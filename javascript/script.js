import { dijkstra } from "./algo/dijkstra.js";
import { aStar } from "./algo/astar.js";
import { bfs } from "./algo/bfs.js";
import { dfs } from "./algo/dfs.js";
import { greedyBestFirst } from "./algo/greedy.js";
import { bellmanFord } from "./algo/bellmanFord.js";
import { bidirectionalSearch } from "./algo/bidirectional.js";
import {
  generateBasicRandomMaze,
  generateSimpleStairsPattern,
  generateRecursiveDivisionHorizontal,
  generateRecursiveDivisionVertical
} from "./maze.js";

// State
let moveMode = null; // "origin" or "destination"
let originTileId = null;
let destinationTileId = null;
let isMouseDown = false;
let isDisabled = false;

//disable enable
function disable() {
  document.getElementById("algorithm").disabled = true;
  document.getElementById("algorithm").classList.add('disable');
  document.getElementById("patterns").disabled = true;
  document.getElementById("patterns").classList.add('disable');
  const startButton = document.getElementById("start");
  startButton.removeEventListener('click', visualize);
  startButton.classList.add('disable');
  document.getElementById("clearPath")?.classList.add('disable');
  document.getElementById("clearPath")?.removeEventListener('click', clearPath);
  isDisabled = true;
}
function enable() {
  document.getElementById("algorithm").disabled = false;
  document.getElementById("algorithm").classList.remove("disable");
  document.getElementById("patterns").disabled = false;
  document.getElementById("patterns").classList.remove("disable");
  const startButton = document.getElementById("start");
  startButton.addEventListener("click", visualize);
  startButton.classList.remove("disable");
  document.getElementById("clearPath")?.classList.remove("disable");
  document.getElementById("clearPath")?.addEventListener("click", clearPath);

  isDisabled = false;
}


// Board setup and rendering
function displayBoard() {
  if (isDisabled) enable();
  const minTileSize = 30;
  const container = document.getElementById("board");
  
  //board dynamic size allocation
  const usableWidth = window.innerWidth * 0.8;
  const usableHeight = window.innerHeight * 0.8;

  const cols = Math.floor(usableWidth / minTileSize);
  const rows = Math.floor(usableHeight / minTileSize);

  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (let i = 0; i < cols * rows; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.id = `tile-${i}`;

    // mouse--->destop and  touch---->touchscreen
    tile.addEventListener("mousedown", (e) => handleInteractionStart(e, tile));
    tile.addEventListener("touchstart", (e) => handleInteractionStart(e, tile), { passive: false });

    tile.addEventListener("mouseenter", () => {
      if (isMouseDown) {
        if (moveMode) {
          moveIconToTile(moveMode, tile);
          tile.classList.remove("wall");
        } else {
          handleWallToggle(tile);
        }
      }
    });

    tile.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.classList.contains("tile")) {
        if (isMouseDown) {
          if (moveMode) {
            moveIconToTile(moveMode, element);
            element.classList.remove("wall");
          } else {
            handleWallToggle(element);
          }
        }
      }
    });

    container.appendChild(tile);
  }

  // origin & destination icon placement
  const middleRow = Math.floor(rows / 2);
  const originCol = Math.floor(cols / 6);
  const destinationCol = Math.floor(cols * 5 / 6);

  originTileId = `tile-${middleRow * cols + originCol}`;
  destinationTileId = `tile-${middleRow * cols + destinationCol}`;

  renderIcons();
}

// Render icons
function renderIcons() {
    document.querySelectorAll(".tile.origin, .tile.destination").forEach(tile => {
        tile.classList.remove("origin", "destination");
        tile.innerHTML = "";
    });

    const originTile = document.getElementById(originTileId);
    originTile.classList.add("origin");
    originTile.innerHTML = '<i class="fa-sharp fa-solid fa-person-running icon origin-icon bounce"></i>';

    const destinationTile = document.getElementById(destinationTileId);
    destinationTile.classList.add("destination");
    destinationTile.innerHTML = '<i class="fa-sharp fa-solid fa-flag icon destination-icon bounce"></i>';
}

// Move icons
function moveIconToTile(iconType, tile) {
    if (tile.id === originTileId || tile.id === destinationTileId) return;
    if (tile.classList.contains("wall")) tile.classList.remove("wall");
    if (tile.classList.contains('visited')) tile.classList.remove('visited');
    if (tile.classList.contains('path')) tile.classList.remove('path');
    if (iconType === "origin") originTileId = tile.id;
    else destinationTileId = tile.id;

    renderIcons();
}

// Wall toggle
function handleWallToggle(tile) {
  if (tile.id === originTileId || tile.id === destinationTileId) return;
  if (tile.classList.contains('visited')) tile.classList.remove('visited');
  if (tile.classList.contains('path')) tile.classList.remove('path');
  tile.classList.toggle("wall");
}

// Global mouse/touch state
document.addEventListener("mouseup", () => {
    isMouseDown = false;
    moveMode = null;
});
document.addEventListener("touchend", () => {
    isMouseDown = false;
    moveMode = null;
});

// Init and resize
function setupSmartResize(minTileSize = 30) {
  let lastCols = 0;
  let lastRows = 0;

  function safeResize() {
    const usableWidth = window.innerWidth * 0.8;
    const usableHeight = window.innerHeight * 0.8;

    const cols = Math.floor(usableWidth / minTileSize);
    const rows = Math.floor(usableHeight / minTileSize);

    if (cols !== lastCols || rows !== lastRows) {
      lastCols = cols;
      lastRows = rows;
      displayBoard();
    }
  }

  window.addEventListener("resize", () => { setTimeout(safeResize, 100); });
}
window.addEventListener("DOMContentLoaded", () => {
  displayBoard();
  setupSmartResize();
});


// Pattern selection
document.getElementById("patterns").addEventListener("change", (e) => {
  const patternValue = e.target.value;
  const tiles = document.querySelectorAll(".tile");
  const cols = parseInt(getComputedStyle(document.getElementById("board")).gridTemplateColumns.split(" ").length);
  const rows = tiles.length / cols;

  const grid = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => tiles[row * cols + col])
  );

  displayBoard();

  switch (patternValue) {
    case "1":
      generateBasicRandomMaze(grid, rows, cols, originTileId, destinationTileId);
      break;
    case "2":
      generateSimpleStairsPattern(grid, rows, cols, originTileId, destinationTileId);
      break;
    case "3":
      generateRecursiveDivisionHorizontal(grid, 0, rows - 1, 0, cols - 1, originTileId, destinationTileId);
      break;
    case "4":
      generateRecursiveDivisionVertical(grid, 0, rows - 1, 0, cols - 1, originTileId, destinationTileId);
      break;
  }

  document.getElementById("patterns").value = "0";
});


// Interaction start
function handleInteractionStart(e, tile) {
    isMouseDown = true;
    if (e.cancelable) e.preventDefault();

    if (tile.querySelector(".origin-icon")) {
        moveMode = "origin";
    } else if (tile.querySelector(".destination-icon")) {
        moveMode = "destination";
    } else {
        handleWallToggle(tile);
    }
}

//Visualize
async function visualize() {
  const algorithmSelect = document.getElementById("algorithm");
  const selectedAlgorithm = algorithmSelect.value;

  if (selectedAlgorithm === "0") {
    alert("Please select an algorithm!");
    return;
  }

  const algorithmMessages = {
    "1": "🔍 Dijkstra's Algorithm: Guarantees the shortest path — like Google Maps, but for grids!",
    "2": "🌟 A* Search: Fast and smart — uses both distance and estimated cost to find the shortest path efficiently.",
    "3": "📚 Breadth-First Search (BFS): Explores evenly in all directions — great for unweighted graphs!",
    "4": "🧭 Depth-First Search (DFS): Dives deep before backtracking — not always optimal, but fun to watch.",
    "5": "⚡ Greedy Best-First Search: Always picks the closest-looking tile — quick, but can miss shorter paths!",
    "6": "📉 Bellman-Ford Algorithm: Handles negative weights — a bit slow, but very reliable.",
    "7": "🔁 Bidirectional Search: Two heads are better than one — starts from both ends and meets in the middle!",
  };
  
  const messageElement = document.getElementById("message");
  messageElement.textContent = algorithmMessages[selectedAlgorithm] || "Please select an algorithm!";


  disable();

  const tiles = document.querySelectorAll(".tile");
  const cols = parseInt(getComputedStyle(document.getElementById("board")).gridTemplateColumns.split(" ").length);
  const rows = tiles.length / cols;

  const grid = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const tile = tiles[row * cols + col];
      return {
        row,
        col,
        isWall: tile.classList.contains("wall"),
        isVisited: false,
        distance: Infinity,
        g: Infinity,
        f: Infinity,
        previous: null,
        element: tile,
      };
    })
  );

  const [originRow, originCol] = getCoordsFromId(originTileId, cols);
  const [destRow, destCol] = getCoordsFromId(destinationTileId, cols);

  const start = grid[originRow][originCol];
  const end = grid[destRow][destCol];

  clearPath();

  try {
    switch (selectedAlgorithm) {
      case "1":
        await dijkstra(grid, start, end);
        break;
      case "2":
        await aStar(grid, start, end);
        break;
      case "3":
        await bfs(grid, start, end);
        break;
      case "4":
        await dfs(grid, start, end);
        break;
      case "5":
        await greedyBestFirst(grid, start, end);
        break;
      case "6":
        await bellmanFord(grid, start, end);
        break;
      case "7":
        await bidirectionalSearch(grid, start, end);
        break;
      default:
        alert("Algorithm not implemented!");
    }
  } finally {
    enable();
  }
}

function getCoordsFromId(id, cols) {
  const index = parseInt(id.split("-")[1]);
  return [Math.floor(index / cols), index % cols];
}

function clearPath() {
  document.querySelectorAll(".tile.visited, .tile.path").forEach(tile => {
    tile.classList.remove("visited", "path");
  });
  
}

window.visualize = visualize;
document.getElementById("start").addEventListener("click", visualize);
document.querySelector(".newBoard").addEventListener("click", displayBoard);
document.querySelector(".clearPath").addEventListener("click", clearPath);


