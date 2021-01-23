/**
 * Mit dieser Klasse wird ein Haus in der Stadt dargestellt.
 * Jedes Haus hat eine Position im Raum und kann sich selbst zeichnen auf ein Canvas.
 */
class Consumer {

    /**
     * Kreiere ein neues Haus mit einer festen Position.
     * @param {Position} pos - die Position wo das Haus stehen wird
     */
    constructor(pos) {
        this.pos = pos;
    }

    /**
     * Zeichne dieses Haus auf das Canvas mit dem "Pinsel"
     * @param {CanvasRenderingContext2D} ctx - der "Pinsel" mit dem gezeichnet wird
     */
    draw(ctx) {
        let width = 20, height = 20;
        ctx.fillStyle = "#dfac20";
        ctx.fillRect(this.pos.x - width/2, this.pos.y - height/2, width, height);
    }

}