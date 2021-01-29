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
        isSimulating: true
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
        best.draw(ctx);
        console.log(best.getFitness());

        // Daten in der Sidebar anzeigen
        document.getElementById('result-length').innerHTML = "Länge: " + Math.round(best.getLength()) + 'm';
        document.getElementById('result-generations').innerHTML = "Generation: " + simulationState.generationCount;
        document.getElementById('result-consumers').innerHTML = "Häuser: " + best.cityObjects.filter(obj => obj instanceof Consumer).length;
        document.getElementById('result-nodes').innerHTML = "Knoten: " + best.cityObjects.filter(obj => obj instanceof Node).length;
        document.getElementById("result-connections").innerHTML = "Verbindungen: " + (best.cityObjects.length - 1);

        if (simulationState.isSimulating) {

            // Nächste Epoche simulieren
            population.nextGeneration();

            // Epoche fertig
            simulationState.generationCount += 1;
        }
    }

    // Canvas EventListeners

    canvas.addEventListener("click", event => {
        
        // Klickposition
        let clickPos = new Position(event.offsetX, event.offsetY);
        let best = population.getFittest();
        
        // Konsument hinzufügen und Stadt erneuern
        best.addConsumer(clickPos, 0);
        population.repopulate(best);

        // wir wollen die Änderungen sofort sehen
        draw();
    }, false);

    // Buttons EventListeners

    // Start/Stop
    document.getElementById('action-simulate').addEventListener('click', event => {
        if (simulationState.isSimulating) {
            event.target.innerHTML = "starten";
            simulationState.isSimulating = false;
        } else {
            event.target.innerHTML = "stoppen";
            simulationState.isSimulating = true;
        }
    }, false);

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

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);