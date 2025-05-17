import { animateVisitedNodes, animatePath, reconstructPath, getNeighbors } from "../util.js";

export async function aStar(grid, start, end) {
  const openSet = [start];
  start.g = 0;
  start.f = heuristic(start, end);
  const visitedInOrder = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (current.isWall || current.isVisited) continue;
    current.isVisited = true;
    visitedInOrder.push(current);

    if (current === end) {
      await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);

      const path = reconstructPath(end);
      if (!end.previous || path.length === 1) {
        alert("No path found!");
        return;
      }

      await animatePath(path);
      return;
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const tempG = current.g + 1;
      if (tempG < neighbor.g) {
        neighbor.g = tempG;
        neighbor.f = tempG + heuristic(neighbor, end);
        neighbor.previous = current;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
  alert("No path found!");
}

function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col); // Manhattan distance
}

