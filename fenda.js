const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "50%";
canvas.style.left = "50%";
canvas.style.transform = "translate(-50%, -50%)";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;

document.body.style.backgroundColor = "black"; 

let player = { x: 180, y: 250, width: 30, height: 30, bullets: [] };
let fendas = [];
let gameOver = false;
let playerSpeed = 20;
let score = 0; 


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
    fendas.forEach((fenda, index) => {
        fenda.y += 2;
        
        
        ctx.strokeStyle = "rgba(173, 216, 230, 0.8)"; 
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) { 
            let xOffset = (Math.random() - 0.5) * 40; 
            let yOffset = (Math.random() - 0.5) * 40;
            ctx.moveTo(fenda.x + 40, fenda.y + 20);
            ctx.lineTo(fenda.x + 40 + xOffset, fenda.y + 20 + yOffset);
        }
        ctx.stroke();

        if (fenda.y > canvas.height) fendas.splice(index, 1);
    });
}


function checkCollisions() {
    player.bullets.forEach((bullet, bIndex) => {
        fendas.forEach((fenda, fIndex) => {
            let dx = bullet.x - (fenda.x + 40);
            let dy = bullet.y - (fenda.y + 20);
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) { 
                player.bullets.splice(bIndex, 1);
                fendas.splice(fIndex, 1);
                score += 10; 
            }
        });
    });
    
    fendas.forEach((fenda) => {
        let dx = player.x + 15 - (fenda.x + 40);
        let dy = player.y + 15 - (fenda.y + 20);
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 30) {
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

   
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação: " + score, 10, 30); 

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Game Over!", 150, 150); 
        createRestartButton(); 
    }
}


function createRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.innerText = "Reiniciar";
    restartButton.style.position = "absolute";
    restartButton.style.top = "200px";
    restartButton.style.left = "150px";
    restartButton.style.fontSize = "18px";
    restartButton.style.padding = "10px 20px";
    restartButton.style.cursor = "pointer";
    
    
    restartButton.addEventListener("click", restartGame);
    
    document.body.appendChild(restartButton);
}


function restartGame() {
    player = { x: 180, y: 250, width: 30, height: 30, bullets: [] };
    fendas = []; 
    score = 0; 
    gameOver = false; 
    document.querySelector("button").remove(); 
    gameLoop(); 
}


document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft" && player.x > 0) player.x -= playerSpeed;
    if (event.code === "ArrowRight" && player.x < canvas.width - player.width) player.x += playerSpeed;
    if (event.code === "Space") player.bullets.push({ x: player.x + 12, y: player.y });
});


setInterval(() => {
    fendas.push({ x: Math.random() * (canvas.width - 80), y: 0 });
}, 1000);


gameLoop();





