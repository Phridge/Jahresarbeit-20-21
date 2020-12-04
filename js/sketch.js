const height = 300;
const widht = 500;

let houseA = new Consumer(10, 10);
let houseB = new Consumer(100, 10);
let node = new Node(50, 50);
let exampleCity = new City([houseA, houseB, node]);
exampleCity.conntect(houseA, node);
exampleCity.conntect(houseB, node);

let population = new Population(10, 0.1, 5, exampleCity);

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
    // console.log(Math.sqrt(Math.pow(houseA.x - houseB.x, 2) + Math.pow(houseA.y - houseB.y, 2)));
    population = population.nextPopulation();
}

document.addEventListener("DOMContentLoaded", () => {
    animate();
});