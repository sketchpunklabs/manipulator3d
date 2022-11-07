// #region VEC3
export function vec3_copy( out, a ){
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}

export function vec3_add( out, a, b ){
    out[ 0 ] = a[ 0 ] + b[ 0 ];
    out[ 1 ] = a[ 1 ] + b[ 1 ];
    out[ 2 ] = a[ 2 ] + b[ 2 ];
    return out;
}

export function vec3_add_batch( out, ...ary ){
    out[ 0 ] = ary[ 0 ][ 0 ];
    out[ 1 ] = ary[ 0 ][ 1 ];
    out[ 2 ] = ary[ 0 ][ 2 ];

    for( let i=1; i < ary.length; i++ ){
        out[ 0 ] += ary[ i ][ 0 ];
        out[ 1 ] += ary[ i ][ 1 ];
        out[ 2 ] += ary[ i ][ 2 ];
    }

    return out;
}

export function vec3_sub( out, a, b ){
    out[ 0 ] = a[ 0 ] - b[ 0 ];
    out[ 1 ] = a[ 1 ] - b[ 1 ];
    out[ 2 ] = a[ 2 ] - b[ 2 ];
    return out;
}

export function vec3_cross( out, a, b ){
    const ax = a[0], ay = a[1], az = a[2],
          bx = b[0], by = b[1], bz = b[2];

    out[ 0 ] = ay * bz - az * by;
    out[ 1 ] = az * bx - ax * bz;
    out[ 2 ] = ax * by - ay * bx;
    return out;
}

export function vec3_dot( a, b ){ return a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ]; }    

export function vec3_scaleAndAdd( out, add, v, s ){
    out[ 0 ] = v[ 0 ] * s + add[ 0 ];
    out[ 1 ] = v[ 1 ] * s + add[ 1 ];
    out[ 2 ] = v[ 2 ] * s + add[ 2 ];
    return out;
}

export function vec3_scale( out, a, s ){
    out[ 0 ] = a[ 0 ] * s;
    out[ 1 ] = a[ 1 ] * s;
    out[ 2 ] = a[ 2 ] * s;
    return out;
}

export function vec3_inv_scale( out, a, s ){
    out[ 0 ] = a[ 0 ] / s;
    out[ 1 ] = a[ 1 ] / s;
    out[ 2 ] = a[ 2 ] / s;
    return out;
}

export function vec3_norm( out, a){
    let mag = Math.sqrt( a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]**2 );
    if( mag != 0 ){
        mag      = 1 / mag;
        out[ 0 ] = a[ 0 ] * mag;
        out[ 1 ] = a[ 1 ] * mag;
        out[ 2 ] = a[ 2 ] * mag;
    }
    return out;
}

export function vec3_negate( out, a){
    out[ 0 ] = -a[ 0 ];
    out[ 1 ] = -a[ 1 ];
    out[ 2 ] = -a[ 2 ];
    return out;
}

export function vec3_transformQuat( out, v, q ){
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3],
            vx = v[0], vy = v[1], vz = v[2],
            x1 = qy * vz - qz * vy,
            y1 = qz * vx - qx * vz,
            z1 = qx * vy - qy * vx,
            x2 = qw * x1 + qy * z1 - qz * y1,
            y2 = qw * y1 + qz * x1 - qx * z1,
            z2 = qw * z1 + qx * y1 - qy * x1;
    out[ 0 ] = vx + 2 * x2;
    out[ 1 ] = vy + 2 * y2;
    out[ 2 ] = vz + 2 * z2;
    return out;
}

export function vec3_transformMat4(out, a, m) {
    let x = a[0], y = a[1], z = a[2];
    let w = ( m[3] * x + m[7] * y + m[11] * z + m[15] ) || 1.0;
    out[0] = ( m[0] * x + m[4] * y + m[8]  * z + m[12] ) / w;
    out[1] = ( m[1] * x + m[5] * y + m[9]  * z + m[13] ) / w;
    out[2] = ( m[2] * x + m[6] * y + m[10] * z + m[14] ) / w;
    return out;
  }

export function vec3_sqrLen( a, b ){ 
    if( b === undefined ) return  a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]** 2;
    return (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 + (a[ 2 ]-b[ 2 ]) ** 2;
}

export function vec3_len( a, b ){ 
    if( b === undefined ) return Math.sqrt( a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]** 2 );
    return Math.sqrt( (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 + (a[ 2 ]-b[ 2 ]) ** 2 );
}

export function vec3_mul( out, a, b ){ 
    out[ 0 ] = a[ 0 ] * b[ 0 ];
    out[ 1 ] = a[ 1 ] * b[ 1 ];
    out[ 2 ] = a[ 2 ] * b[ 2 ];
    return out;
}

export function vec3_lerp( out, a, b, t ) {
    const ti = 1 - t; // Linear Interpolation : (1 - t) * v0 + t * v1;
    out[ 0 ] = a[ 0 ] * ti + b[ 0 ] * t;
    out[ 1 ] = a[ 1 ] * ti + b[ 1 ] * t;
    out[ 2 ] = a[ 2 ] * ti + b[ 2 ] * t;
    return out;
}


export function vec3_angle( a, b ){
    const ax     = a[0];
    const ay     = a[1];
    const az     = a[2];
    const bx     = b[0];
    const by     = b[1];
    const bz     = b[2];
    const mag1   = Math.sqrt( ax * ax + ay * ay + az * az );
    const mag2   = Math.sqrt( bx * bx + by * by + bz * bz );
    const mag    = mag1 * mag2;
    const cosine = mag && vec3_dot( a, b ) / mag;
    return Math.acos( Math.min( Math.max( cosine, -1 ), 1 ) );
  }

// #endregion

// #region QUAT
export function quat_copy( out, a ) {
    out[ 0 ] = a[ 0 ]; 
    out[ 1 ] = a[ 1 ]; 
    out[ 2 ] = a[ 2 ];
    out[ 3 ] = a[ 3 ]; 
    return out;
}

export function quat_mul( out, a, b ) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3],
          bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
    out[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
    out[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
    out[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
}

export function quat_normalize( out, q ){
    let len =  q[0]**2 + q[1]**2 + q[2]**2 + q[3]**2;
    if( len > 0 ){
        len = 1 / Math.sqrt( len );
        out[ 0 ] = q[ 0 ] * len;
        out[ 1 ] = q[ 1 ] * len;
        out[ 2 ] = q[ 2 ] * len;
        out[ 3 ] = q[ 3 ] * len;
    }
    return out;
}

export function quat_setAxisAngle( out, axis, rad ){
    const half = rad * .5,
            s    = Math.sin( half );
    out[ 0 ] = s * axis[ 0 ];
    out[ 1 ] = s * axis[ 1 ];
    out[ 2 ] = s * axis[ 2 ];
    out[ 3 ] = Math.cos( half );
    return out;
}

export function quat_sqrLen( a, b ){ 
    if( b === undefined ) return  a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]** 2 + a[ 3 ]** 2;
    return (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 + (a[ 2 ]-b[ 2 ]) ** 2 + (a[ 3 ]-b[ 3 ]) ** 2;
}


export function quat_rotateTo( out, a, b ){
    // Using unit vectors, Shortest rotation from Direction A to Direction B
    // http://glmatrix.net/docs/quat.js.html#line548
    // http://physicsforgames.blogspot.com/2010/03/Quat-tricks.html

    const dot = vec3_dot( a, b );

    if( dot < -0.999999 ){ // 180 opposites
      const tmp = vec3_cross( [0,0,0], [1,0,0], a );
      if( vec3_len( tmp ) < 0.000001 ) vec3_cross( tmp, [0,1,0], a );
      quat_setAxisAngle( out, vec3.quat_normalize( tmp, tmp ), Math.PI );

    }else if( dot > 0.999999 ){ // Same Direction
        out[ 0 ] = 0;
        out[ 1 ] = 0;
        out[ 2 ] = 0;
        out[ 3 ] = 1;
    }else{
        const v = vec3_cross( [0,0,0], a, b );
        out[ 0 ] = v[ 0 ];
        out[ 1 ] = v[ 1 ];
        out[ 2 ] = v[ 2 ];
        out[ 3 ] = 1 + dot;
        quat_normalize( out, out );
    }

    return out;
}
// #endregion

// #region MAT4

export function mat4_invert(out, a) {
    let a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3];
    let a10 = a[4],  a11 = a[5],  a12 = a[6],  a13 = a[7];
    let a20 = a[8],  a21 = a[9],  a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) return null;
    det = 1.0 / det;

    out[0]  = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1]  = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2]  = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3]  = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4]  = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5]  = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6]  = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7]  = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8]  = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9]  = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
}

export function mat4_mul( out, a, b ){
    let a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3];
    let a10 = a[4],  a11 = a[5],  a12 = a[6],  a13 = a[7];
    let a20 = a[8],  a21 = a[9],  a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  
    // Cache only the current line of the second matrix
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8]  = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9]  = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}
// #endregion

// #region VEC4
export function vec4_transformMat4( out, a, m ){
    let x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
}
// #endregion