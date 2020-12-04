class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 5;
    }

    draw(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}