class Consumer {

    constructor(x, y) {
        if (x instanceof Point) {
            this.pos = x
        } else {
            this.pos = new Point(x + this.width / 2, y + this.height / 2)
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#dfac20';
        ctx.fillRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height)
    }

    clone() {
        return new Consumer(this.pos)
    }
}
Consumer.prototype.width = 20
Consumer.prototype.height = 20