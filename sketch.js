(() => {

    const height = 300;
    const widht = 500;

    let x = 0;
    let speed = 3;

    function animate() {
        requestAnimationFrame(animate);
        x += speed;
        if(x >= 500) x = 0;
        draw();
    }

    function draw() {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 500, 300);

        ctx.fillStyle = '#dfac20';
        ctx.fillRect(x, 10, 40, 40);
    }

    document.addEventListener("DOMContentLoaded", () => {
        animate();
    });

})();