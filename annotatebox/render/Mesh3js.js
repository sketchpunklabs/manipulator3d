import * as THREE from 'three';
import FloorCube from '../../src3/render/FloorCube.js';
import ScaleCube from './ScaleCube.js';
import ShapePointsMesh              from '../../test/_lib/ShapePointsMesh.js';

import { Modes, Axes }  from '../Structs.js';

import {
    // vec3_add,
    // vec3_add_batch,
    // vec3_sub,
    // vec3_len,
    // vec3_norm,
    vec3_scale,
    vec3_scaleAndAdd,
    // vec3_transformQuat,
    //  vec3_negate,
    // vec3_sqrLen,
    // vec3_copy,
    // quat_mul,
    // quat_copy,
    // quat_setAxisAngle,
    // quat_normalize,
} from '../lib/Maths.js';

function newMesh( geo, color, pos=null, rot=null, order=0 ){
    const mat  = new THREE.MeshBasicMaterial( {
        depthTest   : false,
        depthWrite  : false,
        fog         : false,
        toneMapped  : false,
        transparent : true,
        side        : THREE.DoubleSide,
        opacity     : 0.9,
        color       : color,
    } );

    const mesh = new THREE.Mesh( geo, mat );
    mesh.renderOrder = order;
    if( pos ) mesh.position.fromArray( pos );
    if( rot ) mesh.rotation.fromArray( rot );
    return mesh;
}


export default class Mesh3js extends THREE.Group{
    axisColors    = [ 0x81D773, 0x6DA9EA, 0xF7716A ];
    axes          = [ [1,0,0], [0,1,0], [0,0,1] ];
    axisLines     = [];
    axisArcs      = [];

    dmesh  = new ScaleCube();
    pnt    = new ShapePointsMesh();//.useDepth( true );

    constructor(){
        super();
        this.add( this.pnt );
        this.add( this.dmesh.mesh );

        
        const PIH           = Math.PI * 0.5;
        const PIY           = Math.PI * 0.375;
        const PIQ           = Math.PI * 0.25;
        const PIX           = Math.PI * 0.125;
        const PI            = Math.PI;
        
        const geoBox = FloorCube.geo( 0.1, 1.0, 0.1 );
        const xpBox  = newMesh( geoBox, this.axisColors[0], null, [0,0,-PIH] );
        const ypBox  = newMesh( geoBox, this.axisColors[1], null );
        const zpBox  = newMesh( geoBox, this.axisColors[2], null, [PIH,0,0] );
        this.add( xpBox, ypBox, zpBox );
        this.axisLines.push( xpBox, ypBox, zpBox );

        const geoArc = new THREE.TorusGeometry( 1, 0.1, 3, 10, PIQ );
        const zArc   = newMesh( geoArc, this.axisColors[2], [1,0,0], [0,0,-PIX] );
        const yArc   = newMesh( geoArc, this.axisColors[1], [0,0,1], [PIH,0,PIY] );
        const xArc   = newMesh( geoArc, this.axisColors[0], [0,1,0], [0,PIH,PIY] );
        this.add( xArc, yArc, zArc );
        this.axisArcs.push( xArc, yArc, zArc );
    }

    render( abox ){
        this.pnt.reset();

        const tmp  = [0,0,0];
        const pos  = abox.getPosition();
        const rot  = abox.getRotation();
        const lens = abox.state.axesLengths;
        const selAxis = abox.state.selectAxis;
        const selMode = abox.state.selectMode;

        //const axes = abox.getAxes();
        //const pnts = abox.getPoints();

        this.position.fromArray( pos );
        this.quaternion.fromArray( rot );

        this.dmesh.setAxesLengths( lens );
        this.dmesh.selectFace( (( selMode === Modes.Scale )? selAxis : -1) );

        for( let i=0; i < 3; i++ ){
            vec3_scale( tmp, this.axes[ i ], lens[ i ] );
            this.axisLines[ i ].position.fromArray( tmp );
            this.axisLines[ i ].material.color.setHex( ( selMode === Modes.Translate && i === selAxis)? 0xffffff : this.axisColors[i] );

            const ii = ( i+1 ) % 3;
            vec3_scale( tmp, this.axes[ii], lens[ii] );
            this.axisArcs[ i ].position.fromArray( tmp );
            this.axisArcs[ i ].material.color.setHex( ( selMode === Modes.Rotate && i === selAxis)? 0xffffff : this.axisColors[i] );
        }



        // const offset = 0.4;
        // const tmp    = [0,0,0];
        this.pnt.add( [0,0,0], 0xffff00, 5 );
        // this.pnt.add( vec3_scale( tmp, [1,0,0], lens[ 0 ] + offset), 0xffffff, 8 );
        // this.pnt.add( vec3_scale( tmp, [-1,0,0], lens[ 3 ] + offset), 0xffffff, 8 );
        // this.pnt.add( vec3_scale( tmp, [0,1,0], lens[ 1 ] + offset), 0xffffff, 8 );
        // this.pnt.add( vec3_scale( tmp, [0,-1,0], lens[ 4 ] + offset), 0xffffff, 8 );
        // this.pnt.add( vec3_scale( tmp, [0,0,1], lens[ 1 ] + offset), 0xffffff, 8 );
        // this.pnt.add( vec3_scale( tmp, [0,0,-1], lens[ 4 ] + offset), 0xffffff, 8 );
    }
}