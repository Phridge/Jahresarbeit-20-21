/**
 * Diese Klasse beschreibt eine Position im 2Dimensionalen Raum.
 */
class Position {
    /**
     * Kreiere eine Position von x- und y-Koordinate.
     * @param {*} x - die x-Koordinate
     * @param {*} y - die y-Koordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Addiere zwei Positionen.
     * @param {Position} other - die andere Position
     * @return die Summe beider Positionen
     */
    add(other) {
        return new Position(this.x + other.x, this.y + other.y);
    }
    /**
     * Subtrahiere zwei Positionen.
     * @param {Position} other - die andere Position
     * @return die Differenz beider Positionen
     */
    sub(other) {
        return new Position(this.x - other.x, this.y - other.y);
    }

    /**
    * Multipliziere diese Position mit einer Zahl
    * @param {Number} factor - der Wert mit dem multipliziert wird
    * @return diese Position mit factor multipliziert
    */
    mul(factor) {
        return new Position(this.x * factor, this.y * factor);
    }

    /**
     * Berechnet die Distanz zu einer anderen Position.
     * Wird berechnet via Pythagoras: a = sqrt(b^2, c^2),
     * wobei b hier die Distanz zwischen den x-Koordinaten
     * und c die Distanz zwischen den y-Koordinaten der Positionen ist.
     * @param {Position} to - die andere Position
     * @return die distanz zwischen this und der anderen Position
     */
    dist(to) {
        const dx = this.x - to.x;
        const dy = this.y - to.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Prüft, ob diese Position innerhalb des Rechtecks ist, dass
     * durch die Ecke oben links und unten rechts begrenzt ist.
     * @param {Position} upperLeft - die obere linke Ecke des Rechtecks
     * @param {Position} lowerRight - die untere rechte Ecke des Rechtecks
     */
    isInsideRect(upperLeft, lowerRight) {
        return this.x >= upperLeft.x && this.x <= lowerRight.x
            && this.y >= upperLeft.y && this.y <= lowerRight.y;
    }
}