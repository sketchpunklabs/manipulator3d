import { vec3_dot } from '../../src/Maths.js';
import { vec3_add_batch, vec3_len, vec3_sub, vec3_scale, vec3_scaleAndAdd } from '../lib/Maths.js';
import {
    // Ray,
    intersectQuad,
    //intersectSphere,
    //nearPoint,
    NearSegmentResult,
    nearSegment,
} from '../lib/RayIntersection.js';


export default class Faces{
    static minLen = 0.15;

    static pnts = [
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], // Bottom : Start back left, front left, front right, back right
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], // Top
    ];

    static faces = [
        [ this.pnts[6], this.pnts[2], this.pnts[3], this.pnts[7] ], // Right Face +x
        [ this.pnts[4], this.pnts[5], this.pnts[6], this.pnts[7] ], // Top Face +y
        [ this.pnts[1], this.pnts[2], this.pnts[6], this.pnts[5] ], // Front face +z
        [ this.pnts[4], this.pnts[0], this.pnts[1], this.pnts[5] ], // Left Face -x
        [ this.pnts[1], this.pnts[0], this.pnts[3], this.pnts[2] ], // Bot Face -y
        [ this.pnts[7], this.pnts[3], this.pnts[0], this.pnts[4] ], // Back Face -z
    ];

    static rayTest( ray, state, axes, hitPos=[0,0,0] ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const pnts = this.pnts;
        const ax   = new Array( 6 );
        for( let i=0; i < 6; i++ ){
            ax[ i ] = vec3_scale( [0,0,0], axes[i], state.axesLengths[ i ] );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        vec3_add_batch( pnts[0], ax[3], ax[4], ax[5], state.position ); // Bottom Face
        vec3_add_batch( pnts[1], ax[3], ax[4], ax[2], state.position );
        vec3_add_batch( pnts[2], ax[0], ax[4], ax[2], state.position );
        vec3_add_batch( pnts[3], ax[0], ax[4], ax[5], state.position );

        vec3_add_batch( pnts[4], ax[3], ax[1], ax[5], state.position ); // Top Face
        vec3_add_batch( pnts[5], ax[3], ax[1], ax[2], state.position );
        vec3_add_batch( pnts[6], ax[0], ax[1], ax[2], state.position );
        vec3_add_batch( pnts[7], ax[0], ax[1], ax[5], state.position );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let f;
        for( let i=0; i < 6; i++ ){
            f = this.faces[ i ];
            if( intersectQuad( ray, f[0], f[1], f[2], f[3], hitPos, true ) !== null ){
                return i;
            }
        }

        return -1;
    }

    static rayDrag( ray, origin, axes, iAxis, initHit, debug ){


        // if( iAxis === 3 ) return null;

        // debug.ln.reset();
        // debug.pnt.reset();

        const a      = vec3_scaleAndAdd( [0,0,0], origin, axes[ iAxis ], 1000 );
        const b      = vec3_scaleAndAdd( [0,0,0], origin, axes[ iAxis ], -1000 );

        // debug.ln.add( a, b, 0x00ff00 );

        const result = new NearSegmentResult();

        if( nearSegment( ray, a, b, result ) ){

            //debug.pnt.add( result.segPosition, 0x00ff00, 10 );


            // const dir   = vec3_sub( [0,0,0], result.segPosition, initHit );
            //const len = vec3_len( result.segPosition, origin );
            const dir = vec3_sub( [0,0,0], result.segPosition, origin );

            if( vec3_dot( dir, axes[ iAxis ] ) >= 0 ){
                const len = vec3_len( dir );
                if( len >= this.minLen ){
                    //console.log( len );
                    return len;
                }
            }

            
            
            //const len   = vec3_len( dir );
            // const sign  = Math.sign( vec3_dot( dir, axes[ iAxis ] ) );

            // const out = [0,0,0];
            // out[ iAxis ] = len * sign;

            //return out;
        }

        return null;
    }
}