import Link from "next/link";

const algorithms = [
	{
		name: "A* Search",
		path: "/pathfinding/a-star",
		color: "bg-purple-600",
		description:
			"A* is an informed search algorithm that finds the shortest path efficiently using heuristics.",
	},
	{
		name: "Dijkstra's Algorithm",
		path: "/pathfinding/dijkstra",
		color: "bg-blue-600",
		description: "Dijkstra's algorithm finds the shortest path in graphs with non-negative weights.",
	},
	{
		name: "Breadth-First Search (BFS)",
		path: "/pathfinding/bfs",
		color: "bg-green-600",
		description:
			"BFS explores nodes layer by layer and always finds the shortest path in unweighted graphs.",
	},
	{
		name: "Depth-First Search (DFS)",
		path: "/pathfinding/dfs",
		color: "bg-yellow-600",
		description:
			"DFS explores as deep as possible before backtracking. It does not always find the shortest path.",
	},
];

export default function PathfindingPage() {
	return (
		<div className="min-h-screen bg-gray-900 text-white py-12">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="text-4xl font-bold mb-6 text-center">
					Pathfinding Algorithms
				</h1>
				<p className="text-lg text-gray-300 mb-10 text-center">
					Explore and visualize popular pathfinding algorithms. Click on any
					algorithm to learn more and interact with its visualization.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{algorithms.map((algo) => (
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
