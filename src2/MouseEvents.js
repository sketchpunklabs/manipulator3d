import {
    Ray,
    // intersectPlane,
    // intersectTri,
    // intersectSphere,
    // nearPoint,
    // NearSegmentResult,
    // nearSegment,
} from '../src/RayIntersection.js';

export default class MouseEvents{
    // #region MAIN
    constructor( man, renderer ){
        this.ray    = new Ray();
        this.canvas = renderer.domElement;
        this.man    = man;
        this.loadListeners();

        /**
         * Special case when there is an onClick Handler on the canvas, it
         * get triggered on mouse up, but if user did a drag action the click
         * will trigger at the end. This can cause issues if using click as a way
         * to select new attachments.
        */
        this.stopClick = false;
    }
    // #endregion

    // #region METHODS
    loadListeners(){
        this.canvas.addEventListener( 'click',       this.onClick );
        this.canvas.addEventListener( 'pointermove', this.onPointerMove );
        this.canvas.addEventListener( 'pointerdown', this.onPointerDown );
        this.canvas.addEventListener( 'pointerup',   this.onPointerUp );
        return this;
    }

    unloadListeners(){
        this.canvas.removeEventListener( 'click',       this.onClick );
        this.canvas.removeEventListener( 'pointermove', this.onPointerMove );
        this.canvas.removeEventListener( 'pointerdown', this.onPointerDown );
        this.canvas.removeEventListener( 'pointerup',   this.onPointerUp );
    }

    updateRay( e ){
        const rect      = this.canvas.getBoundingClientRect();
        const x         = e.clientX - rect.x;                           // canvas x position
        const y         = e.clientY - rect.y;                           // canvas y position
        const camProj   = this.man.camera.projectionMatrix.toArray();   // Need Projection Matrix
        const camWorld  = this.man.camera.matrixWorld.toArray();        // World Space Transform of Camera
        this.ray.fromScreenProjection( x, y, rect.width, rect.height, camProj, camWorld );
    }
    // #endregion

    // #region HANDLERS
    onClick = ( e )=>{
        if( this.stopClick ){
             e.stopImmediatePropagation();
             this.stopClick = false;
        }
    };

    onPointerMove = ( e )=>{
        this.updateRay( e );

        if( !this.man.state.isDragging ){
            this.man.actions.rayHover( this.ray );
        }else{
            this.man.actions.rayMove( this.ray );
            this.canvas.setPointerCapture( e.pointerId ); // Keep receiving events
            e.preventDefault();
            e.stopPropagation();
        }
    };

    onPointerDown = ( e )=>{
        this.updateRay( e );

        if( this.man.actions.rayDown( this.ray ) ){
            e.preventDefault();
            e.stopPropagation();
            this.stopClick = true;
        }
    };

    onPointerUp = ( e )=>{
        if( this.man.actions.rayUp() ){
            this.canvas.releasePointerCapture( e.pointerId );
        }
    };
    // #endregion
}
