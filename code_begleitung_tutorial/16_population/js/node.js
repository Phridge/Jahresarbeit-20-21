/**
 * Die "Node" Klasse beschreibt einen Knotenpunkt in der Stadt,
 * ausgestattet mit einer Position und einer draw-Methode.
 * Im Gegensatz zu den anderen Stadtobjekten kann ein Knotenpunkt
 * seine Position ändern mithilfe der Methode "moveRandomly"
 */
class Node {
    /**
     * Kreiere einen Knotenpunkt mit einer Startposition.
     * @param {Position} pos - die Startposition des Knotenpunktes
     */
    constructor(pos) {
        this.pos = pos;
    }

    /**
    * Zeichne diesen Knotenpunkt auf das Canvas mit dem "Pinsel".
    * @param {CanvasRenderingContext2D} ctx - der "Pinsel" mit dem gezeichnet wird
    */
    draw(ctx) {
        let width = 7, height = 7;
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.pos.x - width/2, this.pos.y - height/2, width, height);
    }

    /**
     * Verschiebt die Position dieses Knotenpunktes um zufällige Werte.
     * @param {Number} maxMoveDelta - wie weit der Knotenpunkt sich maximal 
     * bewegen darf
     */
    moveRandomly(maxMoveDelta) {
        // Werte von +maxMoveDelta bis -maxMoveDelta
        let delta = new Position(
            ((Math.random() * 2) - 1) * maxMoveDelta,
            ((Math.random() * 2) - 1) * maxMoveDelta
        );
        this.pos = this.pos.add(delta);
    }

    /**
     * Erstelle einen exakten Klon dieses Knotenpunktes.
     * @return der Klon
     */
    clone() {
        return new Node(this.pos);
    }
}