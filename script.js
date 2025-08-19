const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let score = 0;
let direction = 'right';
let changingDirection = false;
let gameInterval;

let poison = [];
let poisonCount = 1;
const poisonDuration = 5000;
let poisonTimeout;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function generatePoison() {
    poison = [];

    for (let i = 0; i < poisonCount; i++) {
        let newPoison = {};
        let collision = false;
        
        do {
            newPoison = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
            collision = snake.some(s => s.x === newPoison.x && s.y === newPoison.y) || 
                        (food.x === newPoison.x && food.y === newPoison.y) ||
                        poison.some(p => p.x === newPoison.x && p.y === newPoison.y);
        } while (collision);
        
        poison.push(newPoison);
    }

    clearTimeout(poisonTimeout);
    poisonTimeout = setTimeout(removePoison, poisonDuration);
}

function removePoison() {
    if (poison.length > 0) {
        poison.pop();
        if (poison.length > 0) {
            poisonTimeout = setTimeout(removePoison, 1000);
        }
    }
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach(segment => {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });

    ctx.fillStyle = '#FF5733';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

    poison.forEach(p => {
        ctx.fillStyle = '#0064C7';
        ctx.fillRect(p.x * gridSize, p.y * gridSize, gridSize - 1, gridSize - 1);
    });
}

function update() {
    changingDirection = false;
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();

        if (score % 10 === 0) {
            poisonCount++;
        }
        generatePoison();
    } else {
        snake.pop();
    }

    const hitPoison = poison.some(p => p.x === head.x && p.y === head.y);
    
    if (isGameOver() || hitPoison) {
        clearInterval(gameInterval);
        alert(`Fim de jogo! Sua pontuação foi: ${score}`);
        location.reload();
    }

    draw();
}

function isGameOver() {
    const head = snake[0];
    const hitWall = head.x < 0 || head.x >= (canvas.width / gridSize) || head.y < 0 || head.y >= (canvas.height / gridSize);
    const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    return hitWall || hitSelf;
}

document.addEventListener('keydown', e => {
    if (changingDirection) return;
    changingDirection = true;

    const key = e.key;

    if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
});

function startGame() {
    generateFood();
    generatePoison();
    gameInterval = setInterval(update, 130);
}

startGame();