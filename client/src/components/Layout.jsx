import React from 'react';
import { Link } from 'react-router-dom';
import ballImg from '../assets/Ball.png';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral font-body text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center">
          {/* Logo + Name */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0 md:mr-8">
            <img src={ballImg} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="text-2xl font-bold text-red-600 font-[Arial]">Bowling Hub</span>
          </div>

          {/* Nav + Auth split */}
          <div className="flex flex-wrap w-full md:w-auto md:flex-1 items-center justify-center md:justify-between">
            {/* Main Nav */}
            <nav className="flex flex-wrap gap-4 items-center justify-center">
              <Link to="/" className="text-blue-700 hover:underline">🏠 Home</Link>
              <Link to="/finder" className="text-blue-700 hover:underline">🧭 Finder</Link>
              <Link to="/blog" className="text-blue-700 hover:underline">📝 Blog</Link>
              <Link to="/tournaments" className="text-blue-700 hover:underline">🏆 Tournaments</Link>
              <Link to="/game" className="text-blue-700 hover:underline">🎳 Game</Link>
              <Link to="/scores" className="text-blue-700 hover:underline">📈 Scores</Link>
              <Link to="/profile" className="text-blue-700 hover:underline">👤 Profile</Link>
            </nav>

            {/* Auth Links */}
            <div className="flex gap-3 items-center ml-auto mt-4 md:mt-0">
              <Link to="/login" className="text-blue-700 hover:underline">🔐 Login</Link>
              <Link to="/register" className="text-blue-700 hover:underline">📝 Register</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-10">
        <div className="container mx-auto px-4 py-6 text-center text-sm">
          <p>Contact: info@bowlingwebsite.com</p>
          <p className="mt-2">
            Follow us:
            <a href="#" className="mx-1 text-blue-500 hover:underline">Facebook</a>|
            <a href="#" className="mx-1 text-blue-500 hover:underline">Twitter</a>|
            <a href="#" className="mx-1 text-blue-500 hover:underline">Instagram</a>
          </p>
          <p className="mt-4 text-gray-500">&copy; {new Date().getFullYear()} Bowling Hub. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
