import { animateVisitedNodes, animatePath, reconstructPath, getNeighbors } from "../util.js";

export async function bfs(grid, start, end) {
  const queue = [start];
  const visitedInOrder = [];
  start.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift();
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
        neighbor.isVisited = true;
        neighbor.previous = current;
        queue.push(neighbor);
      }
    }
  }

  // If path not found
  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
  alert("No path found!");
}

