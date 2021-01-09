const sketch = () => {
    
    const height = 300;
    const width = 500;
    const canvas = document.getElementById('canvas');

    let initialCity = new City()
    initialCity.addTransformer(new Position(250, 150), null)
    initialCity.addNode(new Position(10, 100), 0)
    initialCity.addNode(new Position(400, 50), 1)
    initialCity.addConsumer(new Position(100, 150), 1) 
    initialCity.addConsumer(new Position(20, 20), 1) 
    initialCity.addConsumer(new Position(200, 20), 1) 
    initialCity.addConsumer(new Position(200, 100), 2) 
    initialCity.addConsumer(new Position(200, 200), 2) 
    initialCity.addConsumer(new Position(300, 250), 2) 
    initialCity.addConsumer(new Position(400, 100), 2)

    let simulationState = {
        simulate: true,
        generationCount: 0,
        eps: 10,
        isDragging: null,
    }

    let populationConfig = {
        size: 20,
        moveChance: 0.6,
        maxMoveDelta: 5,
        reconnectChance: 0.05,
        nodePenalty: 5,
        nodeMutationChance: 0.02,
        selectionBias: 1,
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
        transformer: {
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

        let fittest = population.getFittest()
        fittest.draw(ctx, drawConfig)

        document.getElementById('result-length').innerHTML = "Länge: " + Math.round(fittest.getLength()) + 'm';
        document.getElementById('result-generations').innerHTML = "Generation: " + simulationState.generationCount;
        document.getElementById('result-consumers').innerHTML = "Häuser: " + fittest.cityObjects.filter(obj => obj instanceof Consumer).length;
        document.getElementById('result-nodes').innerHTML = "Knoten: " + fittest.cityObjects.filter(obj => obj instanceof Node).length;
        document.getElementById("result-connections").innerHTML = "Verbindungen: " + (fittest.cityObjects.length - 1)

        // console.log(population.getFittest())
        
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
            let best = population.getFittest();
            best.addConsumer(clickPos, 0)
            population.repopulate(best);
            draw()
        }
    }, false);

    canvas.addEventListener("mousedown", event => {
        let downPos = new Position(event.offsetX, event.offsetY)
        let targetCity = population.getFittest()
        let targetObject = targetCity.getCityObjectNear(downPos, drawConfig)
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
        let value = Number(event.target.value)
        if(value > 1) {
            populationConfig.size = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 2;
        }
    });

    document.getElementById('action-set-position-mutation-rate').value = populationConfig.moveChance;
    document.getElementById('action-set-position-mutation-rate').addEventListener('input', event => {
        let value =Number(event.target.value)
        if(value <= 1 && value >= 0) {
            populationConfig.moveChance = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = (value > 1) ? 1 : 0;
        }
    });

    document.getElementById('action-set-position-mutation-max').value = populationConfig.maxMoveDelta;
    document.getElementById('action-set-position-mutation-max').addEventListener('input', event => {
        let value = Number(event.target.value)
        if(value >= 1) {
            populationConfig.maxMoveDelta = value;
            population.updateConfig(populationConfig);
        } else {
            value = 1;
        }
    });

    document.getElementById('action-set-reconnect-chance').value = populationConfig.reconnectChance;
    document.getElementById('action-set-reconnect-chance').addEventListener('input', event => {
        let value = Number(event.target.value)
        if(value <= 1 && value >= 0) {
            populationConfig.reconnectChance = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = (value > 1) ? 1 : 0;
        }
    });
    
    document.getElementById('action-set-generations-per-second').value = simulationState.eps;
    document.getElementById('action-set-generations-per-second').addEventListener('input', event => {
        let value = Number(event.target.value)
        if (value >= 1) {
            simulationState.eps = value;
            population.updateConfig(populationConfig);
        } else {
            event.target.value = 1;
        }
    });

    document.getElementById('action-set-node-penalty').value = populationConfig.nodePenalty;
    document.getElementById('action-set-node-penalty').addEventListener('input', event => {
        let value = Number(event.target.value)
        if (value >= 0) {
            populationConfig.nodePenalty = value;
            population.updateConfig(populationConfig);
        }
    });

    document.getElementById('action-set-node-mutation-rate').value = populationConfig.nodeMutationChance;
    document.getElementById('action-set-node-mutation-rate').addEventListener('input', event => {
        let value = Number(event.target.value)
        if (value >= 0) {
            populationConfig.nodeMutationChance = value
            population.updateConfig(populationConfig)
        }
    });

    function updateSelectionBiasColor(slider) {
        let min = Number(slider.min)
        let max = Number(slider.max)
        let val = Number(slider.value)
        if(val < 0) {
            slider.style.background = "hsl(12, " + (Math.abs(val) / Math.abs(min)) * 100 + "%, 70%)"
        } else if(val == 0) {
            slider.style.background = "hsl(0, 0%, 70%)"
        } else {
            slider.style.background = "hsl(120, " + (Math.abs(val) / Math.abs(max)) * 100 + "%, 70%)"
        }
    }

    document.getElementById('action-set-selection-bias').value = populationConfig.selectionBias;
    document.getElementById('action-set-selection-bias').addEventListener("input", event => {
        populationConfig.selectionBias = Number(event.target.value);
        population.updateConfig(populationConfig)
        updateSelectionBiasColor(event.target)
    });
    updateSelectionBiasColor(document.getElementById('action-set-selection-bias'))

    requestAnimationFrame(draw)
    startSimulation()
};

document.addEventListener("DOMContentLoaded", sketch)