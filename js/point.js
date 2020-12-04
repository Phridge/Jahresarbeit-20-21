class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    plus(other) {
        return new Point(this.x + other.x, this.y + other.y)
    }

    minus(other) {
        return new Point(this.x - other.x, this.y - other.y)
    }

    dist(to = new Point(0, 0)) {
        const dx = this.x - to.x
        const dy = this.y - to.y
        return Math.sqrt(dx * dx + dy * dy)
    }
}