const sketch = () => {
    const widht = 500;
    const height = 300;
    const canvas = document.getElementById('canvas');

    const consumerPosition = new Position(100, 100);
    const consumer = new Consumer(consumerPosition);

    const simulationState = {
        isSimulating: true,
    }

    function draw() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, widht, height);

        consumer.draw(ctx);
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