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
    }

    /**
     * Kreiere und füge einen Verbraucher hinzu.
     * @param {Position} pos - Position des neuen Verbrauchers
     * @param {*} connection - die Verbindung des Verbrauchers
     * @return der Index des neuen Verbrauchers
     */
    addConsumer(pos, connection) {
        return this.addCityObject(new Consumer(pos, connection));
    }

    /**
     * Kreiere und füge einen Knotenpunkt hinzu.
     * @param {Position} pos - Position des neuen Knotenpunktes
     * @param {*} connection - die Verbindung des Knotenpunktes
     * @return der Index des neuen Knotenpunktes
     */
    addNode(pos, connection) {
        return this.addCityObject(new Node(pos, connection));
    }

    /**
     * Kreiere und füge einen Transformer hinzu.
     * Erlaubt keine Verbindung.
     * @param {Position} pos - Position des neuen Transformers
     * @return der Index des neuen Transformers
     */
    addTransformer(pos) {
        return this.addCityObject(new Transformer(pos));
    }

    /** Nicht benutzen! Nur die Stadt darf das. */
    addCityObject(obj) {
        let index = this.cityObjects.length;
        this.cityObjects.push(obj);
        return index;
    }

    /**
     * Ändere die Verbindung eines Stadtobjektes.
     * @param {Number} obj - der Index des Stadtobjektes
     * @param {Number} connection - die neue Verbindung
     */
    setConnection(obj, connection) {
        this.cityObjects[obj].connection = connection;
    }

    /**
     * Entfernt ein Stadtobjekt aus dieser Stadt.
     * Verbindungen zu diesem Stadtobjekt werden dahin verlegt,
     * wo die Verbindung des entfernten Objektes hingezeigt hat.
     * @param {Number} index - das Stadtobjekt, das entfernt werden soll
     */
    removeCityObject(index) {
        let target = this.cityObjects[index];
        
        // das Stadtobjekt wird entfernt aus der Liste
        this.cityObjects.splice(index, 1);
        
        // Da nun ein Stadtobjekt fehlt in der Liste, müssen alle Indices ÜBER index
        // um eins nach unten gesetzt werden - selbst das Neuverkabelungsziel
        let reconnectTarget = target.connection - (target.connection >= index ? 1 : 0);
        
        for (var i = 0, stop = this.cityObjects.length; i < stop; i++) {
            let obj = this.cityObjects[i];
            if (obj.connection === index) {
                obj.connection = reconnectTarget;
            } else if (obj.connection > index) {
                obj.connection -= 1;
            }
        }
    }

    /**
     * Sammelt alle Indices von Stadtobjekten, die nicht gleich,
     * direkt oder indirekt zu objIndex verbinden.
     * Wird gebraucht, um beim Mutieren nicht zu den falschen Stadtobjekten zu verbinden
     * und so Kreise zu verhindern.
     * @param {Number} objIndex - keines der zurückgegebenen Indices ist irgendwie
     * mit diesem Stadtobjekt verbunden.
     * @return ein Set der Indices der nicht verbundenen Stadtobjekte
     */
    cityObjectsUnrelatedTo(objIndex) {
        let result = new Set();
        for (let i = 0; i < this.cityObjects.length; i++) {
            if (!this.indirectConnectionBetween(i, objIndex)) {
                result.add(i);
            }
        }
        return result;
    }

    /**
     * Prüft, ob from:
     * * gleich to ist
     * * direkt zu from verbindet
     * * indirekt (also über ein verbundenes Stadtobjekt) zu from verbindet
     * @param {Number} from - der Index eines Stadtobjektes,
     * das vielleicht zu to verbindet
     * @param {Number} to - der Index eines Stadtobjektes,
     * zu welchem Verbindungen getestet werden
     * @return ob from gleich to oder direkt oder indirekt zu to verbunden ist
     */
    indirectConnectionBetween(from, to) {
        while (from !== to) {
            if (from == null) {
                return false;
            } else {
                from = this.cityObjects[from].connection;
            }
        }
        return true;
    }

    /**
     * Berechnet die "Fitness" für diese Stadt.
     * Je kleiner die Summe der Länge der Verbindungen ist,
     * desto höher die Fitness.
     * @return den Fitness-score
     */
    getFitness() {
        let lengthSum = 0;
        for(let i = 0; i < this.cityObjects.length; i++) {
            let objA = this.cityObjects[i];

            // Testen ob objA überhaupt eine Verbindung hat
            // Transformer fällt hier durch
            if(objA.connection != null) {
                let objB = this.cityObjects[objA.connection];
                let dist = objA.pos.dist(objB.pos); // länge der Verbindung
                lengthSum += dist;
            }
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
        for(let i = 0; i < this.cityObjects.length; i++) {
            let objA = this.cityObjects[i];

            // nicht bei jedem Stadtobjekt zeigt die Verbindung
            // auf ein anderes Objekt (siehe Transformer)
            if(objA.connection != null) {
                let objB = this.cityObjects[objA.connection];
    
                // Verbindung zeichnen
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(objA.pos.x, objA.pos.y);
                ctx.lineTo(objB.pos.x, objB.pos.y);
                ctx.stroke();
            }
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
     * * die Anzahl der Knotenpunkte
     * * die Verbindungen zwischen Stadtobjekten
     */
    mutate() {
        // vorerst festgelegte Mutationwerte/chancen
        let moveChance = 1 / 100; // 1%
        let maxMoveDelta = 5;
        let nodeMutationChance = 1 / 100; // 1%
        let reconnectChance = 3 / 100; // 3%

        
        // Knotenpunkte entfernen
        for (var i = 0; i < this.cityObjects.length; i++) {
            if (this.cityObjects[i] instanceof Node && Math.random() < nodeMutationChance) {
                this.removeCityObject(i);
                i--; // sonst würden wir ein Stadtobjekt überspringen
            }
        }

        // Knotenpunkte verschieben
        for(let i = 0; i < this.cityObjects.length; i++) {
            let obj = this.cityObjects[i];
            if(obj instanceof Node && Math.random() < moveChance) {
                obj.moveRandomly(maxMoveDelta);
            }
        }

        // Knotenpunkte erstellen
        for (var i = 0, stop = this.cityObjects.length; i < stop; i++) {
            let from = this.cityObjects[i];
            if (from.connection != null && Math.random() < nodeMutationChance) {
                let to = this.cityObjects[from.connection];
                // Node genau zwischen den anderen Stadtobjekten einfügen
                let dest = from.pos.add(to.pos).mul(1 / 2);
                let newNodeIndex = this.addNode(dest, from.connection);
                this.setConnection(i, newNodeIndex);
            }
        }

        // Neu verkabeln
        for (let i = 0, stop = this.cityObjects.length; i < stop; i++) {
            let from = this.cityObjects[i];
            if (from.connection != null && Math.random() < reconnectChance) {
                let to = this.cityObjects[from.connection];
                let unrelatedSet = Array.from(this.cityObjectsUnrelatedTo(i).keys());
                // wähle ein zufälliges Element aus unrelatedSet aus
                let reconnectTo = unrelatedSet[Math.floor(Math.random() * unrelatedSet.length)];
                from.connection = reconnectTo;
            }
        }
    }

    /**
     * Erstelle einen exakten Klon dieser Stadt.
     * @return der Klon
     */
    clone() {
        let clone = new City();
        clone.cityObjects = Array.from(this.cityObjects, obj => obj.clone());
        return clone;
    }
}