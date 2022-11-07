
import { 
    Group, Line, Mesh, DoubleSide,
    MeshBasicMaterial, LineBasicMaterial, 
    BufferGeometry, Float32BufferAttribute,
    SphereGeometry, TorusGeometry, CylinderGeometry, BoxGeometry, PlaneGeometry, CircleGeometry,
}                          from 'three';

import FloorCube from './FloorCube.js';

function newMesh( geo, color, pos=null, rot=null, order=0 ){
    const mat  = new MeshBasicMaterial( {
        depthTest   : false,
        depthWrite  : false,
        fog         : false,
        toneMapped  : false,
        transparent : true,
        side        : DoubleSide,
        opacity     : 0.9,
        color       : color,
    } );

    const mesh = new Mesh( geo, mat );
    mesh.renderOrder = order;
    if( pos ) mesh.position.fromArray( pos );
    if( rot ) mesh.rotation.fromArray( rot );
    return mesh;
}

export default class Mesh3JS extends Group{
    axisColors    = [ 0x81D773, 0x6DA9EA, 0xF7716A ];
    axisPLines    = [];
    axisNLines    = [];
    axisArc       = [];
    axisPoints    = [];
    axisPlanes    = [];
    //onUpdate      = null;

    constructor( state ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        super();
        //this.onUpdate = updateCallback;

        const PIH           = Math.PI * 0.5;
        const PI            = Math.PI;
        const arcRadius     = 0.8;
        const arcThickness  = 0.025;
        const planeSize     = 0.25;
        const boxSize       = 0.04;
        const boxLen        = state.axisLength; //0.85;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // GEOMETRY
        const geoSphere = new SphereGeometry( 0.08, 8, 8 );
        const geoArc    = new TorusGeometry( arcRadius, arcThickness, 3, 30, PIH );
        //const geoPlane  = new PlaneGeometry( planeSize, planeSize );
        //const geoPlane  = new CircleGeometry( planeSize, 6 );
        const geoBox    = FloorCube.geo( boxSize, boxLen, boxSize );

        const geoTri = new BufferGeometry();
        geoTri.setAttribute( 'position', new Float32BufferAttribute( [ 0.15,0.15,0,  0.8,0.15,0,  0.15,0.8,0 ], 3 ) );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Translation
        const p     = 0.0;
        const xpBox = newMesh( geoBox, this.axisColors[0], [p,0,0], [0,0,-PIH] );
        const ypBox = newMesh( geoBox, this.axisColors[1], [0,p,0] );
        const zpBox = newMesh( geoBox, this.axisColors[2], [0,0,p], [PIH,0,0] );
        this.add( xpBox, ypBox, zpBox );
        this.axisPLines.push( xpBox, ypBox, zpBox );
        
        const xnBox = newMesh( geoBox, this.axisColors[0], [-p,0,0], [0,0,PIH] );
        const ynBox = newMesh( geoBox, this.axisColors[1], [0,-p,0], [0,0,PI] );
        const znBox = newMesh( geoBox, this.axisColors[2], [0,0,-p], [-PIH,0,0] );
        this.add( xnBox, ynBox, znBox );
        this.axisNLines.push( xnBox, ynBox, znBox );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Rotation
        const r     = 0.2;
        const zArc  = newMesh( geoArc, this.axisColors[2], [r,r,0], [0,0,0] );
        const xArc  = newMesh( geoArc, this.axisColors[0], [0,r,r], [0,-PIH,0] );
        const yArc  = newMesh( geoArc, this.axisColors[1], [r,0,r], [PIH,0,0] );

        this.add( xArc, yArc, zArc );
        this.axisArc.push( xArc, yArc, zArc );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Plane
        // const pp    = planeSize + 0.15;
        // const xPln  = newMesh( geoPlane, this.axisColors[0], [0,pp,pp], [0,PIH,0] );
        // const yPln  = newMesh( geoPlane, this.axisColors[1], [pp,0,pp], [PIH,0,0] );
        // const zPln  = newMesh( geoPlane, this.axisColors[2], [pp,pp,0] );

        const xPln  = newMesh( geoTri, this.axisColors[0], [0,0,0], [0,-PIH,0] );
        const yPln  = newMesh( geoTri, this.axisColors[1], [0,0,0], [PIH,0,0] );
        const zPln  = newMesh( geoTri, this.axisColors[2], [0,0,0], [0,0,0] );
        this.add( xPln, yPln, zPln );
        this.axisPlanes.push( xPln, yPln, zPln );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Scale
        const s     = 1;
        const xpScl = newMesh( geoSphere, this.axisColors[0], [s,0,0] );
        const xnScl = newMesh( geoSphere, this.axisColors[0], [-s,0,0] );
        const ypScl = newMesh( geoSphere, this.axisColors[1], [0,s,0] );
        const ynScl = newMesh( geoSphere, this.axisColors[1], [0,-s,0] );
        const zpScl = newMesh( geoSphere, this.axisColors[2], [0,0,s] );
        const znScl = newMesh( geoSphere, this.axisColors[2], [0,0,-s] );
        const mScl  = newMesh( geoSphere, 0xffff00, null, null, 1 );

        this.add( mScl, xpScl, xnScl, ypScl, ynScl, zpScl, znScl );
        this.axisPoints.push( xpScl, ypScl, zpScl, xnScl, ynScl, znScl, mScl );
    }

    render( state ){
        const mode = state.selectMode;
        const axis = state.selectAxis;
        
        let c;
        this.quaternion.fromArray( state.rotation );
        this.position.fromArray( state.position );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // LINES
        for( let i=0; i < 3; i++ ){
            this.axisNLines[ i ].material.color.setHex( ( mode === 0 && i === axis )? 0xffffff : this.axisColors[i] );
            this.axisPLines[ i ].material.color.setHex( ( mode === 0 && i === axis )? 0xffffff : this.axisColors[i] );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ARCS
        for( let i=0; i < 3; i++ ){
            this.axisArc[ i ].material.color.setHex( ( mode === 1 && i === axis)? 0xffffff : this.axisColors[i] );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // PLANES
        for( let i=0; i < 3; i++ ){
            this.axisPlanes[ i ].material.color.setHex( ( mode === 3 && i === axis)? 0xffffff : this.axisColors[i] );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // POINTS
        for( let i=0; i < 3; i++ ){
            c = ( mode === 2 && i === axis )? 0xffffff : this.axisColors[ i ];
            this.axisPoints[ i ].material.color.setHex( c );
            this.axisPoints[ i+3 ].material.color.setHex( c );
        }

        c = ( mode === 2 && axis === 3 )? 0xffffff : 0xffff00;
        this.axisPoints[ 6 ].material.color.setHex( c );
    }

    /* CAN USE THIS OVERRIDE TO REPLACE UPDATE FUNCTION, IT WILL BE CALLED ON EVERY FRAME*/
    // updateMatrixWorld(){
    //     super.updateMatrixWorld( this );
    //     if( this.onUpdate ) this.onUpdate();
    // }
}