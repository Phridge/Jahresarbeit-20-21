const sketch = () => {
    const widht = 500;
    const height = 300;
    const canvas = document.getElementById('canvas');

    const simulationState = {
        isSimulating: true,
    }

    function draw() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, widht, height);

        ctx.fillStyle = '#505050';
        ctx.fillRect(40, 40, 100, 100);
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