// https://gabormakesgames.com/blog_transforms_transforms.html
// https://gabormakesgames.com/blog_transforms_transform_world.html

export default class transform{
    // #region MAIN
    static new(){ return { pos:[0,0,0], rot:[0,0,0,1], scl:[1,1,1] }; }

    static clone( t ){ return { pos:t.pos.slice(), rot:t.rot.slice(), scl:t.scl.slice() }; }

    static reset( t ){
        t.pos[0] = 0; t.pos[1] = 0; t.pos[2] = 0;
        t.scl[0] = 1; t.scl[1] = 1; t.scl[2] = 1;
        t.rot[0] = 0; t.rot[1] = 0; t.rot[2] = 0; t.rot[3] = 1;
    }

    static copy( t, out ){
        out.pos[ 0 ] = t.pos[ 0 ];
        out.pos[ 1 ] = t.pos[ 1 ];
        out.pos[ 2 ] = t.pos[ 2 ];

        out.scl[ 0 ] = t.scl[ 0 ];
        out.scl[ 1 ] = t.scl[ 1 ];
        out.scl[ 2 ] = t.scl[ 2 ];

        out.rot[ 0 ] = t.rot[ 0 ];
        out.rot[ 1 ] = t.rot[ 1 ];
        out.rot[ 2 ] = t.rot[ 2 ];
        out.rot[ 3 ] = t.rot[ 3 ];
        
        return out;
    }
    // #endregion

    // #region OPS

    // fromInvert( t: Transform ) : this{
    //     // Invert Rotation
    //     this.rot.fromInvert( t.rot );

    //     // Invert Scale
    //     this.scl.fromInvert( t.scl );

    //     // Invert Position : rotInv * ( invScl * -Pos )
    //     this.pos
    //         .fromNegate( t.pos )
    //         .mul( this.scl )
    //         .transformQuat( this.rot );

    //     return this;
    // }

    // Transform LocalInverse(Transform t) {
    //     Quaternion invRotation = Inverse(t.rotation);
     
    //     Vector3 invScale = Vector3(0, 0, 0);
    //     if (t.scale.x != 0) { // Do epsilon comparison here
    //         invScale.x = 1.0 / t.scale.x
    //     }
    //     if (t.scale.y != 0) { // Do epsilon comparison here
    //         invScale.y = 1.0 / t.scale.y
    //     }
    //     if (t.scale.z != 0) { // Do epsilon comparison here
    //         invScale.z = 1.0 / t.scale.z
    //     }
     
    //     Vector3 invTranslation = invRotation * (invScale * (-1 * t.translation));
     
    //     Transform result;
    //     result.position = invTranslation;
    //     result.rotation = invRotation;
    //     result.scale = invScale;
     
    //     return result;
    // }


    /*
    Matrix ToMatrix(Transform transform) {
    // First, extract the rotation basis of the transform
    Vector x = Vector(1, 0, 0) * transform.rotation; // Vec3 * Quat (right vector)
    Vector y = Vector(0, 1, 0) * transform.rotation; // Vec3 * Quat (up vector)
    Vector z = Vector(0, 0, 1) * transform.rotation; // Vec3 * Quat (forward vector)
    
    // Next, scale the basis vectors
    x = x * transform.scale.x; // Vector * float
    y = y * transform.scale.y; // Vector * float
    z = z * transform.scale.z; // Vector * float
 
    // Extract the position of the transform
    Vector t = transform.position;
 
    // Create matrix
    return Matrix(
        x.x, x.y, x.z, 0, // X basis (& Scale)
        y.x, y.y, y.z, 0, // Y basis (& scale)
        z.x, z.y, z.z, 0, // Z basis (& scale)
        t.x, t.y, t.z, 1  // Position
    );
}
    */

    // fromMul( tp: Transform, tc: Transform ) : this{
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // POSITION - parent.position + ( parent.rotation * ( parent.scale * child.position ) )
    //     const v = new Vec3().fromMul( tp.scl, tc.pos ).transformQuat( tp.rot ); // parent.scale * child.position;
    //     this.pos.fromAdd( tp.pos, v );

    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // SCALE - parent.scale * child.scale
    //     this.scl.fromMul( tp.scl, tc.scl );

    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // ROTATION - parent.rotation * child.rotation
    //     this.rot.fromMul( tp.rot, tc.rot );

    //     return this;
    // }

    // mul( cr: TVec4 | Transform, cp ?: TVec3, cs ?: TVec3 ) : this{
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // If just passing in Tranform Object
    //     if( cr instanceof Transform ){
    //         cp = cr.pos;
    //         cs = cr.scl;
    //         cr = cr.rot;
    //     }

    //     if( cr && cp ){
    //         //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //         // POSITION - parent.position + ( parent.rotation * ( parent.scale * child.position ) )
    //         this.pos.add( new Vec3().fromMul( this.scl, cp ).transformQuat( this.rot ) );

    //         //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //         // SCALE - parent.scale * child.scale
    //         if( cs ) this.scl.mul( cs );

    //         //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //         // ROTATION - parent.rotation * child.rotation
    //         this.rot.mul( cr );
    //     }

    //     return this;
    // }

    // addPos( cp: TVec3, ignoreScl=false ) : this{
    //     //POSITION - parent.position + ( parent.rotation * ( parent.scale * child.position ) )
    //     if( ignoreScl )	this.pos.add( new Vec3().fromQuat( this.rot, cp ) );
    //     else 			this.pos.add( new Vec3().fromMul( cp, this.scl ).transformQuat( this.rot ) );
    //     return this;
    // }

    // #endregion
}

    // // #region TRANSFORMATION
    // transformVec3( v: TVec3, out ?: TVec3 ) : TVec3{
    //     // GLSL - vecQuatRotation(model.rotation, a_position.xyz * model.scale) + model.position;
    //     // return (out || v)
    //     //     .fromMul( v, this.scl )
    //     //     .transformQuat( this.rot )
    //     //     .add( this.pos );

    //     out = out || v;
    //     vec3.mul( v, this.scl, out );
    //     vec3.transformQuat( out, this.rot );
    //     vec3.add( out, this.pos );
    //     return out;
    // }
    // // #endregion

// Vector3 InverseTransformPoint(Transform t, Vector3 point) {
//     // Recursive function, apply inverse of parent transform first
//     if (t.parent != NULL) {
//         point = InverseTransformPoint(t.parent, point)
//     }
 
//     // First, apply the inverse translation of the transform
//     point = point - t.position;
 
//     // Next, apply the inverse rotation of the transform
//     Quaternion invRot = Inverse(t.rotation);
//     point = point * invRot;
 
//     // Finally, apply the inverse scale
//     point = point / t.scale; // Component wise vector division
 
//     return point
// }

/*
	World Space Position to Local Space.
	V	.copy( gBWorld.eye_lid_upper_mid_l.pos ) // World Space Postion
	 	.add( [0, -0.05 * t, 0 ] )	// Change it
		.sub( gBWorld.eye_l.pos )	// Subtract from Parent's WS Position
		.div( gBWorld.eye_l.scl )	// Div by Parent's WS Scale
		.transform_quat( gBWorld.eye_l.rot_inv );	// Rotate by Parent's WS Inverse Rotation
*/