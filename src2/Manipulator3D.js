import ManipulatorState from './state/ManipulatorState.js';
import ManipulatorActions from './ManipulatorActions.js';
import MouseEvents from './MouseEvents.js';
import Tracer from './Tracer.js';


export default class Manipulator3D{
    // #region MAIN
    state       = new ManipulatorState();
    actions     = new ManipulatorActions( this );
    trace       = new Tracer();
    camera      = null;
    mouseEvents = null;
    
    constructor( camera, renderer ){
        this.camera       = camera;
        this.mouseEvents  = new MouseEvents( this, renderer );
    }
    // #endregion

    // #region DRAGGING
    startDrag(){
        this.state.isDragging = true;
        this.trace.prepare( this );
        this.state.doCache();


        //console.log( 'startDrag' );

        // // Save initial state of attached object
        // if( this.attachedObject ){
        //     vec3_copy( this._initDragPosition,   this.attachedObject.position.toArray() );
        //     vec3_copy( this._initDragScale,      this.attachedObject.scale.toArray() );
        //     quat_copy( this._initDragQuaternion, this.attachedObject.quaternion.toArray() );
        // }else{
        //     // Continue using 'current' values in no attachment use of the control.
        //     vec3_copy( this._initDragPosition,   this._currentPosition );
        //     vec3_copy( this._initDragScale,      this._currentScale );
        //     quat_copy( this._initDragQuaternion, this._currentQuaternion );
        // }

        // // Offset has prevent the snapping effect of translation
        // vec3_sub( this._intersectOffset, this.data.position, this.data.intersectPos );
        
        // // When dealing with small objects, better to hide the gizmo during scale & rotation
        // // But leave the trace line visible as its really the only ui the user needs during dragging
        // if( this.data.activeMode !== ManipulatorMode.Translate ){
        //     this.mesh.hideGizmo();
        // }

        // this.data.hasUpdated = true; // Need mesh to update
        
        this.emit( 'dragstart' );
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

    // #region OUTER EVENTS{
    on( evtName, fn ){ document.body.addEventListener( evtName, fn ); return this; }
    off( evtName, fn ){ document.body.removeEventListener( evtName, fn ); return this; }
    emit( evtName, detail=null ){
        document.body.dispatchEvent( new CustomEvent( evtName, { detail, bubbles:true, cancelable:true, composed:false } ) ); 
    }
    // #endregion
}