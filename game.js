const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let frog;
let roadLanes = [];
let level = 1;
let speedMultiplier = 1;

const laneHeight = 50;
const frogWidth = 40;
const frogHeight = 40;
const carWidth = 60;
const objectHeight = 40;
const spacing = 200;

function init() {
    frog = {
        x: 380,
        y: 560,
        width: frogWidth,
        height: frogHeight,
        dx: 0
    };

    roadLanes = [];
    const roadLaneYs = [510, 460, 410, 360, 310];
    for (let i = 0; i < 5; i++) {
        const laneCars = [];
        const baseSpeed = (i % 2 === 0 ? 2 : -3);
        const speed = baseSpeed * speedMultiplier;
        const numCars = Math.ceil(800 / (carWidth + spacing)) + 1;
        for (let j = 0; j < numCars; j++) {
            laneCars.push({
                x: j * (carWidth + spacing),
                y: roadLaneYs[i],
                width: carWidth,
                height: objectHeight,
                speed: speed
            });
        }
        roadLanes.push(laneCars);
    }
}

function isColliding(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function getLane(centerY) {
    if (centerY > 550) return {type: 'start'};
    else if (centerY > 500) return {type: 'road', index: 0};
    else if (centerY > 450) return {type: 'road', index: 1};
    else if (centerY > 400) return {type: 'road', index: 2};
    else if (centerY > 350) return {type: 'road', index: 3};
    else if (centerY > 300) return {type: 'road', index: 4};
    else if (centerY > 250) return {type: 'median'};
    else if (centerY > 200) return {type: 'goal'};
    else if (centerY > 150) return {type: 'goal'};
    else if (centerY > 100) return {type: 'goal'};
    else if (centerY > 50) return {type: 'goal'};
    else return {type: 'goal'};
}

function update() {
    for (let lane of roadLanes) {
        for (let car of lane) {
            car.x += car.speed;
            if (car.speed > 0 && car.x > 800) car.x = -car.width;
            else if (car.speed < 0 && car.x < -car.width) car.x = 800;
        }
    }

    frog.x += frog.dx;
    if (frog.x < 0 || frog.x > 760) {
        gameOver();
        return;
    }

    let centerY = frog.y + frog.height / 2;
    let lane = getLane(centerY);

    if (lane.type === 'road') {
        let carsInLane = roadLanes[lane.index];
        for (let car of carsInLane) {
            if (isColliding(frog, car)) {
                gameOver();
                return;
            }
        }
    } else if (lane.type === 'goal') {
        win();
        return;
    } else {
        frog.dx = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    for (let lane of roadLanes) {
        for (let car of lane) {
            ctx.fillRect(car.x, car.y, car.width, car.height);
        }
    }

    ctx.fillStyle = 'green';
    ctx.fillRect(frog.x, frog.y, frog.width, frog.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            frog.y -= 50;
            frog.dx = 0;
            if (frog.y < 0) frog.y = 0;
            break;
        case 'ArrowDown':
            frog.y += 50;
            frog.dx = 0;
            if (frog.y > 560) frog.y = 560;
            break;
        case 'ArrowLeft':
            frog.x -= 40;
            if (frog.x < 0) frog.x = 0;
            break;
        case 'ArrowRight':
            frog.x += 40;
            if (frog.x > 760) frog.x = 760;
            break;
    }
});

function gameOver() {
    alert('ゲームオーバー');
    level = 1;
    speedMultiplier = 1;
    init();
}

function win() {
    alert('クリア！レベル ' + level + ' 達成');
    level++;
    speedMultiplier += 0.5;
    init();
}

init();
gameLoop();