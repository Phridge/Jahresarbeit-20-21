class CityObject {
    constructor(pos, connection) {
        this.pos = pos
        this.connection = connection
    }

    draw(_ctx, _drawConfig) { }

    clone() { }

    containsPosition(_pos, _drawConfig) { return false }
}

class Node extends CityObject {

    constructor(pos, connection) {
        super(pos, connection)
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
        return new Node(this.pos, this.connection)
    }
}

class Consumer extends CityObject {

    constructor(pos, connection) {
        super(pos, connection)
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
        return new Consumer(this.pos, this.connection)
    }
}

class Transformer extends CityObject {

    constructor(pos, connection) {
        super(pos, connection)
    }

    draw(ctx, drawConfig) {
        let w = drawConfig.transformer.width
        let h = drawConfig.transformer.height
        ctx.fillStyle = drawConfig.transformer.color
        ctx.fillRect(this.pos.x - w / 2, this.pos.y - h / 2, w, h)
    }

    containsPosition(position, drawConfig) {
        let w = drawConfig.transformer.width
        let h = drawConfig.transformer.height
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        )
    }

    clone() {
        return new Transformer(this.pos, this.connection)
    }

}