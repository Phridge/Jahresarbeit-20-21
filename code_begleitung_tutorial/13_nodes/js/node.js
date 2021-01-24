/**
 * Die "Node" Klasse beschreibt einen Knotenpunkt in der Stadt,
 * ausgestattet mit einer Position und einer draw-Methode.
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

}