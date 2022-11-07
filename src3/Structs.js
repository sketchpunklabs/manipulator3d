const Modes = Object.freeze({
    None        : -1,
    Translate   : 0,
    Rotate      : 1,
    Scale       : 2,
    Plane       : 3,
});

const Axes = Object.freeze({
    None : -1,
    X    : 0,
    Y    : 1,
    Z    : 2,
    All  : 3,
})

export { Modes, Axes };