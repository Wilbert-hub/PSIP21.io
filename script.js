class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.reset();
    }

    reset() {
        this.body = [{ x: 8, y: 8 }];
        this.direction = { x: 1, y: 0 };
        this.length = 1;
    }

    setDirection(newDirection) {
        // Змейка не может резко разворачиваться в обратную сторону
        if (newDirection.x !== -this.direction.x && newDirection.y !== -this.direction.y) {
            this.direction = newDirection;
        }
    }

    move() {
        const head = { x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y };
        this.body.unshift(head);

        if (this.body.length > this.length) {
            this.body.pop();
        }
    }

    checkCollision(gridCount) {
        const head = this.body[0];

        // Столкновение с границей
        if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
            return true;
        }

        // Столкновение с собой
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }

        return false;
    }

    grow() {
        this.length++;
    }

    draw(ctx, gridSize) {
        ctx.fillStyle = 'green';
        this.body.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }
}

class Food {
    constructor(gridCount) {
        this.gridCount = gridCount;
        this.position = this.randomPosition();
    }

    randomPosition() {
        return {
            x: Math.floor(Math.random() * this.gridCount),
            y: Math.floor(Math.random() * this.gridCount)
        };
    }

    spawnNew() {
        this.position = this.randomPosition();
    }

    draw(ctx, gridSize) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x * gridSize, this.position.y * gridSize, gridSize, gridSize);
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.gridCount = this.canvas.width / this.gridSize;
        this.snake = new Snake(this.gridSize);
        this.food = new Food(this.gridCount);
        this.score = 0;
        this.isGameRunning = false;
        this.gameSpeed = 200;
    }

    start() {
        this.snake.reset();
        this.food.spawnNew();
        this.score = 0;
        this.isGameRunning = true;
        this.loop();
    }

    end() {
        this.isGameRunning = false;
        document.getElementById('gameOverMessage').style.display = 'block';
    }

    loop() {
        if (!this.isGameRunning) return;

        this.update();
        this.draw();

        setTimeout(() => this.loop(), this.gameSpeed);
    }

    update() {
        this.snake.move();

        if (this.snake.checkCollision(this.gridCount)) {
            this.end();
            return;
        }

        const head = this.snake.body[0];
        if (head.x === this.food.position.x && head.y === this.food.position.y) {
            this.snake.grow();
            this.food.spawnNew();
            this.score++;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Отрисовка змейки и еды
        this.snake.draw(this.ctx, this.gridSize);
        this.food.draw(this.ctx, this.gridSize);

        // Отображение счёта
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Счёт: ${this.score}`, 10, 20);
    }

    setDirection(direction) {
        this.snake.setDirection(direction);
    }
}

// Инициализация игры
const game = new Game('gameCanvas');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const gameOverMessage = document.getElementById('gameOverMessage');

// Управление клавишами
document.addEventListener('keydown', (event) => {
    if (!game.isGameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            game.setDirection({ x: 0, y: -1 });
            break;
        case 'ArrowDown':
            game.setDirection({ x: 0, y: 1 });
            break;
        case 'ArrowLeft':
            game.setDirection({ x: -1, y: 0 });
            break;
        case 'ArrowRight':
            game.setDirection({ x: 1, y: 0 });
            break;
    }
});

// Обработчики кнопок
startButton.addEventListener('click', () => {
    game.start();
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    gameOverMessage.style.display = 'none';
});

restartButton.addEventListener('click', () => {
    game.start();
    gameOverMessage.style.display = 'none';
});
