/**
 * Mit dieser Klasse wird ein Haus bzw. ein Verbraucher in der Stadt dargestellt.
 * Jeder Verbraucher hat eine Position im Raum und kann sich selbst zeichnen auf ein Canvas.
 */
class Consumer {

    /**
     * Kreiere einen neuen Verbraucher mit einer festen Position.
     * @param {Position} pos - die Position wo der Verbraucher stehen wird
     */
    constructor(pos) {
        this.pos = pos;
    }

    /**
     * Zeichne diesen Verbraucher auf das Canvas mit dem "Pinsel"
     * @param {CanvasRenderingContext2D} ctx - der "Pinsel" mit dem gezeichnet wird
     */
    draw(ctx) {
        let width = 20, height = 20;
        ctx.fillStyle = "#dfac20";
        ctx.fillRect(this.pos.x - width/2, this.pos.y - height/2, width, height);
    }

}