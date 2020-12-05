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

    clone() {
        return new Node(this.pos)
    }
}

Node.prototype.width = 5
Node.prototype.height = 5