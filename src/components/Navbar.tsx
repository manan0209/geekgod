import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { name: "Sorting", href: "/sorting" },
  { name: "Pathfinding", href: "/pathfinding" },
  { name: "Greedy", href: "/greedy" },
  { name: "About", href: "/about" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  return (
    <nav className="backdrop-blur-md bg-gray-900/80 border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/geekgodlogo.jpg"
            alt="GeekGod Logo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full shadow border-2 border-purple-400 bg-white/10"
            priority
          />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text tracking-tight select-none">
            GeekGod
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 rounded-lg text-gray-100 font-medium hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-100 text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 border-t border-gray-800 px-4 pb-4 pt-2 rounded-b-2xl shadow-lg animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={toggleMobileMenu}
              className="block w-full text-left px-4 py-3 rounded-lg text-gray-100 font-medium hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-200 mb-1"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
