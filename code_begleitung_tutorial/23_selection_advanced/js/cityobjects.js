
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
     */
    draw(_ctx) {

    }

    /**
     * Jedes Stadtobjekt kann geklont werden. Wie genau, überbleibt
     * den abgeleiteten Klassen.
     */
    clone() {
        
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
     */
    draw(ctx) {
        let width = 20, height = 20;
        ctx.fillStyle = "#dfac20";
        ctx.fillRect(this.pos.x - width / 2, this.pos.y - height / 2, width, height);
    }

    /**
     * Erstelle einen exakten Klon dieses Konsumenten.
     * @return der Klon
     */
    clone() {
        return new Consumer(this.pos, this.connection);
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
    */
    draw(ctx) {
        let width = 7, height = 7;
        ctx.fillStyle = '#000000';
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
     */
    draw(ctx) {
        let width = 20, height = 30;
        ctx.fillStyle = "#222222";
        ctx.fillRect(this.pos.x - width / 2, this.pos.y - height / 2, width, height);
    }

    /**
     * Erstelle einen exakten Klon dieses Transformers.
     * @return der Klon
     */
    clone() {
        return new Transformer(this.pos);
    }
}