export type NodeType = 'start' | 'end' | 'wall' | 'visited' | 'path' | 'unvisited';

export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  gScore: number;
  hScore: number;
  fScore: number;
  previousNode: Node | null;
}

export interface GridDimensions {
  rows: number;
  cols: number;
}

export interface PathfindingVisualizerProps {
  rows?: number;
  cols?: number;
  onVisualizationComplete?: () => void;
}
