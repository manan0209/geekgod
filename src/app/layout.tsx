// src/app/layout.tsx
"use client";
import './globals.css';
import Link from 'next/link';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <body className="bg-gray-900 text-gray-100">
        <nav className="sticky top-0 z-10 bg-gray-800 text-white shadow-md py-4">
          <div className="container mx-auto flex justify-between items-center px-6">
            <Link href="/" className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              GeekGod
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/sorting"
                className="hover:text-purple-400 transition-colors"
              >
                Sorting
              </Link>
              <Link
                href="/pathfinding"
                className="hover:text-green-400 transition-colors"
              >
                Pathfinding
              </Link>
              <Link
                href="/greedy"
                className="hover:text-pink-400 transition-colors"
              >
                Greedy
              </Link>
              <Link
                href="/about"
                className="hover:text-blue-400 transition-colors"
              >
                About
              </Link>
              <button
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Dark Mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-900 text-gray-400 py-4 mt-8 text-center">
          <p className="text-sm">
            © 2025 <span className="font-bold text-gray-200">GeekGod</span>. Built with 
            <span className="text-red-500 mx-1">❤️</span>by 
            <a href="https://github.com/manan0209" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">
              devmnn
            </a> 
            to visualize algorithms and make learning fun!
          </p>
        </footer>
      </body>
    </html>
  );
}
