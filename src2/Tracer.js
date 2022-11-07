import {
    // vec3_add,
    vec3_sub,
    vec3_len,
    vec3_copy,
    // vec3_transformQuat,
    vec3_norm,
    vec3_dot,
    vec3_scale,
    vec3_scaleAndAdd,
    // vec3_sqrLen,
    // quat_mul,
    // quat_normalize,
    // quat_copy,
    // quat_sqrLen,
    // quat_setAxisAngle,
} from '../src/Maths.js';

import {
    // Ray,
    // intersectPlane,
    // intersectTri,
    // intersectSphere,
    // nearPoint,
    NearSegmentResult,
    nearSegment,
} from '../src/RayIntersection.js';

import ManipulatorMode from './ManipulatorMode.js';

export default class Tracer{
    // #region MAIN
    initPos  = [0,0,0]; // Inital Contact Position that started the drag
    offset   = [0,0,0]; // Offset vector from contact position and gizmo's origin
    startPos = [0,0,0]; // Start Position of the trace line
    endPos   = [0,0,0]; // End Position of the trace line
    dir      = [0,0,0]; // Direction of trace line
    hitPos   = [0,0,0]; // Intersection position of mouse ray & trace segment
    pos      = [0,0,0]; // Final position with offset applied
    distance = 0;       // Signed distance traveled
    // #endregion

    rayIntersect( ray ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Trace mouse movement onto trace line
        const segResult = new NearSegmentResult();
        nearSegment( ray, this.startPos, this.endPos, segResult );
        vec3_copy( this.hitPos, segResult.segPosition );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Distance Traveled
        const dir  = vec3_sub( [0,0,0], this.hitPos, this.initPos );
        const sign = Math.sign( vec3_dot( this.dir, dir ) );
        this.distance = vec3_len( dir ) * sign;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Final Position
        vec3_sub( this.pos, this.hitPos, this.offset ); 

        // Debug.pnt2.reset()
        //     .add( segResult.segPosition, 0x707070, 8 )
        //     .add( this.initPos, 0x00ff00, 4 );

        return this.distance;
        // console.log( dist );
    }
    
    prepare( man ){
        const s = man.state;
        vec3_copy( this.initPos, s.contactPos );
        vec3_sub( this.offset, this.initPos, s.position.value );

        switch( s.mode ){
            // ----------------------------------------------
            case ManipulatorMode.Translate:{
                vec3_copy( this.dir, s.rotation.aryAxisSclDir[ s.iAxis ] );
                vec3_scaleAndAdd( this.startPos, this.initPos, s.rotation.aryAxisSclDir[ s.iAxis ], 1000 );
                vec3_scaleAndAdd( this.endPos, this.initPos, s.rotation.aryAxisSclDir[ s.iAxis ],  -1000 );
            break; }

            // ----------------------------------------------
            case ManipulatorMode.Rotate:{
                const i   = (s.iAxis + 1) % 3;
                const ii  = (s.iAxis + 2) % 3;
                const a   = s.position.aryEndPoint[ i ];
                const b   = s.position.aryEndPoint[ ii ];

                const sn = 
                    Math.sign( s.cameraVecScale[ i ] ) * 
                    Math.sign( s.cameraVecScale[ ii ] );

                vec3_sub( this.dir, b, a );
                vec3_norm( this.dir, this.dir );
                vec3_scale( this.dir, this.dir, sn );

                vec3_scaleAndAdd( this.startPos, this.initPos, this.dir,  1000 );
                vec3_scaleAndAdd( this.endPos,   this.initPos, this.dir, -1000 );
            break; }
            
            // ----------------------------------------------
            case ManipulatorMode.Scale: break;
        }

        // Debug.ln2.reset();
        // Debug.ln2.add( this.startPos, this.endPos, 0x707070 );


        // console.log( s.mode, s.axis )

        //main.state.rotation.aryAxisSclDir[];

        // this.traceLine.isActive = true;
        // vec3_copy( this.traceLine.origin, pos );
        // vec3_copy( this.traceLine.hitPos, pos );

        // if( axis == -1 ){
        //     vec3_transformQuat( this.traceLine.dir, [1,0,0], this.lastCamRot );
        // }else{
        //     vec3_copy( this.traceLine.dir, this.axes[axis].dir );
        // }

        // vec3_scaleAndAdd( this.traceLine.a, pos, this.traceLine.dir, -1000 );
        // vec3_scaleAndAdd( this.traceLine.b, pos, this.traceLine.dir,  1000 );

        
        //Debug.pnt2.add( man.state.contactPos, 0x00ff00, 5 );
    }
}