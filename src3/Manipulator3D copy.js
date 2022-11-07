// import ManipulatorState from './state/ManipulatorState.js';
// import ManipulatorActions from './ManipulatorActions.js';
// import MouseEvents from './MouseEvents.js';
// import Tracer from './Tracer.js';

import StateProxy   from './lib/StateProxy.js';
import MouseEvents  from './lib/MouseEvents.js';

// https://github.com/pmndrs/drei/blob/master/src/core/pivotControls/AxisRotator.tsx

export default class Manipulator3D{
    // #region MAIN    
    constructor( camera, renderer, loadMesh=true ){
        this.target         = null;
        this.camera         = camera;
        this.mouseEvents    = new MouseEvents( this, renderer, false );
        
        this.state          = StateProxy.new({
            position    : [0,0,0],
            rotation    : [0,0,0,1],
            scale       : [1,1,1],
            isActive    : false,
            isDragging  : false,
        });

        this.settings       = {
        };
    }
    // #endregion

    // #region METHODS
    attach( obj ){  this.target = obj; return this; }
    detach(){ this.target = null; return this; }
    // #endregion

    // #region GETTERS / SETTERS
    // #endregion

    // #region CAMERA
    updateFromCamera( pos, rot ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Only update if the camera has changed since last update
        if(
            Math.abs( vec3_sqrLen( pos, this.cameraPos ) ) <= 0.000001 &&
            Math.abs( quat_sqrLen( rot, this.cameraRot ) ) <= 0.000001
        ) return;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        vec3_copy( this.cameraPos, pos );       // Save camera state
        quat_copy( this.cameraRot, rot );
        this.updateCameraScale();               // Update cameral scaling
        this.updateData();                      // Update other bits of data
        return this;
    }

    updateCameraScale(){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Adjust the scale to keep the gizmo as the same size no matter how far the camera goes
        const eyeDir     = vec3_sub( [0,0,0], this.cameraPos, this.position.value );
        const eyeLen     = vec3_len( eyeDir );
        this.cameraScale = eyeLen / this.cameraFactor;
        
        vec3_norm( eyeDir, eyeDir ); // Normalize for DOT Checks
        vec3_scale( this.cameraVecScale, [1,1,1], this.cameraScale );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Flip viewing to the opposite side
        if( vec3_dot( eyeDir, [1,0,0] ) < this.cameraFlipDMin ) this.cameraVecScale[0] = -this.cameraVecScale[0];
        if( vec3_dot( eyeDir, [0,1,0] ) < this.cameraFlipDMin ) this.cameraVecScale[1] = -this.cameraVecScale[1];
        if( vec3_dot( eyeDir, [0,0,1] ) < this.cameraFlipDMin ) this.cameraVecScale[2] = -this.cameraVecScale[2];
    }
    // #endregion

    // #region DRAGGING
    startDrag(){
        this.state.isDragging = true;
        // this.trace.prepare( this );
        // this.state.doCache();
        
        // this.emit( 'dragstart' );
    }

    endDrag(){
        this.state.isDragging = false;
        //console.log( 'endDrag' );

        // // onTranslate updates position, need to recalculate at the end of dragging 
        // // for intersection tests to be accurate.
        // this.data.calcAxesPosition();

        // // When doing dragging away from ui, the hover event won't trigger to undo
        // // visual states, so call method at the end of the dragging to tidy things up.
        // this.data.resetState();
        // this.mesh.showGizmo();

        this.emit( 'dragend' );
    }
    // #endregion

    // #region OUTER EVENTS
    // TODO : Maybe use EventTarget instead of body
    on( evtName, fn ){ document.body.addEventListener( evtName, fn ); return this; }
    off( evtName, fn ){ document.body.removeEventListener( evtName, fn ); return this; }
    emit( evtName, detail=null ){
        document.body.dispatchEvent( new CustomEvent( evtName, { detail, bubbles:true, cancelable:true, composed:false } ) ); 
    }
    // #endregion
}