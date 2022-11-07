// #region IMPORT
import StateProxy       from './lib/StateProxy.js';
import EventDispatcher  from './lib/EventDispatcher.js';
import MouseEvents      from './lib/MouseEvents.js';
import Actions          from './Actions.js';
import { Modes, Axes }  from './Structs.js';
import { debounce  }    from './lib/Func.js';

import Mesh3js          from './render/Mesh3js.js';

import {
    // vec3_add,
    vec3_add_batch,
    // vec3_sub,
    // vec3_len,
    // vec3_norm,
    // vec3_scale,
     vec3_transformQuat,
     vec3_negate,
    // vec3_sqrLen,
    // vec3_copy,
    // quat_mul,
    // quat_copy,
    // quat_setAxisAngle,
    // quat_normalize,
} from './lib/Maths.js';

// #endregion

export default function AnnotateBox( oCamera, oRenderer, debug ){
    // #region MAIN
    const self  = {};
    const state = StateProxy.new({
        position        : [0,0,0],
        rotation        : [0,0,0,1],
        axesLengths     : [1,1,1,1,1,1], // xp, yp, zp, xn, yn, zn

        isActive        : true,
        isDragging      : false,
        
        selectMode      : Modes.None,
        selectAxis      : Axes.None,
        rayHitPos       : null,

        axisLen         : 1, // How long the axis line should be on the UI
        debug           : debug,
    });

    const events        = EventDispatcher();
    const actions       = Actions( self, state, events );
    const mouse         = MouseEvents( oCamera, oRenderer, actions, state, true );
    const mesh          = new Mesh3js();
    // #endregion

    // #region METHODS
    const getAxes = ()=>{
        const x = vec3_transformQuat( [0,0,0], [1,0,0], state.rotation );
        const y = vec3_transformQuat( [0,0,0], [0,1,0], state.rotation );
        const z = vec3_transformQuat( [0,0,0], [0,0,1], state.rotation );
        return [
            x, y, z,
            vec3_negate( [0,0,0], x ),
            vec3_negate( [0,0,0], y ),
            vec3_negate( [0,0,0], z ),
        ];
    };

    const render      = ()=>mesh.render( self );
    const renderDelay = debounce( render, 5 );
    // const getPoints = ()=>{
    //     const axes = getAxes();
    //     return [ 
    //         vec3_add_batch( [0,0,0], axes[3], axes[4], axes[5], state.position ),
    //         vec3_add_batch( [0,0,0], axes[3], axes[4], axes[2], state.position ),
    //         vec3_add_batch( [0,0,0], axes[0], axes[4], axes[2], state.position ),
    //         vec3_add_batch( [0,0,0], axes[0], axes[4], axes[5], state.position ),

    //         vec3_add_batch( [0,0,0], axes[3], axes[1], axes[5], state.position ),
    //         vec3_add_batch( [0,0,0], axes[3], axes[1], axes[2], state.position ),
    //         vec3_add_batch( [0,0,0], axes[0], axes[1], axes[2], state.position ),
    //         vec3_add_batch( [0,0,0], axes[0], axes[1], axes[5], state.position ),
    //     ];
    // };
    // #endregion

    // #region EVENTS
    state.$.on( 'change', e=>{
        // console.log( 'chg', e.detail );
        switch( e.detail.prop ){
            case 'position'     :
            case 'rotation'     :
            case 'selectMode'   :
            case 'selectAxis'   : renderDelay(); break;
            case 'axesLengths'  : render(); break;
        }
    });
    // #endregion

    // #region Export
    self.state   = state;
    self.getAxes = getAxes;
    self.mesh    = mesh;
    self.events  = events;

    self.getPosition = ()=>state.position.slice(),
    self.setPosition = v=>{ state.position = [ v[0], v[1], v[2] ]; return self; },
    self.getRotation = ()=>state.rotation.slice(),
    self.setRotation = v=>{ state.rotation = [ v[0], v[1], v[2], v[3] ]; return self; },

    render();
    return self;
    // #endregion
}