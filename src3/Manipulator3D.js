// #region IMPORTS
import { Vector3, Quaternion } from 'three';

import StateProxy       from './lib/StateProxy.js';
import MouseEvents      from './lib/MouseEvents.js';
import EventDispatcher  from './lib/EventDispatcher.js';
import Mesh3JS          from './render/Mesh3JS.js';
import { Modes, Axes }  from './Structs.js';
import Actions          from './Actions.js';
import { debounce  }    from './lib/Func.js';
    
import {
    // vec3_add,
    vec3_sub,
    vec3_len,
    // vec3_norm,
    // vec3_scale,
    // vec3_transformQuat,
    // vec3_sqrLen,
    // vec3_copy,
    // quat_mul,
    // quat_copy,
    // quat_setAxisAngle,
    // quat_normalize,
} from './lib/Maths.js';
// #endregion

let Debug;
export default function Manipulator3D( oCamera, oRenderer, debug ){
    // #region MAIN
    Debug = debug;
    const state = StateProxy.new({
        position        : [0,0,0],
        rotation        : [0,0,0,1],
        scale           : [1,1,1],
        isActive        : true,
        isDragging      : false,
        target          : null,

        rayHitPos       : [0,0,0],
        
        selectMode      : Modes.None,
        selectAxis      : Axes.None,

        usePosition     : true,
        useRotation     : true,
        useScale        : true,

        cameraFactor    : 9,
        cameraScale     : 1,

        axisLength      : 0.85,
        arcRadius       : 1.08,
        pntRadius       : 1,
        scaleIncStep    : 1.0,
    });

    const events        = EventDispatcher();
    const actions       = Actions( state, events );
    const mouse         = MouseEvents( oCamera, oRenderer, actions, state, true );
    const mesh          = new Mesh3JS( state );
    // #endregion

    // #region FUNCS
    const cameraScaleUpdate = ()=>{
        const scl = computeCameraScale( oCamera, state );
        mesh.scale.set( scl, scl, scl );
    }
    
    const render = debounce( ()=>{ mesh.render( state ); }, 5 );
    const update = ()=>{ cameraScaleUpdate(); };
    // #endregion

    // #region EVENTS
    state.$.on( 'change', e=>{
            // console.log( 'chg', e.detail );
            switch( e.detail.prop ){
                case 'rotation'   :
                case 'position'   :
                case 'selectMode' : render(); break;
            }
        })
        
        .on( 'positionChange', ()=>{
            if( state.target ) state.target.position.fromArray( state.position );
            events.emit( 'transform', { position: state.position.slice( 0 ) } );
        })

        .on( 'rotationChange', ()=>{
            if( state.target ) state.target.quaternion.fromArray( state.rotation );
            events.emit( 'transform', { rotation: state.rotation.slice( 0 ) } );
        })

        .on( 'scaleChange', ()=>{
            if( state.target ) state.target.scale.fromArray( state.scale );
            events.emit( 'transform', { scale: state.scale.slice( 0 ) } );
        })
    ;
    // #endregion

    // #region EXPORT
    const self = { 
        events,
        state,
        update, 
        mesh,

        setRotation : v=>{ state.rotation = [ v[0], v[1], v[2], v[3] ]; return self; },
        setPosition : v=>{ state.position = [ v[0], v[1], v[2] ]; return self; },
        attach      : o=>{
            state.target    = o;
            state.position  = o.position.toArray();
            state.rotation  = o.quaternion.toArray();
            state.scale     = o.scale.toArray();
            return self;
        },
    };
    return self;
    // #endregion
};

// #region HELPERS
function computeCameraScale( camera, state ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Need world space info incase camera is attached to something
    const wPos = new Vector3();
    //const wRot = new Quaternion();
    camera.getWorldPosition( wPos );
    //camera.getWorldQuaternion( wRot );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const eyeDir      = vec3_sub( [0,0,0], wPos.toArray(), state.position );
    const eyeLen      = vec3_len( eyeDir );
    const cameraScale = eyeLen / state.cameraFactor;

    //state.$.update( { cameraScale } );
    state.cameraScale = cameraScale;
    return cameraScale;
}
// #endregion
