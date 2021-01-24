/**
 * Die Klasse "City" stellt ein Netzwerk bestehend aus
 * Konsumenten, Transformer und Knotenpunkte dar.
 * Sie besitzt eine Liste, in der ebendiese gespeichert sind (cityObjects)
 * und eine Extraliste mit Indexpaaren (connections), die beschreiben, 
 * welches Stadtobjekt mit welchem verbunden ist.
 * Eine Stadt kann auch mutiert werden, dabei werden verschiedene Werte der Stadt
 * nach Zufallsprinzip geändert bzw. mutiert.
 */
class City {
    /**
     * Kreiere ein neues Stadt-Objekt.
     * Zu beginn ist es leer, es müssen nach und nach die Stadtobjekte
     * und Verbindungen hinzugefügt werden.
     */
    constructor() {
        this.cityObjects = [];
        this.connections = [];
    }

    /**
     * Erweitere die Stadt um ein weiteres Stadtobjekt.
     * @param {*} obj - das Stadtobjekt das zur Stadt hinzukommt
     */
    addCityObject(obj) {
        this.cityObjects.push(obj);
    }

    /**
     * Füge eine Verbindung zwischen zwei Stadtobjekten hinzu.
     * @param {Number} a - der Index des ersten Stadtobjektes
     * @param {Number} b - der Index des zweiten Stadtobjektes
     */
    addConnection(a, b) {
        this.connections.push([a, b]);
    }

    /**
     * Berechnet die "Fitness" für diese Stadt.
     * Je kleiner die Summe der Länge der Verbindungen ist,
     * desto höher die Fitness.
     * @return den Fitness-score
     */
    getFitness() {
        let lengthSum = 0;
        for(let i = 0; i < this.connections.length; i++) {
            let connection = this.connections[i];
            let objA = this.cityObjects[connection[0]];
            let objB = this.cityObjects[connection[1]];
            let dist = objA.pos.dist(objB.pos); // länge der Verbindung
            lengthSum += dist;
        }

        // "Umdrehen" des Wertes: je kleiner die Länge, desto höher der daraus
        // berechnete Wert für die Fitness
        let fitness = 100 / (lengthSum / 100 + 1);
        return fitness;
    }

    /**
     * Zeichne diese Stadt mit all ihren Stadtobjekten und Verbindungen.
     * @param {*} ctx - der "Pinsel" mit dem gezeichnet wird
     */
    draw(ctx) {
        // zuerst alle Verbindungen zeichnen
        for(let i = 0; i < this.connections.length; i++) {
            let connection = this.connections[i];

            // Stadtobjekte in dieser Verbindung
            let objA = this.cityObjects[connection[0]];
            let objB = this.cityObjects[connection[1]];

            // Verbindung zeichnen
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(objA.pos.x, objA.pos.y);
            ctx.lineTo(objB.pos.x, objB.pos.y);
            ctx.stroke();
        }

        // danach alle Stadtobjekte
        for(let i = 0; i < this.cityObjects.length; i++) {
            let obj = this.cityObjects[i];
            obj.draw(ctx);
        }
    }

    /**
     * Mutiert diese Stadt. Mutieren kann folgende Werte verändern:
     * * die Position von Knotenpunkten
     */
    mutate() {
        // vorerst festgelegte Mutationwerte/chancen
        let moveChance = 10 / 100; // 10%
        let maxMoveDelta = 5;

        for(let i = 0; i < this.cityObjects.length; i++) {
            let obj = this.cityObjects[i];
            if(obj instanceof Node && Math.random() < moveChance) {
                obj.moveRandomly(maxMoveDelta);
            }
        }
    }
}