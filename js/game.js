const game = document.getElementById("gameArea");
const gameOver = document.getElementById("gameOver");
const playAgainButton = document.getElementById("playAgain");
const ctx = game.getContext("2d");
const snakeSize = document.getElementById("size");
let animationID = null;
let direction = "east";
let prevDir = "east";
let x = 0;
let y = 0;
let lost = false;
let size = 1;

let snake = [{"x": x, "y": y}];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let tokenX = getRandomInt(0, 38) * 20;
let tokenY = getRandomInt(0, 28) * 20;

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, game.width, game.height);
}

function drawRect(x, y, token) {
    if(token) {
        ctx.fillStyle = "green";
    }
    else {
        ctx.fillStyle = "red";
    }
    ctx.beginPath();
    ctx.rect(x, y, 20, 20);
    ctx.fill();
}

function handleScore() {
    tokenX = getRandomInt(0, 38) * 20;
    tokenY = getRandomInt(0, 28) * 20;
    size += 1;
    snakeSize.innerHTML = "Size: " + size;
}

function keyPress(event) {
    switch(event.key) {
        case "ArrowUp":
            if(prevDir !== "south") {
                direction = "north";
            }
            break;
        case "ArrowDown":
            if(prevDir !== "north") {
                direction = "south";
            }
            break;
        case "ArrowLeft":
            if(prevDir !== "east") {
                direction = "west";
            }
            break;
        case "ArrowRight":
            if(prevDir !== "west") {
                direction = "east";
            }
            break;
    }
}

function startGame() {
    console.log("starting game");
    lost = false;
    snake = [{"x": x, "y": y}];
    size = 1;
    direction = "east";
    prevDir = "east";
    x = 0;
    y = 0;
    gameOver.style.display = "none";
    playAgainButton.style.display = "none";
    game.style.display = "block";
    snakeSize.innerHTML = "Size: " + size;
    runGame();
}

function endGame() {
    game.style.display = "none";
    gameOver.style.display = 'block';
    playAgainButton.style.display = "block";
}

function runGame() {
    if(lost) {
        lost = false;
        console.log(animationID);
        window.cancelAnimationFrame(animationID);
        endGame();
        return;
    }
    setTimeout(
        () => {animationID = window.requestAnimationFrame(runGame)}, 65);
    clearScreen();
    drawRect(tokenX, tokenY, true);
    let count = 0;
    snake.forEach((box) => {
        if(x === box['x'] && y === box['y'] && count !== 0) {
            lost = true;
        }
        drawRect(box['x'], box['y'], false);
        ++count;
    });
    // console.log(x, y);
    switch(direction) {
        case "north":
            y -= 20;
            if(y < 0) {
                y = 580;
            }
            break;
        case "south":
            y += 20;
            if(y > 580) {
                y = 0;
            }
            break;
        case "west":
            x -= 20;
            if(x < 0) {
                x = 780;
            }
            break;
        case "east":
            x += 20;
            if(x > 780) {
                x = 0;
            }
            break;
    }
    snake.unshift({"x": x, "y": y});
    if(x !== tokenX || y !== tokenY) {
        snake.pop();
    }
    else {
        handleScore();
    }
    prevDir = direction;
}

window.addEventListener("load", startGame);

document.body.addEventListener("keydown", keyPress);

playAgainButton.addEventListener("click", startGame);

