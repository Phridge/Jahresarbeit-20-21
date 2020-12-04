class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 5;
    }

    randomPosition(minX, minY, maxX, maxY) {
        this.x = Math.floor((Math.random() * maxX) + minX);
        this.y = Math.floor((Math.random() * maxY) + minY);
    }

    draw(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}