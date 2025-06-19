"use client";

import Grid from "@/components/Pathfinding/Grid";
import { Node } from "@/types/pathfinding";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_ROWS = 15;
const DEFAULT_COLS = 30;
const SPEEDS = {
  SLOW: 100,
  NORMAL: 30,
  FAST: 10,
  INSTANT: 0,
};

function getNeighbors(node: Node, grid: Node[][]): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];
  for (const { dr, dc } of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
      const neighbor = grid[newRow][newCol];
      if (!neighbor.isWall) {
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
}

export default function DijkstraPage() {
  const [dimensions] = useState({ rows: DEFAULT_ROWS, cols: DEFAULT_COLS });
  const [startNode, setStartNode] = useState({ row: Math.floor(DEFAULT_ROWS / 2), col: 5 });
  const [endNode, setEndNode] = useState({ row: Math.floor(DEFAULT_ROWS / 2), col: DEFAULT_COLS - 5 });
  const [walls, setWalls] = useState<{ row: number; col: number }[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<{ row: number; col: number }[]>([]);
  const [path, setPath] = useState<{ row: number; col: number }[]>([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS.NORMAL);
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
    setVisitedNodes([]);
    setPath([]);
    setCurrentStep(0);
  }, [dimensions, startNode, endNode]);

  useEffect(() => {
    resetGrid();
  }, [dimensions, resetGrid]);

  const clearWalls = () => { setWalls([]); resetGrid(); };
  const clearPath = () => { setVisitedNodes([]); setPath([]); setCurrentStep(0); resetGrid(); };
  const togglePause = () => { setIsPaused(!isPaused); };
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setSpeed(Number(e.target.value)); };

  const delay = () => { if (speed === SPEEDS.INSTANT) return Promise.resolve(); return new Promise(resolve => setTimeout(resolve, speed)); };

  const visualizeDijkstra = async () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    clearPath();
    const gridCopy = JSON.parse(JSON.stringify(grid)) as Node[][];
    for (const row of gridCopy) {
      for (const node of row) {
        node.isVisited = false;
        node.isPath = false;
        node.gScore = Infinity;
        node.previousNode = null;
        node.isWall = walls.some(wall => wall.row === node.row && wall.col === node.col);
      }
    }
    const startNodeRef = gridCopy[startNode.row][startNode.col];
    const endNodeRef = gridCopy[endNode.row][endNode.col];
    startNodeRef.gScore = 0;
    const unvisited: Node[] = [];
    for (const row of gridCopy) for (const node of row) unvisited.push(node);
    while (unvisited.length > 0) {
      unvisited.sort((a, b) => a.gScore - b.gScore);
      const current = unvisited.shift()!;
      if (current.isWall) continue;
      if (current.gScore === Infinity) break;
      current.isVisited = true;
      if (!(current.row === startNode.row && current.col === startNode.col) && !(current.row === endNode.row && current.col === endNode.col)) {
        setVisitedNodes(prev => [...prev, { row: current.row, col: current.col }]);
        await delay();
      }
      if (current === endNodeRef) break;
      const neighbors = getNeighbors(current, gridCopy);
      for (const neighbor of neighbors) {
        if (neighbor.isVisited) continue;
        const tentativeG = current.gScore + 1;
        if (tentativeG < neighbor.gScore) {
          neighbor.gScore = tentativeG;
          neighbor.previousNode = current;
        }
      }
    }
    // Reconstruct path
    const pathNodes: Node[] = [];
    let curr: Node | null = endNodeRef;
    while (curr && curr.previousNode && curr !== startNodeRef) {
      pathNodes.unshift(curr);
      curr = curr.previousNode;
    }
    for (const node of pathNodes) {
      setPath(prev => [...prev, { row: node.row, col: node.col }]);
      await delay();
    }
    setIsVisualizing(false);
    setIsPaused(false);
  };

  const handleNodeClick = (node: Node) => {
    if (isVisualizing) return;
    if (node.row === startNode.row && node.col === startNode.col) { setIsMovingStart(true); return; }
    if (node.row === endNode.row && node.col === endNode.col) { setIsMovingEnd(true); return; }
    setWalls(prev => {
      const wallExists = prev.some(wall => wall.row === node.row && wall.col === node.col);
      if (wallExists) return prev.filter(wall => !(wall.row === node.row && wall.col === node.col));
      else return [...prev, { row: node.row, col: node.col }];
    });
  };

  const handleNodeDrag = (node: Node) => {
    if (!isMouseDown || isVisualizing) return;
    if ((node.row === startNode.row && node.col === startNode.col) || (node.row === endNode.row && node.col === endNode.col)) return;
    if (isMovingStart) { setStartNode({ row: node.row, col: node.col }); return; }
    if (isMovingEnd) { setEndNode({ row: node.row, col: node.col }); return; }
    setWalls(prev => {
      const wallExists = prev.some(wall => wall.row === node.row && wall.col === node.col);
      if (wallExists) return prev.filter(wall => !(wall.row === node.row && wall.col === node.col));
      else return [...prev, { row: node.row, col: node.col }];
    });
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMovingStart(false);
      setIsMovingEnd(false);
      setIsMouseDown(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => { window.removeEventListener("mouseup", handleMouseUp); };
  }, []);

  const explanationSteps = [
    { title: "1. Initialize", content: "Set the distance to the start node as 0 and all others as Infinity. Add all nodes to the unvisited set.", visual: "All nodes are unvisited. The start node has distance 0." },
    { title: "2. Visit Closest Node", content: "Pick the unvisited node with the smallest distance. Mark it as visited.", visual: "The node with the smallest distance is chosen next." },
    { title: "3. Update Neighbors", content: "For each unvisited neighbor, update its distance if a shorter path is found.", visual: "Neighbors get updated if a better path is found." },
    { title: "4. Repeat", content: "Continue until the end node is visited or all nodes are processed.", visual: "The process repeats until the shortest path is found or no path exists." },
    { title: "5. Reconstruct Path", content: "Trace back from the end node to the start node to get the shortest path.", visual: "The shortest path is highlighted." },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Dijkstra&apos;s Algorithm</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={visualizeDijkstra}
                    disabled={isVisualizing}
                    className={`px-4 py-2 rounded-md font-medium flex-1 ${isVisualizing ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    {isVisualizing ? (isPaused ? "Resume" : "Pause") : "Visualize Dijkstra"}
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
                    <option value={SPEEDS.NORMAL}>Normal ({SPEEDS.NORMAL}ms)</option>
                    <option value={SPEEDS.FAST}>Fast ({SPEEDS.FAST}ms)</option>
                    <option value={SPEEDS.INSTANT}>Instant</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">How Dijkstra&apos;s Algorithm Works</h2>
              <div className="space-y-6">
                {explanationSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-lg transition-all duration-200 ${currentStep === index ? "bg-gray-700/50 border-l-4 border-blue-500" : "bg-gray-800/50 hover:bg-gray-700/50"}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">{step.title}</h3>
                    <p className="text-gray-200 mb-3">{step.content}</p>
                    <div className="text-sm text-gray-300 bg-gray-900/30 p-3 rounded border border-gray-700">
                      <span className="text-yellow-300">💡 Pro Tip:</span> {step.visual}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 bg-gray-700/30 rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-300 mb-2">Distance</h4>
                    <p className="text-sm text-gray-300">The shortest known distance from the start node to each node.</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-300 mb-2">Unvisited Set</h4>
                    <p className="text-sm text-gray-300">All nodes start unvisited and are removed as they are processed.</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-300 mb-2">Optimality</h4>
                    <p className="text-gray-400 text-sm mt-2">Dijkstra&apos;s algorithm is guaranteed to find the shortest path in graphs with non-negative weights. &quot;Priority queue&quot; is used to always expand the lowest-cost node.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden"><div className="h-6"></div></div>
          </div>
          {/* Sidebar (reuse from A*) */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-green-500 rounded-sm flex-shrink-0"></div>
                  <div><p className="font-medium">Start Node</p><p className="text-xs text-gray-400">Click and drag to move</p></div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-red-500 rounded-sm flex-shrink-0"></div>
                  <div><p className="font-medium">End Node</p><p className="text-xs text-gray-400">Click and drag to move</p></div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded transition-colors">
                  <div className="w-5 h-5 bg-gray-600 rounded-sm flex-shrink-0"></div>
                  <div><p className="font-medium">Wall</p><p className="text-xs text-gray-400">Click to add/remove</p></div>
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
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">How to Use</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-blue-300 mb-1">1. Create Your Maze</h4>
                  <p className="text-sm text-gray-300">Click or drag on the grid to add or remove walls</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-green-300 mb-1">2. Position Start & End</h4>
                  <p className="text-sm text-gray-300">Drag the green and red nodes to set start and end points</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-yellow-300 mb-1">3. Visualize</h4>
                  <p className="text-sm text-gray-300">Click &quot;Visualize Dijkstra&quot; to find the shortest path</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h4 className="font-medium text-purple-300 mb-1">4. Experiment</h4>
                  <p className="text-sm text-gray-300">Try different mazes and see how Dijkstra finds the path</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">About Dijkstra</h3>
              <p className="text-sm text-gray-300 mb-4">Dijkstra&apos;s algorithm finds the shortest path between two points in a graph with non-negative weights.</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2"><span className="text-blue-400">⚡</span><div><p className="font-medium">Optimal</p><p className="text-xs text-gray-400">Always finds the shortest path</p></div></div>
                <div className="flex items-start gap-2"><span className="text-green-400">🧠</span><div><p className="font-medium">Systematic</p><p className="text-xs text-gray-400">Explores all possible paths efficiently</p></div></div>
                <div className="flex items-start gap-2"><span className="text-yellow-400">🎯</span><div><p className="font-medium">Versatile</p><p className="text-xs text-gray-400">Works on any graph with non-negative weights</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}