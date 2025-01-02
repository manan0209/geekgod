// src/app/page.tsx

import Link from 'next/link';

const categories = [
  {
    title: 'Sorting Algorithms',
    description: 'Visualize algorithms like Bubble Sort, Merge Sort, and Quick Sort.',
    link: '/sorting',
    bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
  },
  {
    title: 'Pathfinding Algorithms',
    description: 'Learn algorithms like Dijkstra, A*, BFS, and DFS.',
    link: '/pathfinding',
    bgColor: 'bg-gradient-to-r from-green-400 to-teal-500',
  },
  {
    title: 'Greedy Algorithms',
    description: 'Explore Prim’s, Kruskal’s, and other greedy strategies.',
    link: '/greedy',
    bgColor: 'bg-gradient-to-r from-pink-500 to-red-500',
  },
  {
    title: 'About the Creator',
    description: 'Learn about why and how GeekGod was built.',
    link: '/about',
    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <h1 className="text-4xl font-extrabold text-center mb-12 tracking-wide">
        Welcome to <span className="text-purple-400">GeekGod</span>
      </h1>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {categories.map((category) => (
          <div
            key={category.title}
            className={`${category.bgColor} shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform`}
          >
            <h2 className="text-2xl font-bold mb-3">{category.title}</h2>
            <p className="text-gray-200 mb-4">{category.description}</p>
            <Link
              href={category.link}
              className="inline-block bg-white text-gray-900 font-medium py-2 px-4 rounded hover:bg-gray-200"
            >
              Learn More →
            </Link>
          </div>
        ))}
      </div>
      <footer className="mt-16 text-center text-gray-500">
        © 2025 GeekGod. Built with ❤️ to visualize algorithms.
      </footer>
    </div>
  );
}
