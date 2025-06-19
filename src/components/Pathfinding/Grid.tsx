'use client';

import { useState, useEffect, useCallback } from 'react';
import { Node, NodeType, GridDimensions } from '@/types/pathfinding';

interface GridProps {
  rows: number;
  cols: number;
  onNodeClick: (node: Node) => void;
  onNodeDrag: (node: Node) => void;
  startNode: { row: number; col: number };
  endNode: { row: number; col: number };
  walls: { row: number; col: number }[];
  visitedNodes: { row: number; col: number }[];
  path: { row: number; col: number }[];
  isVisualizing: boolean;
}

const Grid = ({
  rows,
  cols,
  onNodeClick,
  onNodeDrag,
  startNode,
  endNode,
  walls,
  visitedNodes,
  path,
  isVisualizing,
}: GridProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [grid, setGrid] = useState<Node[][]>([]);

  // Initialize grid
  useEffect(() => {
    const newGrid: Node[][] = [];
    for (let row = 0; row < rows; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < cols; col++) {
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
  }, [rows, cols, startNode, endNode]);

  const getNodeType = (row: number, col: number): NodeType => {
    if (row === startNode.row && col === startNode.col) return 'start';
    if (row === endNode.row && col === endNode.col) return 'end';
    if (walls.some(wall => wall.row === row && wall.col === col)) return 'wall';
    if (path.some(node => node.row === row && node.col === col)) return 'path';
    if (visitedNodes.some(node => node.row === row && node.col === col)) return 'visited';
    return 'unvisited';
  };

  const getNodeClass = (nodeType: NodeType): string => {
    const baseClass = 'w-6 h-6 border border-gray-200 flex items-center justify-center transition-colors';
    
    switch (nodeType) {
      case 'start':
        return `${baseClass} bg-green-500`;
      case 'end':
        return `${baseClass} bg-red-500`;
      case 'wall':
        return `${baseClass} bg-gray-800`;
      case 'visited':
        return `${baseClass} bg-blue-400`;
      case 'path':
        return `${baseClass} bg-yellow-400`;
      default:
        return `${baseClass} bg-white`;
    }
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsMouseDown(true);
    onNodeClick(grid[row][col]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isMouseDown) {
      onNodeDrag(grid[row][col]);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Add event listeners to handle mouse up outside the grid
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="grid gap-px bg-gray-200 p-2 rounded-lg overflow-auto"
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((node, colIdx) => {
          const nodeType = getNodeType(node.row, node.col);
          return (
            <div
              key={`${node.row}-${node.col}`}
              className={getNodeClass(nodeType)}
              onMouseDown={() => handleMouseDown(node.row, node.col)}
              onMouseEnter={() => handleMouseEnter(node.row, node.col)}
              onMouseUp={handleMouseUp}
              draggable={false}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
