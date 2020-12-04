class Consumer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
    }

    draw(ctx) {
        ctx.fillStyle = '#dfac20';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }    
}