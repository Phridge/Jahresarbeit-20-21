const sketch = () => {
    const print = console.log.bind(console)

    const height = 300;
    const widht = 500;
    const canvas = document.getElementById('canvas');

    let city = new City([
        new Consumer(10, 10), 
        new Consumer(100, 150), 
        new Consumer(200, 10), 
        new Node(10, 0),
        new Node(10, 200),
        new Consumer(200, 100), 
        new Consumer(200, 200), 
        new Consumer(300, 250), 
        new Consumer(400, 100),
    ]);
    city.connect(city.cityObjects[0], city.cityObjects[3]);
    city.connect(city.cityObjects[1], city.cityObjects[3]);
    city.connect(city.cityObjects[2], city.cityObjects[3]);
    city.connect(city.cityObjects[3], city.cityObjects[4]);
    city.connect(city.cityObjects[4], city.cityObjects[5]);
    city.connect(city.cityObjects[4], city.cityObjects[6]);
    city.connect(city.cityObjects[4], city.cityObjects[7]);
    city.connect(city.cityObjects[4], city.cityObjects[8])

    let population = new Population(10, 0.1, 2, city);

    function animate() {
        requestAnimationFrame(animate);
        draw();
    }

    function draw() {
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, widht, height);
        
        population.getFittest().draw(ctx);

        // print(population.getFittest().getFitness());
        population.nextPopulation();
    }

    animate();
};

document.addEventListener("DOMContentLoaded", sketch);