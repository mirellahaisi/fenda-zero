const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "50%";
canvas.style.left = "50%";
canvas.style.transform = "translate(-50%, -50%)";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

document.body.style.margin = "0";
document.body.style.backgroundColor = "black";


const minX = canvas.width * 0.1;
const maxX = canvas.width * 0.9 - 30;

let player = { x: (minX + maxX) / 2, y: canvas.height - 60, width: 30, height: 30, bullets: [] };
let fendas = [];
let gameOver = false;
let playerSpeed = 30;
let score = 0;
let startTime = Date.now();
let lastFendaTime = 0;
let fendaInterval = 1000;
let minInterval = 300;
let baseStarSpeed = 0.01;

const credits = document.createElement("div");
credits.innerHTML = "Giovana Rita Daniel, Leonardo Stall e Mirella Haisi";
credits.style.position = "absolute";
credits.style.bottom = "10px";
credits.style.right = "15px";
credits.style.color = "rgba(255, 255, 255, 0.5)";
credits.style.fontSize = "12px";
credits.style.fontFamily = "Arial, sans-serif";
credits.style.zIndex = "1";
document.body.appendChild(credits);

let estrelas = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    speed: Math.random() * 0.01 + 0.005
}));

function desenharEstrelas() {
    const speedMultiplier = fendaInterval <= 300 ? 3 : 1;

    estrelas.forEach(estrela => {
        estrela.alpha += estrela.speed * speedMultiplier;

        if (estrela.alpha > 1 || estrela.alpha < 0.3) {
            estrela.speed *= -1;
            if (fendaInterval <= 300) {
                estrela.speed = (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
            }
        }

        ctx.beginPath();
        ctx.globalAlpha = estrela.alpha;
        ctx.fillStyle = "white";
        ctx.arc(estrela.x, estrela.y, estrela.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function drawPlayer() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
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
    fendas.forEach((fenda, index) => {
        fenda.y += 2;

        ctx.strokeStyle = fenda.color;
        ctx.lineWidth = 2;

        for (let i = 0; i < 10; i++) {
            let angle = Math.random() * Math.PI * 2;
            let length = Math.random() * 30 + 10;
            let startX = fenda.x + 40;
            let startY = fenda.y + 20;
            let endX = startX + Math.cos(angle) * length;
            let endY = startY + Math.sin(angle) * length;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }

        if (fenda.y > canvas.height) fendas.splice(index, 1);
    });
}

function checkCollisions() {
    for (let b = player.bullets.length - 1; b >= 0; b--) {
        const bullet = player.bullets[b];
        for (let f = fendas.length - 1; f >= 0; f--) {
            const fenda = fendas[f];

            if (fenda.y > 0) {
                let dx = bullet.x - (fenda.x + 40);
                let dy = bullet.y - (fenda.y + 20);
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 30) {
                    player.bullets.splice(b, 1);
                    fendas.splice(f, 1);
                    score += 10;
                    break;
                }
            }
        }
    }

    fendas.forEach((fenda) => {
        const playerLeft = player.x;
        const playerRight = player.x + player.width;
        const playerTop = player.y;
        const playerBottom = player.y + player.height;

        const fendaLeft = fenda.x;
        const fendaRight = fenda.x + 80;
        const fendaTop = fenda.y;
        const fendaBottom = fenda.y + 40;

        if (
            playerRight > fendaLeft &&
            playerLeft < fendaRight &&
            playerBottom > fendaTop &&
            playerTop < fendaBottom
        ) {
            gameOver = true;
        }
    });
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEstrelas();
    drawPlayer();
    drawBullets();
    drawFendas();
    checkCollisions();

    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    const currentTime = Date.now() - startTime;
    ctx.fillText("Pontuação: " + score, 10, 30);
    ctx.fillText("Tempo: " + formatTime(currentTime) + "s", 10, 60);
    const currentTimeFenda = Math.floor((Date.now() - startTime) / 1000);
    fendaInterval = Math.max(minInterval, 1000 - currentTimeFenda * 20);
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 60, canvas.height / 2);
        createRestartButton();
    }
}

function createRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.innerText = "Reiniciar";
    restartButton.style.position = "absolute";
    restartButton.style.top = "60%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.style.fontSize = "18px";
    restartButton.style.padding = "10px 20px";
    restartButton.style.cursor = "pointer";
    restartButton.style.zIndex = "1";
    restartButton.style.color = "black";
    restartButton.style.backgroundColor = "yellow";
    restartButton.style.border = "2px solid yellow";
    restartButton.style.borderRadius = "8px";
    restartButton.style.boxShadow = "0 0 10px yellow";
    restartButton.addEventListener("click", restartGame);
    document.body.appendChild(restartButton);
}


function restartGame() {
    player = { x: (minX + maxX) / 2, y: canvas.height - 60, width: 30, height: 30, bullets: [] };
    fendas = [];
    score = 0;
    gameOver = false;
    startTime = Date.now();
    fendaInterval = 1000;
    document.querySelector("button").remove();
    spawnFendas();
    gameLoop();
}

function spawnFendas() {
    const now = Date.now();
    if (now - lastFendaTime > fendaInterval) {
        let randomX = Math.random() * (maxX - minX) + minX;
        fendas.push({
            x: randomX,
            y: 0,
            color: fendaInterval <= 300 ? "#DA70D6" : "lightblue"
        });
        lastFendaTime = now;
    }
    if (!gameOver) requestAnimationFrame(spawnFendas);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft" && player.x > minX) player.x -= playerSpeed;
    if (event.code === "ArrowRight" && player.x < maxX) player.x += playerSpeed;
    if (event.code === "Space") player.bullets.push({ x: player.x + 12, y: player.y });
});

spawnFendas();
gameLoop();