"use client"
import PrimGraph, { Edge, Node } from "@/components/Greedy/PrimGraph";
import { useCallback, useEffect, useState } from "react";

function generateGraph() {
  const nodes: Node[] = [
    { id: 1, x: 200, y: 40 },
    { id: 2, x: 60, y: 120 },
    { id: 3, x: 340, y: 120 },
    { id: 4, x: 100, y: 260 },
    { id: 5, x: 300, y: 260 },
  ];
  const edges: Edge[] = [
    { id: 1, from: 1, to: 2, weight: 2 },
    { id: 2, from: 1, to: 3, weight: 3 },
    { id: 3, from: 2, to: 3, weight: 1 },
    { id: 4, from: 2, to: 4, weight: 4 },
    { id: 5, from: 3, to: 5, weight: 5 },
    { id: 6, from: 4, to: 5, weight: 7 },
    { id: 7, from: 3, to: 4, weight: 6 },
  ];
  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [edges[i].weight, edges[j].weight] = [edges[j].weight, edges[i].weight];
  }
  return { nodes, edges };
}

export default function PrimPage() {
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const [mstEdges, setMstEdges] = useState<Set<number>>(new Set());
  const [frontierEdges, setFrontierEdges] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [step, setStep] = useState(0);
  const [currentEdge, setCurrentEdge] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [history, setHistory] = useState<{ mst: Set<number>; visited: Set<number>; frontier: Set<number>; step: number; current: number | null }[]>([]);

  const nextStep = useCallback(() => {
    if (!graph) return;
    const { nodes, edges } = graph;
    // If MST is complete, do nothing
    if (mstEdges.size >= nodes.length - 1) return;
    const newVisited = new Set(visited);
    const newMstEdges = new Set(mstEdges);
    const newFrontier = new Set<number>();
    // If first step, pick node 1
    if (visited.size === 0) {
      newVisited.add(1);
    }
    // Find all edges from visited to unvisited
    edges.forEach((e) => {
      if ((newVisited.has(e.from) && !newVisited.has(e.to)) || (newVisited.has(e.to) && !newVisited.has(e.from))) {
        newFrontier.add(e.id);
      }
    });
    // Find the minimum weight edge in the frontier
    let minEdge: Edge | null = null;
    for (const eid of newFrontier) {
      const e = edges.find((ed) => ed.id === eid)!;
      if (!minEdge || e.weight < minEdge.weight) minEdge = e;
    }
    if (minEdge) {
      newMstEdges.add(minEdge.id);
      newVisited.add(minEdge.from);
      newVisited.add(minEdge.to);
      setCurrentEdge(minEdge.id);
    }
    setFrontierEdges(newFrontier);
    setMstEdges(newMstEdges);
    setVisited(newVisited);
    setHistory([...history, { mst: new Set(mstEdges), visited: new Set(visited), frontier: new Set(frontierEdges), step, current: currentEdge }]);
    setStep(step + 1);
  }, [graph, mstEdges, visited, history, frontierEdges, step, currentEdge]);

  useEffect(() => { setGraph(generateGraph()); }, []);

  useEffect(() => {
    if (!graph) return;
    if (autoPlay && mstEdges.size < graph.nodes.length - 1) {
      const t = setTimeout(nextStep, 900);
      return () => clearTimeout(t);
    }
    if (autoPlay) setAutoPlay(false);
  }, [autoPlay, mstEdges, graph, visited, frontierEdges, step, nextStep]);

  if (!graph) return null;
  const { nodes, edges } = graph;

  function reset() {
    setGraph(generateGraph());
    setMstEdges(new Set());
    setFrontierEdges(new Set());
    setVisited(new Set());
    setStep(0);
    setCurrentEdge(null);
    setAutoPlay(false);
    setHistory([]);
  }

  function undo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setMstEdges(new Set(prev.mst));
    setVisited(new Set(prev.visited));
    setFrontierEdges(new Set(prev.frontier));
    setStep(prev.step);
    setCurrentEdge(prev.current);
    setHistory(history.slice(0, -1));
    setAutoPlay(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Prim&apos;s Algorithm Visualization</h1>
        <p className="mb-6 text-gray-300">
          Prim&apos;s algorithm is a greedy algorithm for finding the Minimum Spanning Tree (MST) of a connected, undirected graph. It grows the MST from a starting node, always adding the smallest edge that connects a new vertex.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <PrimGraph
            nodes={nodes}
            edges={edges}
            mstEdges={mstEdges}
            frontierEdges={frontierEdges}
            currentEdge={currentEdge}
          />
          <div className="flex flex-col gap-3 w-full md:w-56">
            <button onClick={nextStep} disabled={mstEdges.size >= nodes.length - 1} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-medium disabled:opacity-50">Next Step</button>
            <button onClick={() => setAutoPlay(!autoPlay)} disabled={mstEdges.size >= nodes.length - 1} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50">{autoPlay ? "Pause" : "Auto Play"}</button>
            <button onClick={undo} disabled={history.length === 0} className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 font-medium disabled:opacity-50">Undo</button>
            <button onClick={reset} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 font-medium">Random Graph</button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">How Prim&apos;s Algorithm Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Start with any node as the initial MST.</li>
            <li>At each step, add the smallest edge that connects a vertex in the MST to a vertex outside the MST (<span className='text-blue-400'>blue</span>).</li>
            <li>Frontier edges are highlighted <span className='text-yellow-400'>yellow</span>. The current edge is <span className='text-cyan-400'>cyan</span>.</li>
            <li>Repeat until all vertices are included in the MST.</li>
          </ol>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
          <p>
            <span className="text-blue-400 font-bold">Blue</span>: Edge in MST &nbsp;|
            <span className="text-yellow-400 font-bold"> Yellow</span>: Frontier edge &nbsp;|
            <span className="text-cyan-400 font-bold"> Cyan</span>: Current edge
          </p>
        </div>
      </div>
    </div>
  );
}
