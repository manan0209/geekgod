// src/components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-gray-800 p-4">
    <div className="container mx-auto flex justify-between">
      <h2 className="text-lg font-semibold text-white">Algorithm Visualizer</h2>
      <div className="flex space-x-4">
        <Link href="/sorting" className="text-white hover:underline">Sorting</Link>
        <Link href="/pathfinding" className="text-white hover:underline">Pathfinding</Link>
        <Link href="/greedy" className="text-white hover:underline">Greedy</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
