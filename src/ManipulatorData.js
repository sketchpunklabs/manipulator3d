import {
    vec3_sub,
    vec3_len,
    vec3_copy,
    vec3_transformQuat,
    vec3_norm,
    vec3_dot,
    vec3_scale,
    vec3_scaleAndAdd,
    vec3_sqrLen,
    quat_copy,
    quat_sqrLen,
} from './Maths.js';

import {
    intersectPlane,
    intersectTri,
    intersectSphere,
    nearPoint,
    NearSegmentResult,
    nearSegment,
} from './RayIntersection.js';


export const ManipulatorMode = Object.freeze({
    Translate   : 0,
    Rotate      : 1,
    Scale       : 2,
});

export class ManipulatorData{
    // #region MAIN
    scaleFactor     = 10;           // Rescale axes based on camera distance, to keep gizmo about the same size
    minFlipAdjust   = -0.02;	    // Dot Angle minimum to flip Gizmo
    minHitDistance  = 0.1;          // Min Distance to consider touching an axis segment
    minPntDistance  = 0.1;
    minArcDistance  = 0.1;
    lastCamPos      = [0,0,0];      // Store last cam position to be able to recompute while dragging
    lastCamRot      = [0,0,0,1];    // Store last cam rotation
    hasHit          = false;        // Indicator there was a ray intersection hit
    hasUpdated      = true;         // Indicator that the data has changed
    isDragging      = false;        // Is the gizmo currently being dragged by the user
    isActive        = false;        // Is the UI element enabled / visible

    intersectPos    = [0,0,0];      
    position        = [0,0,0];      // Position in world space
    scale           = [1,1,1];      // Scale based on angle from camera & distance
    infoScale       = 1;            // Scale distance test values use for hit detection
    
    arcRadius       = 1.5;          // Radius of Arc
    axisLen         = 1.5;          // Length of the axis lines
    midPointLen     = 0.55;         // How far from origin to mark compute mid points
    sclPointLen     = 1.8;          // How far from origin to mark compute scale points

    axes            = [             // Information about each axis
        { dir: [1,0,0], endPos:[1,0,0], midPos:[0,0,0], sclPos:[0,0,0] }, // X
        { dir: [0,1,0], endPos:[0,1,0], midPos:[0,0,0], sclPos:[0,0,0] }, // Y
        { dir: [0,0,1], endPos:[0,0,1], midPos:[0,0,0], sclPos:[0,0,0] }, // Z
    ];

    traceStep       = 0.1;      // Distance to travel to count as 1 step
    traceLine       = { 
        isActive    : false,    // Should the line be visible
        hitPos      : [0,0,0],  // Current Hit position on line
        origin      : [0,0,0],  // Hit position that initialized the trace line
        a           : [0,0,0],  // First point of line
        b           : [0,0,0],  // Second Point of line
        dir         : [0,0,0],  // Direction line is being drawn on
    };

    activeMode      = ManipulatorMode.Translate;
    activeAxis      = -1;   // Axis index that's active (0:x, 1:y, 2:z), -2 means all axes
    activePlane     = -1;   // Same as active Axis, just for planes

    onDragStart     = null;
    onDragEnd       = null;
    onTranslate     = null;
    onRotate        = null;
    onScale         = null;
    // #endregion

    // #region METHODS
    setPosition( x,y,z ){
        if( x.length === 3 ){
            this.position[ 0 ] = x[0];
            this.position[ 1 ] = x[1];
            this.position[ 2 ] = x[2];
        }else{
            this.position[ 0 ] = x;
            this.position[ 1 ] = y;
            this.position[ 2 ] = z;
        }

        this.hasUpdated = true;
        return this;
    }

    // UI data changed in relation to direction & distance from the camera
    updateFromCamera( camPos, camRot, forceUpdate=false ){
        // If dragging or no change to camera since last update
        if(
            (this.isDragging || (
                Math.abs( vec3_sqrLen( camPos, this.lastCamPos ) ) <= 0.000001 &&
                Math.abs( quat_sqrLen( camRot, this.lastCamRot ) ) <= 0.000001
            )) && !forceUpdate
        ) return this;

        vec3_copy( this.lastCamPos, camPos );
        quat_copy( this.lastCamRot, camRot );
        this._calcCameraScale();
        return this;
    }
    
    resetState(){
        this.traceLine.isActive = false;
        this.activeMode         = ManipulatorMode.Translate;
        this.activeAxis         = -1;
        this.activePlane        = -1;
    }
    // #endregion

    // #region DRAGGING
    startDrag(){
        this.isDragging = true;
        if( this.onDragStart ) this.onDragStart();
    }

    stopDrag(){
        this.isDragging = false;
        if( this.onDragEnd ) this.onDragEnd();
    }

    // User interacting on a plane
    _movePlane( ray, i ){
        const norm = this.axes[ i ].dir;
        const t    = intersectPlane( ray, this.position, norm );

        if( t != null ){
            ray.posAt( t, this.position );
            this.calcAxesPosition();

            if( this.onTranslate ) this.onTranslate( this.position.slice( 0 ) );
            return true;
        }

        return false;
    }
    
    // User interacting on a trace line
    _moveTrace( ray ){
        const segResult = new NearSegmentResult();
        if( nearSegment( ray, this.traceLine.a, this.traceLine.b, segResult ) ){

            vec3_copy( this.traceLine.hitPos, segResult.segPosition );            
            
            switch( this.activeMode ){
                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                case ManipulatorMode.Translate:
                    vec3_copy( this.position, segResult.segPosition );
                    this.calcAxesPosition(); // Need to recompute all the axis data during translating

                    if( this.onTranslate ) this.onTranslate( segResult.segPosition.slice( 0 ) );
                break;

                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                case ManipulatorMode.Rotate:
                case ManipulatorMode.Scale:
                    const dir   = vec3_sub( [0,0,0], segResult.segPosition, this.traceLine.origin );
                    const dist  = vec3_len( dir );
                    const sign  = Math.sign( vec3_dot( dir, this.traceLine.dir ) );
                    const step  = ( dist / this.traceStep ) * sign;

                    if( this.onRotate && this.activeMode === ManipulatorMode.Rotate ){
                        this.onRotate( step, this.activeAxis );
                    }

                    if( this.onScale && this.activeMode === ManipulatorMode.Scale ){
                        this.onScale( step, ( this.activeAxis >= 0 )? this.activeAxis : null );
                    }
                break;
            }

            return true;
        }

        return false;
    }

    // Handle ray on some sort of down event
    onRayDown( ray ){
        if( this.isActive && this._rayIntersect( ray ) ){
            this.startDrag();
            return true;
        }
        return false
    }

    // Handle ray on same sort of hover event
    onRayHover( ray ){
        return ( this.isActive && !this.isDragging )? this._rayIntersect( ray ) : false;
    }

    // Handle ray on same sort of move event
    onRayMove( ray ){
        if( this.isActive && !this.isDragging ) return false;

        if( this.activeAxis != -1 ){
            this._moveTrace( ray );
        }else if( this.activePlane != -1 ){
            return this._movePlane( ray, this.activePlane );
        }

        return false;
    }
    // #endregion
    
    // #region HELPER
    _setTraceLine( pos, axis=-1 ){
        this.traceLine.isActive = true;
        vec3_copy( this.traceLine.origin, pos );
        vec3_copy( this.traceLine.hitPos, pos );

        if( axis == -1 ){
            vec3_transformQuat( this.traceLine.dir, [1,0,0], this.lastCamRot );
        }else{
            vec3_copy( this.traceLine.dir, this.axes[axis].dir );
        }

        vec3_scaleAndAdd( this.traceLine.a, pos, this.traceLine.dir, -1000 );
        vec3_scaleAndAdd( this.traceLine.b, pos, this.traceLine.dir,  1000 );
    }
    // #endregion

    // #region COMPUTE
    _calcCameraScale(){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Adjust the scale to keep the gizmo as the same size no matter how far the camera goes
        const eyeDir = vec3_sub( [0,0,0], this.lastCamPos, this.position );
        const eyeLen = vec3_len( eyeDir );
        
        this.infoScale = eyeLen / this.scaleFactor;
        
        vec3_norm( eyeDir, eyeDir ); // Normalize for DOT Checks
        vec3_scale( this.scale, [1,1,1], this.infoScale );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Flip viewing to the opposite side
        if( vec3_dot( eyeDir, [1,0,0] ) < this.minFlipAdjust ) this.scale[0] = -this.scale[0];
        if( vec3_dot( eyeDir, [0,1,0] ) < this.minFlipAdjust ) this.scale[1] = -this.scale[1];
        if( vec3_dot( eyeDir, [0,0,1] ) < this.minFlipAdjust ) this.scale[2] = -this.scale[2];
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Update the axis positions
        this.calcAxesPosition();
    }

    calcAxesPosition(){
        const a = this.axes;
        for( let i=0; i < 3; i++ ){
            vec3_scaleAndAdd( a[i].endPos, this.position, a[i].dir, this.scale[i] * this.axisLen );     // Axis Line
            vec3_scaleAndAdd( a[i].midPos, this.position, a[i].dir, this.scale[i] * this.midPointLen ); // Mid Point 
            vec3_scaleAndAdd( a[i].sclPos, this.position, a[i].dir, this.scale[i] * this.sclPointLen ); // Scale Points
        }

        this.hasUpdated = true;
    }
    // #endregion

    // #region RAY INTERSECTION
    _rayIntersect( ray ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // First test if the ray even intersects the sphere area the control occupies
        if( ! this._testSphere( ray ) ){
            return false;
        }

        const lastAxis = this.activeAxis;
        this.resetState();

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let hit = false;
        if( ! (hit = this._testPoints( ray )) ){
            if( ! (hit = this._testPlanes( ray )) ){
                if( ! (hit = this._testAxis( ray )) ){
                    hit = this._testArc( ray );
                }
            }
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( lastAxis !== this.activeAxis ){
            this.hasUpdated = true;
        }

        this.hasHit = hit;
        return hit;
    }

    _testSphere( ray ){
        return intersectSphere( ray, this.position, ( this.sclPointLen + this.minPntDistance ) * this.infoScale );
    }

    _testPlanes( ray ){
        // Test each axis plane by using triangle points
        const a = this.axes;

        let i, ii;
        for( i=0; i < 3; i++ ){  
            ii = ( i + 1 ) % 3; // 0:1 = Z(2), 1:2 = X(0), 2:0 = Y(1) 
            if( intersectTri( ray, a[ i ].midPos, a[ ii ].midPos, this.position, this.intersectPos, false ) ){
                this.activePlane = (i + 2) % 3;
                return true;
            }
        }
        return false;
    }

    _testArc( ray ){
        const minDistance = this.infoScale * this.minArcDistance;
        const a           = this.axes;
        const hitPos      = [0,0,0];           // Intersection Hit Position
        const hitDir      = [0,0,0];           // Direction to Hit point
        const axis        = [0,0,0];           // Axis for hemisphere testing
        const radius      = this.arcRadius * this.infoScale; // Doing distance testing in Squared values
        
        let t, dist;
        let i, ii, iii;

        for( i=0; i < 3; i++ ){
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // First test against the plane using the axis as the plane normal
            t = intersectPlane( ray, this.position, a[i].dir );
            if( t === null ) continue;

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // Next do a circle radius test of the hit point to plane origin
            ray.posAt( t, hitPos );
            dist = vec3_len( this.position, hitPos );

            if( Math.abs( dist - radius ) <= minDistance ){
                // ------------------------------------------
                // Inside circle, Check if in the positive side of the hemisphere
                // using the next axis direction 
                ii = ( i + 1 ) % 3;

                // Get direction to hit point
                vec3_sub( hitDir, hitPos, this.position );

                // Flip axis direction based on camera angle
                vec3_scale( axis, a[ii].dir, Math.sign( this.scale[ii] ) );

                if( vec3_dot( hitDir, axis ) >= 0 ){
                    // ------------------------------------------
                    // Do the other hemisphere check with the remaining axis  
                    iii = ( i + 2 ) % 3;

                    // Flip axis direction based on camera angle
                    vec3_scale( axis, a[iii].dir, Math.sign( this.scale[iii] ) );

                    if( vec3_dot( hitDir, axis ) >= 0 ){
                        this.activeAxis = i;
                        this.activeMode = ManipulatorMode.Rotate;
                        this._setTraceLine( hitPos );
                        vec3_copy( this.intersectPos, hitPos );
                        return true;
                    }
                }
            }
        }

        return false;
    }

    _testAxis( ray ){
        const minDistance = this.infoScale * this.minHitDistance;
        const segResult   = new NearSegmentResult();
        const pos         = [ 0, 0, 0 ];
        let min           = Infinity;
        let axis          = -1;
        let ax;
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for( let i=0; i < 3; i++ ){
            ax = this.axes[ i ];
            
            // Find the axis with the shortest distance
            if( nearSegment( ray, this.position, ax.endPos, segResult ) ){
                if( segResult.distance <= minDistance && segResult.distance < min ){
                    min  = segResult.distance;
                    axis = i;
                    vec3_copy( pos, segResult.segPosition );
                }
            }
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( axis !== -1 ){
            this.activeAxis = axis;
            this._setTraceLine( pos, axis );
            vec3_copy( this.intersectPos, pos );
            return true;
        }

        return false;
    }
    
    _testPoints( ray ){
        const minDistance = this.infoScale * this.minPntDistance;
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test for origin point for all axis scaling
        let t = nearPoint( ray, this.position, minDistance );
        if( t !== null ){
            this._setTraceLine( this.position );
            this.activeMode = ManipulatorMode.Scale;
            this.activeAxis = -2;
            return true;
        }
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test axis specific points
        for( let i=0; i < 3; i++ ){
            t = nearPoint( ray, this.axes[ i ].sclPos, minDistance );
            if( t !== null ){
                this._setTraceLine( this.axes[ i ].sclPos, i );
                
                this.activeAxis = i;
                this.activeMode = ManipulatorMode.Scale;

                vec3_copy( this.intersectPos, this.axes[ i ].sclPos );
                return true;
            }
        }

        return false;
    }
    // #endregion
}