const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas størrelse
canvas.width = 400;
canvas.height = 400;

// Alt annet
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

// Last inn lyder
const eatSound = new Audio('audio/eat.mp3');
const turnSound = new Audio('audio/turn.mp3');
const crashSound = new Audio('audio/crash.mp3');

// Lydstatus
let soundEnabled = true;

// Muteknapp
const muteButton = document.getElementById('muteButton');

// Funksjon for å spille lyd
function playSound(sound) {
    if (soundEnabled) {
        sound.play();
    }
}

// Håndterer muteknappen
muteButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    muteButton.textContent = soundEnabled ? '🔊' : '🔇';
});

// Oppdaterer mat- og slangeposisjon
function update() {
    const head = { ...snake[0] };
    head.x += direction.x * tileSize;
    head.y += direction.y * tileSize;

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snakeCollision(head)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        currentScore.textContent = score;
        playSound(eatSound);
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
        }
        food = generateFood();
    } else {
        snake.pop();
    }
}

// Sjekker om slangen kolliderer
function snakeCollision(position) {
    return snake.some((segment, index) => index !== 0 && segment.x === position.x && segment.y === position.y);
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

// Henter highscore
async function fetchHighScore() {
    const response = await fetch('/get_highscore');
    const data = await response.json();
    highScore = data.high_score;
    highScoreDisplay.textContent = highScore;
}
fetchHighScore();

// Lagrer highscore
async function saveHighScore() {
    if (score > highScore) {
        await fetch('/update_highscore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player_name: 'Player1', score: score })
        });
    }
}

// Nullstiller spillet
function resetGame() {
    crashSound.play();
    alert('Game over!');
    saveHighScore();
    snake = [{ x: 100, y: 100 }];
    direction = { x: 0, y: 0 };
    score = 0;
    currentScore.textContent = score;
    food = { x: 200, y: 200 };
}


// Tegner rektangel  
function drawRect(color, x, y, size) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

// Spillelementene
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tegner rutemønster
    for (let y = 0; y < canvas.height; y += tileSize) {
        for (let x = 0; x < canvas.width; x += tileSize) {
            ctx.fillStyle = (x / tileSize + y / tileSize) % 2 === 0 ? '#181825' : '#222738';
            ctx.fillRect(x, y, tileSize, tileSize);
        }
    }

    // Tegner mat
    drawRect('#ff0000', food.x, food.y, tileSize);

    // Tegner slangen
    snake.forEach((segment, index) => {
        drawRect(index === 0 ? '#ffffff' : '#e4dede', segment.x, segment.y, tileSize);
    });
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
    };

    const newDirection = keyMap[e.key];
    if (newDirection) {
        // Stopper nettsiden fra å bevege seg
        e.preventDefault();

        // Sjekk at slangen ikke går motsatt vei
        if (direction.x + newDirection.x === 0 && direction.y + newDirection.y === 0) return;

        direction = newDirection;
        playSound(turnSound);  // Spill snu-lyden
    }
});

// Start spillet
gameLoop();