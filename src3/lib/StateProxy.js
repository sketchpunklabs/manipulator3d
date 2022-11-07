export default class StateProxy{
    // #region MAIN
    static new( data={} ){ return new Proxy( data, new StateProxy( data ) ); }

    constructor( data ){
        this._data   = data;
        this._events = new EventTarget();
    }
    // #endregion

    // #region METHODS
    update( struct, emitChange=false ){
        Object.assign( this._data, struct );
        if( emitChange ) this.emit( 'change', null );
        return this;
    }
    // #endregion

    // #region PROXY TRAPS
    get( target, prop, receiver ){
        // console.log( "GET", "target", target, "prop", prop, "rec", receiver );    
        if( prop === '$' ) return this;
        return Reflect.get( target, prop, receiver ); //target[ prop ];
    }

    set( target, prop, value ){
        // console.log( "SET", "target", target, "prop", prop, "value", value, 'prev', Reflect.get( target, prop ) );
        if( prop === '$' ) return false;

        // Only update the state if the value is different
        if( Reflect.get( target, prop ) !== value ){
            Reflect.set( target, prop, value );     // Save data to Object
            this.emit( prop + 'Change', value );    // Emit event that property changed
            this.emit( 'change', { prop, value } ); // Emit event that any property changed
        }
        return true;
    }
    // #endregion

    // #region EVENTS
    on( evtName, fn ){   this._events.addEventListener( evtName, fn ); return this; }
    off( evtName, fn){   this._events.removeEventListener( evtName, fn ); return this; }
    once( evtName, fn ){ this._events.addEventListener( evtName, fn, { once:true } ); return this; }
    emit( evtName, data ){
        this._events.dispatchEvent( new CustomEvent( evtName, { detail:data, bubbles: false, cancelable:true, composed:false } ) );
        return this;
    }
    // #endregion
}