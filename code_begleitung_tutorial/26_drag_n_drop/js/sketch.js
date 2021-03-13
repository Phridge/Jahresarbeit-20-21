function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    let initialCity = new City();
    initialCity.addTransformer(new Position(300, 100)); // Index 0
    initialCity.addNode(new Position(420, 100), 0); // Index 1
    initialCity.addNode(new Position(170, 180), 0); // Index 2
    initialCity.addConsumer(new Position(100, 50), 2); // Index 3
    initialCity.addConsumer(new Position(400, 200), 1); // Index 4
    initialCity.addConsumer(new Position(50, 250), 2); // Index 5
    initialCity.addConsumer(new Position(450, 50), 1); // Index 6
    initialCity.addConsumer(new Position(250, 200), 2); // Index 7

    // Alle Konfigurationen, die für Population/City interessant sind
    let populationConfig = {
        size: 20,
        maxMoveDelta: 5,
        moveChance: 3 / 100,
        nodeMutationChance: 2 / 100,
        reconnectChance: 3 / 100,
        nodePenalty: 5,
        selectionBias: 1
    };

    // Status/Konfigurationen, die nichts mit Population/City zu tun haben
    let simulationState = {
        generationCount: 0,
        eps: 10, 
        nextPopulationRefresh: 0,
        isSimulating: true,
        // speichert Informationen zum momentanen Drag-Status
        isDragging: false
    };

    // allgemeine Zeichen-Konfigurationen für zentrale Kontrolle
    let drawConfig = {
        node: {
            width: 7,
            height: 7,
            color: '#000000'
        },
        consumer: {
            width: 20,
            height: 20,
            color: '#dfac20',
            houseOffset: new Position(0, -20)
        },
        transformer: {
            width: 20,
            height: 30,
            color: "#222222"
        },
        connection: {
            width: 2,
            color: "#000000"
        }
    };

    let population = new Population(populationConfig, initialCity);

    // um draw() auszulagern
    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    // einmal auf Canvas zeichnen um nicht neuen Animationsprozess zu starten
    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Zeichnen der besten Stadt
        let best = population.getFittest();
        best.draw(ctx, drawConfig);
        console.log(best.getFitness());

        // Daten in der Sidebar anzeigen
        document.getElementById('result-length').innerHTML = "Länge: " + Math.round(best.getLength()) + 'm';
        document.getElementById('result-generations').innerHTML = "Generation: " + simulationState.generationCount;
        document.getElementById('result-consumers').innerHTML = "Häuser: " + best.cityObjects.filter(obj => obj instanceof Consumer).length;
        document.getElementById('result-nodes').innerHTML = "Knoten: " + best.cityObjects.filter(obj => obj instanceof Node).length;
        document.getElementById("result-connections").innerHTML = "Verbindungen: " + (best.cityObjects.length - 1);

        // Epochen simulieren
        if (simulationState.isSimulating) {
            let timestamp = new Date().getTime();

            while (simulationState.nextPopulationRefresh < timestamp) {
                population.nextGeneration();

                simulationState.nextPopulationRefresh += 1000 / simulationState.eps;

                simulationState.generationCount++;
            }
        }

        // drag n drop
        if (simulationState.isDragging) {
            // dieser Teil des Programms synchronisiert die Position des Objektes
            // mit der Position im "isDragging" Objekt
            let target = simulationState.isDragging.targetObject;
            target.pos = simulationState.isDragging.currentPos.add(simulationState.isDragging.offset);
        }

    }

    // Funktion die das Starten der Simulation übernimmt
    function startSimulation() {
        simulationState.isSimulating = true;
        simulationState.nextPopulationRefresh = new Date().getTime();
    }

    // Funktion, die das Stoppen der Simulation übernimmt
    function stopSimulation() {
        simulationState.isSimulating = false;
    }

    // Übernimmt das Starten des Drag-Prozesses
    function startDragging(beginPos, offset, targetObject, targetCity) {
        let continueSimulating = simulationState.isSimulating;
        if (simulationState.isSimulating) {
            stopSimulation();
        }

        // "isDragging" ist nicht mehr null, sondern nun ein Objekt
        simulationState.isDragging = {
            // Position des Objektes
            currentPos: beginPos,
            // Abstand Klick - Position des Objektes
            offset,
            // das Objekt
            targetObject,
            // die Stadt
            targetCity,
            // ob nach dem Drop die Simulation weitergehen soll
            continueSimulating,
        };
    }

    // Übernimmt das Stoppen des Drag-Prozesses
    function stopDragging() {
        let continueSimulating = simulationState.isDragging.continueSimulating;

        population.repopulate(simulationState.isDragging.targetCity);
        simulationState.isDragging = null;

        if (continueSimulating) {
            startSimulation();
        }
    }

    // Canvas EventListeners

    // Ein "Klick" entspricht Taste runter-Taste rauf mit kurzer Verzögerung 
    canvas.addEventListener("click", event => {
        if (simulationState.isDragging) {
            // falls auf ein Stadtobjekt geklickt wurde (Drag n Drop initiiert)
            // wird es sofort wieder losgelassen
            stopDragging();
        } else {
            // es wurde nicht auf ein Stadtobjekt geklickt, neues Objekt hinzufügen
            let clickPos = new Position(event.offsetX, event.offsetY);
            let best = population.getFittest();
            
            best.addConsumer(clickPos, 0);
            population.repopulate(best);

            draw();
        }
    });

    // Wenn die Maustaste gedrückt wird
    canvas.addEventListener("mousedown", event => {
        let downPos = new Position(event.offsetX, event.offsetY);

        // Das angeklickte Stadtobjekt der besten Stadt wird gesucht
        let targetCity = population.getFittest();
        let targetObject = targetCity.getCityObjectNear(downPos, drawConfig);

        // falls ein objekt gefunden wurde...
        if (targetObject) {
            // drag n drop initiiert
            startDragging(
                targetObject.pos,
                targetObject.pos.sub(downPos),
                targetObject,
                targetCity
            );
        }
    });

    // Wenn sich die maus über das Canvas bewegt...
    canvas.addEventListener("mousemove", event => {
        // ... und das Programm im drag n drop Modus ist...
        if (simulationState.isDragging) {
            // ... wird die gewünschte Position des Stadtobjektes auf neustem Stand gehalten
            let currentPos = new Position(event.offsetX, event.offsetY);
            simulationState.isDragging.currentPos = currentPos;
        }
    });

    // Wenn die Maus das Canvas verlässt...
    canvas.addEventListener("mouseout", () => {
        if (simulationState.isDragging) {
            // wird dass Stadtobjekt "abgesetzt"
            stopDragging();
        }
    });

    // Buttons EventListeners

    // Start/Stop
    document.getElementById('action-simulate').addEventListener('click', event => {
        if (simulationState.isSimulating) {
            event.target.innerHTML = "starten";
            stopSimulation(); // so ist es besser
        } else {
            event.target.innerHTML = "stoppen";
            startSimulation();
        }
    });

    // Reset
    document.getElementById('action-reset').addEventListener('click', event => {
        population.repopulate(initialCity);
        simulationState.generationCount = 0;
    });

    // Sidebar EventListeners

    // Populationsgröße
    document.getElementById('action-set-populations-size').value = populationConfig.size;
    document.getElementById('action-set-populations-size').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value > 1) {
            populationConfig.size = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 2;
        }
    });

    // Knotenpunkt-bewege-Chance
    document.getElementById('action-set-position-mutation-rate').value = populationConfig.moveChance;
    document.getElementById('action-set-position-mutation-rate').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value <= 1 && value >= 0) {
            populationConfig.moveChance = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = (value > 1) ? 1 : 0;
        }
    });

    // Bewegungsmaximum bei Knotenpunkt-Bewegung
    document.getElementById('action-set-position-mutation-max').value = populationConfig.maxMoveDelta;
    document.getElementById('action-set-position-mutation-max').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value >= 1) {
            populationConfig.maxMoveDelta = value;
            population.updateConfig(populationConfig);
        } else {
            value = 1;
        }
    });

    // Neuverbindungschance
    document.getElementById('action-set-reconnect-chance').value = populationConfig.reconnectChance;
    document.getElementById('action-set-reconnect-chance').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value <= 1 && value >= 0) {
            populationConfig.reconnectChance = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = (value > 1) ? 1 : 0;
        }
    });

    // Knotenpunkkosten
    document.getElementById('action-set-node-penalty').value = populationConfig.nodePenalty;
    document.getElementById('action-set-node-penalty').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value >= 0) {
            populationConfig.nodePenalty = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 0;
        }
    });

    // Knotenpunktmutationchance
    document.getElementById('action-set-node-mutation-rate').value = populationConfig.nodeMutationChance;
    document.getElementById('action-set-node-mutation-rate').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value >= 0) {
            populationConfig.nodeMutationChance = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 0;
        }
    });

    // Passt die Hintergrundfarbe eines sliders entsprechend seiner "value" an
    // -2 => 0 => 2
    // rot => grau => grün
    function updateSelectionBiasColor(slider) {
        let min = Number(slider.min);
        let max = Number(slider.max);
        let val = Number(slider.value);

        if (val < 0) {
            // rot
            slider.style.background = "hsl(12, " + (Math.abs(val) / Math.abs(min)) * 100 + "%, 70%)";
        } else if (val == 0) {
            // grau
            slider.style.background = "hsl(0, 0%, 70%)";
        } else {
            // grün
            slider.style.background = "hsl(120, " + (Math.abs(val) / Math.abs(max)) * 100 + "%, 70%)";
        }
    }

    // Selektion-Tendenz
    document.getElementById('action-set-selection-bias').value = populationConfig.selectionBias;
    document.getElementById('action-set-selection-bias').addEventListener("input", event => {
        populationConfig.selectionBias = Number(event.target.value);
        population.updateConfig(populationConfig);
        updateSelectionBiasColor(event.target);
    });
    updateSelectionBiasColor(document.getElementById('action-set-selection-bias'));

    // Epochen pro Sekunde
    document.getElementById('action-set-generations-per-second').value = simulationState.eps;
    document.getElementById('action-set-generations-per-second').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value >= 1) {
            simulationState.eps = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 1;
        }
    });

    requestAnimationFrame(animate);

    // damit die Simulation auch wirklich startet
    startSimulation();
}

document.addEventListener("DOMContentLoaded", sketch);