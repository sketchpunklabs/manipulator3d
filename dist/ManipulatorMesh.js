
import * as THREE from 'three';
import { ManipulatorMode } from './ManipulatorData.js';

export class ManipulatorMesh extends THREE.Group{
    // #region MAIN
    axisColors    = [ 0x81D773, 0x6DA9EA, 0xF7716A ];
    axisLines     = [];
    axisArcs      = [];
    axisBoxes     = [];
    axisTris      = [];

    grpCtrl       = new THREE.Group();
    meshTracePnt  = null;
    meshTraceLine = null;

    colSelect     = 0xffffff;
    colOrigin     = 0xffff00;

    constructor( data ){
        super();
        const PIH           = Math.PI * 0.5;
        const lineRadius    = 0.03;
        const arcRadius     = data.arcRadius;
        const arcThickness  = 0.03
        const sclDistance   = data.sclPointLen;

        this.visible = false;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // MATERIALS
		const matBasic = new THREE.MeshBasicMaterial( {
			depthTest: false,
			depthWrite: false,
			fog: false,
			toneMapped: false,
			transparent: true,
            side: THREE.DoubleSide,
            opacity: 1.0,
            color: 0xffffff,
		} );

		const matLine = new THREE.LineBasicMaterial( {
			depthTest: false,
			depthWrite: false,
			fog: false,
			toneMapped: false,
			transparent: true,
            color: 0x909090,
		} );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // GEOMETRY
		const geoTrace = new THREE.BufferGeometry();
		geoTrace.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0,	0, 100, 0 ], 3 ) );

        const geoTri = new THREE.BufferGeometry();
		geoTri.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0,0,0,	data.midPointLen,0,0, 0,data.midPointLen,0 ], 3 ) );

        const geoSphere   = new THREE.SphereGeometry( 0.1, 8, 8 );
        const geoArc      = new THREE.TorusGeometry( arcRadius, arcThickness, 3, 10, PIH );
		const geoAxisLine = new THREE.CylinderGeometry( lineRadius, lineRadius, data.axisLen, 3 );
		geoAxisLine.translate( 0, data.axisLen * 0.5, 0 );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // AXIS LINES
        const yAxisLine = new THREE.Mesh( geoAxisLine, matBasic.clone() );
        this.grpCtrl.add( yAxisLine );

        const zAxisLine = new THREE.Mesh( geoAxisLine, matBasic.clone() );
        zAxisLine.rotation.x = PIH;
        this.grpCtrl.add( zAxisLine );

        const xAxisLine = new THREE.Mesh( geoAxisLine, matBasic.clone() );
        xAxisLine.rotation.z = -PIH;
        this.grpCtrl.add( xAxisLine );

        this.axisLines.push( xAxisLine, yAxisLine, zAxisLine );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // AXIS LINES
        const zAxisArc = new THREE.Mesh( geoArc, matBasic.clone() );
        this.grpCtrl.add( zAxisArc );

        const xAxisArc = new THREE.Mesh( geoArc, matBasic.clone() );
        xAxisArc.rotation.y = -PIH;
        this.grpCtrl.add( xAxisArc );

        const yAxisArc = new THREE.Mesh( geoArc, matBasic.clone() );
        yAxisArc.rotation.x = PIH;
        this.grpCtrl.add( yAxisArc );

        this.axisArcs.push( xAxisArc, yAxisArc, zAxisArc );
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // SCALE SELECTORS
        const zAxisBox = new THREE.Mesh( geoSphere, matBasic.clone() );
        zAxisBox.position.z = sclDistance;
        this.grpCtrl.add( zAxisBox );

        const xAxisBox = new THREE.Mesh( geoSphere, matBasic.clone() );
        xAxisBox.position.x = sclDistance;
        this.grpCtrl.add( xAxisBox );

        const yAxisBox = new THREE.Mesh( geoSphere, matBasic.clone() );
        yAxisBox.position.y = sclDistance;
        this.grpCtrl.add( yAxisBox );

        this.axisBoxes.push( xAxisBox, yAxisBox, zAxisBox );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // PLANE SELECTORS
        const zAxisTri = new THREE.Mesh( geoTri, matBasic.clone() );
        this.grpCtrl.add( zAxisTri );

        const yAxisTri = new THREE.Mesh( geoTri, matBasic.clone() );
        yAxisTri.rotation.x = PIH;
        this.grpCtrl.add( yAxisTri );

        const xAxisTri = new THREE.Mesh( geoTri, matBasic.clone() );
        xAxisTri.rotation.y = -PIH;
        this.grpCtrl.add( xAxisTri );
        
        this.axisTris.push( xAxisTri, yAxisTri, zAxisTri );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        this.meshTraceLine = new THREE.Line( geoTrace, matLine );
        this.meshTraceLine.visible = false;
        this.add( this.meshTraceLine );

        this.meshTracePnt = new THREE.Mesh( geoSphere, matBasic.clone() );
        this.meshTracePnt.visible = false;
        this.add( this.meshTracePnt );

        this.origin = new THREE.Mesh( geoSphere, matBasic.clone() );
        this.grpCtrl.add( this.origin );
        this.add( this.grpCtrl );
    }

    // #endregion

    showGizmo(){ this.grpCtrl.visible = true; }
    hideGizmo(){ this.grpCtrl.visible = false; }

    update( data ){
        if( !data.hasUpdated && !data.hasHit ) return;

        this.grpCtrl.scale.fromArray( data.scale );
        this.grpCtrl.position.fromArray( data.position );

        if( data.activeAxis === -2 && data.activeMode === ManipulatorMode.Scale ){
            this.origin.material.color.setHex( this.colSelect );
        }else{
            this.origin.material.color.setHex( this.colOrigin );
        }

        for( let i=0; i < 3; i++ ){
            this.axisLines[ i ].material.color.setHex( this.axisColors[ i ] );
            this.axisArcs[ i ].material.color.setHex( this.axisColors[ i ] );
            this.axisBoxes[ i ].material.color.setHex( this.axisColors[ i ] );
            this.axisTris[ i ].material.color.setHex( this.axisColors[ i ] );

            if( i === data.activeAxis ){
                switch( data.activeMode ){
                    case ManipulatorMode.Translate: this.axisLines[ i ].material.color.setHex( this.colSelect ); break;
                    case ManipulatorMode.Rotate:    this.axisArcs[ i ].material.color.setHex( this.colSelect ); break;
                    case ManipulatorMode.Scale:     this.axisBoxes[ i ].material.color.setHex( this.colSelect ); break;
                }
            }

            if( i === data.activePlane ){
                this.axisTris[ i ].material.color.setHex( 0xffffff );
            }
        }


        if( data.traceLine.isActive ){
            const sclPnt = Math.abs( data.scale[2] );
            this.meshTracePnt.visible = true;
            this.meshTracePnt.scale.set( sclPnt, sclPnt, sclPnt );
            this.meshTracePnt.position.fromArray( data.traceLine.origin );

            this.meshTraceLine.visible = true;
            this.meshTraceLine.geometry.attributes.position.needsUpdate = true;

            const pntArray = this.meshTraceLine.geometry.attributes.position.array;
            pntArray[ 0 ] = data.traceLine.a[ 0 ];
            pntArray[ 1 ] = data.traceLine.a[ 1 ];
            pntArray[ 2 ] = data.traceLine.a[ 2 ];
            pntArray[ 3 ] = data.traceLine.b[ 0 ];
            pntArray[ 4 ] = data.traceLine.b[ 1 ];
            pntArray[ 5 ] = data.traceLine.b[ 2 ];
        }else{
            this.meshTraceLine.visible = false;
            this.meshTracePnt.visible = false;
        }
    }
}