import { Group }        from 'three';
import DynLineMesh      from './_lib/DynLineMesh.js';
import ShapePointsMesh  from './_lib/ShapePointsMesh.js';

export default class ManipulatorDebugger extends Group{
    meshAxis    = new DynLineMesh();
    meshPoints  = new ShapePointsMesh();

    constructor(){
        super();
        this.add( this.meshAxis );
        this.add( this.meshPoints );
    }

    update( data, forceUpdate=false ){
        if( !data.hasUpdated && !data.hasHit && !forceUpdate ) return;

        const a         = [0,0,0];
        const b         = [0,0,0];
        const pntSize   = 6;
        const pntShape  = 2;
        this.meshAxis.reset();
        this.meshPoints.reset();

        // Axes Lines
        this.meshAxis.add( data.position, data.axes[0].endPos, 0xffff00 );
        this.meshAxis.add( data.position, data.axes[1].endPos, 0x00ffff );
        this.meshAxis.add( data.position, data.axes[2].endPos, 0x00ff00 );

        // Mind Point lines ( Planes )
        this.meshAxis.add( data.axes[0].midPos, data.axes[1].midPos, 0xffff00, 0x00ffff );
        this.meshAxis.add( data.axes[1].midPos, data.axes[2].midPos, 0x00ffff, 0x00ff00 );
        this.meshAxis.add( data.axes[2].midPos, data.axes[0].midPos, 0x00ff00, 0xffff00 );

        // Draw End Points
        this.meshPoints.add( data.axes[0].endPos, 0xffff00, pntSize * Math.abs( data.scale[0] ), pntShape );
        this.meshPoints.add( data.axes[1].endPos, 0x00ffff, pntSize * Math.abs( data.scale[1] ), pntShape );
        this.meshPoints.add( data.axes[2].endPos, 0x00ff00, pntSize * Math.abs( data.scale[2] ), pntShape );

        // Draw Mid Points
        this.meshPoints.add( data.axes[0].midPos, 0xffff00, 3 * Math.abs( data.scale[0] ), 1 );
        this.meshPoints.add( data.axes[1].midPos, 0x00ffff, 3 * Math.abs( data.scale[1] ), 1 );
        this.meshPoints.add( data.axes[2].midPos, 0x00ff00, 3 * Math.abs( data.scale[2] ), 1 );

        // Draw Scl Points
        this.meshPoints.add( data.axes[0].sclPos, 0xffff00, 5 * Math.abs( data.scale[0] ), 0 );
        this.meshPoints.add( data.axes[1].sclPos, 0x00ffff, 5 * Math.abs( data.scale[1] ), 0 );
        this.meshPoints.add( data.axes[2].sclPos, 0x00ff00, 5 * Math.abs( data.scale[2] ), 0 );

        // Draw axes guides
        // let ax;
        // for( let i=0; i < 3; i++ ){
        //     ax = data.axes[ i ];
        //     if( ax.isActive ){
        //         this.meshAxis.add( ax.tracePoints.a, ax.tracePoints.b, 0x909090 );
        //     }
        // }

        // TraceLine
        if( data.traceLine.isActive ){
            this.meshAxis.add( data.traceLine.a, data.traceLine.b, 0x909090 );
            //this.meshPoints.add( data.hitPos, 0xffffff, 5 * Math.abs( data.scale[2] ), 7 );
            this.meshPoints.add( data.traceLine.origin, 0xffffff, 5 * Math.abs( data.scale[2] ), 7 );
            //console.log( 'x', data.traceLine.hit );
            this.meshPoints.add( data.traceLine.hitPos, 0xffffff, 5 * Math.abs( data.scale[2] ), 1 );
            ///Debug.pnt.add( data.traceLine.hit, 0xffffff, 10 );
        }

        // Draw Rotation Arcs
        const xSign = Math.sign( data.scale[0] );
        const ySign = Math.sign( data.scale[1] );
        const zSign = Math.sign( data.scale[2] );
        
        this.meshAxis.arc( data.position, data.axes[0].dir, data.axes[2].dir, data.scale[0] * data.arcRadius, 6, Math.PI*0.5*xSign*zSign, 0, 0x00ffff );
        this.meshAxis.arc( data.position, data.axes[1].dir, data.axes[2].dir, data.scale[1] * data.arcRadius, 6, Math.PI*0.5*zSign*ySign, 0, 0xffff00 );
        this.meshAxis.arc( data.position, data.axes[1].dir, data.axes[0].dir, data.scale[1] * data.arcRadius, 6, Math.PI*0.5*xSign*ySign, 0, 0x00ff00 );

    }
}
