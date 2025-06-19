
export default function PrimPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Prim's Algorithm Visualization</h1>
        <p className="mb-6 text-gray-300">
          Prim's algorithm is a greedy algorithm for finding the Minimum Spanning Tree (MST) of a connected, undirected graph. It grows the MST from a starting node, always adding the smallest edge that connects a new vertex.
        </p>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">How Prim's Algorithm Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Start with any node as the initial MST.</li>
            <li>At each step, add the smallest edge that connects a vertex in the MST to a vertex outside the MST.</li>
            <li>Repeat until all vertices are included in the MST.</li>
          </ol>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
          <p>Interactive visualization coming soon!</p>
        </div>
      </div>
    </div>
  );
}
