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
import Plane            from './mod/Plane.js';
import Scale            from './mod/Scale.js';

import { Modes, Axes }  from './Structs.js';
import { vec3_scale } from '../src/Maths.js';

export default function DragAction( state, events ){
    // #region MAIN
    const initPosition = [0,0,0];
    const initRotation = [0,0,0,0];
    const initScale    = [0,0,0];
    const initHitPos   = [0,0,0];
    const axes         = [
        [1,0,0],
        [0,1,0],
        [0,0,1],
    ];

    let   initMode     = -1;
    let   initAxis     = -1;
    // #endregion

    // #region METHODS
    const start = ()=>{
        if( state.target ){
            vec3_copy( initPosition, state.target.position.toArray() );
            vec3_copy( initScale,    state.target.scale.toArray() );
            quat_copy( initRotation, state.target.quaternion.toArray() );
        }else{
            vec3_copy( initPosition, state.position );
            vec3_copy( initScale,    state.scale );
            quat_copy( initRotation, state.rotation );
        }
        
        vec3_copy( initHitPos, state.rayHitPos );
        vec3_transformQuat( axes[0], [1,0,0], initRotation );
        vec3_transformQuat( axes[1], [0,1,0], initRotation );
        vec3_transformQuat( axes[2], [0,0,1], initRotation );

        initMode = state.selectMode;
        initAxis = state.selectAxis;
        
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

            case Modes.Plane:{
                const pos = Plane.rayDrag( ray, initPosition, axes, initAxis, initHitPos );
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
                const scl = Scale.rayDrag( ray, initPosition, axes, initAxis, initHitPos );
                if( scl ){
                    
                    state.position = vec3_scaleAndAdd( [0,0,0], initPosition, axes[ initAxis ], scl[ initAxis ] * 0.5 );
                    

                    //vec3_inv_scale( scl, scl, state.scaleIncStep );
                    vec3_add( scl, initScale, scl );
                    state.scale = scl;


                    return true;
                }
            break; }
        }

        return false;
    };
    // #endregion

    return { start, stop, move };
}