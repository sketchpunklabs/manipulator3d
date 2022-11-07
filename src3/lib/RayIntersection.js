// #region IMPORT
import {
    vec3_add,
    vec3_sub,
    vec3_mul,
    vec3_norm,
    vec3_copy,
    vec3_scale,
    vec3_dot,
    vec3_cross,
    vec3_sqrLen,
    vec3_lerp,
    vec3_len,
    vec4_transformMat4,
    mat4_invert,
    mat4_mul,
} from './Maths.js';
// #endregion

export class Ray{
    posStart    = [0,0,0];  // Origin
    posEnd      = [0,0,0];
    direction   = [0,0,0];  // Direction from Start to End
    vecLength   = [0,0,0];  // Vector Length between start to end

    // #region GETTERS / SETTERS
    /** Get position of the ray from T Scale of VecLen */
    posAt( t, out){
        // RayVecLen * t + RayOrigin
        // also works lerp( RayOrigin, RayEnd, t )
        out      = out || [0,0,0];
        out[ 0 ] = this.vecLength[ 0 ] * t + this.posStart[ 0 ];
        out[ 1 ] = this.vecLength[ 1 ] * t + this.posStart[ 1 ];
        out[ 2 ] = this.vecLength[ 2 ] * t + this.posStart[ 2 ];
        return out;
    }

    /** Get position of the ray from distance from origin */
    directionAt( len, out ){
        out      = out || [0,0,0];
        out[ 0 ] = this.direction[ 0 ] * len + this.posStart[ 0 ];
        out[ 1 ] = this.direction[ 1 ] * len + this.posStart[ 1 ];
        out[ 2 ] = this.direction[ 2 ] * len + this.posStart[ 2 ];        
        return out;
    }

    fromCaster( caster ){
        vec3_copy( this.posStart,  caster.ray.origin.toArray() );
        vec3_copy( this.direction, caster.ray.direction.toArray() );

        const len = ( caster.far == Infinity )? 1000 : caster.far;
        vec3_scale( this.vecLength, this.direction, len );
        vec3_add( this.posEnd, this.posStart, this.vecLength );
    }

    fromScreenProjection( x, y, w, h, projMatrix, camMatrix ){
        // http://antongerdelan.net/opengl/raycasting.html
        // Normalize Device Coordinate
        const nx  = x / w * 2 - 1;
        const ny  = 1 - y / h * 2;

        // inverseWorldMatrix = invert( ProjectionMatrix * ViewMatrix ) OR
        // inverseWorldMatrix = localMatrix * invert( ProjectionMatrix ) 
        const invMatrix = [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0 ];
        mat4_invert( invMatrix, projMatrix )
        mat4_mul( invMatrix, camMatrix, invMatrix );
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // https://stackoverflow.com/questions/20140711/picking-in-3d-with-ray-tracing-using-ninevehgl-or-opengl-i-phone/20143963#20143963
        // Clip Cords would be [nx,ny,-1,1];
        const clipNear   = [ nx, ny, -1, 1 ];
        const clipFar    = [ nx, ny,  1, 1 ];

        // using 4d Homogeneous Clip Coordinates
        vec4_transformMat4( clipNear, clipNear, invMatrix );
        vec4_transformMat4( clipFar,  clipFar,  invMatrix );

        // Normalize by using W component
        for( let i=0; i < 3; i++){
            clipNear[ i ] /= clipNear[ 3 ];
            clipFar [ i ] /= clipFar [ 3 ];
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        vec3_copy( this.posStart, clipNear );           // Starting Point of the Ray
        vec3_copy( this.posEnd, clipFar );              // The absolute end of the ray
        vec3_sub( this.vecLength, clipFar, clipNear );  // Vector Length
        vec3_norm( this.direction, this.vecLength );    // Normalized Vector Length
        return this;
    }
    // #endregion
}

export function intersectSphere( ray, origin, radius ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const radiusSq		= radius * radius;
    const rayToCenter	= vec3_sub( [0,0,0], origin, ray.posStart );		
    const tProj			= vec3_dot( rayToCenter, ray.direction ); 		// Project the length to the center onto the Ray

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Get length of projection point to center and check if its within the sphere
    // Opposite^2 = hyptenuse^2 - adjacent^2
    const oppLenSq = vec3_sqrLen( rayToCenter ) - ( tProj * tProj );
    return !( oppLenSq > radiusSq );
}

/** T returned is scale to vector length, not direction */
export function intersectPlane( ray, planePos, planeNorm ){
    // ((planePos - rayOrigin) dot planeNorm) / ( rayVecLen dot planeNorm )
    // pos = t * rayVecLen + rayOrigin;
    const denom = vec3_dot( ray.vecLength, planeNorm );           // Dot product of ray Length and plane normal
    if( denom <= 0.000001 && denom >= -0.000001 ) return null;  // abs(denom) < epsilon, using && instead to not perform absolute.

    const t = vec3_dot( vec3_sub( [0,0,0], planePos, ray.posStart ), planeNorm ) / denom;
    return ( t >= 0 )? t : null;
}

export function intersectTri( ray, v0, v1, v2, out, cullFace=true ){
    const v0v1  = vec3_sub( [0,0,0], v1, v0 );
    const v0v2  = vec3_sub( [0,0,0], v2, v0 );
    const pvec 	= vec3_cross( [0,0,0], ray.direction, v0v2 );
    const det   = vec3_dot( v0v1, pvec );

    if( cullFace && det < 0.000001 ) return false;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const idet  = 1 / det;
    const tvec  = vec3_sub( [0,0,0], ray.posStart, v0 );
    const u     = vec3_dot( tvec, pvec ) * idet;

    if( u < 0 || u > 1 ) return false;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const qvec  = vec3_cross( [0,0,0], tvec, v0v1,  );
    const v     = vec3_dot( ray.direction, qvec ) * idet;

    if( v < 0 || u+v > 1 ) return false;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if( out ){
        const len = vec3_dot( v0v2, qvec ) * idet;
        ray.directionAt( len, out );
    }

    return true;
}

export function nearPoint( ray, p, distLimit=0.1 ){
    /* closest_point_to_line3D
    let dx	= bx - ax,
        dy	= by - ay,
        dz	= bz - az,
        t	= ( (px-ax)*dx + (py-ay)*dy + (pz-az)*dz ) / ( dx*dx + dy*dy + dz*dz ) ; */
    const v = vec3_sub( [0,0,0], p, ray.posStart );
    vec3_mul( v, v, ray.vecLength );

    const t = ( v[0] + v[1] + v[2] ) / vec3_sqrLen( ray.vecLength );

    if( t < 0 || t > 1 ) return null;                   // Over / Under shoots the Ray Segment
    const lenSqr = vec3_sqrLen( ray.posAt( t, v ), p );  // Distance from point to nearest point on ray.

    return ( lenSqr <= (distLimit*distLimit) )? t : null;
}

export class NearSegmentResult{
    segPosition = [0,0,0];
    rayPosition = [0,0,0];
    distanceSq  = 0;
    distance    = 0;
}

/** Returns [ T of Segment, T of RayLen ] */
export function nearSegment( ray, p0, p1, results=null){
    // http://geomalgorithms.com/a07-_distance.html
    const   u = vec3_sub( [0,0,0], p1, p0 ),
            v = ray.vecLength,
            w = vec3_sub( [0,0,0], p0, ray.posStart ),
            a = vec3_dot( u, u ), // always >= 0
            b = vec3_dot( u, v ),
            c = vec3_dot( v, v ), // always >= 0
            d = vec3_dot( u, w ),
            e = vec3_dot( v, w ),
            D = a * c - b * b;    // always >= 0

    let tU = 0, // T Of Segment 
        tV = 0; // T Of Ray

    // Compute the line parameters of the two closest points
    if( D < 0.000001 ){	            // the lines are almost parallel
        tU = 0.0;
        tV = ( b > c ? d/b : e/c ); // use the largest denominator
    }else{
        tU = ( b*e - c*d ) / D;
        tV = ( a*e - b*d ) / D;
    }

    if( tU < 0 || tU > 1 || tV < 0 || tV > 1 ) return false;
    
    // Segment Position : u.scale( tU ).add( p0 )
    // Ray Position :     v.scale( tV ).add( this.origin ) ];
    if( results ){
        vec3_lerp( results.rayPosition, ray.posStart, ray.posEnd, tV );
        vec3_lerp( results.segPosition, p0, p1, tU );
        results.distance = vec3_len( results.segPosition, results.rayPosition );
    }

    return true;
}