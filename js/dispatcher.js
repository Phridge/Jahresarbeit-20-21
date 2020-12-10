
class Dispatcher extends CityObject {

    constructor(pos) {
        super(pos)
    }

    draw(ctx, drawConfig) {
        let w = drawConfig.dispatcher.width
        let h = drawConfig.dispatcher.height
        ctx.fillStyle = drawConfig.dispatcher.color
        ctx.fillRect(this.pos.x - w / 2, this.pos.y - h / 2, w, h)
    }

    containsPosition(position, drawConfig) {
        let w = drawConfig.dispatcher.width
        let h = drawConfig.dispatcher.height
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        )
    }

    clone() {
        return new Dispatcher(this.pos)
    }

}