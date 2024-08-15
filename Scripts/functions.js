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