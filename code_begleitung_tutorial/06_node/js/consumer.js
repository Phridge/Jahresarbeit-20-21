class Consumer {

    constructor(pos) {
        this.pos = pos;
        this.width = 20;
        this.height = 20;
    }

    draw(ctx) {
        ctx.fillStyle = '#dfac20';
        ctx.fillRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);
    }

    clone() {
        return new Consumer(this.pos);
    }
}
