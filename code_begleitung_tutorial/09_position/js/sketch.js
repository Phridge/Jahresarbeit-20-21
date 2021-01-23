function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    // diesmal genannt "ctx", weniger zu schreiben
    let ctx = canvas.getContext("2d");

    // veränderliche Werte der bewegten Box
    let position = new Position(200, 100);
    let direction = 1;
    let speed = 3;
    let boxWidth = 50;
    let boxHeight = 50;

    // unsere Animationsroutine
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Boxwerte berechnen
        let movement = speed * direction;
        position = position.add(new Position(movement, 0));
        
        // wenn wir gegen eine Wand fahren, umdrehen
        if(position.x + boxWidth > width || position.x < 0) {
            direction = -direction;
        }

        // Box zeichnen
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 5;
        ctx.strokeRect(position.x, position.y, boxWidth, boxHeight);


        // nächster Frame
        requestAnimationFrame(animate);
    }

    // erster Frame
    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);