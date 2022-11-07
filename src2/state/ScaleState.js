export default class ScaleState{
    value = [1,1,1];
    set( v ){
        this.value[ 0 ] = v[ 0 ];
        this.value[ 1 ] = v[ 1 ];
        this.value[ 2 ] = v[ 2 ];
    }
}
