
class CityObject {
    constructor(pos) {
        this.pos = pos
    }

    draw(_ctx, _drawConfig) {
        // overridden in subclasses
    }


    clone() {
        return new CityObject(this.pos)
    }

    containsPosition(_pos, _drawConfig) {
        return false;
    }
}