
/**
 * Die Klasse "CityObject" ist die Basisklasse für
 * Node, Consumer und Transformer, die gemeinsame Methoden
 * und Attribute beschreibt.
 */
class CityObject {
    /**
     * Basis-Konstruktor für abgeleitete Klassen.
     * Jedes Stadtobjekt besitzt EINE Position und EINE
     * Verbindung.
     * @param {Position} pos - die Position des Stadtobjektes
     * @param {Number?} connection - die Verbindung, ein Index - kann auch null sein
     */
    constructor(pos, connection) {
        this.pos = pos;
        this.connection = connection;
    }

    /**
     * Jedes CityObject kann gezeichnet werden, aber wie genau,
     * bestimmen die abgeleiteten Klassen. Deshalb spezifiziert
     * die CityObject Klasse hier kein genaues Verhalten.
     * @param {*} _ctx - der Pinsel mit dem gezeichnet wird.
     */
    draw(_ctx) {

    }

    /**
     * Jedes Stadtobjekt kann geklont werden. Wie genau, überbleibt
     * den abgeleiteten Klassen.
     */
    clone() {
        
    }

    /**
     * Prüft, ob eine Position in der Nähe dieses Stadtobjektes ist.
     * Die Zeichenkonfigurationen werden benötigt, da alle Stadtobjekte
     * von denen Abhängig sind. Aber wie die Stadtobjekte testen, ob sich die
     * Position in der Nähe befindet, ist denen überlassen.
     * @param {*} _position 
     * @param {*} _drawConfig 
     */
    containsPosition(_position, _drawConfig) {
        return false;
    }
}

/**
 * Mit dieser Klasse wird ein Haus bzw. ein Verbraucher in der Stadt dargestellt.
 * Jeder Verbraucher hat eine Position im Raum und kann sich selbst zeichnen auf ein Canvas.
 */
class Consumer extends CityObject {

    /**
     * Kreiere einen neuen Verbraucher mit einer festen Position.
     * @param {Position} pos - die Position wo der Verbraucher stehen wird
     * @param {Number} connection - die Verbindung des Verbrauchers
     */
    constructor(pos, connection) {
        super(pos, connection); // die Basisklasse muss auch "konstruiert" werden
    }

    /**
     * Zeichne diesen Verbraucher auf das Canvas mit dem "Pinsel"
     * @param {CanvasRenderingContext2D} ctx - der "Pinsel" mit dem gezeichnet wird
     * @param {*} drawConfig - Konfigurationen fürs Zeichnen
     */
    draw(ctx, drawConfig) {
        let w = drawConfig.consumer.width;
        let h = drawConfig.consumer.height;
        let anchor = this.pos;
        // Mittelpunkt des Hauses
        let house = anchor.add(drawConfig.consumer.houseOffset);

        // Verbindung vom Haus zum Knotenpunkt (Anker)
        ctx.beginPath();
        ctx.strokeStyle = drawConfig.connection.color;
        ctx.moveTo(anchor.x, anchor.y);
        ctx.lineTo(house.x, house.y);
        ctx.stroke();

        // Anker Zeichnen
        let wNode = drawConfig.node.width;
        let hNode = drawConfig.node.height;
        ctx.fillStyle = drawConfig.node.color;
        ctx.fillRect(anchor.x - wNode / 2, anchor.y - hNode / 2, wNode, hNode);

        // Das Haus
        ctx.fillStyle = drawConfig.consumer.color;
        ctx.fillRect(house.x - w / 2, house.y - h / 2, w, h);
    }

    /**
     * Erstelle einen exakten Klon dieses Konsumenten.
     * @return der Klon
     */
    clone() {
        return new Consumer(this.pos, this.connection);
    }

    /**
     * Prüft, ob eine Position innerhalb dieses Konsumenten liegt.
     * Die Position liegt in der Nähe, wenn sie entweder auf dem Knotenpunkt
     * oder auf dem Haus liegt.
     * @param {*} position 
     * @param {*} drawConfig 
     */
    containsPosition(position, drawConfig) {
        
        // Konsument-Werte
        let cw = drawConfig.consumer.width;
        let ch = drawConfig.consumer.height;
        let off = drawConfig.consumer.houseOffset;
        
        // Knotenpunkt-Werte
        let nw = drawConfig.node.width;
        let nh = drawConfig.node.height;

        return position.isInsideRect(
            // Haus check
            new Position(this.pos.x + off.x - cw / 2, this.pos.y + off.y - ch / 2),
            new Position(this.pos.x + off.x + cw / 2, this.pos.y + off.y + ch / 2)
        ) || position.isInsideRect(
            // Knotenpunkt check
            new Position(this.pos.x - nw / 2, this.pos.y - nh / 2),
            new Position(this.pos.x + nw / 2, this.pos.y + nh / 2)
        );
    }
}

/**
 * Die "Node" Klasse beschreibt einen Knotenpunkt in der Stadt,
 * ausgestattet mit einer Position und einer draw-Methode.
 * Im Gegensatz zu den anderen Stadtobjekten kann ein Knotenpunkt
 * seine Position ändern mithilfe der Methode "moveRandomly"
 */
class Node extends CityObject {
    /**
     * Kreiere einen Knotenpunkt mit einer Startposition und
     * -Verbindung.
     * @param {Position} pos - die Startposition des Knotenpunktes
     * @param {Number} connection - die Verbindung des Knotenpunktes
     */
    constructor(pos, connection) {
        super(pos, connection);
    }

    /**
     * Zeichne diesen Knotenpunkt auf das Canvas mit dem "Pinsel".
     * @param {CanvasRenderingContext2D} ctx - der "Pinsel" mit dem gezeichnet wird
     * @param {*} drawConfig - Konfigurationen fürs Zeichnen
     */
    draw(ctx, drawConfig) {
        let width = drawConfig.node.width, height = drawConfig.node.height;
        ctx.fillStyle = drawConfig.node.color;
        ctx.fillRect(this.pos.x - width / 2, this.pos.y - height / 2, width, height);
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
        return new Node(this.pos, this.connection);
    }

    /**
     * Prüft, ob eine Position in der Nähe dieses Knotenpunktes liegt.
     * @param {*} position 
     * @param {*} drawConfig 
     */
    containsPosition(position, drawConfig) {
        let w = drawConfig.node.width;
        let h = drawConfig.node.height;
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        );
    }
}

/**
 * Die Klasse "Transformer" beschreibt den zentralen Verteiler,
 * von dem alle Verbindungen ausgehen.
 * Ebenso wie ein Konsument hat ein Transformer eine Position und
 * kann sich selbst zeichnen.
 */
class Transformer extends CityObject {
    /**
     * Kreiere einen Transformer mit einer festen Position.
     * @param {Position} pos - die Position des Transformers
     */
    constructor(pos) {
        // der Transformer hat keine Verbindung
        super(pos, null);
    }

    /**
     * Zeichne diesen Transformer.
     * @param {*} ctx - der "Pinsel" mit dem gezeichnet wird.
     * @param {*} drawConfig - Konfigurationen fürs Zeichnen
     */
    draw(ctx, drawConfig) {
        let width = drawConfig.transformer.width, height = drawConfig.transformer.height;
        ctx.fillStyle = drawConfig.transformer.color;
        ctx.fillRect(this.pos.x - width / 2, this.pos.y - height / 2, width, height);
    }

    /**
     * Erstelle einen exakten Klon dieses Transformers.
     * @return der Klon
     */
    clone() {
        return new Transformer(this.pos);
    }

    /**
     * Prüft, ob eine Position in der Nähe dieses Transformators liegt.
     * @param {*} position 
     * @param {*} drawConfig 
     */
    containsPosition(position, drawConfig) {
        let w = drawConfig.transformer.width;
        let h = drawConfig.transformer.height;
        return position.isInsideRect(
            new Position(this.pos.x - w / 2, this.pos.y - h / 2),
            new Position(this.pos.x + w / 2, this.pos.y + h / 2)
        );
    }
}