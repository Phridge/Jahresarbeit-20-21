class Consumer extends CityObject {

    constructor(pos) {
        super(pos)
    }

    draw(ctx, drawConfig) {
        let w = drawConfig.consumer.width
        let h = drawConfig.consumer.height
        let anchor = this.pos
        let house = this.housePos()

        // line from house to anchor
        ctx.beginPath()
        ctx.strokeStyle = drawConfig.connection.color
        ctx.moveTo(anchor.x, anchor.y)
        ctx.lineTo(house.x, house.y)
        ctx.stroke()

        // anchor
        let wNode = drawConfig.node.width
        let hNode = drawConfig.node.height
        ctx.fillStyle = drawConfig.node.color
        ctx.fillRect(anchor.x - wNode / 2, anchor.y - hNode / 2, wNode, hNode)

        // self
        ctx.fillStyle = drawConfig.consumer.color
        ctx.fillRect(house.x - w / 2, house.y - h / 2, w, h)
    }

    housePos() {
        return new Position(this.pos.x, this.pos.y - 20)
    }

    containsPosition(position, drawConfig) {
        let w = drawConfig.consumer.width
        let h = drawConfig.consumer.height
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        )
    }

    clone() {
        return new Consumer(this.pos)
    }
}