const sketch = () => {
    const widht = 500;
    const height = 300;
    const canvas = document.getElementById('canvas');

    const consumerPosition = new Position(100, 100);
    const consumer = new Consumer(consumerPosition);

    const nodePosition = new Position(100, 200);
    const node = new Node(nodePosition);

    const city = new City([
        consumer,
        node
    ]);
    city.connect(0, 1);

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

    startSimulation();
}

document.addEventListener('DOMContentLoaded', sketch);