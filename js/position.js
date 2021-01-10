class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Position(this.x + other.x, this.y + other.y);
    }

    sub(other) {
        return new Position(this.x - other.x, this.y - other.y);
    }

    mul(factor) {
        return new Position(this.x * factor, this.y * factor);
    }

    dist(to = new Position(0, 0)) {
        const dx = this.x - to.x;
        const dy = this.y - to.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distToLine(p1, p2) {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let num = Math.abs(dx * (p1.y - this.y) - (p1.x - this.x) * dy);
        let den = Math.sqrt(dx * dx + dy * dy);
        let dist = num / den;

        return Math.min(dist, this.dist(p1), this.dist(p2));
    }

    isInsideRect(upperLeft, lowerRight) {
        return this.x >= upperLeft.x && this.x <= lowerRight.x
            && this.y >= upperLeft.y && this.y <= lowerRight.y;
    }
}