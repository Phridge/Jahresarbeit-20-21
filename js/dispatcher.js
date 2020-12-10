
class Dispatcher extends CityObject {

    constructor(pos) {
        super(pos)
    }

    draw(_ctx) {
        // TODO: dispatcher draw
    }

    clone() {
        return new Dispatcher(this.pos)
    }

}