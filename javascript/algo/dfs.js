// javascript/Algorithms/dfs.js
import { animateVisitedNodes, animatePath, reconstructPath, getNeighbors } from "../util.js";

export async function dfs(grid, start, end) {
  const stack = [start];
  const visitedInOrder = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current.isWall || current.isVisited) continue;

    current.isVisited = true;
    visitedInOrder.push(current);

    if (current === end) {
      await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
      const path = reconstructPath(end);
      if (path.length === 1) {
        alert("No path found!");
        return;
      }
      await animatePath(path, start.element.id, end.element.id);
      return;
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previous = current;
        stack.push(neighbor);
      }
    }
  }

  // If end not found
  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
  alert("No path found!");
}
