"use client";
import Image from "next/image";
import Navbar from "../components/Navbar"; // Import the Navbar component
import "./globals.css";
//import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //const [darkMode] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>GeekGod - Interactive Algorithm Visualizer</title>
        <meta name="description" content="Visualize sorting, pathfinding, and greedy algorithms interactively. Learn computer science with beautiful, step-by-step visualizations. GeekGod is a modern, open-source algorithm visualizer built with Next.js and Tailwind CSS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#18181b" />
        <meta property="og:title" content="GeekGod - Interactive Algorithm Visualizer" />
        <meta property="og:description" content="Visualize sorting, pathfinding, and greedy algorithms interactively. Learn computer science with beautiful, step-by-step visualizations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://geekgod.vercel.app/" />
        <meta property="og:image" content="/geekgodlogo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GeekGod - Interactive Algorithm Visualizer" />
        <meta name="twitter:description" content="Visualize sorting, pathfinding, and greedy algorithms interactively. Learn computer science with beautiful, step-by-step visualizations." />
        <meta name="twitter:image" content="/geekgodlogo.jpg" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="canonical" href="https://geekgod.vercel.app/" />
      </head>
      <body className="bg-gray-900 text-gray-100 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Redesigned Footer */}
        <footer className="backdrop-blur-md bg-gray-900/80 border-t border-gray-800 text-gray-400 mt-12">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/geekgodlogo.jpg"
                alt="GeekGod Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-purple-400"
                priority
              />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text select-none">
                GeekGod
              </span>
            </div>
            <div className="text-sm text-gray-400 text-center md:text-right">
              © {new Date().getFullYear()} Manan Goel. Made with{" "}
              <span className="text-pink-400">♥</span> to make algorithms easy
              for everyone.
            </div>
            <div className="flex gap-3">
              <a
                href="https://github.com/manan0209"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                GitHub
              </a>
              <a
                href="mailto:manangoel0209@gmail.com"
                className="hover:text-green-400 transition"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
