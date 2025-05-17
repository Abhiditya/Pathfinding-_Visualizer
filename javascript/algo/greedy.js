import { animateVisitedNodes, animatePath, reconstructPath, getNeighbors } from "../util.js";

function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export async function greedyBestFirst(grid, start, end) {
  const openSet = [start];
  start.h = heuristic(start, end);
  const visitedInOrder = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.h - b.h);
    const current = openSet.shift();

    if (current.isWall || current.isVisited) continue;
    current.isVisited = true;
    visitedInOrder.push(current);

    if (current === end) {
      await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
      const path = reconstructPath(end);
      await animatePath(path, start.element.id, end.element.id);
      return;
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.h = heuristic(neighbor, end);
        neighbor.previous = current;
        openSet.push(neighbor);
      }
    }
  }

  // If no path found
  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
  alert("No path found!");
}
