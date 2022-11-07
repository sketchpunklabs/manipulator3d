import { vec3_add, vec3_angle, vec3_norm } from '../lib/Maths.js';
import {
    // Ray,
    intersectPlane,
    // intersectTri,
    // intersectSphere,
    // nearPoint,
    //NearSegmentResult,
    //nearSegment,
} from '../lib/RayIntersection.js';


import { 
    vec3_sub,
    vec3_len, 
    vec3_dot, 
    vec3_scaleAndAdd,
    quat_rotateTo,
} from '../lib/Maths.js';
import { ZeroCurvatureEnding } from 'three';
import { Axes } from '../Structs.js';

export default class Rotation{
    static minRayDistance = 0.1;
    static minAngle       = 11 * Math.PI / 180;

    static rayTest( ray, state, axes, hitPos=[0,0,0] ){
        //const minRange  = this.minRayDistance * state.cameraScale;
        const origin    = state.position;
        const hitDir    = [0,0,0];
        const toHit     = [0,0,0];
        let t;
        let ii;
        let dist;
        let radius;

        // let debug = state.debug;
        // debug.pnt.reset();
        // debug.ln.reset();

        for( let i=0; i < 3; i++ ){
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // First test against the plane using the axis as the plane normal
            t = intersectPlane( ray, origin, axes[i] );
            if( t === null ) continue;

            ii = (i + 1) % 3; // Need the next axis over to perform tests

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // Next do a circle radius test of the hit point to plane origin
            ray.posAt( t, hitPos );
            radius = state.axesLengths[ ii ] + state.axisLen;
            dist   = vec3_len( hitPos, origin );
            
            //debug.pnt.add( vec3_scaleAndAdd( [0,0,0], origin, axes[ii], radius ), 0xffff00, 13 );
            //debug.pnt.add( hitPos, 0x00ff00, 7 );
            

            if( Math.abs( radius - dist ) <= this.minRayDistance ){
                //debug.pnt.add( hitPos, 0xffffff, 13 );
                // Direction to hit position
                vec3_sub( toHit, hitPos, origin );
                vec3_norm( toHit, toHit );

                if( vec3_angle( axes[ii], toHit ) <= this.minAngle ){

                    //debug.ln.add( origin, vec3_scaleAndAdd( [0,0,0], origin, toHit, 4 ), 0xffffff );
                    //debug.ln.add( origin, vec3_scaleAndAdd( [0,0,0], origin, axes[ii], 4 ), 0xffff00 );

                    //console.log( i, vec3_angle( axes[ii], toHit ) * 180 / Math.PI );

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
