const sketch = () => {
    const print = console.log.bind(console); //only for debugging

    const height = 300;
    const widht = 500;
    const canvas = document.getElementById('canvas');
    const queue = [];

    let city = new City([
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
    city.connect(0, 3);
    city.connect(1, 3);
    city.connect(2, 3);
    city.connect(3, 4);
    city.connect(4, 5);
    city.connect(4, 6);
    city.connect(4, 7);
    city.connect(4, 8);

    let simulationConfig = {
        simulate: true,
    }

    let populationConfig = {
        size: 10,
        moveChance: 0.1,
        maxMoveDelta: 2,
        reconnectChance: 0.05,
    }

    let population = new Population(populationConfig, city);

    function animate() {
        requestAnimationFrame(animate);
        if(simulationConfig.simulate) draw();
    }
 
    function draw() {
        // dispatch all event actions stored in queue
        while(queue.length > 0) {
            queue.shift()(population);
        }

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, widht, height);
        
        population.getFittest().draw(ctx);
        document.getElementById('sidebar--resultLength').innerHTML = "Länge: " + Math.round(population.getFittest().getLength()) + 'm';
        population.nextPopulation();
    }

    canvas.addEventListener("click", event => {
        const clickPos = new Position(event.offsetX, event.offsetY)
        const obj = new Consumer(clickPos)
        queue.push(pop => {
            let best = pop.getFittest()
            best.addConnectedCityObject(obj)
            pop.repopulate(best)
        })
    }, false);

    document.getElementById('sidebar--simulate').addEventListener('click', event => {
        simulationConfig.simulate = !simulationConfig.simulate;
        if(simulationConfig.simulate) {
            animate();
            event.target.innerHTML = "anhalten";
        } else {
            event.target.innerHTML = "starten";
        }
    }, false);

    document.getElementById('sidebar--reset').addEventListener('click', event => {
        document.getElementById('sidebar--simulate').innerHTML = "anhalten";
        sketch();
    }, false);

    animate();
    draw();
};

document.addEventListener("DOMContentLoaded", sketch);