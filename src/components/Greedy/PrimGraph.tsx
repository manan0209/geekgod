
export interface Node {
  id: number;
  x: number;
  y: number;
}

export interface Edge {
  id: number;
  from: number;
  to: number;
  weight: number;
}

interface PrimGraphProps {
  nodes: Node[];
  edges: Edge[];
  mstEdges: Set<number>;
  frontierEdges: Set<number>;
  currentEdge: number | null;
}

export default function PrimGraph({ nodes, edges, mstEdges, frontierEdges, currentEdge }: PrimGraphProps) {
  const width = 400;
  const height = 320;
  const getNode = (id: number) => nodes.find((n) => n.id === id)!;

  return (
    <svg width={width} height={height} className="bg-gray-800 rounded-lg" style={{ maxWidth: "100%" }}>
      {/* Draw edges */}
      {edges.map((edge) => {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        let color = "#888";
        if (mstEdges.has(edge.id)) color = "#3b82f6"; // blue for MST
        else if (frontierEdges.has(edge.id)) color = "#facc15"; // yellow for frontier
        else if (currentEdge === edge.id) color = "#22d3ee"; // cyan for current
        return (
          <g key={edge.id}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth={mstEdges.has(edge.id) ? 4 : 2}
              opacity={frontierEdges.has(edge.id) ? 0.7 : 1}
            />
            <text
              x={(from.x + to.x) / 2}
              y={(from.y + to.y) / 2 - 8}
              fill="#fff"
              fontSize={14}
              textAnchor="middle"
            >
              {edge.weight}
            </text>
          </g>
        );
      })}
      {/* Draw nodes */}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r={18} fill="#2563eb" stroke="#fff" strokeWidth={2} />
          <text x={node.x} y={node.y + 5} fill="#fff" fontSize={16} textAnchor="middle" fontWeight="bold">
            {node.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
