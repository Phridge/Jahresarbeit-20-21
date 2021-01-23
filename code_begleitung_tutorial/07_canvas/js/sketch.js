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

    // Das Canvas "zurücksetzen"
    renderer.clearRect(0, 0, width, height);

    // rotes Rechteck
    renderer.fillStyle = "#FF0000";
    renderer.fillRect(10, 50, 70, 40);

    // grüne Zickzack-Linien
    renderer.strokeStyle = "green";
    renderer.beginPath();
    renderer.moveTo(30, 30);
    renderer.lineTo(60, 120);
    renderer.lineTo(90, 30);
    renderer.lineTo(120, 120);
    renderer.moveTo(150, 30);
    renderer.lineTo(180, 120);
    renderer.stroke();

    // blauer Text
    renderer.fillStyle = "blue";
    renderer.font = "30px Arial";
    renderer.fillText("Hello there!", 300, 200);

}

document.addEventListener("DOMContentLoaded", sketch);