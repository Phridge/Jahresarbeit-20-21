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

    let populationConfig = {
        size: 20,
        maxMoveDelta: 5,
        moveChance: 3 / 100,
        nodeMutationChance: 2 / 100,
        reconnectChance: 3 / 100,
        nodePenalty: 5,
    };

    // Zählt die Zahl der simulierten Epochen
    let generationCount = 0;

    let population = new Population(populationConfig, initialCity);

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Epoche simulieren
        population.nextGeneration();

        // Daten in der Sidebar anzeigen
        document.getElementById('result-length').innerHTML = "Länge: " + Math.round(fittest.getLength()) + 'm';
        document.getElementById('result-generations').innerHTML = "Generation: " + generationCount;
        document.getElementById('result-consumers').innerHTML = "Häuser: " + fittest.cityObjects.filter(obj => obj instanceof Consumer).length;
        document.getElementById('result-nodes').innerHTML = "Knoten: " + fittest.cityObjects.filter(obj => obj instanceof Node).length;
        document.getElementById("result-connections").innerHTML = "Verbindungen: " + (fittest.cityObjects.length - 1);

        // Zeichnen der besten Stadt
        let best = population.getFittest();
        best.draw(ctx);
        console.log(best.getFitness());

        // Epoche fertig
        generationCount += 1;

        requestAnimationFrame(animate);
    }

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
        }
    });

    // Knotenpunktmutationchance
    document.getElementById('action-set-node-mutation-rate').value = populationConfig.nodeMutationChance;
    document.getElementById('action-set-node-mutation-rate').addEventListener('input', event => {
        let value = Number(event.target.value);
        if (value >= 0) {
            populationConfig.nodeMutationChance = value;
            population.updateConfig(populationConfig);
        }
    });

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);