const game = document.getElementById("gameArea");
const gameOver = document.getElementById("gameOver");
const playAgainButton = document.getElementById("playAgain");
const ctx = game.getContext("2d");
const snakeSize = document.getElementById("size");
const directionMap = {
    "ArrowUp": ["north", "south"],
    "ArrowDown": ["south", "north"],
    "ArrowLeft": ["west", "east"],
    "ArrowRight": ["east", "west"]
}
const CANVAS_WIDTH = game.width;
const CANVAS_HEIGHT = game.height;
const BLOCK_SIZE = 25;
let animationID = null;
let direction = "east";
let prevDir = "east";
let x = 0;
let y = 0;
let lost = false;
let size = 1;
let tokenX;
let tokenY;
let snake = [{"x": x, "y": y}];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setToken() {
    tokenX = getRandomInt(0, CANVAS_WIDTH / BLOCK_SIZE - 1) * BLOCK_SIZE;
    tokenY = getRandomInt(0, CANVAS_HEIGHT / BLOCK_SIZE - 1) * BLOCK_SIZE;
}


function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawRect(x, y, token) {
    if(token) {
        ctx.fillStyle = "green";
    }
    else {
        ctx.fillStyle = "red";
    }
    ctx.beginPath();
    ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
}

function checkTokenLocations(prospectiveX, prospectiveY) {
    for(box of snake) {
        if(prospectiveX === box['x'] && prospectiveY === box['y']) {
            return true;
        }
    }
    return false;
}


function handleScore() {
    setToken();
    while(checkTokenLocations(tokenX, tokenY)) {
        console.log("under snake, reassigning");
        setToken();
    }
    size += 1;
    snakeSize.innerHTML = "Size: " + size;
}

function keyPress(event) {
    if(directionMap[event.key] && prevDir !== directionMap[event.key][1]) {
        direction = directionMap[event.key][0];
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
    setToken();
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
    switch(direction) {
        case "north":
            y -= 25;
            if(y < 0) {
                y = 575;
            }
            break;
        case "south":
            y += 25;
            if(y > 575) {
                y = 0;
            }
            break;
        case "west":
            x -= 25;
            if(x < 0) {
                x = 775;
            }
            break;
        case "east":
            x += 25;
            if(x > 775) {
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

