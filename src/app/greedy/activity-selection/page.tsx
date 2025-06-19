
export default function ActivitySelectionPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Activity Selection Visualization</h1>
        <p className="mb-6 text-gray-300">
          The Activity Selection problem is a classic greedy algorithm problem. The goal is to select the maximum number of non-overlapping activities from a set, always picking the next activity that finishes earliest.
        </p>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">How Activity Selection Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Sort all activities by their finish time.</li>
            <li>Select the first activity (with the earliest finish time).</li>
            <li>For each subsequent activity, if its start time is after or equal to the finish time of the last selected activity, select it.</li>
            <li>Repeat until all activities are considered.</li>
          </ol>
        </div>
        <div className="bg-gray-700 rounded-lg p-6 text-center text-gray-400">
          <p>Interactive visualization coming soon!</p>
        </div>
      </div>
    </div>
  );
}
