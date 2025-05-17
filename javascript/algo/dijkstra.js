// javascript/Algorithms/dijkstra.js
import { animateVisitedNodes, animatePath, reconstructPath, getNeighbors } from "../util.js";

export async function dijkstra(grid, start, end) {
  const unvisitedNodes = [];
  start.distance = 0;
  unvisitedNodes.push(start);

  const visitedInOrder = [];

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const current = unvisitedNodes.shift();

    if (current.isWall || current.isVisited) continue;

    current.isVisited = true;
    visitedInOrder.push(current);

    if (current === end) {
      // Wait for visited animation to complete
      await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
      
      const path = reconstructPath(end);
      if (path.length === 1) {
        alert("No path found!");
        return;
      }

      // Wait for path animation to complete
      await animatePath(path);
      return;
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const newDist = current.distance + 1;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.previous = current;
          unvisitedNodes.push(neighbor);
        }
      }
    }
  }

  // End of loop, no path found
  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
  alert("No path found!");
}
