
class CityObject {
    constructor(pos) {
        this.pos = pos
    }

    draw(_ctx, _drawConfig) {
        // overridden in subclasses
    }

    clone() { // general clone function, produces shallow clones
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    }

    containsPosition(_pos, _drawConfig) {
        return false;
    }
}