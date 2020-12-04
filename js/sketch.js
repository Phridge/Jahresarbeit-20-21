const height = 300;
const widht = 500;

let house = new Consumer(10, 10);
let node = new Node(40, 40);

let city = new City([house, node]);
city.conntect(house, node);

function animate() {
    requestAnimationFrame(animate);
    draw();
}

function draw() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, widht, height);
    city.draw(ctx);
}

document.addEventListener("DOMContentLoaded", () => {
    animate();
});