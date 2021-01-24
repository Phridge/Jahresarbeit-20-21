function sketch() {
    let canvas = document.getElementById("canvas");

    let width = 500, height = 300;
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    let transformer = new Transformer(new Position(300, 100));
    let consumer1 = new Consumer(new Position(100, 50 ));
    let consumer2 = new Consumer(new Position(400, 200));
    let consumer3 = new Consumer(new Position(50,  250));
    let consumer4 = new Consumer(new Position(450, 50));
    let node1 = new Node(new Position(420, 100));
    let node2 = new Node(new Position(170, 180));

    let city = new City();

    city.addCityObject(transformer); // Index 0
    city.addCityObject(consumer1); // Index 1
    city.addCityObject(consumer2); // Index 2
    city.addCityObject(consumer3); // Index 3
    city.addCityObject(consumer4); // Index 4
    // Knotenpunkte kommen hinzu
    city.addCityObject(node1); // Index 5
    city.addCityObject(node2); // Index 6

    // die Stadt wird anders verkabelt
    city.addConnection(1, 6);
    city.addConnection(3, 6);
    city.addConnection(2, 5);
    city.addConnection(4, 5);
    city.addConnection(5, 0);
    city.addConnection(6, 0);

    function animate() {
        ctx.clearRect(0, 0, width, height);

        city.draw(ctx);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", sketch);