// #region IMPORTS
// import Translation      from './mod/Translation.js';
// import Rotation         from './mod/Rotation.js';
// import Scale            from './mod/Scale.js';
import Faces            from './mod/Faces.js';
import Translation      from './mod/Translation.js';
import Rotation         from './mod/Rotation.js';

// import DragAction       from './DragAction.js';
import { Modes, Axes }  from './Structs.js';

import { intersectQuad }  from './lib/RayIntersection.js';

import DragAction       from './DragAction.js';
    
import {
    vec3_add_batch,
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

export default function Actions( ref, state, events ){
    // #region MAIN
    const dragging = DragAction( ref, state, events );
    let pnts = [
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], // Bottom : Start back left, front left, front right, back right
        [0,0,0], [0,0,0], [0,0,0], [0,0,0], // Top
    ];    
    // #endregion

    // #region HELPERS
    const rayIntersect = ray =>{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Get the current state axis from rotation
        const axes = ref.getAxes();
        const hit  = [Infinity,Infinity,Infinity];

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const rotAxis = Rotation.rayTest( ray, state, axes, hit );
        //const rotDist = ( rotAxis === -1 )? Infinity : vec3_sqrLen( ray.posStart, rotHit );
        if( rotAxis !== -1 ){
            state.selectAxis = rotAxis;
            state.selectMode = Modes.Rotate;
            state.rayHitPos  = hit;
            return true;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const posAxis = Translation.rayTest( ray, state, axes, hit );
        if( posAxis !== -1 ){
            state.selectAxis = posAxis;
            state.selectMode = Modes.Translate;
            state.rayHitPos  = hit;
            return true;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const faceAxis = Faces.rayTest( ray, state, axes, hit );
        if( faceAxis !== -1 ){
            state.selectAxis = faceAxis;
            state.selectMode = Modes.Scale;
            state.rayHitPos  = hit;
            return true;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        state.selectAxis = Axes.None;
        state.selectMode = Modes.Translate;
        return false;
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
