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