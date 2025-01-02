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
      </body>
    </html>
  );
}
