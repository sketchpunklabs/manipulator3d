// #region IMPORTS
import Translation      from './mod/Translation.js';
import Rotation         from './mod/Rotation.js';
import Scale            from './mod/Scale.js';
import Plane            from './mod/Plane.js';

import DragAction       from './DragAction.js';
import { Modes, Axes }  from './Structs.js';
    
import {
    // vec3_add,
    // vec3_sub,
    // vec3_len,
    // vec3_norm,
    // vec3_scale,
    vec3_transformQuat,
    vec3_sqrLen,
    // vec3_copy,
    // quat_mul,
    // quat_copy,
    // quat_setAxisAngle,
    // quat_normalize,
} from './lib/Maths.js';
// #endregion

export default function Actions( state, events ){
    // #region MAIN
    const dragging = DragAction( state, events );
    const axes     = [
        [1,0,0],
        [0,1,0],
        [0,0,1],
    ];
    // #endregion

    // #region HELPERS
    const rayIntersect = ray => {
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Get the current state axis from rotation
        vec3_transformQuat( axes[0], [1,0,0], state.rotation );
        vec3_transformQuat( axes[1], [0,1,0], state.rotation );
        vec3_transformQuat( axes[2], [0,0,1], state.rotation );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test Translation Segments
        const posHit  = [Infinity,Infinity,Infinity];
        const posAxis = Translation.rayTest( ray, state, axes, posHit );
        const posDist =  ( posAxis === -1 )? Infinity : vec3_sqrLen( ray.posStart, posHit );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test Rotation Arcs
        const rotHit  = [Infinity,Infinity,Infinity];
        const rotAxis = Rotation.rayTest( ray, state, axes, rotHit );
        const rotDist = ( rotAxis === -1 )? Infinity : vec3_sqrLen( ray.posStart, rotHit );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test Scale Points
        const sclHit  = [Infinity,Infinity,Infinity];
        const sclAxis = Scale.rayTest( ray, state, axes, sclHit );
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const plnHit  = [Infinity,Infinity,Infinity];
        const plnAxis = Plane.rayTest( ray, state, axes, plnHit );
        const plnDist = ( plnAxis === -1 )? Infinity : vec3_sqrLen( ray.posStart, plnHit );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //console.log( 'Position', posAxis, posDist, 'Rotation', rotAxis, rotDist );

        if( posAxis === Axes.None && rotAxis === Axes.None && sclAxis === Axes.None && plnAxis === Axes.None ){
            state.selectAxis = Axes.None;
            state.selectMode = Modes.None;
            return false;
        }

        if( sclAxis !== -1 ){
            state.selectAxis = sclAxis;
            state.selectMode = Modes.Scale;
            state.rayHitPos  = sclHit;
        
        }else if( posAxis !== -1 && posDist < rotDist && posDist < plnDist  ){
            state.selectAxis = posAxis;
            state.selectMode = Modes.Translate;
            state.rayHitPos  = posHit;
        
        }else if( rotAxis !== -1 && rotDist < plnDist ){
            state.selectAxis = rotAxis;
            state.selectMode = Modes.Rotate;
            state.rayHitPos  = rotHit;

        }else if( plnAxis !== -1 ){
            state.selectAxis = plnAxis;
            state.selectMode = Modes.Plane;
            state.rayHitPos  = plnHit;
        }

        return true;
    };
    // #endregion

    // #region EXPORT
    return {
        rayDown( ray ){ 
            if( state.isActive && rayIntersect( ray ) ){
                dragging.start();
                return true;
            }
            return false;
        },
        
        rayUp( ray ){
            if( state.isDragging ) dragging.stop ();
        },

        rayMove( ray ){ 
            if( !state.isActive || !state.isDragging ) return false;
            return dragging.move( ray );
        },
        
        rayHover( ray ){ 
            return ( state.isActive && !state.isDragging )? rayIntersect( ray ) : false;
        },
    };
    // #endregion
}
