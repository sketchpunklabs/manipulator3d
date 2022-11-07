import { Ray } from '../../src/RayIntersection.js';


export default function MouseEvents( camera, renderer, actions, state, autoLoad=false ){
    // #region MAIN
    const oRay      = new Ray();
    const canvas    = renderer.domElement;

    /**
     * Special case when there is an onClick Handler on the canvas, it
     * get triggered on mouse up, but if user did a drag action the click
     * will trigger at the end. This can cause issues if using click as a way
     * to select new attachments.
    */
    let stopClick   = false;
    // #endregion

    // #region EVENT HANDLERS
    const onClick       = e =>{ if( stopClick ){ e.stopImmediatePropagation(); stopClick = false; } };
    const onPointerUp   = e =>{ if( actions.rayUp() ) canvas.releasePointerCapture( e.pointerId ); };
    const onPointerMove = e =>{
        updateRay( e );

        if( !state.isDragging ){
            actions.rayHover( oRay );
        }else{
            actions.rayMove( oRay );
            canvas.setPointerCapture( e.pointerId ); // Keep receiving events
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const onPointerDown = e =>{
        updateRay( e );
        if( actions.rayDown( oRay ) ){
            e.preventDefault();
            e.stopPropagation();
            stopClick = true;
        }
    };
    // #endregion

    // #region HELPERS
    const updateRay = e =>{
        const rect      = canvas.getBoundingClientRect();
        const x         = e.clientX - rect.x;                  // canvas x position
        const y         = e.clientY - rect.y;                  // canvas y position
        const camProj   = camera.projectionMatrix.toArray();   // Need Projection Matrix
        const camWorld  = camera.matrixWorld.toArray();        // World Space Transform of Camera
        oRay.fromScreenProjection( x, y, rect.width, rect.height, camProj, camWorld );
    };
    // #endregion

    // #region METHODS
    const loadListeners = ()=>{
        canvas.addEventListener( 'click',       onClick );
        canvas.addEventListener( 'pointermove', onPointerMove );
        canvas.addEventListener( 'pointerdown', onPointerDown );
        canvas.addEventListener( 'pointerup',   onPointerUp );
        return this;
    };
    
    const unloadListeners = ()=>{
        canvas.removeEventListener( 'click',       onClick );
        canvas.removeEventListener( 'pointermove', onPointerMove );
        canvas.removeEventListener( 'pointerdown', onPointerDown );
        canvas.removeEventListener( 'pointerup',   onPointerUp );
        return this;
    };
    // #endregion

    if( autoLoad ) loadListeners();
    return { loadListeners, unloadListeners };
}