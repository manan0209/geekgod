import React from "react";

export interface HuffmanNode {
  id: number;
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  x?: number;
  y?: number;
}

interface HuffmanTreeProps {
  root: HuffmanNode | null;
  highlightIds?: Set<number>;
}

function renderTree(node: HuffmanNode | undefined, x: number, y: number, level: number, highlightIds?: Set<number>) {
  if (!node) return null;
  const nodeRadius = 22;
  const gapX = 80 / (level + 1);
  const gapY = 70;
  const children: React.ReactNode[] = [];
  if (node.left) {
    children.push(
      <g key={node.left.id + "-edge"}>
        <line x1={x} y1={y} x2={x - gapX * 2} y2={y + gapY} stroke="#fff" strokeWidth={2} />
        {renderTree(node.left, x - gapX * 2, y + gapY, level + 1, highlightIds)}
      </g>
    );
  }
  if (node.right) {
    children.push(
      <g key={node.right.id + "-edge"}>
        <line x1={x} y1={y} x2={x + gapX * 2} y2={y + gapY} stroke="#fff" strokeWidth={2} />
        {renderTree(node.right, x + gapX * 2, y + gapY, level + 1, highlightIds)}
      </g>
    );
  }
  const color = highlightIds?.has(node.id) ? "#facc15" : "#fbbf24";
  return (
    <g key={node.id}>
      {children}
      <circle cx={x} cy={y} r={nodeRadius} fill={color} stroke="#fff" strokeWidth={2} />
      <text x={x} y={y - 6} textAnchor="middle" fontSize={16} fill="#222" fontWeight="bold">
        {node.char || ""}
      </text>
      <text x={x} y={y + 14} textAnchor="middle" fontSize={13} fill="#222">
        {node.freq}
      </text>
    </g>
  );
}

export default function HuffmanTree({ root, highlightIds }: HuffmanTreeProps) {
  if (!root) return null;
  return (
    <svg width={400} height={260} className="bg-gray-800 rounded-lg" style={{ maxWidth: "100%" }}>
      {renderTree(root, 200, 40, 1, highlightIds)}
    </svg>
  );
}
