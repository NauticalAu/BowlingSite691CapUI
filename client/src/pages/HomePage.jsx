import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold mb-4">🎳 Welcome to Bowling Hub!</h1>
      <p className="mb-4">Track your games, find alleys, and read bowling blogs.</p>
      <div className="space-x-4">
        <Link to="/login" className="text-blue-600 underline">Login</Link>
        <Link to="/register" className="text-blue-600 underline">Register</Link>
        <Link to="/game" className="text-blue-600 underline">Start Game</Link>
      </div>
    </div>
  );
}

export default HomePage;
