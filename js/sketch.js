const sketch = () => {
    
    const height = 300;
    const width = 500;
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
        eps: 20,
        isDragging: null,
    }

    let populationConfig = {
        size: 20,
        moveChance: 0.6,
        maxMoveDelta: 5,
        reconnectChance: 0.05,
        nodePenalty: 5,
        connectionMutateChance: 0.02,
    }

    let drawConfig = {
        node: {
            width: 7,
            height: 7,
            color: '#000000',
        },
        consumer: {
            width: 20,
            height: 20,
            color: '#dfac20',
        },
        dispatcher: {
            width: 20,
            height: 30,
            color: "#222222"
        },
        connection: {
            width: 2,
            color: "#000000"
        },
    }

    let population = new Population(populationConfig, initialCity);


    var nextPopulationRefresh = +Infinity
    function draw() {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        population.getFittest().draw(ctx, drawConfig);
        document.getElementById('result-length').innerHTML = "Länge: " + Math.round(population.getFittest().getLength()) + 'm';
        document.getElementById('result-generations').innerHTML = "Generation: " + simulationState.generationCount;
        document.getElementById('result-consumers').innerHTML = "Häuser: " + population.getFittest().cityObjects.filter(obj => obj instanceof Consumer).length;
        document.getElementById('result-nodes').innerHTML = "Knoten: " + population.getFittest().cityObjects.filter(obj => obj instanceof Node).length;
        document.getElementById('result-connections').innerHTML = "Verbindungen: " + population.getFittest().connections.length;

        //print(population.getFittest().getFitness(populationConfig));
        
        if(simulationState.isSimulating) {
            let timestamp = new Date().getTime()
            while(nextPopulationRefresh < timestamp) {
                population.nextPopulation();
                nextPopulationRefresh += 1000 / simulationState.eps
                simulationState.generationCount++;
            }
        }
        
        if(simulationState.isDragging) {
            let target = simulationState.isDragging.targetObject
            target.pos = simulationState.isDragging.currentPos.add(simulationState.isDragging.offset)
        }

        requestAnimationFrame(draw)
    }

    function startSimulation() {
        simulationState.isSimulating = true
        nextPopulationRefresh = new Date().getTime()
    }

    function stopSimulation() {
        simulationState.isSimulating = false
    }

    function startDragging(beginPos, offset, targetObject, targetCity) {
        let continueSimulating = simulationState.isSimulating
        if(simulationState.isSimulating) {
            stopSimulation()
        }

        simulationState.isDragging = {
            currentPos: beginPos,
            offset,
            targetObject,
            targetCity,
            continueSimulating,
        }
    }

    function stopDragging() {
        let continueSimulating = simulationState.isDragging.continueSimulating

        population.repopulate(simulationState.isDragging.targetCity)
        simulationState.isDragging = null

        if (continueSimulating) {
            startSimulation()
        }
    }

    canvas.addEventListener("click", event => {
        if(simulationState.isDragging) {
            // dropped the city object previously dragged
            stopDragging()
        } else {
            // clicked
            let clickPos = new Position(event.offsetX, event.offsetY);
            let obj = new Consumer(clickPos);
            let best = population.getFittest();
            best.addConnectedCityObject(obj);
            population.repopulate(best);
            draw()
        }
    }, false);

    canvas.addEventListener("mousedown", event => {
        let downPos = new Position(event.offsetX, event.offsetY)
        let targetCity = population.getFittest()
        let targetObject = targetCity.getCityObjectNear(downPos)
        if(targetObject) {
            // we're dragging something now
            startDragging(
                targetObject.pos,
                targetObject.pos.sub(downPos),
                targetObject,
                targetCity
            );
        }
    })

    canvas.addEventListener("mousemove", event => {
        if(simulationState.isDragging) {
            let currentPos = new Position(event.offsetX, event.offsetY)
            simulationState.isDragging.currentPos = currentPos
        }
    })

    canvas.addEventListener("mouseout", () => {
        if(simulationState.isDragging) {
            stopDragging()
        }
    })

    document.getElementById('action-simulate').addEventListener('click', event => {
        if(simulationState.isSimulating) {
            event.target.innerHTML = "starten";
            stopSimulation()
        } else {
            event.target.innerHTML = "stoppen";
            startSimulation()
        }
    }, false);

    document.getElementById('action-reset').addEventListener('click', event => {
        population.repopulate(initialCity);
        simulationState.generationCount = 0;
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
    
    document.getElementById('action-set-generations-per-second').value = simulationState.eps;
    document.getElementById('action-set-generations-per-second').addEventListener('input', event => {
        if (event.target.value >= 1) {
            simulationState.eps = event.target.value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 1;
        }
    });

    document.getElementById('action-set-node-penalty').value = populationConfig.nodePenalty;
    document.getElementById('action-set-node-penalty').addEventListener('input', event => {
        if (event.target.value >= 0) {
            populationConfig.nodePenalty = event.target.value;
            population.updateConfig(populationConfig);
        }
    });

    document.getElementById('action-set-node-mutation-rate').value = populationConfig.connectionMutateChance;
    document.getElementById('action-set-node-mutation-rate').addEventListener('input', event => {
        if (event.target.value >= 0) {
            populationConfig.connectionMutateChance = event.target.value;
            population.updateConfig(populationConfig);
        }
    });

    requestAnimationFrame(draw)
    startSimulation()
};

document.addEventListener("DOMContentLoaded", sketch);