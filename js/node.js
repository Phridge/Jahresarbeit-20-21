class Node {

    constructor(pos) {
        this.pos = pos
    }

    moveRandomly(maxDist) {
        this.pos = this.pos.add(new Position(
            ((Math.random() * 2) - 1) * maxDist,
            ((Math.random() * 2) - 1) * maxDist
        ))
    }

    draw(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.pos.x - this.width/2, this.pos.y - this.height/2, this.width, this.height)
    }

    containsPosition(position) {
        let upperLeft = new Position(this.pos.x - this.width / 2, this.pos.y - this.height / 2)
        let lowerRight = new Position(this.pos.x + this.width / 2, this.pos.y + this.height / 2)
        return position.x >= upperLeft.x && position.x <= lowerRight.x
            && position.y >= upperLeft.y && position.y <= lowerRight.y
    }

    clone() {
        return new Node(this.pos)
    }
}

Node.prototype.width = 7
Node.prototype.height = 7