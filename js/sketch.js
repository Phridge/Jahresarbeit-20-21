const sketch = () => {
    const print = console.log.bind(console); //only for debugging

    const height = 300;
    const widht = 500;
    const canvas = document.getElementById('canvas');

    let initialCity = new City([
        new Consumer(new Position(100, 150)), 
        new Consumer(new Position(20, 20)), 
        new Consumer(new Position(200, 20)), 
        new Node    (new Position(10, 100)),
        new Node    (new Position(400, 50)),
        new Consumer(new Position(200, 100)), 
        new Consumer(new Position(200, 200)), 
        new Consumer(new Position(300, 250)), 
        new Consumer(new Position(400, 100)),
    ]);
    initialCity.connect(0, 3)
    initialCity.connect(1, 3)
    initialCity.connect(2, 3)
    initialCity.connect(3, 4)
    initialCity.connect(4, 5)
    initialCity.connect(4, 6)
    initialCity.connect(4, 7)
    initialCity.connect(4, 8)

    let simulationState = {
        simulate: true,
        generationCount: 0,
    }

    let populationConfig = {
        size: 100,
        moveChance: 0.6,
        maxMoveDelta: 10,
        reconnectChance: 0.05,
    }

    let population = new Population(populationConfig, initialCity);



    var nextPopulationRefresh = performance.now();

    function draw(timestamp) {
        // dispatch all events
        while(queue.length > 0) {
            queue.shift()(population);
        }

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, widht, height);
        population.getFittest().draw(ctx);
        document.getElementById('result-length').innerHTML = "Länge: " + Math.round(population.getFittest().getLength()) + 'm';
        document.getElementById('result-generations').innerHTML = "Generation: " + simulationState.generationCount;
        document.getElementById('result-consumers').innerHTML = "Häuser: " + population.getFittest().cityObjects.filter(obj => obj instanceof Consumer).length;
        document.getElementById('result-nodes').innerHTML = "Knoten: " + population.getFittest().cityObjects.filter(obj => obj instanceof Node).length;
        document.getElementById('result-connections').innerHTML = "Verbindungen: " + population.getFittest().connections.length;

        //print(population.getFittest().getFitness());
        
        while (simulationState.simulate && timestamp > nextPopulationRefresh) {
            population.nextPopulation();
            nextPopulationRefresh += 1000 / config.eps
            simulationState.generationCount++;
        }

        requestAnimationFrame(draw)
    }

    canvas.addEventListener("click", event => {
        const clickPos = new Position(event.offsetX, event.offsetY);
        const obj = new Consumer(clickPos);
        let best = population.getFittest();
        best.addConnectedCityObject(obj);
        population.repopulate(best);
        // draw(false);
    }, false);

    document.getElementById('action-simulate').addEventListener('click', event => {
        simulationState.simulate = !simulationState.simulate;
        if(simulationState.simulate) {
            // animate();
            event.target.innerHTML = "anhalten";
        } else {
            event.target.innerHTML = "starten";
        }
    });

    document.getElementById('action-reset').addEventListener('click', event => {
        population.repopulate(initialCity);
        // draw(false);
    });

    document.getElementById('action-set-populations-size').value = populationConfig.size;
    document.getElementById('action-set-populations-size').addEventListener('input', event => {
        if(event.target.value > 1) {
            populationConfig.size = event.target.value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 2;
        }
    });

    document.getElementById('action-set-position-mutation-rate').value = populationConfig.moveChance;
    document.getElementById('action-set-position-mutation-rate').addEventListener('input', event => {
        if(event.target.value <= 1 && event.target.value >= 0) {
            populationConfig.moveChance = event.target.value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = (event.target.value > 1) ? 1 : 0;
        }
    });

    document.getElementById('action-set-position-mutation-max').value = populationConfig.maxMoveDelta;
    document.getElementById('action-set-position-mutation-max').addEventListener('input', event => {
        if(event.target.value >= 1) {
            populationConfig.maxMoveDelta = event.target.value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 1;
        }
    });

    document.getElementById('action-set-connections-mutation-rate').value = populationConfig.reconnectChance;
    document.getElementById('action-set-connections-mutation-rate').addEventListener('input', event => {
        if(event.target.value <= 1 && event.target.value >= 0) {
            populationConfig.reconnectChance = event.target.value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = (event.target.value > 1) ? 1 : 0;
        }
    });
    

    requestAnimationFrame(draw)
};

document.addEventListener("DOMContentLoaded", sketch);