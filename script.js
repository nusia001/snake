const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas størrelse
canvas.width = 400;
canvas.height = 400;

const tileSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = 0;

// Oppdatere score og highscore
const currentScore = document.getElementById('currentScore');
const highScoreDisplay = document.getElementById('highScore');

// Lage tilfeldig sted for mat
function randomPosition() {
    return Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
}

// Sjekker om mat er på slangens kropp
function isFoodOnSnake(foodPosition) {
    return snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
}

// Generer mat
function generateFood() {
    let newFoodPosition;
    do {
        newFoodPosition = { x: randomPosition(), y: randomPosition() };
    } while (isFoodOnSnake(newFoodPosition));
    return newFoodPosition;
}

// Oppdaterer mat- og slangeposisjon
function update() {
    const head = { ...snake[0] };
    head.x += direction.x * tileSize;
    head.y += direction.y * tileSize;
    snake.unshift(head);

    // Sjekker om slangen spiser mat
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        currentScore.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
        }
        food = generateFood();
    } else {
        snake.pop();
    }
}

// Tegne rektangel
function drawRect(color, x, y, size) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

// Spill loop
function gameLoop() {
    if (isGameOver()) {
        resetGame();
        return;
    }

    update();
    render();

    setTimeout(gameLoop, 100);
}

// Sjekker om spillet er over
function isGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) return true;

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }

    return false;
}

// Nullstiller spillet
function resetGame() {
    alert('Game over!');
    snake = [{ x: 100, y: 100 }];
    direction = { x: 0, y: 0 };
    score = 0;
    currentScore.textContent = score;
    food = { x: randomPosition(), y: randomPosition() };
}

// Spillelementene
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    drawRect('#ff0000', food.x, food.y, tileSize);

    // Draw snake
    snake.forEach((segment, index) => {
        drawRect(index === 0 ? '#00ff00' : '#66ff66', segment.x, segment.y, tileSize);
    });
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
    };

    const newDirection = keyMap[e.key];
    if (newDirection) {
        if (direction.x + newDirection.x === 0 && direction.y + newDirection.y === 0) return;
        direction = newDirection;
    }
});

// Start spillet
gameLoop();