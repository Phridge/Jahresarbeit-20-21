function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    // unsere Stadtobjekte
    let consumer1 = new Consumer(new Position(100, 50 ));
    let consumer2 = new Consumer(new Position(400, 200));
    let consumer3 = new Consumer(new Position(50,  250));
    let consumer4 = new Consumer(new Position(450, 50));
    let transformer = new Transformer(new Position(300, 100));

    // die Stadt
    let city = new City();

    // Stadtobjekte hinzugfügen/registrieren
    city.addCityObject(transformer); // Index 0
    city.addCityObject(consumer1); // Index 1
    city.addCityObject(consumer2); // Index 2
    city.addCityObject(consumer3); // Index 3
    city.addCityObject(consumer4); // Index 4

    // Verbindungen auch ...
    city.addConnection(0, 1);
    city.addConnection(0, 2);
    city.addConnection(0, 3);
    city.addConnection(0, 4);
    


    function animate() {
        ctx.clearRect(0, 0, width, height);

        // ... und einfach die Stadt zeichnen
        city.draw(ctx);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);