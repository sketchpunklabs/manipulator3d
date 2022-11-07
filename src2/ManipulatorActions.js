import {
    // vec3_add,
    // vec3_sub,
    // vec3_len,
    vec3_copy,
    // vec3_transformQuat,
    // vec3_norm,
    // vec3_dot,
    // vec3_scale,
    // vec3_scaleAndAdd,
    vec3_sqrLen,
    quat_mul,
    quat_normalize,
    // quat_copy,
    // quat_sqrLen,
    quat_setAxisAngle,
} from '../src/Maths.js';

import ManipulatorMode from './ManipulatorMode.js';

export default class ManipulatorActions{
    constructor( man ){
        this.man = man;
    }

    rayIntersect( ray ){
        const s = this.man.state;
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test Axis
        const posHit  = [Infinity,Infinity,Infinity];
        const posAxis = s.position.rayTest( ray, s, posHit );
        const posDist = vec3_sqrLen( ray.posStart, posHit );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test Rotation Arcs
        const rotHit  = [Infinity,Infinity,Infinity];
        const rotAxis = s.rotation.rayTest( ray, s, rotHit );
        const rotDist = vec3_sqrLen( ray.posStart, rotHit );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( posAxis === -1 && rotAxis === -1 ){
            s.mode = ManipulatorMode.None;
            s.iAxis = -1;
            return false;
        }
        
        if( posDist < rotDist ){
            //console.log( 'POSITION', posAxis );
            s.mode = ManipulatorMode.Translate;
            s.iAxis = posAxis;
            vec3_copy( s.contactPos, posHit );
        }else{
            //console.log( 'ROTATION', rotAxis );
            s.mode = ManipulatorMode.Rotate;
            s.iAxis = rotAxis;
            vec3_copy( s.contactPos, rotHit );
        }

        return true;
    }

    rayHover( ray ){
        return ( this.man.state.isActive && !this.man.state.isDragging && this.rayIntersect( ray ) );
    }

    rayDown( ray ){
        if( this.man.state.isActive && this.rayIntersect( ray ) ){
            this.man.startDrag();
            return true;
        }

        return false;
    }

    rayMove( ray ){
        if( this.man.state.isActive && !this.man.state.isDragging ) return false;
        
        const s    = this.man.state;
        const dist = this.man.trace.rayIntersect( ray );

        switch( s.mode ){
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            case ManipulatorMode.Translate:{
                //const pos = vec3_sub( [0,0,0], this.man.trace.hitPos, this.man.trace.offset );
                s.position.set( this.man.trace.pos );
                s.updateData();
            break; }

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            case ManipulatorMode.Rotate:{
                const distStep = 0.1;           // Distance to travel to count as 1 step
                const steps = dist / distStep;
                const rad   = s.rotateStep * steps;
                const q     = quat_setAxisAngle( [0,0,0,1], s._initAxis, rad );

                quat_mul( q, q, s._initRotation );
                quat_normalize( q, q );

                s.rotation.set( q );
                s.rotation.updateAxis();
                s.rotation.updateScale( s ); // TODO This is dumb
                s.updateData();
            break; }
            
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            case ManipulatorMode.Scale: {

            break; }
        }

        return true;
    }

    rayUp(){
        if( this.man.state.isDragging ){
            this.man.endDrag();
            return true;
        }
        return false;
    }
}
