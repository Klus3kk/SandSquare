const height = window.innerHeight;
const width = window.innerWidth;
const pixelSize = 10;  // Size of each "pixel" in the grid

const screenCanvas = document.getElementById("gameFrame");
const context = screenCanvas.getContext("2d");
screenCanvas.width = width;
screenCanvas.height = height;

let grid, cols, rows;
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

function createArray(cols, rows) {
    let array = new Array(cols);
    for (let i = 0; i < cols; i++) {
        array[i] = new Array(rows);
    }     
    // Initialize the grid with empty cells (e.g., 0 represents empty)
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            array[x][y] = 0;
        }
    }
    return array;
}

function setup() {
    cols = Math.floor(width / pixelSize);  // Adjust for larger pixel size
    rows = Math.floor(height / pixelSize); // Adjust for larger pixel size
    grid = createArray(cols, rows);

    screenCanvas.addEventListener('mousedown', () => isMouseDown = true);
    screenCanvas.addEventListener('mouseup', () => isMouseDown = false);
    screenCanvas.addEventListener('mousemove', (e) => {
        const rect = screenCanvas.getBoundingClientRect();  // Get the bounding rectangle of the canvas
        
        // Adjust the mouse coordinates to the canvas space and scale to grid
        mouseX = Math.floor(((e.clientX - rect.left) / (rect.right - rect.left)) * screenCanvas.width / pixelSize);
        mouseY = Math.floor(((e.clientY - rect.top) / (rect.bottom - rect.top)) * screenCanvas.height / pixelSize);
    });
}

function mousePressed() {    
    // Add sand particle where the mouse is if the button is held down
    let dir = 0;
    if(Math.random(1) < 0.5) {
        dir = 1;
    }
    if (isMouseDown) {
        if (mouseX >= 0 && mouseX < cols && mouseY >= 0 && mouseY < rows) {
            grid[mouseX + dir][mouseY] = 1; // 1 represents a sand particle
        }
    }
}

function update() {
    mousePressed();
    // Update grid, making particles fall
    for (let y = rows - 1; y >= 0; y--) {            
        for (let x = 0; x < cols; x++) {
            if (grid[x][y] === 1) { // 1 represents a sand particle
                let dir = Math.random() < 0.5 ? 1 : -1; // Randomly choose direction
                // Move down if possible
                if (y + 1 < rows && grid[x][y + 1] === 0) {
                    grid[x][y + 1] = 1;
                    grid[x][y] = 0;
                } 
                // Move down-right if possible
                else if (x + dir >= 0 && x + dir < cols && y + 1 < rows && grid[x + dir][y + 1] === 0) {
                    grid[x + dir][y + 1] = 1;
                    grid[x][y] = 0;
                } 
                // Move down-left if possible
                else if (x - dir >= 0 && x - dir < cols && y + 1 < rows && grid[x - dir][y + 1] === 0) {
                    grid[x - dir][y + 1] = 1;
                    grid[x][y] = 0;
                }
            }
        }
    }
}

function draw() {
    context.clearRect(0, 0, width, height);
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y] === 1) { 
                // Draw a sand particle with larger "pixels"
                context.fillStyle = 'rgb(200,180,140)';
                context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function main() {
    update();
    draw();
    requestAnimationFrame(main);
}

setup();
main();
