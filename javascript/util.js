// javascript/util.js
export function getNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

export function reconstructPath(endNode) {
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previous;
  }
  return path;
}

export async function animateVisitedNodes(nodes, originTileId, destinationTileId) {
  for (let i = 0; i < nodes.length; i++) {
    const tile = nodes[i].element;
    const tileId = tile.id;

    if (tileId !== originTileId && tileId !== destinationTileId) {
      tile.classList.remove("visited");
      void tile.offsetWidth; // force reflow
      tile.classList.add("visited");
    }

    await delay(getCurrentSpeed());
  }
}

export async function animatePath(path, originTileId, destinationTileId) {
  for (let i = 0; i < path.length; i++) {
    const node = path[i];
    const tileId = node.element.id;

    if (tileId !== originTileId && tileId !== destinationTileId) {
      node.element.classList.remove("visited");
      node.element.classList.add("path");
    }

    await delay(getCurrentSpeed());
  }
}


export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCurrentSpeed() {
  const input = document.getElementById("speedRange");
  const value = input ? parseInt(input.value) : 300; // default to 50
  const maxDelay = 500;
  return maxDelay - value; // inverse mapping: higher slider = faster
}
