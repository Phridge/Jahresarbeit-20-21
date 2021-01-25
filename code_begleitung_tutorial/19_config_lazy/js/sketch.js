function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    let initialCity = new City();
    initialCity.addTransformer(new Position(300, 100)); // Index 0
    initialCity.addNode(new Position(420, 100), 0); // Index 1
    initialCity.addNode(new Position(170, 180), 0); // Index 2
    initialCity.addConsumer(new Position(100, 50), 2); // Index 3
    initialCity.addConsumer(new Position(400, 200), 1); // Index 4
    initialCity.addConsumer(new Position(50, 250), 2); // Index 5
    initialCity.addConsumer(new Position(450, 50), 1); // Index 6
    initialCity.addConsumer(new Position(250, 200), 2); // Index 7

    // das Konfigurationsobjekt, alle wichtigen Zahlen an einem Platz
    let populationConfig = {
        size: 20,
        maxMoveDelta: 5,
        moveChance: 3 / 100,
        nodeMutationChance: 2 / 100,
        reconnectChance: 3 / 100,
        nodePenalty: 5
    };

    let population = new Population(populationConfig, initialCity);

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

    // alles funktioniert so wie vorher... nur besser

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);