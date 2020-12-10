class Consumer extends CityObject {

    constructor(pos) {
        super(pos)
    }

    draw(ctx, drawConfig) {
        let w = drawConfig.consumer.width
        let h = drawConfig.consumer.height
        ctx.fillStyle = drawConfig.consumer.color
        ctx.fillRect(this.pos.x - w / 2, this.pos.y - h / 2, w, h)
    }

    anchor() {
        return this.pos.sub(new Position(0, -30))
    }

    containsPosition(position, drawConfig) {
        let w = drawConfig.consumer.width
        let h = drawConfig.consumer.height
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        )
    }

    doNotCross() {
        return true;
    }

    clone() {
        return new Consumer(this.pos)
    }
}