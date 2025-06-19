"use client"

import HuffmanTree, { HuffmanNode } from "@/components/Greedy/HuffmanTree";
import { useEffect, useState } from "react";

function buildHuffmanTree(freqs: { [char: string]: number }) {
  let id = 1;
  let nodes: HuffmanNode[] = Object.entries(freqs).map(([char, freq]) => ({ id: id++, char, freq }));
  const steps: { nodes: HuffmanNode[]; highlight: Set<number> }[] = [];
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const [left, right] = [nodes[0], nodes[1]];
    const highlight = new Set([left.id, right.id]);
    steps.push({ nodes: nodes.map(n => ({ ...n })), highlight });
    const parent: HuffmanNode = { id: id++, freq: left.freq + right.freq, left, right };
    nodes = [parent, ...nodes.slice(2)];
  }
  steps.push({ nodes: nodes.map(n => ({ ...n })), highlight: new Set() });
  return { root: nodes[0], steps };
}

function getFrequencies(input: string) {
  const freq: { [char: string]: number } = {};
  for (const c of input) freq[c] = (freq[c] || 0) + 1;
  return freq;
}

export default function HuffmanPage() {
  const [input, setInput] = useState("huffman");
  const [freqs, setFreqs] = useState<{ [char: string]: number }>(() => getFrequencies("huffman"));
  const [tree, setTree] = useState<{ root: HuffmanNode; steps: { nodes: HuffmanNode[]; highlight: Set<number> }[] } | null>(null);
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    setFreqs(getFrequencies(input));
  }, [input]);
  useEffect(() => {
    const t = buildHuffmanTree(freqs);
    setTree(t);
    setStep(0);
    setAutoPlay(false);
  }, [freqs]);
  useEffect(() => {
    if (autoPlay && tree && step < tree.steps.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 1000);
      return () => clearTimeout(t);
    }
    if (autoPlay && tree && step >= tree.steps.length - 1) setAutoPlay(false);
  }, [autoPlay, step, tree]);

  if (!tree) return null;
  const { root, steps } = tree;
  const current = steps[step];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400">Huffman Coding Visualization</h1>
        <p className="mb-6 text-gray-300">
          Huffman Coding is a greedy algorithm used for lossless data compression. It builds an optimal prefix code based on the frequencies of characters in the input.
        </p>
        <div className="mb-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <label className="block mb-2 text-gray-200 font-medium">Input String:</label>
            <input
              value={input}
              onChange={e => setInput(e.target.value.replace(/[^a-z]/gi, '').slice(0, 12))}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter up to 12 letters"
              maxLength={12}
            />
            <div className="mt-2 text-sm text-gray-400">(Only letters, max 12 chars)</div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-56">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 font-medium disabled:opacity-50">Prev</button>
            <button onClick={() => setAutoPlay(!autoPlay)} disabled={step >= steps.length - 1} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 font-medium disabled:opacity-50">{autoPlay ? "Pause" : "Auto Play"}</button>
            <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step >= steps.length - 1} className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 font-medium disabled:opacity-50">Next</button>
            <button onClick={() => setStep(0)} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 font-medium">Reset</button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <div className="flex-1">
            <HuffmanTree root={root} highlightIds={current.highlight} />
          </div>
          <div className="w-full md:w-56 bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-yellow-300">Frequencies</h3>
            <ul className="text-gray-200">
              {Object.entries(freqs).map(([c, f]) => (
                <li key={c}><span className="font-bold text-yellow-400">{c}</span>: {f}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">How Huffman Coding Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Count the frequency of each character in the input.</li>
            <li>Create a priority queue (min-heap) of all characters, prioritized by frequency.</li>
            <li>While there is more than one node in the queue:
              <ul className="list-disc list-inside ml-6">
                <li>Remove the two nodes with the lowest frequency (<span className='text-yellow-400'>highlighted</span>).</li>
                <li>Create a new node with these two as children and frequency equal to their sum.</li>
                <li>Add the new node back to the queue.</li>
              </ul>
            </li>
            <li>The remaining node is the root of the Huffman tree. Assign codes by traversing the tree.</li>
          </ol>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
          <p>
            <span className="text-yellow-400 font-bold">Yellow</span>: Nodes being merged in this step
          </p>
        </div>
      </div>
    </div>
  );
}
