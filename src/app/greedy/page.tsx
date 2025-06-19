import Link from "next/link";

const greedyAlgos = [
	{
		name: "Kruskal's Algorithm",
		path: "/greedy/kruskal",
		color: "bg-green-600",
		description:
			"Finds the Minimum Spanning Tree of a graph by always choosing the smallest edge that doesn't form a cycle.",
	},
	{
		name: "Prim's Algorithm",
		path: "/greedy/prim",
		color: "bg-blue-600",
		description:
			"Builds a Minimum Spanning Tree by growing from a starting node, always adding the smallest edge to the tree.",
	},
	{
		name: "Huffman Coding",
		path: "/greedy/huffman",
		color: "bg-yellow-600",
		description:
			"Constructs an optimal prefix code for data compression using a greedy approach.",
	},
	{
		name: "Activity Selection",
		path: "/greedy/activity-selection",
		color: "bg-purple-600",
		description:
			"Selects the maximum number of non-overlapping activities by always picking the next activity that finishes earliest.",
	},
];

export default function GreedyPage() {
	return (
		<div className="min-h-screen bg-gray-900 text-white py-12">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="text-4xl font-bold mb-6 text-center">
					Greedy Algorithms
				</h1>
				<p className="text-lg text-gray-300 mb-10 text-center">
					Discover and visualize classic greedy algorithms. Click on any
					algorithm to learn more and interact with its visualization.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{greedyAlgos.map((algo) => (
						<div
							key={algo.name}
							className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between"
						>
							<div>
								<h2
									className={`text-2xl font-semibold mb-2 ${algo.color} bg-clip-text text-transparent bg-gradient-to-r`}
								>
									{algo.name}
								</h2>
								<p className="text-gray-300 mb-4">
									{algo.description}
								</p>
							</div>
							<Link
								href={algo.path}
								className={`inline-block mt-auto px-5 py-2 rounded-md font-medium text-white ${algo.color} hover:brightness-110 transition-all text-center`}
							>
								Visualize {algo.name}
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
