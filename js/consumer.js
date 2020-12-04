class Consumer {
    constructor(x, y) {
        this.width = 20;
        this.height = 20;
        this.x = x + this.width/2;
        this.y = y + this.height/2;
    }

    draw(ctx) {
        ctx.fillStyle = '#dfac20';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }    
}