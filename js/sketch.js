const height = 300;
const widht = 500;

let city = new City([
    new Consumer(10, 10), 
    new Consumer(100, 100), 
    new Consumer(200, 10), 
    new Node(0, 0),
]);
city.conntect(city.cityObjects[0], city.cityObjects[3]);
city.conntect(city.cityObjects[1], city.cityObjects[3]);
city.conntect(city.cityObjects[2], city.cityObjects[3]);


let population = new Population(10, 0.1, 2, city);

function animate() {
    requestAnimationFrame(animate);
    draw();
}

function draw() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, widht, height);
    
    population.getFittest().draw(ctx);

    // console.log(population.getFittest().getFitness());
    population = population.nextPopulation();
}

document.addEventListener("DOMContentLoaded", () => {
    animate();
});