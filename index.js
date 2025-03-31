import Snake from "./snake.js";

function createDOMGrid(DOMGridSize) {
    const DOMGridContainer = document.querySelector("#snake-grid");

    for (let i = 0; i < DOMGridSize; i++) {
        const DOMGridRow = document.createElement("div");
        DOMGridRow.classList.add("grid-row");

        for (let j = 0; j < DOMGridSize; j++) {
            const singleGrid = document.createElement("div");
            singleGrid.classList.add("single-grid");
            DOMGridRow.appendChild(singleGrid);
        }
        DOMGridContainer.appendChild(DOMGridRow);
    }
}

function clearAll() {
    const DOMGridContainer = document.querySelector("#snake-grid");
    DOMGridContainer.innerHTML = "";
}

function updateGrid(grid) {
    const allGrids = document.querySelectorAll(".single-grid");

    for (let i = 0; i < DOMGridSize; i++) {
        for (let j = 0; j < DOMGridSize; j++) {
            if (grid[i][j] === 1) {
                allGrids[(i * DOMGridSize) + j].classList.remove("empty-grid");
                allGrids[(i * DOMGridSize) + j].classList.remove("food-grid");
                allGrids[(i * DOMGridSize) + j].classList.add("snake-grid");
            }
            else if (grid[i][j] === 'A') {
                allGrids[(i * DOMGridSize) + j].classList.remove("snake-grid");
                allGrids[(i * DOMGridSize) + j].classList.remove("empty-grid");
                allGrids[(i * DOMGridSize) + j].classList.add("food-grid");
            }
            else {
                allGrids[(i * DOMGridSize) + j].classList.remove("snake-grid");
                allGrids[(i * DOMGridSize) + j].classList.remove("food-grid");
                allGrids[(i * DOMGridSize) + j].classList.add("empty-grid");
            }
        }        
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let DOMGridSize = parseInt(prompt("Enter grid size"));
let DOMSnakeSize = parseInt(prompt("Enter initial snake size"));

createDOMGrid(DOMGridSize);
let snake = new Snake(DOMGridSize, DOMSnakeSize);

document.addEventListener("keydown", async function (e) {
    e.preventDefault();

    if (e.key === "ArrowUp" || e.key === "w") 
        snake.move("up");
    else if (e.key === "ArrowDown" || e.key === "s")
        snake.move("down");
    else if (e.key === "ArrowLeft" || e.key === "a")
        snake.move("left");
    else if (e.key === "ArrowRight" || e.key === "d")
        snake.move("right");

    updateGrid(snake.grid);
    await sleep(200);
})

updateGrid(snake.grid);
let gameRunning = true;
let gameRestart = false;

do {
    if (gameRestart) {
        clearAll();
        createDOMGrid(DOMGridSize);
        snake = new Snake(DOMGridSize, DOMSnakeSize);
        updateGrid(snake.grid);
        gameRunning = true;
        gameRestart = false;
    }

    while (gameRunning) {
        try {
            snake.move();
            updateGrid(snake.grid);
            await sleep(200);
        }
        catch (e) {
            gameRunning = false;
            console.error(e);
            alert(e.message);
        }
    }

    let inputRestart = prompt("Restart with same settings? (Y/n)");
    if (inputRestart.toLowerCase() === 'y')
        gameRestart = true;

} while (gameRestart);