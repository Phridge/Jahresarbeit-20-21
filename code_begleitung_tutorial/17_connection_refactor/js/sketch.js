function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    // die "Ausgangsstadt"
    let initialCity = new City();
    initialCity.addCityObject(new Transformer(new Position(300, 100))); // Index 0
    initialCity.addCityObject(new Consumer(new Position(100, 50))); // Index 1
    initialCity.addCityObject(new Consumer(new Position(400, 200))); // Index 2
    initialCity.addCityObject(new Consumer(new Position(50, 250))); // Index 3
    initialCity.addCityObject(new Consumer(new Position(450, 50))); // Index 4
    initialCity.addCityObject(new Node(new Position(420, 100))); // Index 5
    initialCity.addCityObject(new Node(new Position(170, 180))); // Index 6
    initialCity.addConnection(1, 6);
    initialCity.addConnection(3, 6);
    initialCity.addConnection(2, 5);
    initialCity.addConnection(4, 5);
    initialCity.addConnection(5, 0);
    initialCity.addConnection(6, 0);

    // die Population mit Anfangs 20x der selben Ausgangsstadt
    let population = new Population(initialCity, 20);

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Epoche simulieren
        population.nextGeneration();

        // Zeichnen der besten Stadt
        let best = population.getFittest();
        best.draw(ctx);
        console.log(best.getFitness());

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);