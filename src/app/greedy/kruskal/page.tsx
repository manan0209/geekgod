"use client";

import KruskalGraph, { Edge, Node } from "@/components/Greedy/KruskalGraph";
import { useEffect, useState } from "react";

// Helper: generate a small random connected graph
function generateGraph() {
  // Fixed layout for clarity (5 nodes)
  const nodes: Node[] = [
    { id: 1, x: 200, y: 40 },
    { id: 2, x: 60, y: 120 },
    { id: 3, x: 340, y: 120 },
    { id: 4, x: 100, y: 260 },
    { id: 5, x: 300, y: 260 },
  ];
  // Edges (undirected, unique id)
  const edges: Edge[] = [
    { id: 1, from: 1, to: 2, weight: 2 },
    { id: 2, from: 1, to: 3, weight: 3 },
    { id: 3, from: 2, to: 3, weight: 1 },
    { id: 4, from: 2, to: 4, weight: 4 },
    { id: 5, from: 3, to: 5, weight: 5 },
    { id: 6, from: 4, to: 5, weight: 7 },
    { id: 7, from: 3, to: 4, weight: 6 },
  ];
  // Shuffle weights for variety
  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [edges[i].weight, edges[j].weight] = [edges[j].weight, edges[i].weight];
  }
  return { nodes, edges };
}

// Union-Find for cycle detection
function find(parent: number[], i: number): number {
  if (parent[i] !== i) parent[i] = find(parent, parent[i]);
  return parent[i];
}
function union(parent: number[], rank: number[], x: number, y: number) {
  const xroot = find(parent, x);
  const yroot = find(parent, y);
  if (xroot === yroot) return;
  if (rank[xroot] < rank[yroot]) parent[xroot] = yroot;
  else if (rank[xroot] > rank[yroot]) parent[yroot] = xroot;
  else { parent[yroot] = xroot; rank[xroot]++; }
}

export default function KruskalPage() {
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const [step, setStep] = useState(0);
  const [mstEdges, setMstEdges] = useState<Set<number>>(new Set());
  const [cycleEdges, setCycleEdges] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<{ mst: Set<number>; cycle: Set<number>; step: number }[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);

  // Generate graph only on client
  useEffect(() => {
    setGraph(generateGraph());
  }, []);

  // Auto play effect (must always be called)
  useEffect(() => {
    if (!graph) return;
    const { nodes, edges } = graph;
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    if (autoPlay && step < sortedEdges.length && mstEdges.size < nodes.length - 1) {
      const t = setTimeout(() => {
        // nextStep logic inline to avoid closure issues
        // Union-Find setup
        const parent = Array(nodes.length + 1).fill(0).map((_, i) => i);
        const rank = Array(nodes.length + 1).fill(0);
        mstEdges.forEach((eid) => {
          const e = edges.find((ed) => ed.id === eid)!;
          union(parent, rank, e.from, e.to);
        });
        const edge = sortedEdges[step];
        const fromRoot = find(parent, edge.from);
        const toRoot = find(parent, edge.to);
        if (fromRoot !== toRoot) {
          setMstEdges(new Set([...mstEdges, edge.id]));
          setCycleEdges(new Set([...cycleEdges]));
        } else {
          setCycleEdges(new Set([...cycleEdges, edge.id]));
        }
        setHistory([...history, { mst: new Set(mstEdges), cycle: new Set(cycleEdges), step }]);
        setStep(step + 1);
      }, 900);
      return () => clearTimeout(t);
    }
    if (autoPlay) setAutoPlay(false);
  }, [autoPlay, step, mstEdges, cycleEdges, history, graph]);

  // All hooks above this line!
  if (!graph) return null; // or a loading spinner
  const { nodes, edges } = graph;

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const currentEdge = step < sortedEdges.length ? sortedEdges[step].id : null;

  // Step through Kruskal's algorithm
  function nextStep() {
    if (step >= sortedEdges.length || mstEdges.size >= nodes.length - 1) return;
    // Union-Find setup
    const parent = Array(nodes.length + 1).fill(0).map((_, i) => i);
    const rank = Array(nodes.length + 1).fill(0);
    // Rebuild MST so far
    mstEdges.forEach((eid) => {
      const e = edges.find((ed) => ed.id === eid)!;
      union(parent, rank, e.from, e.to);
    });
    // Next edge
    const edge = sortedEdges[step];
    const fromRoot = find(parent, edge.from);
    const toRoot = find(parent, edge.to);
    if (fromRoot !== toRoot) {
      // Add to MST
      setMstEdges(new Set([...mstEdges, edge.id]));
      setCycleEdges(new Set([...cycleEdges]));
    } else {
      // Would form a cycle
      setCycleEdges(new Set([...cycleEdges, edge.id]));
    }
    setHistory([...history, { mst: new Set(mstEdges), cycle: new Set(cycleEdges), step }]);
    setStep(step + 1);
  }

  function reset() {
    setGraph(generateGraph());
    setStep(0);
    setMstEdges(new Set());
    setCycleEdges(new Set());
    setHistory([]);
    setAutoPlay(false);
  }

  // Undo (optional)
  function undo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setMstEdges(new Set(prev.mst));
    setCycleEdges(new Set(prev.cycle));
    setStep(prev.step);
    setHistory(history.slice(0, -1));
    setAutoPlay(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-green-400">Kruskal&apos;s Algorithm Visualization</h1>
        <p className="mb-6 text-gray-300">
          Kruskal&apos;s algorithm is a classic greedy algorithm for finding the Minimum Spanning Tree (MST) of a connected, undirected graph. It always picks the smallest edge that doesn&apos;t form a cycle, gradually building the MST.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <KruskalGraph
            nodes={nodes}
            edges={edges}
            mstEdges={mstEdges}
            currentEdge={currentEdge}
            cycleEdges={cycleEdges}
          />
          <div className="flex flex-col gap-3 w-full md:w-56">
            <button onClick={nextStep} disabled={step >= sortedEdges.length || mstEdges.size >= nodes.length - 1} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50">Next Step</button>
            <button onClick={() => setAutoPlay(!autoPlay)} disabled={step >= sortedEdges.length || mstEdges.size >= nodes.length - 1} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-medium disabled:opacity-50">{autoPlay ? "Pause" : "Auto Play"}</button>
            <button onClick={undo} disabled={history.length === 0} className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 font-medium disabled:opacity-50">Undo</button>
            <button onClick={reset} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 font-medium">Random Graph</button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">How Kruskal&apos;s Algorithm Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Sort all edges in the graph by increasing weight.</li>
            <li>Initialize the MST as an empty set.</li>
            <li>Iterate through the sorted edges:</li>
            <ul className="list-disc list-inside ml-6">
              <li>If adding the edge does not form a cycle, add it to the MST (highlighted <span className='text-green-400'>green</span>).</li>
              <li>Otherwise, skip the edge (highlighted <span className='text-red-400'>red</span>).</li>
            </ul>
            <li>Repeat until the MST contains (V-1) edges, where V is the number of vertices.</li>
          </ol>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
          <p>
            <span className="text-green-400 font-bold">Green</span>: Edge in MST &nbsp;|
            <span className="text-yellow-400 font-bold"> Yellow</span>: Current edge &nbsp;|
            <span className="text-red-400 font-bold"> Red</span>: Would form a cycle
          </p>
        </div>
      </div>
    </div>
  );
}
