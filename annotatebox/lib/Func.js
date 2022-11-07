export function debounce( fn, delay ){
    let id = null;
    return ()=>{ //...args
        if( id ) clearTimeout( id );
        id = setTimeout( ()=>fn.apply( null, arguments ), delay ); //id = setTimeout( ()=>fn( ...args ), delay );
    };
}

export function memorize( fn ){
    const cache = {};
    return ( ...args )=>{
        const key = args.toString();
        if( key in cache ) return cache[ key ];

        const result = fn( ...args );
        cache[ key ] = result;
        return result;
    }
}

export function throttle( fn, delay ){
    let lastTime = 0;
    return ( ...args )=>{
        const now = new Date().getTime();
        if( now - lastTime < delay ) return;
        lastTime = now;
        fn( ...args );
    }
}