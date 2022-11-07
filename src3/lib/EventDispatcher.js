export default function EventDispatcher(){
    const evtTarget = new EventTarget();
    return {
        on( evtName, fn ){   evtTarget.addEventListener( evtName, fn );    return this; },
        off( evtName, fn ){  evtTarget.removeEventListener( evtName, fn ); return this; },
        once( evtName, fn ){ evtTarget.addEventListener( evtName, fn, { once:true } ); return this; },
        emit( evtName, data ){
            evtTarget.dispatchEvent( new CustomEvent( evtName, { detail:data, bubbles: false, cancelable:true, composed:false } ) );
            return this;
        },
    };
}