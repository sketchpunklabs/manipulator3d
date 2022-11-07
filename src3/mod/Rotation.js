import { vec3_add, vec3_angle, vec3_norm } from '../lib/Maths.js';
import {
    // Ray,
    intersectPlane,
    // intersectTri,
    // intersectSphere,
    // nearPoint,
    //NearSegmentResult,
    //nearSegment,
} from '../../src/RayIntersection.js';

import { 
    vec3_sub,
    vec3_len, 
    vec3_dot, 
    //vec3_scaleAndAdd,
    quat_rotateTo,
} from '../lib/Maths.js';
import { ZeroCurvatureEnding } from 'three';
import { Axes } from '../Structs.js';


export default class Rotation{
    static minRayDistance = 0.08;

    static rayTest( ray, state, axes, hitPos=[0,0,0] ){
        const minRange  = this.minRayDistance * state.cameraScale;
        const origin    = state.position;
        const radius    = state.arcRadius * state.cameraScale;
        const hitDir    = [0,0,0];
        let t;
        let dist;

        for( let i=0; i < 3; i++ ){
           // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // First test against the plane using the axis as the plane normal
            t = intersectPlane( ray, origin, axes[i] );
            if( t === null ) continue;

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // Next do a circle radius test of the hit point to plane origin
            ray.posAt( t, hitPos );
            dist = vec3_len( hitPos, origin );

            if( Math.abs( radius - dist ) <= minRange ){

                // Test if in the correct quadrant
                vec3_sub( hitDir, hitPos, origin );
                if( vec3_dot( hitDir, axes[ ( i + 1 ) % 3 ] ) >= 0 && 
                    vec3_dot( hitDir, axes[ ( i + 2 ) % 3 ] ) >= 0 ){
                    return i;
                }

            }
        }

        return -1;
    }

    static rayDrag( ray, origin, axes, iAxis, hitPos ){
        let t = intersectPlane( ray, origin, axes[ iAxis ] );
        if( t === null ) return null;
        
        const fromDir = vec3_sub( [0,0,0], hitPos, origin );
        vec3_norm( fromDir, fromDir );

        const toDir = vec3_sub( [0,0,0],  ray.posAt( t ), origin );
        vec3_norm( toDir, toDir );

        return quat_rotateTo( [0,0,0,1], fromDir, toDir );
    }
}
