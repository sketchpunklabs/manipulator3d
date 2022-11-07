import * as THREE from 'three';

// Create a cube with its origin at the bottom left back corner
export default class FloorCube{
    static mesh( mat=null, pos=null, scl=null ){
        const bGeo = this.geo();
        const mesh = new THREE.Mesh( bGeo, mat || new THREE.MeshPhongMaterial( { color:0x009999 } ) );
        if( pos )			mesh.position.fromArray( pos );
        if( scl != null )	mesh.scale.set( scl, scl, scl );
    
        return mesh; 
    }

    static geo( width=1, height=1, depth=1 ){
        const geo  = this.get( width, height, depth );
        const bGeo = new THREE.BufferGeometry();
        bGeo.setIndex( new THREE.BufferAttribute( geo.indices, 1 ) );
        bGeo.setAttribute( 'position',  new THREE.BufferAttribute( geo.vertices, 3 ) );
        bGeo.setAttribute( 'normal',    new THREE.BufferAttribute( geo.normals,  3 ) );
        bGeo.setAttribute( 'uv',        new THREE.BufferAttribute( geo.texcoord, 2 ) );
        return bGeo;
    }
    
    static get( width=1, height=1, depth=1 ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const x1 = width  * 0.5, 
              y1 = height, // * 0.5, 
              z1 = depth  * 0.5,
              x0 = -x1, 
              y0 = 0, //-y1,  
              z0 = -z1;

        // Starting bottom left corner, then working counter clockwise to create the front face.
        // Backface is the first face but in reverse (3,2,1,0)
        // keep each quad face built the same way to make index and uv easier to assign
        const vert = [
            x0, y1, z1, 	//0 Front
            x0, y0, z1, 	//1
            x1, y0, z1, 	//2
            x1, y1, z1, 	//3 

            x1, y1, z0, 	//4 Back
            x1, y0, z0, 	//5
            x0, y0, z0, 	//6
            x0, y1, z0, 	//7 

            x1, y1, z1, 	//3 Right
            x1, y0, z1, 	//2 
            x1, y0, z0, 	//5
            x1, y1, z0, 	//4

            x0, y0, z1, 	//1 Bottom
            x0, y0, z0, 	//6
            x1, y0, z0, 	//5
            x1, y0, z1, 	//2

            x0, y1, z0, 	//7 Left
            x0, y0, z0, 	//6
            x0, y0, z1, 	//1
            x0, y1, z1, 	//0

            x0, y1, z0, 	//7 Top
            x0, y1, z1, 	//0
            x1, y1, z1, 	//3
            x1, y1, z0, 	//4
        ];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //Build the index of each quad [0,1,2, 2,3,0]
        let i;
        const idx = [];
        for( i=0; i < vert.length / 3; i+=2) idx.push( i, i+1, ( Math.floor( i / 4 ) * 4 ) + ( ( i + 2 ) % 4 ) );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //Build UV data for each vertex
        const uv = [];
        for( i=0; i < 6; i++) uv.push( 0,0,	 0,1,  1,1,  1,0 );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return { 
            vertices    : new Float32Array( vert ),
            indices     : new Uint16Array( idx ),
            texcoord    : new Float32Array( uv ), 
            normals     : new Float32Array( [ // Left/Right have their xNormal flipped to render correctly in 3JS, Why does normals need to be mirrored on X?
                0, 0, 1,	 0, 0, 1,	 0, 0, 1,	 0, 0, 1,		//Front
                0, 0,-1,	 0, 0,-1,	 0, 0,-1,	 0, 0,-1,		//Back
                1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Left
                0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
                -1, 0, 0,	 -1, 0, 0,	 -1, 0, 0,	 -1, 0, 0,		//Right
                0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
            ] ),
        };
    }
}