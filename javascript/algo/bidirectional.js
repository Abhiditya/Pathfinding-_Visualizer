import { animateVisitedNodes, animatePath, getNeighbors } from "../util.js";

export async function bidirectionalSearch(grid, start, end) {
  const queueStart = [start];
  const queueEnd = [end];

  const visitedStart = new Map(); // maps nodes to their parents
  const visitedEnd = new Map();

  const visitedInOrder = [];

  visitedStart.set(start, null);
  visitedEnd.set(end, null);

  while (queueStart.length && queueEnd.length) {
    const currentFromStart = queueStart.shift();
    const currentFromEnd = queueEnd.shift();

    visitedInOrder.push(currentFromStart, currentFromEnd);

    if (visitedEnd.has(currentFromStart)) {
      const meetingNode = currentFromStart;
      await visualizePath(meetingNode, visitedStart, visitedEnd, visitedInOrder, start, end);
      return;
    }

    if (visitedStart.has(currentFromEnd)) {
      const meetingNode = currentFromEnd;
      await visualizePath(meetingNode, visitedStart, visitedEnd, visitedInOrder, start, end);
      return;
    }

    for (const neighbor of getNeighbors(currentFromStart, grid)) {
      if (!visitedStart.has(neighbor) && !neighbor.isWall) {
        visitedStart.set(neighbor, currentFromStart);
        queueStart.push(neighbor);
      }
    }

    for (const neighbor of getNeighbors(currentFromEnd, grid)) {
      if (!visitedEnd.has(neighbor) && !neighbor.isWall) {
        visitedEnd.set(neighbor, currentFromEnd);
        queueEnd.push(neighbor);
      }
    }
  }

  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
  alert("No path found!");
}

async function visualizePath(meetingNode, visitedStart, visitedEnd, visitedInOrder, start, end) {
  const pathStart = [];
  let node = meetingNode;
  while (node !== null) {
    pathStart.unshift(node);
    node = visitedStart.get(node);
  }

  const pathEnd = [];
  node = visitedEnd.get(meetingNode);
  while (node !== null) {
    pathEnd.push(node);
    node = visitedEnd.get(node);
  }

  const fullPath = [...pathStart, ...pathEnd];

  await animateVisitedNodes(visitedInOrder, start.element.id, end.element.id);
  await animatePath(fullPath, start.element.id, end.element.id);
}

