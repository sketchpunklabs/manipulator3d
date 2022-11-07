import {
    // vec3_add,
    // vec3_sub,
    // vec3_len,
    // vec3_norm,
    // vec3_scale,
    vec3_inv_scale,
    vec3_transformQuat,
    // vec3_sqrLen,
    vec3_copy,
    quat_mul,
    quat_copy,
    vec3_add,
    vec3_scaleAndAdd,
    //quat_setAxisAngle,
    //quat_normalize,
} from './lib/Maths.js';

import Translation      from './mod/Translation.js';
import Rotation         from './mod/Rotation.js';
import Faces            from './mod/Faces.js';

import { Modes, Axes }  from './Structs.js';
import { vec3_scale } from './lib/Maths.js';

export default function DragAction( ref, state, events ){
    // #region MAIN
    const initPosition = [0,0,0];
    const initRotation = [0,0,0,0];
    const initHitPos   = [0,0,0];
    let   axes         = null;
    let   axesLengths  = null;
    let   initMode     = -1;
    let   initAxis     = -1;
    // #endregion

    // #region METHODS
    const start = ()=>{
        initMode    = state.selectMode;
        initAxis    = state.selectAxis;
        axesLengths = state.axesLengths.slice();
        axes        = ref.getAxes();
        vec3_copy( initPosition, state.position );
        quat_copy( initRotation, state.rotation );
        vec3_copy( initHitPos,   state.rayHitPos );

        state.isDragging = true;
        events.emit( 'dragStart' );
    };

    const stop = ()=>{
        state.isDragging = false;
        events.emit( 'dragEnd' );
    };

    const move = ( ray )=>{
        switch( initMode ){
            case Modes.Translate:{
                const pos = Translation.rayDrag( ray, initPosition, axes[ initAxis ], initHitPos );
                if( pos ){
                    state.position = pos;
                    return true;
                }
            break; }

            case Modes.Rotate:{
                const rot = Rotation.rayDrag( ray, initPosition, axes, initAxis, initHitPos );
                if( rot ){
                    state.rotation = quat_mul( [0,0,0,1], rot, initRotation );
                    return true;
                }
            break; }

            case Modes.Scale:{
                const len = Faces.rayDrag( ray, initPosition, axes, initAxis, initHitPos, state.debug );
                if( len ){
                    const al          = axesLengths.slice();
                    al[ initAxis ]    = len;
                    state.axesLengths = al;
                    return true;
                }
            break; }
        }

        return false;
    };
    // #endregion

    return { start, stop, move };
}