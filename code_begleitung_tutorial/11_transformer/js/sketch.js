function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    // die Verbraucher ...
    let consumer1 = new Consumer(new Position(100, 50));
    let consumer2 = new Consumer(new Position(400, 200));

    // ... und der Transformer
    let transformer = new Transformer(new Position(300, 100));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // zuerst die Verbindungen zeichnen
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();

        // erste Verbindung
        ctx.moveTo(transformer.pos.x, transformer.pos.y);
        ctx.lineTo(consumer1.pos.x, consumer1.pos.y);
        // zweite Verbindung
        ctx.moveTo(transformer.pos.x, transformer.pos.y);
        ctx.lineTo(consumer2.pos.x, consumer2.pos.y);

        // fertig
        ctx.stroke();

        // jetzt Konsumenten und Transformer
        transformer.draw(ctx);
        consumer1.draw(ctx);
        consumer2.draw(ctx);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);