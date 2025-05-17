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
    let r1 = 1, c1 = 1;
    let lastTile = null;

    while (r1 < rows && c1 < cols) {
        const tile = grid[r1][c1]; 
        if (!isSpecialTile(tile, originTileId, destinationTileId)) {
            tile.classList.add("wall");
            lastTile = tile;
        }
        r1++;
        c1++;
    }

    let r2 = rows - 1, c2 = c1;
    while (r2 >= 0 && c2 < cols) {
        const tile = grid[r2][c2]; 
        if (!isSpecialTile(tile, originTileId, destinationTileId)) {
            tile.classList.add("wall");
            lastTile = tile;
        }
        r2--;
        c2++;
    }

    if (lastTile) lastTile.classList.remove("wall");
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