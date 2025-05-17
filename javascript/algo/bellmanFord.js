import { animateVisitedNodes, animatePath, reconstructPath, getNeighbors } from "../util.js";

export async function bellmanFord(grid, start, end) {
  const nodes = grid.flat();
  start.distance = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    for (const node of nodes) {
      if (node.isWall) continue;
      const neighbors = getNeighbors(node, grid);
      for (const neighbor of neighbors) {
        if (node.distance + 1 < neighbor.distance) {
          neighbor.distance = node.distance + 1;
          neighbor.previous = node;
        }
      }
    }
  }

  // Reconstruct path and track visited nodes
  const visitedInOrder = [];
  let current = end;
  while (current && current.previous) {
    visitedInOrder.unshift(current);
    current = current.previous;
  }

  if (visitedInOrder.length === 0) {
    alert("No path found!");
    return;
  }

  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);

  const path = reconstructPath(end);
  await animatePath(path, start.element.id, end.element.id);
}

