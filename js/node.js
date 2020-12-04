class Node {

    constructor(x, y) {
        if(x instanceof Point) {
            this.pos = x
        } else {
            this.pos = new Point(x + this.width/2, y + this.width/2)
        }
    }

    moveRandomly(maxDist) {
        this.pos = this.pos.plus(new Point(
            ((Math.random() * 2) - 1) * maxDist,
            ((Math.random() * 2) - 1) * maxDist
        ))
    }

    draw(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.pos.x - this.width/2, this.pos.y - this.height/2, this.width, this.height)
    }
}

Node.prototype.width = 5
Node.prototype.height = 5