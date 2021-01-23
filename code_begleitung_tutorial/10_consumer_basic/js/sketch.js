function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    // der Verbraucher bzw. Haus
    let position = new Position(200, 100);
    let consumer = new Consumer(position);

    // unsere Animationsroutine
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // einfach den Verbraucher zeichnen
        consumer.draw(ctx);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);