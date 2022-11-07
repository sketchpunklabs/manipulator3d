import PositionState    from './PositionState.js';
import RotationState    from './RotationState.js';
import ScaleState       from './ScaleState.js';


import {
    // vec3_add,
    vec3_sub,
    vec3_len,
    vec3_copy,
    // vec3_transformQuat,
    vec3_norm,
    vec3_dot,
    vec3_scale,
    // vec3_scaleAndAdd,
    vec3_sqrLen,
    // quat_mul,
    // quat_normalize,
    quat_copy,
    quat_sqrLen,
    // quat_setAxisAngle,
} from '../../src/Maths.js';


import ManipulatorMode from '../ManipulatorMode.js';

export default class ManipulatorState{
    // #region MAIN
    // Main Transformation State
    position = new PositionState();
    rotation = new RotationState();
    scale    = new ScaleState();

    // Scale data based on camera distance
    cameraRot       = [0,0,0,1];
    cameraPos       = [0,0,0];
    cameraFactor    = 10;
    cameraScale     = 1;
    cameraVecScale  = [1,1,1];
    cameraFlipDMin  = -0.02;

    // settings
    isActive        = true;
    isDragging      = false;
    rotateStep      = 2 * Math.PI / 180;   // How many radians per step

    // misc
    radius          = 1.5;  // Distance each axis should stick out from origin
    mode            = ManipulatorMode.None;
    iAxis           = -1;
    contactPos      = [0,0,0];

    // cache
    _initRotation = [0,0,0,0];
    _initAxis     = [0,0,0];

    constructor(){}
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

    // #region METHODS
    updateData(){
        this.rotation.updateScale( this );      // Update scaled axis   
        this.position.updateEndpoints( this );  // Update axis end points
    }

    doCache(){
        quat_copy( this._initRotation, this.rotation.value );
        vec3_copy( this._initAxis, this.rotation.aryAxis[ this.iAxis ] );
    }
    // #endregion
}