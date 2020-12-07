const sketch = () => {
    const widht = 500;
    const height = 300;
    const canvas = document.getElementById('canvas');

    const city = new City([
        new Consumer(new Position(100, 100)),
        new Consumer(new Position(300, 150)),
        new Node(new Position(200, 150)),
    ]);
    city.connect(0, 2);
    city.connect(1, 2);

    const simulationState = {
        isSimulating: true,
    }

    function draw() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, widht, height);

        city.draw(ctx);
    }

    function startSimulation() {
        simulationState.isSimulating = true;
        requestAnimationFrame(draw);
    }

    function stopSimulation() {
        simulationState.isSimulating = false;
    }

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
        draw();
    });

    startSimulation();
}

document.addEventListener('DOMContentLoaded', sketch);