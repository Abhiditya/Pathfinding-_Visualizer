export function generateBasicRandomMaze(grid, rows, cols, originTileId, destinationTileId) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tile = grid[row][col]; 
            if (Math.random() < 0.4 && !isSpecialTile(tile, originTileId, destinationTileId)) {
                tile.classList.add("wall");
            }
        }
    }
}

export function generateSimpleStairsPattern(grid, rows, cols, originTileId, destinationTileId) {
    function isSpecial(tile) {
        return isSpecialTile(tile, originTileId, destinationTileId);
    }

    const stairHeight = 3;  // How many vertical blocks per stair step
    const stairWidth = 3;   // How many horizontal blocks per stair step
    const gapChance = 0.05; // Small chance for random gaps

    let r = 1;
    let c = 0;

    // Build main staircase ↘️
    while (r < rows && c < cols) {
        // Horizontal part of stair
        for (let j = 0; j < stairWidth && r < rows && c < cols; j++) {
            const tile = grid[r][c];
            if (!isSpecial(tile) && Math.random() > gapChance) {
                tile.classList.add("wall");
            }
            c++;
        }
        // Vertical part of stair
        for (let i = 0; i < stairHeight && r < rows && c < cols; i++) {
            const tile = grid[r][c];
            if (!isSpecial(tile) && Math.random() > gapChance) {
                tile.classList.add("wall");
            }
            r++;
        }
    }

    // Add a mirrored staircase from top-right ↙️ for symmetry
    r = 1;
    c = cols - 2;
    while (r < rows && c >= 0) {
        for (let j = 0; j < stairWidth && r < rows && c >= 0; j++) {
            const tile = grid[r][c];
            if (!isSpecial(tile) && Math.random() > gapChance) {
                tile.classList.add("wall");
            }
            c--;
        }
        for (let i = 0; i < stairHeight && r < rows && c >= 0; i++) {
            const tile = grid[r][c];
            if (!isSpecial(tile) && Math.random() > gapChance) {
                tile.classList.add("wall");
            }
            r++;
        }
    }
}


export function generateRecursiveDivisionHorizontal(grid, startRow = 0, endRow = grid.length - 1, startCol = 0, endCol = grid[0].length - 1, originTileId, destinationTileId) {
    if (endRow <= startRow) return;

    const wallRow = getRandomEven(startRow, endRow);
    const passageCol = getRandomInt(startCol, endCol);

    for (let col = startCol; col <= endCol; col++) {
        const tile = grid[wallRow][col];
        if (col !== passageCol && !isSpecialTile(tile, originTileId, destinationTileId)) {
            tile.classList.add("wall");
        }
    }

    generateRecursiveDivisionHorizontal(grid, startRow, wallRow - 1, startCol, endCol, originTileId, destinationTileId);
    generateRecursiveDivisionHorizontal(grid, wallRow + 1, endRow, startCol, endCol, originTileId, destinationTileId);
}

export function generateRecursiveDivisionVertical(grid, startRow = 0, endRow = grid.length - 1, startCol = 0, endCol = grid[0].length - 1, originTileId, destinationTileId) {
    if (endCol <= startCol) return;

    const wallCol = getRandomEven(startCol, endCol);
    const passageRow = getRandomInt(startRow, endRow);

    for (let row = startRow; row <= endRow; row++) {
        const tile = grid[row][wallCol];
        if (row !== passageRow && !isSpecialTile(tile, originTileId, destinationTileId)) {
            tile.classList.add("wall");
        }
    }

    generateRecursiveDivisionVertical(grid, startRow, endRow, startCol, wallCol - 1, originTileId, destinationTileId);
    generateRecursiveDivisionVertical(grid, startRow, endRow, wallCol + 1, endCol, originTileId, destinationTileId);
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEven(min, max) {
    const evenMin = min % 2 === 0 ? min : min + 1;
    const evenMax = max % 2 === 0 ? max : max - 1;
    if (evenMin > evenMax) return evenMin;
    const range = (evenMax - evenMin) / 2 + 1;
    return evenMin + 2 * Math.floor(Math.random() * range);
}

function isSpecialTile(tile, originTileId, destinationTileId) {
    return tile.id === originTileId || tile.id === destinationTileId;
}