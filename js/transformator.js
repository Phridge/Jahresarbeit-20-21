
class Transformer extends CityObject {

    constructor(pos) {
        super(pos)
    }

    draw(ctx, drawConfig) {
        let w = drawConfig.transformator.width
        let h = drawConfig.transformator.height
        ctx.fillStyle = drawConfig.transformator.color
        ctx.fillRect(this.pos.x - w / 2, this.pos.y - h / 2, w, h)
    }

    containsPosition(position, drawConfig) {
        let w = drawConfig.transformator.width
        let h = drawConfig.transformator.height
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        )
    }

    clone() {
        return new Transformer(this.pos)
    }

}