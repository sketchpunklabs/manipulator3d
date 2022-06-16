
import { 
    Group, Line, Mesh, DoubleSide,
    MeshBasicMaterial, LineBasicMaterial, 
    BufferGeometry, Float32BufferAttribute,
    SphereGeometry, TorusGeometry, CylinderGeometry, 
}                          from 'three';
import { ManipulatorMode } from './ManipulatorData.js';

export class ManipulatorMesh extends Group{
    // #region MAIN
    axisColors    = [ 0x81D773, 0x6DA9EA, 0xF7716A ];
    axisLines     = [];
    axisArcs      = [];
    axisPoints    = [];
    axisTris      = [];

    grpCtrl       = new Group();
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
		const matBasic = new MeshBasicMaterial( {
			depthTest: false,
			depthWrite: false,
			fog: false,
			toneMapped: false,
			transparent: true,
            side: DoubleSide,
            opacity: 1.0,
            color: 0xffffff,
		} );

		const matLine = new LineBasicMaterial( {
			depthTest: false,
			depthWrite: false,
			fog: false,
			toneMapped: false,
			transparent: true,
            color: 0x909090,
		} );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // GEOMETRY
		const geoTrace = new BufferGeometry();
		geoTrace.setAttribute( 'position', new Float32BufferAttribute( [ 0, 0, 0,	0, 100, 0 ], 3 ) );

        const geoTri = new BufferGeometry();
		geoTri.setAttribute( 'position', new Float32BufferAttribute( [ 0,0,0,	data.midPointLen,0,0, 0,data.midPointLen,0 ], 3 ) );

        const geoSphere   = new SphereGeometry( 0.1, 8, 8 );
        const geoArc      = new TorusGeometry( arcRadius, arcThickness, 3, 10, PIH );
		const geoAxisLine = new CylinderGeometry( lineRadius, lineRadius, data.axisLen, 3 );
		geoAxisLine.translate( 0, data.axisLen * 0.5, 0 );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // AXIS LINES
        const yAxisLine = new Mesh( geoAxisLine, matBasic.clone() );
        this.grpCtrl.add( yAxisLine );

        const zAxisLine = new Mesh( geoAxisLine, matBasic.clone() );
        zAxisLine.rotation.x = PIH;
        this.grpCtrl.add( zAxisLine );

        const xAxisLine = new Mesh( geoAxisLine, matBasic.clone() );
        xAxisLine.rotation.z = -PIH;
        this.grpCtrl.add( xAxisLine );

        this.axisLines.push( xAxisLine, yAxisLine, zAxisLine );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // AXIS LINES
        const zAxisArc = new Mesh( geoArc, matBasic.clone() );
        this.grpCtrl.add( zAxisArc );

        const xAxisArc = new Mesh( geoArc, matBasic.clone() );
        xAxisArc.rotation.y = -PIH;
        this.grpCtrl.add( xAxisArc );

        const yAxisArc = new Mesh( geoArc, matBasic.clone() );
        yAxisArc.rotation.x = PIH;
        this.grpCtrl.add( yAxisArc );

        this.axisArcs.push( xAxisArc, yAxisArc, zAxisArc );
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // SCALE SELECTORS
        const zAxisPnt = new Mesh( geoSphere, matBasic.clone() );
        zAxisPnt.position.z = sclDistance;
        this.grpCtrl.add( zAxisPnt );

        const xAxisPnt = new Mesh( geoSphere, matBasic.clone() );
        xAxisPnt.position.x = sclDistance;
        this.grpCtrl.add( xAxisPnt );

        const yAxisPnt = new Mesh( geoSphere, matBasic.clone() );
        yAxisPnt.position.y = sclDistance;
        this.grpCtrl.add( yAxisPnt );

        this.axisPoints.push( xAxisPnt, yAxisPnt, zAxisPnt );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // PLANE SELECTORS
        const zAxisTri = new Mesh( geoTri, matBasic.clone() );
        this.grpCtrl.add( zAxisTri );

        const yAxisTri = new Mesh( geoTri, matBasic.clone() );
        yAxisTri.rotation.x = PIH;
        this.grpCtrl.add( yAxisTri );

        const xAxisTri = new Mesh( geoTri, matBasic.clone() );
        xAxisTri.rotation.y = -PIH;
        this.grpCtrl.add( xAxisTri );
        
        this.axisTris.push( xAxisTri, yAxisTri, zAxisTri );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        this.meshTraceLine = new Line( geoTrace, matLine );
        this.meshTraceLine.visible = false;
        this.add( this.meshTraceLine );

        this.meshTracePnt = new Mesh( geoSphere, matBasic.clone() );
        this.meshTracePnt.visible = false;
        this.add( this.meshTracePnt );

        this.origin = new Mesh( geoSphere, matBasic.clone() );
        this.grpCtrl.add( this.origin );
        this.add( this.grpCtrl );
    }

    // #endregion

    showGizmo(){ this.grpCtrl.visible = true; }
    hideGizmo(){ this.grpCtrl.visible = false; }

    // Update the visible state of the gizmo parts
    updateLook( data ){
        let itm;
        for( itm of this.axisArcs )   itm.visible = data.useRotate;
        
        this.origin.visible = data.useScale;
        for( itm of this.axisPoints ) itm.visible = data.useScale;

        for( itm of this.axisTris )   itm.visible = data.useTranslate;
    }

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
            this.axisPoints[ i ].material.color.setHex( this.axisColors[ i ] );
            this.axisTris[ i ].material.color.setHex( this.axisColors[ i ] );

            if( i === data.activeAxis ){
                switch( data.activeMode ){
                    case ManipulatorMode.Translate: this.axisLines[ i ].material.color.setHex( this.colSelect ); break;
                    case ManipulatorMode.Rotate:    this.axisArcs[ i ].material.color.setHex( this.colSelect ); break;
                    case ManipulatorMode.Scale:     this.axisPoints[ i ].material.color.setHex( this.colSelect ); break;
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