
class CityObject {
    constructor(pos) {
        this.pos = pos
    }

    draw(_ctx, _drawConfig) {
        // overridden in subclasses
    }

    anchor() {
        return this.pos
    }

    clone() {
        return new CityObject(this.pos)
    }

    containsPosition(_pos, _drawConfig) {
        return false;
    }

    doNotCross() {
        return false;
    }

    moveRandomly(_maxDist) {
        // overridden in subclasses
    }
}