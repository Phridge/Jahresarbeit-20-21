function sketch() {
    // DOM Node
    let canvas = document.getElementById("canvas");

    // Breite und Höhe des Canvas
    let width = 500, height = 300;

    // Werte dem Canvas mitteilen
    canvas.width = width;
    canvas.height = height;

    // den "Pinsel" anfordern
    let renderer = canvas.getContext("2d");

    // unsere Animationsroutine
    function animate() {
        renderer.clearRect(0, 0, width, height);

        // Boxwerte berechnen
        let anchorX = width / 2;
        let anchorY = height / 2;
        let boxWidth = 200;
        let boxHeight = 100;
        let randomOffsetX = Math.random() * 10;
        let randomOffsetY = Math.random() * 5;
        let boxX = anchorX - boxWidth / 2;
        let boxY = anchorY - boxHeight / 2;

        // Box Zeichnen
        renderer.fillStyle = "purple";
        renderer.fillRect(boxX + randomOffsetX, boxY + randomOffsetY, boxWidth, boxHeight);

        // nächster Frame
        requestAnimationFrame(animate);
    }

    // erster Frame
    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);