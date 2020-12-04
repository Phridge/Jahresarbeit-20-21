const sketch = () => {
    const print = console.log.bind(console)

    const height = 300;
    const widht = 500;
    const canvas = document.getElementById('canvas');
    const queue = []

    let city = new City([
        new Consumer(new Point(10, 10)), 
        new Consumer(new Point(100, 150)), 
        new Consumer(new Point(200, 10)), 
        new Node(new Point(10, 0)),
        new Node(new Point(10, 200)),
        new Consumer(new Point(200, 100)), 
        new Consumer(new Point(200, 200)), 
        new Consumer(new Point(300, 250)), 
        new Consumer(new Point(400, 100)),
    ]);
    city.connect(0, 3);
    city.connect(1, 3);
    city.connect(2, 3);
    city.connect(3, 4);
    city.connect(4, 5);
    city.connect(4, 6);
    city.connect(4, 7);
    city.connect(4, 8)

    let population = new Population(10, 0.1, 2, city);

    function animate() {
        requestAnimationFrame(animate);
        draw();
    }

    function draw() {
        while(queue.length > 0) { // dispatch all events
            queue.shift()(population);
        }

        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, widht, height);
        
        population.getFittest().draw(ctx);

        // print(population.getFittest().getFitness());
        population.nextPopulation();
    }

    canvas.addEventListener("click", (event) => {
        const clickPos = new Point(event.offsetX, event.offsetY)
        const obj = new Consumer(clickPos)
        queue.push(pop => {
            let best = pop.getFittest()
            best.addConnectedCityObject(obj)
            pop.repopulate(best)
        })
    }, false)

    animate()
};

document.addEventListener("DOMContentLoaded", sketch);