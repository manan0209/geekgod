"use client";

import Grid from "@/components/Pathfinding/Grid";
import { useCallback, useEffect, useState } from "react";

// Node type for TypeScript
// type NodeType = "start" | "end" | "wall" | "visited" | "path" | "unvisited";

interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  gScore: number; // Cost from start to current node
  hScore: number; // Heuristic (estimated cost from current to end)
  fScore: number; // Total cost (gScore + hScore)
  previousNode: Node | null;
}

// Constants
const DEFAULT_ROWS = 15;
const DEFAULT_COLS = 30;
const SPEEDS = {
  SLOW: 100,
  NORMAL: 30,
  FAST: 10,
  INSTANT: 0,
};

// Heuristic function for A*
function heuristic(node: Node, endNode: Node): number {
  // Manhattan distance
  return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

// Get neighbors for a node
function getNeighbors(node: Node, grid: Node[][]): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  // Check all four directions
  const directions = [
    { dr: -1, dc: 0 }, // Up
    { dr: 1, dc: 0 }, // Down
    { dr: 0, dc: -1 }, // Left
    { dr: 0, dc: 1 }, // Right
  ];

  for (const { dr, dc } of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    // Check if the neighbor is within grid bounds
    if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
      const neighbor = grid[newRow][newCol];
      // Only add if it's not a wall
      if (!neighbor.isWall) {
        neighbors.push(neighbor);
      }
    }
  }

  return neighbors;
}

export default function AstarPage() {
  // Grid state
  const [dimensions] = useState({
    rows: DEFAULT_ROWS,
    cols: DEFAULT_COLS,
  });

  // Node positions
  const [startNode, setStartNode] = useState({
    row: Math.floor(DEFAULT_ROWS / 2),
    col: 5,
  });
  const [endNode, setEndNode] = useState({
    row: Math.floor(DEFAULT_ROWS / 2),
    col: DEFAULT_COLS - 5,
  });

  // Algorithm state
  const [walls, setWalls] = useState<{ row: number; col: number }[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<
    { row: number; col: number }[]
  >([]);
  const [path, setPath] = useState<{ row: number; col: number }[]>([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS.NORMAL);

  // UI state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMovingStart, setIsMovingStart] = useState(false);
  const [isMovingEnd, setIsMovingEnd] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [grid, setGrid] = useState<Node[][]>([]);

  const resetGrid = useCallback(() => {
    const newGrid: Node[][] = [];
    for (let row = 0; row < dimensions.rows; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < dimensions.cols; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === startNode.row && col === startNode.col,
          isEnd: row === endNode.row && col === endNode.col,
          isWall: false,
          isVisited: false,
          isPath: false,
          gScore: Infinity,
          hScore: 0,
          fScore: Infinity,
          previousNode: null,
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setPath([]);
    setVisitedNodes([]);
    setIsVisualizing(false);
  }, [dimensions, startNode, endNode]);

  // Initialize grid
  useEffect(() => {
    resetGrid();
  }, [dimensions, resetGrid]);

  const clearWalls = () => {
    setWalls([]);
    resetGrid();
  };

  const clearPath = () => {
    setVisitedNodes([]);
    setPath([]);
    setCurrentStep(0);
    resetGrid();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(Number(e.target.value));
  };

  // Helper function to delay execution for visualization
  const delay = () => {
    if (speed === SPEEDS.INSTANT) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, speed));
  };

  const visualizeAStar = async () => {
    if (isVisualizing) return;

    setIsVisualizing(true);
    clearPath();

    // Create a deep copy of the grid for the algorithm
    const gridCopy = JSON.parse(JSON.stringify(grid)) as Node[][];

    // Reset grid states
    for (const row of gridCopy) {
      for (const node of row) {
        node.isVisited = false;
        node.isPath = false;
        node.gScore = Infinity;
        node.hScore = 0;
        node.fScore = Infinity;
        node.previousNode = null;

        // Set walls
        node.isWall = walls.some(
          (wall) => wall.row === node.row && wall.col === node.col
        );
      }
    }

    const startNodeRef = gridCopy[startNode.row][startNode.col];
    const endNodeRef = gridCopy[endNode.row][endNode.col];

    // Initialize open set with start node
    const openSet: Node[] = [startNodeRef];
    const closedSet: Node[] = [];
    const cameFrom = new Map<Node, Node>();

    // Initialize scores
    const gScore = new Map<Node, number>();
    const fScore = new Map<Node, number>();

    gScore.set(startNodeRef, 0);
    fScore.set(startNodeRef, heuristic(startNodeRef, endNodeRef));

    try {
      // Main A* loop
      while (openSet.length > 0) {
        if (isPaused) {
          await new Promise((resolve) => {
            const checkPause = () => {
              if (!isPaused) return resolve(true);
              setTimeout(checkPause, 100);
            };
            checkPause();
          });
        }

        // Highlight current step in pseudocode
        setCurrentStep(2); // Highlight node selection

        // Find node with lowest fScore
        let current = openSet[0];
        for (const node of openSet) {
          const currentFScore = fScore.get(current) || Infinity;
          const nodeFScore = fScore.get(node) || Infinity;
          if (nodeFScore < currentFScore) {
            current = node;
          }
        }

        // Check if we've reached the end
        if (current === endNodeRef) {
          // Reconstruct path
          const pathNodes: Node[] = [];
          let pathNode: Node | undefined = current;

          while (pathNode) {
            pathNodes.unshift(pathNode);
            pathNode = cameFrom.get(pathNode);
          }

          // Animate path
          for (const node of pathNodes) {
            if (
              (node.row === startNode.row && node.col === startNode.col) ||
              (node.row === endNode.row && node.col === endNode.col)
            ) {
              continue;
            }

            setPath((prev) => [...prev, { row: node.row, col: node.col }]);
            await delay();
          }

          setCurrentStep(4); // Highlight path reconstruction
          break;
        }

        // Move current from open to closed set
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        // Add to visited nodes for visualization
        if (
          !(current.row === startNode.row && current.col === startNode.col) &&
          !(current.row === endNode.row && current.col === endNode.col)
        ) {
          setVisitedNodes((prev) => [
            ...prev,
            { row: current.row, col: current.col },
          ]);
        }

        // Check neighbors
        setCurrentStep(3); // Highlight neighbor checking
        const neighbors = getNeighbors(current, gridCopy);

        for (const neighbor of neighbors) {
          // Skip if in closed set
          if (closedSet.includes(neighbor)) continue;

          // Calculate tentative gScore
          const tentativeGScore = (gScore.get(current) || 0) + 1; // Assuming uniform edge cost

          // If neighbor not in open set, add it
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          } else if (tentativeGScore >= (gScore.get(neighbor) || Infinity)) {
            // This is not a better path
            continue;
          }

          // This is the best path so far, record it
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(
            neighbor,
            tentativeGScore + heuristic(neighbor, endNodeRef)
          );

          // Visualize the frontier
          if (
            !(
              neighbor.row === startNode.row && neighbor.col === startNode.col
            ) &&
            !(neighbor.row === endNode.row && neighbor.col === endNode.col)
          ) {
            await delay();
          }
        }

        // Small delay to make visualization visible
        await delay();
      }
    } catch (error) {
      console.error("Error during A* visualization:", error);
    } finally {
      setIsVisualizing(false);
      setIsPaused(false);
    }
  };

  const handleNodeClick = (node: Node) => {
    if (isVisualizing) return;

    // Check if clicking on start node
    if (node.row === startNode.row && node.col === startNode.col) {
      setIsMovingStart(true);
      return;
    }

    // Check if clicking on end node
    if (node.row === endNode.row && node.col === endNode.col) {
      setIsMovingEnd(true);
      return;
    }

    // Toggle wall
    setWalls((prev) => {
      const wallExists = prev.some(
        (wall) => wall.row === node.row && wall.col === node.col
      );
      if (wallExists) {
        return prev.filter(
          (wall) => !(wall.row === node.row && wall.col === node.col)
        );
      } else {
        return [...prev, { row: node.row, col: node.col }];
      }
    });
  };

  const handleNodeDrag = (node: Node) => {
    if (!isMouseDown || isVisualizing) return;

    // Don't allow walls on start/end nodes
    if (
      (node.row === startNode.row && node.col === startNode.col) ||
      (node.row === endNode.row && node.col === endNode.col)
    ) {
      return;
    }

    // Move start/end nodes if dragging them
    if (isMovingStart) {
      setStartNode({ row: node.row, col: node.col });
      return;
    }

    if (isMovingEnd) {
      setEndNode({ row: node.row, col: node.col });
      return;
    }

    // Toggle wall
    setWalls((prev) => {
      const wallExists = prev.some(
        (wall) => wall.row === node.row && wall.col === node.col
      );
      if (wallExists) {
        return prev.filter(
          (wall) => !(wall.row === node.row && wall.col === node.col)
        );
      } else {
        return [...prev, { row: node.row, col: node.col }];
      }
    });
  };

  // Handle mouse up to stop moving start/end nodes
  useEffect(() => {
    const handleMouseUp = () => {
      setIsMovingStart(false);
      setIsMovingEnd(false);
      setIsMouseDown(false);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Explanation steps for the algorithm explanation section
  const explanationSteps = [
    {
      title: "1. Initialize",
      content:
        "Start by adding the start node to the open set. Set the gScore of the start node to 0 and calculate its heuristic (hScore) to the end node.",
      visual:
        "The open set contains nodes to be evaluated. The start node is the first node in the open set.",
    },
    {
      title: "2. Select Node with Lowest f(n)",
      content:
        "From the open set, pick the node with the lowest f(n) = g(n) + h(n). This is the most promising node to explore next.",
      visual: "The node with the lowest f(n) is highlighted and expanded.",
    },
    {
      title: "3. Check for Goal",
      content:
        "If the current node is the end node, reconstruct the path by following the previous nodes.",
      visual: "If the end node is reached, the shortest path is traced back.",
    },
    {
      title: "4. Explore Neighbors",
      content:
        "For each neighbor of the current node, calculate tentative gScore. If this path is better, update the neighbor’s scores and set its previous node.",
      visual: "Neighbors are checked and updated if a better path is found.",
    },
    {
      title: "5. Repeat",
      content:
        "Continue the process until the open set is empty or the end node is reached.",
      visual:
        "The algorithm repeats until the shortest path is found or no path exists.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            A* Pathfinding Algorithm
          </h1>
          <div className="flex items-center gap-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <Grid
                rows={dimensions.rows}
                cols={dimensions.cols}
                onNodeClick={handleNodeClick}
                onNodeDrag={handleNodeDrag}
                startNode={startNode}
                endNode={endNode}
                walls={walls}
                visitedNodes={visitedNodes}
                path={path}
                isMouseDown={isMouseDown}
                onMouseDownChange={setIsMouseDown}
              />

              {/* Controls */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={visualizeAStar}
                    disabled={isVisualizing}
                    className={`px-4 py-2 rounded-md font-medium flex-1 ${
                      isVisualizing
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isVisualizing
                      ? isPaused
                        ? "Resume"
                        : "Pause"
                      : "Visualize A*"}
                  </button>

                  {isVisualizing && (
                    <button
                      onClick={togglePause}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md font-medium"
                    >
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                  )}

                  <button
                    onClick={clearPath}
                    disabled={isVisualizing && !isPaused}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear Path
                  </button>

                  <button
                    onClick={clearWalls}
                    disabled={isVisualizing && !isPaused}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear Walls
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <label className="text-sm font-medium">Speed:</label>
                  <select
                    value={speed}
                    onChange={handleSpeedChange}
                    disabled={isVisualizing && !isPaused}
                    className="bg-gray-700 text-white rounded px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value={SPEEDS.SLOW}>Slow ({SPEEDS.SLOW}ms)</option>
                    <option value={SPEEDS.NORMAL}>
                      Normal ({SPEEDS.NORMAL}ms)
                    </option>
                    <option value={SPEEDS.FAST}>Fast ({SPEEDS.FAST}ms)</option>
                    <option value={SPEEDS.INSTANT}>Instant</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Algorithm Explanation */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                How A* Pathfinding Works
              </h2>
              <div className="space-y-6">
                {explanationSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-lg transition-all duration-200 ${
                      currentStep === index
                        ? "bg-gray-700/50 border-l-4 border-blue-500"
                        : "bg-gray-800/50 hover:bg-gray-700/50"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-200 mb-3">{step.content}</p>
                    <div className="text-sm text-gray-300 bg-gray-900/30 p-3 rounded border border-gray-700">
                      <span className="text-yellow-300">💡 Pro Tip:</span>{" "}
                      {step.visual}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-gray-700/30 rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-300 mb-2">
                      f(n) = g(n) + h(n)
                    </h4>
                    <p className="text-sm text-gray-300">
                      The core formula A* uses to find the most promising path
                      to explore next.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-300 mb-2">g(n)</h4>
                    <p className="text-sm text-gray-300">
                      The exact cost of the path from the start node to node n.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-300 mb-2">h(n)</h4>
                    <p className="text-sm text-gray-300">
                      Heuristic function that estimates the cost from node n to
                      the goal.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-300 mb-2">
                      Optimality
                    </h4>
                    <p className="text-gray-400 text-sm mt-2">A* is guaranteed to find the shortest path if the heuristic is admissible (never overestimates the true cost). &quot;Manhattan distance&quot; is used here.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty div to maintain spacing */}
            <div className="lg:hidden">
              <div className="h-6"></div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
            {/* Legend */}
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-green-500 rounded-sm flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Start Node</p>
                    <p className="text-xs text-gray-400">
                      Click and drag to move
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-red-500 rounded-sm flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">End Node</p>
                    <p className="text-xs text-gray-400">
                      Click and drag to move
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-gray-600 rounded-sm flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Wall</p>
                    <p className="text-xs text-gray-400">Click to add/remove</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-blue-400 rounded-sm flex-shrink-0"></div>
                  <p className="font-medium">Visited Nodes</p>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-yellow-400 rounded-sm flex-shrink-0"></div>
                  <p className="font-medium">Shortest Path</p>
                </div>
              </div>
            </div>

            {/* How to Use */}
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">How to Use</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-blue-300 mb-1">
                    1. Create Your Maze
                  </h4>
                  <p className="text-sm text-gray-300">
                    Click or drag on the grid to add or remove walls
                  </p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-green-300 mb-1">
                    2. Position Start & End
                  </h4>
                  <p className="text-sm text-gray-300">
                    Drag the green and red nodes to set start and end points
                  </p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-yellow-300 mb-1">
                    3. Visualize
                  </h4>
                  <p className="text-sm text-gray-300">
                    Click &quot;Visualize A*&quot; to find the shortest path
                  </p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-purple-300 mb-1">
                    4. Experiment
                  </h4>
                  <p className="text-sm text-gray-300">
                    Try different mazes and see how A* finds the path
                  </p>
                </div>
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">About A*</h3>
              <p className="text-sm text-gray-300 mb-4">
                A* is a popular pathfinding algorithm that finds the shortest
                path between two points efficiently.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">⚡</span>
                  <div>
                    <p className="font-medium">Optimal</p>
                    <p className="text-xs text-gray-400">
                      Always finds the shortest path
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">🧠</span>
                  <div>
                    <p className="font-medium">Smart</p>
                    <p className="text-xs text-gray-400">
                      Uses heuristics to be efficient
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">🎯</span>
                  <div>
                    <p className="font-medium">Versatile</p>
                    <p className="text-xs text-gray-400">
                      Works with different grid layouts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
