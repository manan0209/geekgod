"use client";
import "./globals.css";
import Navbar from "../components/Navbar"; // Import the Navbar component
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //const [darkMode] = useState(false);

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Redesigned Footer */}
        <footer className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-gray-200 rounded-t-[3rem] shadow-xl">
          <div className="container mx-auto px-6 py-10">
            {/* Curved Header Section */}
            <div className="flex justify-center mb-8">
              <svg
                className="w-10 h-10 text-gray-200 animate-bounce"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3l4 8h-8l4-8zm1 2h-2v3h2v-3zm-1 16c5 0 9-4 9-9h2c0 6.07-4.93 11-11 11s-11-4.93-11-11h2c0 5 4 9 9 9zm2-10h-2v6h-2v-6h-2v-2h6v2z" />
              </svg>
              <h2 className="text-3xl font-extrabold text-center text-gray-100 ml-3">
                GeekGod
              </h2>
            </div>

            

            {/* Description Section */}
            <p className="mt-6 text-center text-base text-black-100">
              © 2025 <span className="font-semibold">GeekGod</span>. Built with{" "}
              <span className="text-red-400">❤️</span> by{" "}
              <a
                href="https://github.com/manan0209"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300 transition"
              >
                devmnn
              </a>{" "}
              to visualize algorithms and make learning fun!
            </p>
          </div>

          {/* Decorative Bottom Curve */}
          
        </footer>
      </body>
    </html>
  );
}
