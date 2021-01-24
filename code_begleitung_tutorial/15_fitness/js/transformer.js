/**
 * Die Klasse "Transformer" beschreibt den zentralen Verteiler,
 * von dem alle Verbindungen ausgehen.
 * Ebenso wie ein Konsument hat ein Transformer eine Position und
 * kann sich selbst zeichnen.
 */
class Transformer {
    /**
     * Kreiere einen Transformer mit einer festen Position.
     * @param {Position} pos - die Position des Transformers
     */
    constructor(pos) {
        this.pos = pos;
    }

    /**
     * Zeichne diesen Transformer.
     * @param {*} ctx - der "Pinsel" mit dem gezeichnet wird.
     */
    draw(ctx) {
        let width = 20, height = 30;
        ctx.fillStyle = "#222222";
        ctx.fillRect(this.pos.x - width/2, this.pos.y - height/2, width, height);
    }
}