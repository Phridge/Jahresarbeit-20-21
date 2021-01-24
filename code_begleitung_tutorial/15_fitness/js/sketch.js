function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");


    let city = new City();

    city.addCityObject(new Transformer(new Position(300, 100))); // Index 0
    city.addCityObject(new Consumer(new Position(100, 50))); // Index 1
    city.addCityObject(new Consumer(new Position(400, 200))); // Index 2
    city.addCityObject(new Consumer(new Position(50, 250))); // Index 3
    city.addCityObject(new Consumer(new Position(450, 50))); // Index 4
    city.addCityObject(new Node(new Position(420, 100))); // Index 5
    city.addCityObject(new Node(new Position(170, 180))); // Index 6

    city.addConnection(1, 6);
    city.addConnection(3, 6);
    city.addConnection(2, 5);
    city.addConnection(4, 5);
    city.addConnection(5, 0);
    city.addConnection(6, 0);

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        city.mutate();
        city.draw(ctx);

        // Ausgabe der Fitness in der Konsole
        console.log(city.getFitness());

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);