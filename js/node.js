class Node extends CityObject {

    constructor(pos) {
        super(pos)
    }

    moveRandomly(maxDist) {
        this.pos = this.pos.add(new Position(
            ((Math.random() * 2) - 1) * maxDist,
            ((Math.random() * 2) - 1) * maxDist
        ))
    }

    draw(ctx, drawConfig) {
        let w = drawConfig.node.width
        let h = drawConfig.node.height
        ctx.fillStyle = drawConfig.node.color
        ctx.fillRect(this.pos.x - w / 2, this.pos.y - h / 2, w, h)
    }

    containsPosition(position, drawConfig) {
        let w = drawConfig.node.width
        let h = drawConfig.node.height
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        )
    }

    clone() {
        return new Node(this.pos)
    }
}