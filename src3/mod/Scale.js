import { vec3_add, vec3_sub, vec3_dot, vec3_norm } from '../lib/Maths.js';
import {
    // Ray,
    // intersectPlane,
    // intersectTri,
    // intersectSphere,
    nearPoint,
    NearSegmentResult,
    nearSegment,
} from '../../src/RayIntersection.js';
import { vec3_copy, vec3_scaleAndAdd, vec3_len } from '../lib/Maths.js';


export default class Scale{
    static minRayDistance = 0.08;

    static rayTest( ray, state, axes, hitPos=[0,0,0] ){
        const minRange  = this.minRayDistance * state.cameraScale;
        const a         = [ 0, 0, 0 ];
        const b         = [ 0, 0, 0 ];
        const s         = state.pntRadius * state.cameraScale;
        const origin    = state.position;

        if( nearPoint( ray, origin, minRange ) !== null ) return 3;

        for( let i=0; i < 3; i++ ){
            vec3_scaleAndAdd( a, origin, axes[i], -s );
            if( nearPoint( ray, a, minRange ) !== null ){
                vec3_copy( hitPos, a );
                return i;
            }

            vec3_scaleAndAdd( b, origin, axes[i], s );
            if( nearPoint( ray, b, minRange ) !== null ){
                vec3_copy( hitPos, b );
                return i;
            }
        }

        return -1;
    }

    static rayDrag( ray, origin, axes, iAxis, initHit ){
        if( iAxis === 3 ) return null;

        const a      = vec3_scaleAndAdd( [0,0,0], origin, axes[ iAxis ], 1000 );
        const b      = vec3_scaleAndAdd( [0,0,0], origin, axes[ iAxis ], -1000 );
        const result = new NearSegmentResult();

        if( nearSegment( ray, a, b, result ) ){
            const dir   = vec3_sub( [0,0,0], result.segPosition, initHit );
            const len   = vec3_len( dir );
            const sign  = Math.sign( vec3_dot( dir, axes[ iAxis ] ) );

            const out = [0,0,0];
            out[ iAxis ] = len * sign;

            return out;
        }

        return null;
    }
}
