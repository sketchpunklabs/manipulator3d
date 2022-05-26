// #region IMPORTS
import { Raycaster }        from 'three';
import { Ray }              from './RayIntersection.js';
import { ManipulatorData }  from './ManipulatorData.js';
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
    _initDragScale      = [0,0,0];

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

        canvas.addEventListener( 'pointermove', e=>{
            this.update();
            this._updateRaycaster( e );
            if( !this.data.isDragging ) this.data.onRayHover( this._ray );
            else                        this.data.onRayMove( this._ray );
        });

        canvas.addEventListener( "pointerdown", e=>{
            this._updateRaycaster( e );
            this.data.onRayDown( this._ray );
        } );

        canvas.addEventListener( "pointerup", e=>{
            if( this.data.isDragging ) this.data.stopDrag();
        });
    }
    // #endregion
    
    // #region METHODS
    attach( obj ){
        if( !this.data.isActive ) return;
        this.attachedObject = obj;
        this.data.setPosition( obj.position.toArray() );
        this.data.calcAxesPosition();
    }

    detach(){
        this.attachedObject = null;
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

    // #region INNER EVENTS
    _onDragStart(){
        // Save initial state of attached object
        vec3_copy( this._initDragPosition,   this.attachedObject.position.toArray() );
        vec3_copy( this._initDragScale,      this.attachedObject.scale.toArray() );
        quat_copy( this._initDragQuaternion, this.attachedObject.quaternion.toArray() );

        // Offset has prevent the snapping effect of translation
        vec3_sub( this._intersectOffset, this.data.position, this.data.intersectPos );
        
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

        this._emit( 'dragend' );
    }

    _onTranslate( pos ){
        const offsetPos = vec3_add( [0,0,0], pos, this._intersectOffset );

        this.data.setPosition( offsetPos );                  // Save position for mesh to move to
        this.attachedObject.position.fromArray( offsetPos ); // move attached object to the same spot

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
        this.attachedObject.quaternion.fromArray( q );
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
        this.attachedObject.scale.fromArray( scl );
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

    // #region METHODS

    // Enable / disable gizmo
    setActive( b ){
        this.data.isActive = b;
        if( this.mesh ) this.mesh.visible   = b;
    }

    update( forceUpdate=false ){
        if( !this.data.isActive && !forceUpdate ) return false;

        // When camera changes, need data to be updated to reflect the changes
        this.data.updateFromCamera( this._camera.position.toArray(), this._camera.quaternion.toArray() );
        
        if( (this.data.hasUpdated || this.data.hasHit) && this.mesh ){
            this.mesh.update( this.data );
            this.data.hasUpdated = false;
            this.data.hasHit     = false;
            return true;
        }

        return false;
    }
    // #endregion
}