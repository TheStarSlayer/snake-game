export default class Snake {
    constructor(inputGridSize = 10, snakeLength = 5) {
        this.grid = [];
        this.snake = [];
        this.gridSize = inputGridSize;

        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize).fill(0);
        }

        let snakeCenterLoc = Math.ceil(this.gridSize / 2);
        this.HEAD = [snakeCenterLoc - Math.ceil(snakeLength / 2), snakeCenterLoc];
        this.TAIL = [this.HEAD[0] + snakeLength - 1, snakeCenterLoc];

        for (let i = this.HEAD[0]; i <= this.TAIL[0]; i++) {
            const snakeNode = { coords: [i, snakeCenterLoc] };
            if (i !== this.HEAD[0]) {
                snakeNode.prevCoords = [i - 1, snakeCenterLoc];
            }
            this.snake.push(snakeNode);
            this.grid[i][snakeCenterLoc] = 1;
        }

        this.generateFoodPos();
        this.snakeDirection = "up";
    }

    generateFoodPos() {
        this.emptyCells = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) {
                    this.emptyCells.push([i, j]);
                }
            }
        }

        if (this.emptyCells.length === 0) {
            throw new Error("Game Over: No space left for food!");
        }

        this.foodPos = this.emptyCells[Math.floor(Math.random() * this.emptyCells.length)];
        this.grid[this.foodPos[0]][this.foodPos[1]] = 'A';
    }

    move(wantedDirection = "forward") {
        if (wantedDirection === "forward") {
            this.moveForward();
            return;
        }

        switch (this.snakeDirection) {
            case "up":
            case "down":
                if (wantedDirection === "left")
                    this.moveLeft();
                else if (wantedDirection === "right")
                    this.moveRight();
                break;

            case "left":
                if (wantedDirection === "up")
                    this.moveRight();
                else if (wantedDirection === "down")
                    this.moveLeft();
                break;

            case "right":
                if (wantedDirection === "up")
                    this.moveLeft();
                else if (wantedDirection === "down")
                    this.moveRight();
                break;
        }
        console.log("HEAD: ", this.HEAD, "TAIL: ", this.TAIL);
    }

    moveForward() {
        switch (this.snakeDirection) {
            case "up":
                this.HEAD = [this.HEAD[0] - 1, this.HEAD[1]];
                break;
            case "down":
                this.HEAD = [this.HEAD[0] + 1, this.HEAD[1]];
                break;
            case "left":
                this.HEAD = [this.HEAD[0], this.HEAD[1] - 1];
                break;
            case "right":
                this.HEAD = [this.HEAD[0], this.HEAD[1] + 1];
                break;
        }
        this.updateSnakePos();
    }

    moveLeft() {
        switch (this.snakeDirection) {
            case "up":
            case "down":
                this.HEAD = [this.HEAD[0], this.HEAD[1] - 1];
                this.snakeDirection = "left";
                break;
            case "left":
                this.HEAD = [this.HEAD[0] + 1, this.HEAD[1]];
                this.snakeDirection = "down";
                break;
            case "right":
                this.HEAD = [this.HEAD[0] - 1, this.HEAD[1]];
                this.snakeDirection = "up";
                break;
        }
        this.updateSnakePos();
    }

    moveRight() {
        switch (this.snakeDirection) {
            case "up":
            case "down":
                this.HEAD = [this.HEAD[0], this.HEAD[1] + 1];
                this.snakeDirection = "right";
                break;
            case "left":
                this.HEAD = [this.HEAD[0] - 1, this.HEAD[1]];
                this.snakeDirection = "up";
                break;
            case "right":
                this.HEAD = [this.HEAD[0] + 1, this.HEAD[1]];
                this.snakeDirection = "down";
                break;
        }
        this.updateSnakePos();
    }

    updateSnakePos() {
        if (this.HEAD[0] < 0 || this.HEAD[0] >= this.gridSize ||
            this.HEAD[1] < 0 || this.HEAD[1] >= this.gridSize) {
            throw new Error("Snake crashed!");
        }

        if (this.grid[this.HEAD[0]][this.HEAD[1]] === 1) {
            throw new Error("Snake ate itself!");
        }

        let snakeEatsFood = false;
        let snakeTail = {};

        if (this.grid[this.HEAD[0]][this.HEAD[1]] === 'A') {
            snakeTail.coords = [...this.snake[this.snake.length - 1].coords];
            snakeTail.prevCoords = [...this.snake[this.snake.length - 1].prevCoords];
            snakeEatsFood = true;
        }

        this.snake[0].coords = [...this.HEAD];

        this.grid[this.HEAD[0]][this.HEAD[1]] = 1;
        this.grid[this.TAIL[0]][this.TAIL[1]] = 0;

        for (let i = 1; i < this.snake.length; i++) {
            this.snake[i].coords = [...this.snake[i].prevCoords];
            this.snake[i].prevCoords = [...this.snake[i - 1].coords];
        }

        if (snakeEatsFood) {
            this.snake.push(snakeTail);
            this.grid[snakeTail.coords[0]][snakeTail.coords[1]] = 1;
            this.generateFoodPos();
        }

        this.TAIL = [...this.snake[this.snake.length - 1].coords];
    }
}
