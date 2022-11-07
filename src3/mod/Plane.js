import { vec3_add, vec3_sub } from '../lib/Maths.js';
import {
    // Ray,
    intersectPlane,
    intersectTri,
    // intersectSphere,
    //nearPoint,
    //NearSegmentResult,
    //nearSegment,
} from '../../src/RayIntersection.js';
import { vec3_copy, vec3_scaleAndAdd } from '../lib/Maths.js';


export default class Plane{
    static rayTest( ray, state, axes, hitPos=[0,0,0] ){
        const a         = [ 0, 0, 0 ];
        const b         = [ 0, 0, 0 ];
        const c         = [ 0, 0, 0 ];
        const x         = 0.15 * state.cameraScale;
        const y         = 0.65 * state.cameraScale;
        const origin    = state.position;

        for( let i=0; i < 3; i++ ){
            let ii  = ( i + 1 ) % 3;
            let iii = ( i + 2 ) % 3;
            
            vec3_scaleAndAdd( a, origin, axes[ ii ], x );
            vec3_scaleAndAdd( a, a, axes[ iii ], x );

            vec3_scaleAndAdd( b, a, axes[ ii ], y );
            vec3_scaleAndAdd( c, a, axes[ iii ], y );

            if( intersectTri( ray, b, a, c, hitPos, false ) ){
                return i;
            }
        }

        return -1;
    }

    static rayDrag( ray, origin, axes, iAxis, initHit ){
        const t = intersectPlane( ray, origin, axes[ iAxis ] );
        if( t === null ) return null;

        const offset = vec3_sub( [0,0,0], origin, initHit );
        const pos    = ray.posAt( t );

        return vec3_add( pos, pos, offset );
    }
}
