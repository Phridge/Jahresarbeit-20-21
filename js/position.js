class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(other) {
        return new Position(this.x + other.x, this.y + other.y)
    }

    sub(other) {
        return new Position(this.x - other.x, this.y - other.y)
    }

    dist(to = new Position(0, 0)) {
        const dx = this.x - to.x
        const dy = this.y - to.y
        return Math.sqrt(dx * dx + dy * dy)
    }
}