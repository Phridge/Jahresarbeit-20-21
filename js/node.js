class Node {
    constructor(x, y) {
        this.width = 5;
        this.height = 5;
        this.x = x + this.width/2;
        this.y = y + this.height/2;
    }

    randomPosition(minX, minY, maxX, maxY) {
        this.x = Math.floor((Math.random() * maxX) + minX);
        this.y = Math.floor((Math.random() * maxY) + minY);
    }

    draw(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
}