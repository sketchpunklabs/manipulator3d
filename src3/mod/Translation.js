import { vec3_add, vec3_sub } from '../lib/Maths.js';
import {
    // Ray,
    // intersectPlane,
    // intersectTri,
    // intersectSphere,
    // nearPoint,
    NearSegmentResult,
    nearSegment,
} from '../../src/RayIntersection.js';
import { vec3_copy, vec3_scaleAndAdd } from '../lib/Maths.js';


export default class Translation{
    static minRayDistance = 0.08;

    static rayTest( ray, state, axes, hitPos=[0,0,0] ){
        const minRange  = this.minRayDistance * state.cameraScale;
        const segResult = new NearSegmentResult();
        const a         = [ 0, 0, 0 ];
        const b         = [ 0, 0, 0 ];
        const s         = state.axisLength * state.cameraScale;
        const p         = state.position;

        let minDist     = Infinity;
        let minAxis     = -1;

        for( let i=0; i < 3; i++ ){
            vec3_scaleAndAdd( a, p, axes[i], -s );
            vec3_scaleAndAdd( b, p, axes[i], s );

            if( nearSegment( ray, a, b, segResult ) ){
              if( segResult.distance <= minRange && segResult.distance < minDist ){
                    minAxis = i;
                    minDist = segResult.distance;
                    vec3_copy( hitPos, segResult.segPosition );
                }
            }
        }

        return minAxis;
    }

    static rayDrag( ray, origin, axis, initHit ){
        const a         = vec3_scaleAndAdd( [0,0,0], origin, axis, 1000 );
        const b         = vec3_scaleAndAdd( [0,0,0], origin, axis, -1000 );
        const segResult = new NearSegmentResult();

        if( nearSegment( ray, a, b, segResult ) ){
            const offset = vec3_sub( [0,0,0], origin, initHit );
            vec3_add( offset, offset, segResult.segPosition );
            return offset;
        }

        return null;
    }
}
