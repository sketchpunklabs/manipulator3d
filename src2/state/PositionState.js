import {
    vec3_add,
    // vec3_sub,
    // vec3_len,
    vec3_copy,
    // vec3_transformQuat,
    // vec3_norm,
    vec3_dot,
    // vec3_scale,
    // vec3_scaleAndAdd,
    // vec3_sqrLen,
    // quat_mul,
    // quat_normalize,
    // quat_copy,
    // quat_sqrLen,
    // quat_setAxisAngle,
} from '../../src/Maths.js';


import {
    // Ray,
    // intersectPlane,
    // intersectTri,
    // intersectSphere,
    // nearPoint,
    NearSegmentResult,
    nearSegment,
} from '../../src/RayIntersection.js';

export default class PositionState{
    // #region DATA
    value           = [0,0,0];

    minRayDistance  = 0.2;
    xEndPoint       = [0,0,0];
    yEndPoint       = [0,0,0];
    zEndPoint       = [0,0,0];

    aryEndPoint     = [
        this.xEndPoint,
        this.yEndPoint,
        this.zEndPoint,
    ];
    // #endregion

    set( v ){
        this.value[ 0 ] = v[ 0 ];
        this.value[ 1 ] = v[ 1 ];
        this.value[ 2 ] = v[ 2 ];
    }

    updateEndpoints( man ){
        vec3_add( this.xEndPoint, this.value, man.rotation.xAxisScl );
        vec3_add( this.yEndPoint, this.value, man.rotation.yAxisScl );
        vec3_add( this.zEndPoint, this.value, man.rotation.zAxisScl );
    }

    rayTest( ray, state, hitPos=[0,0,0] ){
        const minRange  = state.cameraScale * this.minRayDistance;
        const segResult = new NearSegmentResult();
        let minDist     = Infinity;
        let minAxis     = -1;

        //Debug.pnt2.reset();
        
        for( let i=0; i < 3; i++ ){
            if( nearSegment( ray, this.value, this.aryEndPoint[i], segResult ) ){
                if( ( segResult.distance <= minRange ) && segResult.distance < minDist ){
                    minAxis = i;
                    minDist = segResult.distance;
                    vec3_copy( hitPos, segResult.segPosition );
                }
            }
        }

        // if( minDist !== Infinity ){
        //     // console.log( 'Axis', minAxis, 'at', minPos );
        //     // Debug.pnt2.add( minPos, 0x00ff00, 4 )
        //     return true;
        // }

        return minAxis;
    }
}