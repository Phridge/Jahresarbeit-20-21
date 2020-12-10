
class CityObject {
    constructor(pos) {
        this.pos = pos;
    }

    draw(_ctx) {
        // overridden in subclasses
    }

    anchor() {
        return this.pos
    }

    clone() {
        return new CityObject(this.pos)
    }

    containsPosition(_pos) {
        return false;
    }

    doNotCross() {
        return false;
    }

    moveRandomly(_maxDist) {
        // overridden in subclasses
    }
}