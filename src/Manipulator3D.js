// #region IMPORTS
import { Raycaster, Vector3, Quaternion } 
                            from 'three';
import { Ray }              from './RayIntersection.js';
import { ManipulatorData, ManipulatorMode } 
                            from './ManipulatorData.js';
import { ManipulatorMesh }  from './ManipulatorMesh.js';

import {
    vec3_add,
    vec3_sub,
    vec3_copy,
    quat_mul,
    quat_copy,
    quat_setAxisAngle,
    quat_normalize,
} from './Maths.js';
// #endregion

export class Manipulator3D{
    // #region MAIN
    mesh                = null;                 // Rendering of the gizmo
    data                = null;                 // Data state of the gizmo
    attachedObject      = null;                 // Reference to selected object

    _camera             = null;                 // ThreeJS Camera
    _renderer           = null;                 // ThreeJS Renderer
    _caster             = new Raycaster();      // ThreeJS Ray Caster
    _ray                = new Ray();            // Custom ray object

    _scaleStep          = 0.1;                  // How much to increment per step
    _rotateStep         = 10 * Math.PI / 180;   // How many radians per step

    _intersectOffset    = [0,0,0];              // Offset between gizmo position & intersection point
    _initDragPosition   = [0,0,0];              // Caching values at the start of a drag action
    _initDragQuaternion = [0,0,0,1];
    _initDragScale      = [1,1,1];

    _currentPosition    = [0,0,0];              // Keep track of current values, useful for no attachment use.
    _currentQuaternion  = [0,0,0,1];
    _currentScale       = [1,1,1];

    _3jsVec             = new Vector3();
    _3jsQuat            = new Quaternion();

    /**
     * Special case when there is an onClick Handler on the canvas, it
     * get triggered on mouse up, but if user did a drag action the click
     * will trigger at the end. This can cause issues if using click as a way
     * to select new attachments.
     */
    _stopClick          = false;

    constructor( scene, camera, renderer=null, excludeMesh=false ){
        this.data      = new ManipulatorData();
        this._camera   = camera;
        
        if( !excludeMesh ){
            this.mesh = new ManipulatorMesh( this.data );
            scene.add( this.mesh );
        }
        
        this.data.onDragStart = ()=>this._onDragStart();
        this.data.onDragEnd   = ()=>this._onDragEnd();
        this.data.onTranslate = pos=>this._onTranslate( pos );
        this.data.onRotate    = ( steps, iAxis )=>this._onRotate( steps, iAxis );
        this.data.onScale     = ( steps, iAxis )=>this._onScale( steps, iAxis );

        if( renderer ) this.setRenderer( renderer );

        this.update( true );
    }  

    // Can set the renderer at a later point, sets up canvas listeners
    setRenderer( renderer ){
        const canvas   = renderer.domElement;
        this._renderer = renderer

        this.addMouseListeners();
    }
    // #endregion
    
    // #region NON-MOUSE CONTROL METHODS ( XR Controller Ray Casting )
    rayHover( rayCaster ){
        this.update();
        this._ray.fromCaster( rayCaster );
        return this.data.onRayHover( this._ray );
    }

    rayMove( rayCaster ){
        this.update();
        this._ray.fromCaster( rayCaster );
        return this.data.onRayMove( this._ray );
    }

    rayDown( rayCaster ){
        this._ray.fromCaster( rayCaster );
        return this.data.onRayDown( this._ray );
    }

    rayUp(){
        if( this.data.isDragging ) this.data.stopDrag();
    }
    // #endregion

    // #region METHODS
    isDragging(){ return this.data.isDragging; }
    isActive(){ return this.data.isActive; }

    // Enable / disable gizmo
    setActive( isOn ){
        this.data.isActive = isOn;
        if( this.mesh ) this.mesh.visible = isOn;
        if( isOn ) this.updateStateFromCamera();
        return this;
    }

    // Move control to a position
    moveTo( p ){
        this.data.setPosition( p );
        this.data.calcAxesPosition();
        this.update( true );
        return this;
    }

    // Enable/Disable different modes : Will hide render bits & disable ray intersections
    useTranslate( b ){ this.data.useTranslate = b; this.mesh.updateLook( this.data ); return this; }
    useRotate( b ){    this.data.useRotate    = b; this.mesh.updateLook( this.data ); return this; }
    useScale( b ){     this.data.useScale     = b; this.mesh.updateLook( this.data ); return this; }

    // How much distance traveled on the trace line to register as 1 step
    setTraceLineStepDistance( n ){ this.data.traceStep = n; return this; }
    setScaleStep( n ){ this._scaleStep = n; return this; }
    setRotationStep( n ){ this._rotateStep = n * Math.PI / 180; return this; }
    
    // How to scale the control in relation to the distance of the camera, 
    // this is an attempt to keep the control the same size in screen space
    setScaleFactor( n ){ this.data.scaleFactor = n; return this; }

    // When using control without attachment, this method allows to set 
    // init data for the drag during the onDragStart Event. This only works
    // with rotation/scale as position is locked to the location of the control itself.
    resetInitialValues( q=[0,0,0,1], s=[1,1,1] ){
        if( s ) vec3_copy( this._initDragScale,      s );
        if( q ) quat_copy( this._initDragQuaternion, q );
        return this;
    }

    attach( obj ){
        if( !this.data.isActive ) return;
        this.attachedObject = obj;
        this.moveTo( obj.position.toArray() );
        return this;
    }

    detach(){
        this.attachedObject = null;
        return this;
    }

    update( forceUpdate=false ){
        if( !this.data.isActive && !forceUpdate ) return false;

        // When camera changes, need data to be updated to reflect the changes
        this.updateStateFromCamera( forceUpdate );
        
        if( (this.data.hasUpdated || this.data.hasHit) && this.mesh ){
            this.mesh.update( this.data );
            this.data.hasUpdated = false;
            this.data.hasHit     = false;
            return true;
        }

        return false;
    }

    updateStateFromCamera( forceUpdate=false ){
        // In VR, the camera can exists on a dolly which causes its position & rotation 
        // to be stuck in local space. Need to get WorldSpace transform to properly compute
        // the scaling factor else the scale values will be so small that mesh wouldn't
        // be visible.
        this._camera.getWorldPosition( this._3jsVec );
        this._camera.getWorldQuaternion( this._3jsQuat );

        this.data.updateFromCamera( this._3jsVec.toArray(), this._3jsQuat.toArray(), forceUpdate );
    }
    // #endregion

    // #region GETTERS
    isDragging(){ return this.data.isDragging; }
    // #endregion

    // #region RAY CASTER

    // Convert mouse screen position to NDC coordinates, needed for ray casting
    _screenToNDCCoord(e) {
        const c    = this._renderer.domElement; // renderer canvas
        const rect = c.getBoundingClientRect(); // need canvas screen location & size
        const x    = e.clientX - rect.x;        // canvas x position
        const y    = e.clientY - rect.y;        // canvas y position

        return {
            x:  ( x / rect.width )  * 2 - 1,
            y: -( y / rect.height ) * 2 + 1,
        };
    }

    // Upate cached ray caster from mouse event on canvas
    _updateRaycaster( e ){
        this._caster.setFromCamera( this._screenToNDCCoord( e ), this._camera );
        this._ray.fromCaster( this._caster );
    }
    // #endregion

    // #region MOUSE EVENTS
    addMouseListeners(){
        const canvas = this._renderer?.domElement;
        if( !canvas ) return;
        canvas.addEventListener( 'click',       this._onClick );
        canvas.addEventListener( 'pointermove', this._onPointerMove );
        canvas.addEventListener( 'pointerdown', this._onPointerDown );
        canvas.addEventListener( 'pointerup',   this._onPointerUp );
    }

    removeMouseListeners(){
        const canvas = this._renderer?.domElement;
        if( !canvas ) return;
        canvas.removeEventListener( 'click',       this._onClick );
        canvas.removeEventListener( 'pointermove', this._onPointerMove );
        canvas.removeEventListener( 'pointerdown', this._onPointerDown );
        canvas.removeEventListener( 'pointerup',   this._onPointerUp );
    }

    _onClick = ( e ) => {
        if( this._stopClick ){
            e.stopImmediatePropagation();
            this._stopClick = false;
        }
    };

    _onPointerMove = ( e ) => {
        this.update();
        this._updateRaycaster( e );

        if( !this.data.isDragging ){
            this.data.onRayHover( this._ray );
        }else{
            this.data.onRayMove( this._ray );
            this.renderer?.domElement.setPointerCapture( e.pointerId ); // Keep receiving events
            e.preventDefault();
            e.stopPropagation();
        }
    };

    _onPointerDown = ( e ) => {
        this._updateRaycaster( e );
        if( this.data.onRayDown( this._ray ) ){
            e.preventDefault();
            e.stopPropagation();
            this._stopClick = true;
        }
    };

    _onPointerUp = ( e ) => {
        if( this.data.isDragging ){
            this.data.stopDrag();
            this.renderer?.domElement.releasePointerCapture( e.pointerId );
        }
    };
    // #endregion

    // #region INNER EVENTS
    _onDragStart(){
        // Save initial state of attached object
        if( this.attachedObject ){
            vec3_copy( this._initDragPosition,   this.attachedObject.position.toArray() );
            vec3_copy( this._initDragScale,      this.attachedObject.scale.toArray() );
            quat_copy( this._initDragQuaternion, this.attachedObject.quaternion.toArray() );
        }else{
            // Continue using 'current' values in no attachment use of the control.
            vec3_copy( this._initDragPosition,   this._currentPosition );
            vec3_copy( this._initDragScale,      this._currentScale );
            quat_copy( this._initDragQuaternion, this._currentQuaternion );
        }

        // Offset has prevent the snapping effect of translation
        vec3_sub( this._intersectOffset, this.data.position, this.data.intersectPos );
        
        // When dealing with small objects, better to hide the gizmo during scale & rotation
        // But leave the trace line visible as its really the only ui the user needs during dragging
        if( this.data.activeMode !== ManipulatorMode.Translate ){
            this.mesh.hideGizmo();
        }

        this.data.hasUpdated = true; // Need mesh to update
        this._emit( 'dragstart' );
    }

    _onDragEnd(){
        // onTranslate updates position, need to recalculate at the end of dragging 
        // for intersection tests to be accurate.
        this.data.calcAxesPosition();

        // When doing dragging away from ui, the hover event won't trigger to undo
        // visual states, so call method at the end of the dragging to tidy things up.
        this.data.resetState();
        this.mesh.showGizmo();

        this._emit( 'dragend' );
    }

    _onTranslate( pos ){
        const offsetPos = vec3_add( [0,0,0], pos, this._intersectOffset );

        this.data.setPosition( offsetPos ); // Save position for control mesh to move to
        
        // move attached object to the same spot
        if( this.attachedObject ) this.attachedObject.position.fromArray( offsetPos );

        vec3_copy( this._currentPosition, offsetPos );
        this._emit( 'translate', pos );
    }

    _onRotate( steps, iAxis ){
        // Y Axis needs to sign change, other exists reverse the scale sign        
        const sign = ( iAxis === 1 )? 1 : -Math.sign( this.data.scale[ iAxis ] );

        // Compute how much offset rotation to apply to initial value
        const q    = quat_setAxisAngle( [0,0,0,1], 
            this.data.axes[ iAxis ].dir, 
            this._rotateStep * steps * sign,
        );

        quat_mul( q, q, this._initDragQuaternion );
        quat_normalize( q, q );
        
        // Apply
        if( this.attachedObject ) this.attachedObject.quaternion.fromArray( q );

        quat_copy( this._currentQuaternion, q );
        this._emit( 'rotate', q );
    }

    _onScale( steps, iAxis ){
        const scl = this._initDragScale.slice( 0 ); // Clone data, keep init as read only
        const inc = steps * this._scaleStep;        // How much to increment the scale value

        // Apply scale increment in all axes
        if( iAxis === null ){
            scl[ 0 ] += inc;
            scl[ 1 ] += inc;
            scl[ 2 ] += inc;
        
        // Apply to a specific axis
        }else{
            scl[ iAxis ] += inc * Math.sign( this.data.scale[ iAxis ] );
        }
        
        // Apply
        if( this.attachedObject ) this.attachedObject.scale.fromArray( scl );

        vec3_copy( this._currentScale, scl );

        this._emit( 'scale', scl );
    }
    // #endregion

    // #region OUTER EVENTS{
    on( evtName, fn ){ this._renderer.domElement.addEventListener( evtName, fn ); }
    off( evtName, fn ){ this._renderer.domElement.removeEventListener( evtName, fn ); }
    _emit( evtName, detail=null ){
        this._renderer.domElement.dispatchEvent( new CustomEvent( evtName, { detail, bubbles:true, cancelable:true, composed:false } ) ); 
    }
    // #endregion
}