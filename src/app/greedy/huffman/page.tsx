
export default function HuffmanPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400">Huffman Coding Visualization</h1>
        <p className="mb-6 text-gray-300">
          Huffman Coding is a greedy algorithm used for lossless data compression. It builds an optimal prefix code based on the frequencies of characters in the input.
        </p>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">How Huffman Coding Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Count the frequency of each character in the input.</li>
            <li>Create a priority queue (min-heap) of all characters, prioritized by frequency.</li>
            <li>While there is more than one node in the queue:</li>
            <ul className="list-disc list-inside ml-6">
              <li>Remove the two nodes with the lowest frequency.</li>
              <li>Create a new node with these two as children and frequency equal to their sum.</li>
              <li>Add the new node back to the queue.</li>
            </ul>
            <li>The remaining node is the root of the Huffman tree. Assign codes by traversing the tree.</li>
          </ol>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
          <p>Interactive visualization coming soon!</p>
        </div>
      </div>
    </div>
  );
}
