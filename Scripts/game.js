// Array of objects with name and color
const objects = [
    { name: 'Sand', color: 'rgb(200,180,140)' },
    { name: 'Water', color: 'rgb(50,100,255)' },

];

const height = window.innerHeight;
const width = window.innerWidth;
const pixelSize = 10;  // Size of each "pixel" in the grid

const screenCanvas = document.getElementById("gameFrame");
const menu = document.getElementById('menu');
const context = screenCanvas.getContext("2d");
screenCanvas.width = width;
screenCanvas.height = height;

let selectedObject = "Sand"; // Default selected object
let grid, cols, rows;
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

function addObject(name, color) {
    // Add the object to the array
    objects.push({ name, color });

    // Create a new button for the object
    const button = document.createElement("button");
    button.innerText = name;
    button.style.backgroundColor = color;
    button.addEventListener("click", () => selectObject(name));

    // Add the button to the menu
    document.getElementById("menu").appendChild(button);
}

function selectObject(name) {
    selectedObject = name;
}
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

function resizeCanvas() {
    const menuWidth = document.getElementById("menu").offsetWidth;
    let newWidth = window.innerWidth - menuWidth - 40; // Adjust for padding/margins
    let newHeight = window.innerHeight - document.getElementById("titleFrame").offsetHeight - document.getElementById("infoFrame").offsetHeight - 40;

    // Apply minimum and maximum width and height
    const minWidth = 400;
    const maxWidth = 800;
    const minHeight = 300;
    const maxHeight = 600;

    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    screenCanvas.width = newWidth;
    screenCanvas.height = newHeight;

    cols = Math.floor(screenCanvas.width / pixelSize);
    rows = Math.floor(screenCanvas.height / pixelSize);

    grid = createArray(cols, rows); // Recreate grid based on new dimensions
}

function setup() {
    resizeCanvas();

    window.addEventListener('resize', () => {
        resizeCanvas();  // Resize the canvas when the window is resized
        draw(); // Redraw the elements to fit the new size
    });

    screenCanvas.addEventListener('mousedown', () => isMouseDown = true);
    screenCanvas.addEventListener('mouseup', () => isMouseDown = false);
    screenCanvas.addEventListener('mousemove', (e) => {
        const rect = screenCanvas.getBoundingClientRect();
        mouseX = Math.floor(((e.clientX - rect.left) / (rect.right - rect.left)) * screenCanvas.width / pixelSize);
        mouseY = Math.floor(((e.clientY - rect.top) / (rect.bottom - rect.top)) * screenCanvas.height / pixelSize);
    });

    // Adding objects
    addObject("Sand", "#C8B48C");
    addObject("Water", "#1E90FF");
    //
}

function mousePressed() {    
    // Add sand particle where the mouse is if the button is held down
    let dir = 0;
    if(Math.random(1) < 0.5) {
        dir = 1;
    }
    if (isMouseDown) {
        if (mouseX + dir >= 0 && mouseX + dir < cols && mouseY >= 0 && mouseY < rows) {
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
            } else if (grid[x][y] === 2) {
                context.fillStyle = 'rgb(30,144,255)'; // Water color
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

// function addButton(name, className) {
//     let button = document.createElement("button");
//     button.innerHTML = name;
//     button.className = className;
//     document.getElementById("menu").appendChild(button);
// }