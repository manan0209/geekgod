import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg rounded-b-3xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r via-pink-500 to-blue-500 rounded-full transition-all duration-300 ease-in-out bg-transparent hover:bg-gradient-to-r from-purple-400 to-gold-500 hover:text-white hover:scale-105 shadow-md">
          <Link href="/">
            Geek
            <span className="text-gold-100 text-3xl font-extrabold rounded-full transition-all duration-300 ease-in-out bg-transparent hover:bg-gradient-to-r from-purple-400 to-gold-500 hover:text-white hover:scale-115 shadow-md">
              God
            </span>
          </Link>
        </h2>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {["Sorting", "Pathfinding", "Greedy", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-gray-100 text-lg font-semibold rounded-full px-4 py-2 transition-all duration-300 ease-in-out bg-transparent hover:bg-gradient-to-r from-purple-400 to-blue-500 hover:text-white hover:scale-105 shadow-md"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-100 text-3xl focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-center rounded-b-3xl shadow-lg">
          {["Sorting", "Pathfinding", "Greedy", "About"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={toggleMobileMenu}
              className="block text-gray-100 text-lg font-semibold rounded-full px-4 py-3 m-2 transition-all duration-300 ease-in-out bg-transparent hover:bg-gradient-to-r from-purple-400 to-blue-500 hover:text-white hover:scale-105 shadow-md"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
