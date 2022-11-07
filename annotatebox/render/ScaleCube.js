import * as THREE from 'three';

export default class ScaleCube{
    // #region MAIN
    mesh        = null;
    constructor(){
        const geo  = genGeometry();
        const bGeo = new THREE.BufferGeometry();
        bGeo.setIndex( new THREE.BufferAttribute( geo.indices, 1 ) );
        bGeo.setAttribute( 'position',  new THREE.BufferAttribute( geo.vertices, 4 ) );
        bGeo.setAttribute( 'normal',    new THREE.BufferAttribute( geo.normals,  3 ) );
        bGeo.setAttribute( 'uv',        new THREE.BufferAttribute( geo.texcoord, 2 ) );

        const mat  = customMaterial();
        this.mesh  = new THREE.Mesh( bGeo, mat );
    }
    // #endregion

    // #region METHODS
    // xp, yp, zp, xn, yn, zn
    setAxesLengths( size ){
        const scl = this.mesh.material.uniforms.scale.value;
        scl[ 0 ]  = size[ 0 ];
        scl[ 1 ]  = size[ 1 ];
        scl[ 2 ]  = size[ 2 ];
        scl[ 3 ]  = size[ 3 ];
        scl[ 4 ]  = size[ 4 ];
        scl[ 5 ]  = size[ 5 ];
        return this;
    }

    selectFace( i ){ this.mesh.material.uniforms.selFace.value = i; return this; }
    // #endregion
}

function genGeometry(){
    const x1 =  1, 
          y1 =  1, 
          z1 =  1,
          x0 = -1, 
          y0 = -1,  
          z0 = -1;

    // Starting bottom left corner, then working counter clockwise to create the front face.
    // Backface is the first face but in reverse (3,2,1,0)
    // keep each quad face built the same way to make index and uv easier to assign
    const vert = [
        x0, y1, z1, 2,  //0 Front
        x0, y0, z1, 2,  //1
        x1, y0, z1, 2,  //2
        x1, y1, z1, 2,  //3 

        x1, y1, z0, 5,  //4 Back
        x1, y0, z0, 5,  //5
        x0, y0, z0, 5,  //6
        x0, y1, z0, 5,  //7 

        x1, y1, z1, 0,  //3 Right
        x1, y0, z1, 0,  //2 
        x1, y0, z0, 0,  //5
        x1, y1, z0, 0,  //4

        x0, y0, z1, 4,  //1 Bottom
        x0, y0, z0, 4,  //6
        x1, y0, z0, 4,  //5
        x1, y0, z1, 4,  //2

        x0, y1, z0, 3,  //7 Left
        x0, y0, z0, 3,  //6
        x0, y0, z1, 3,  //1
        x0, y1, z1, 3,  //0

        x0, y1, z0, 1,  //7 Top
        x0, y1, z1, 1,  //0
        x1, y1, z1, 1,  //3
        x1, y1, z0, 1,  //4
    ];

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Build the index of each quad [0,1,2, 2,3,0]
    let i;
    const idx = [];
    for( i=0; i < vert.length / 3; i+=2) idx.push( i, i+1, ( Math.floor( i / 4 ) * 4 ) + ( ( i + 2 ) % 4 ) );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Build UV data for each vertex
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

function customMaterial(){
    const mat = new THREE.RawShaderMaterial({
        depthTest       : true,
        transparent 	: true, 
        side            : THREE.DoubleSide,
        // lights       : true,

        uniforms        : {
            alpha       : { type :'float', value:0.7, },
            scale       : { type :'float', value:[1,1,1,1,1,1] },
            borderWidth : { type :'float', value:0.02, },
            borderColor : { type :'vec3',  value:new THREE.Color( 0xb0b0b0 ) },
            selColor    : { type :'vec3',  value:new THREE.Color( 0xffff00 ) },

            selFace     : { type :'int', value:-1, },

            color       : { type :'vec3', value:new THREE.Color( 0xa0a0a0 ) },
            color_x     : { type :'vec3', value:new THREE.Color( "#878FA3" ) }, // Each axis gets a Grayscaled Value, used as strength of baseColor
            color_y     : { type :'vec3', value:new THREE.Color( "#ffffff" ) }, // these don't really need to be modified unless looking to change 
            color_z     : { type :'vec3', value:new THREE.Color( "#CED4E0" ) }, // the overall strength of each axis
        },

        extensions      : { 
            derivatives : true
        },

        vertexShader    : `#version 300 es
        in	vec4    position;
        in  vec3    normal;
        in	vec2    uv;
        
        uniform mediump float[6] scale;
        uniform     int      selFace;
        uniform     vec3     color;
        uniform     vec3     selColor;

        uniform     mat4     modelMatrix;
        uniform     mat4     viewMatrix;
        uniform     mat4     projectionMatrix;

        out vec3    fragSPos;
        out vec3    fragWPos;  // World Space Position
        out vec3    fragNorm;
        out vec3    fragLNorm;
        out vec2    fragUV;
        out vec3    fragColor;
        
        void main(){
            int  faceIdx = int( position.w );
            fragColor = (faceIdx != selFace)? color : selColor;

            vec3 pos = position.xyz;
            pos.x *= ( pos.x > 0.0 )? scale[ 0 ] : scale[ 3 ];
            pos.y *= ( pos.y > 0.0 )? scale[ 1 ] : scale[ 4 ];
            pos.z *= ( pos.z > 0.0 )? scale[ 2 ] : scale[ 5 ];

            vec4 wPos   = modelMatrix * vec4( pos, 1.0 );  // World Space
            vec4 vPos   = viewMatrix * wPos;               // View Space
            
            fragSPos    = pos;
            fragUV      = uv;
            fragWPos    = wPos.xyz;
            fragNorm    = ( modelMatrix * vec4( normal, 0.0 ) ).xyz;
            fragLNorm   = normal;
            
            gl_Position = projectionMatrix * vPos;
        }`,

        fragmentShader  : `#version 300 es
        precision mediump float;
        
        uniform float[6] scale;
        uniform float alpha;
        //uniform vec3 color;
        uniform vec3 color_x;
        uniform vec3 color_y;
        uniform vec3 color_z;
        uniform float borderWidth;
        uniform vec3 borderColor;

        in  vec3    fragColor;
        in  vec3    fragSPos;
        in  vec3    fragWPos;
        in  vec3    fragNorm;
        in  vec3    fragLNorm;
        in  vec2    fragUV;
        out vec4    outColor;

        // #####################################################################
        void main(){
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            vec3 norm = normalize( fragNorm ); // Normals From Mesh

            // Treating normal as Light Strength, it curves the progression from dark to light
            // if left as is, it gives the tint lighting much more strength and also linear progression
            norm = norm * norm; 
    
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // From what I understand of how this works is by applying a Lighting Color for Each axis direction.
            // Then using the normal direction to blend each axis color together. From kenny's image example, he
            // setup the brightest color to come from Y, Second from Z then the darkest color at X.
            vec3 out_color;
            out_color = mix( fragColor, fragColor * color_x, norm.x );
            out_color = mix( out_color, fragColor * color_y, norm.y );
            out_color = mix( out_color, fragColor * color_z, norm.z );

            //outColor = vec4( out_color, alpha );

            // Darken Negative
            float aMin = abs( min( fragLNorm.x, min( fragLNorm.y, fragLNorm.z ) ) );
            out_color  = out_color - aMin * 0.3 * out_color ;

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // Create Borders
            // Invert AA Normal : [0,1,0] > [1,0,1]
            // if norm.z > 0 then xy
            // if norm.y > 0 then xz
            // if norm.x > 0 then yz
            vec3 negate = abs( fragLNorm - 1.0 );

            // Scaled Length of each of the 6 directions
            vec3 scl = fragSPos;
            scl.x    = ( fragSPos.x > 0.0 )? scale[ 0 ] : scale[ 3 ];
            scl.y    = ( fragSPos.y > 0.0 )? scale[ 1 ] : scale[ 4 ];
            scl.z    = ( fragSPos.z > 0.0 )? scale[ 2 ] : scale[ 5 ];
            scl     -= borderWidth; // Subtract width to simplify smoothstep
            
            vec3 absPos = abs( fragSPos );  // Absolute Scaled Position
            vec3 px     = fwidth( absPos );
            float mask  = 1.0;
            mask = min( mask, smoothstep( scl.x * negate.x, scl.x-px.x, absPos.x ) );
            mask = min( mask, smoothstep( scl.y * negate.y, scl.y-px.y, absPos.y ) );
            mask = min( mask, smoothstep( scl.z * negate.z, scl.z-px.z, absPos.z ) );
            mask = 1.0 - mask;

            outColor.rgb = mix( out_color, borderColor, mask );
            outColor.a   = mix( alpha, 1.0, mask );
        }`
    });

    return mat;
}