import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function HomePage() {
  return (
      <div className="text-center py-12 space-y-6">
        {/* Hero Section */}
        <img
          src="/assets/alley.png"
          alt="Bowling Alley"
          className="mx-auto max-w-xl w-full rounded shadow-md"
        />

        <h1 className="text-4xl font-bold text-primary">🎳 Welcome to Bowling Hub!</h1>
        <p className="text-[18px] text-gray-700 max-w-2xl mx-auto">
          Discover the joy of bowling and find the best alleys near you. Track your games, explore leagues,
          and learn new techniques in our blog!
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/finder"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-red-700 font-semibold"
          >
            🧭 Find Nearby Alleys
          </Link>
          <Link
            to="/blog"
            className="bg-secondary text-white px-6 py-2 rounded hover:bg-blue-800 font-semibold"
          >
            📖 Explore Blog
          </Link>
        </div>
      </div>
  );
}

export default HomePage;
