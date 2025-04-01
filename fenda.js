const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "50%";
canvas.style.left = "50%";
canvas.style.transform = "translate(-50%, -50%)";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;

let player = { x: 180, y: 250, width: 30, height: 30, bullets: [] };
let fendas = [];
let gameOver = false;

function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
}

function drawBullets() {
    ctx.fillStyle = "orange";
    player.bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });
}

function drawFendas() {
    ctx.fillStyle = "black";
    fendas.forEach((fenda, index) => {
        fenda.y += 2;
        ctx.fillRect(fenda.x, fenda.y, 40, 20);
        if (fenda.y > canvas.height) fendas.splice(index, 1);
    });
}

function checkCollisions() {
    player.bullets.forEach((bullet, bIndex) => {
        fendas.forEach((fenda, fIndex) => {
            if (
                bullet.x < fenda.x + 40 &&
                bullet.x + 5 > fenda.x &&
                bullet.y < fenda.y + 20 &&
                bullet.y + 10 > fenda.y
            ) {
                player.bullets.splice(bIndex, 1);
                fendas.splice(fIndex, 1);
            }
        });
    });
    
    fendas.forEach((fenda) => {
        if (
            player.x < fenda.x + 40 &&
            player.x + 30 > fenda.x &&
            player.y < fenda.y + 20 &&
            player.y + 30 > fenda.y
        ) {
            gameOver = true;
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawFendas();
    checkCollisions();
    
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Game Over!", 150, 150);
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft" && player.x > 0) player.x -= 10;
    if (event.code === "ArrowRight" && player.x < canvas.width - player.width) player.x += 10;
    if (event.code === "Space") player.bullets.push({ x: player.x + 12, y: player.y });
});

setInterval(() => {
    fendas.push({ x: Math.random() * (canvas.width - 40), y: 0 });
}, 1000);

gameLoop();