import {
    vec3_add,
    vec3_sub,
    vec3_len,
    vec3_copy,
    vec3_transformQuat,
    // vec3_norm,
    vec3_dot,
    vec3_scale,
    // vec3_scaleAndAdd,
    vec3_sqrLen,
    // quat_mul,
    // quat_normalize,
    // quat_copy,
    // quat_sqrLen,
    quat_setAxisAngle,
} from '../../src/Maths.js';

import {
    // Ray,
    intersectPlane,
    // intersectTri,
    // intersectSphere,
    // nearPoint,
    // NearSegmentResult,
    // nearSegment,
} from '../../src/RayIntersection.js';

export default class RotationState{
    minRayDistance  = 0.2;

    value       = [0,0,0,1];
    xAxis       = [1,0,0];      // Actual Axis of rotation
    yAxis       = [0,1,0];
    zAxis       = [0,0,1];

    xAxisScl    = [1,0,0];      // Scaled to Camera Distance & Radius
    yAxisScl    = [0,1,0];
    zAxisScl    = [0,0,1];

    xAxisSclDir = [1,0,0];      // Normalized, no radius applied
    yAxisSclDir = [0,1,0];
    zAxisSclDir = [0,0,1];

    aryAxisSclDir = [ this.xAxisSclDir, this.yAxisSclDir, this.zAxisSclDir ];
    aryAxis       = [ this.xAxis, this.yAxis, this.zAxis ];

    set( v ){
        this.value[ 0 ] = v[ 0 ];
        this.value[ 1 ] = v[ 1 ];
        this.value[ 2 ] = v[ 2 ];
        this.value[ 3 ] = v[ 3 ];
    }

    setAxisAngle( axis, rad ){
        quat_setAxisAngle( this.value, axis, rad );
        this.updateAxis();
    }

    updateAxis(){
        vec3_transformQuat( this.xAxis, [1,0,0], this.value );
        vec3_transformQuat( this.yAxis, [0,1,0], this.value );
        vec3_transformQuat( this.zAxis, [0,0,1], this.value );
    }

    // Update acaled axis directions based on the camera
    updateScale( man ){ 
        vec3_scale( this.xAxisSclDir, this.xAxis, man.cameraVecScale[ 0 ] );
        vec3_scale( this.yAxisSclDir, this.yAxis, man.cameraVecScale[ 1 ] );
        vec3_scale( this.zAxisSclDir, this.zAxis, man.cameraVecScale[ 2 ] );

        vec3_scale( this.xAxisScl, this.xAxisSclDir, man.radius );
        vec3_scale( this.yAxisScl, this.yAxisSclDir, man.radius );
        vec3_scale( this.zAxisScl, this.zAxisSclDir, man.radius );
    }

    rayTest( ray, state, out=[0,0,0] ){
        const minRange       = state.cameraScale * this.minRayDistance;
        const radius         = state.cameraScale * state.radius;
        const pos            = state.position.value;
        const hitDir         = [0,0,0];
        const hitPos         = [0,0,0];

        let t;
        let dist;

        for( let i=0; i < 3; i++ ){
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // First test against the plane using the axis as the plane normal
            t = intersectPlane( ray, pos, this.aryAxisSclDir[i] );
            if( t === null ) continue;

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // Next do a circle radius test of the hit point to plane origin
            ray.posAt( t, hitPos );
            dist = vec3_len( pos, hitPos );
            
            if( Math.abs( dist - radius ) <= minRange ){
                // Inside circle, Check if in the positive side of 
                // the hemisphere using the next axis direction 
                vec3_sub( hitDir, hitPos, pos );

                if( vec3_dot( hitDir, this.aryAxisSclDir[ ( i + 1 ) % 3 ] ) >= 0 ){

                    // Do the other hemisphere check with the remaining axis  
                    if( vec3_dot( hitDir, this.aryAxisSclDir[ ( i + 2 ) % 3 ] ) >= 0 ){
                        // Debug.pnt2.add( hitPos, 0x00ff00, 5 );
                        // Debug.pnt2._updateGeometry();
                        vec3_copy( out, hitPos );
                        return i;
                    }

                }
            }
        }

        return -1;
    }

}