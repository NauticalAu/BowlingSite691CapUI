import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import ScoreSummaryPage from './pages/ScoreSummaryPage';
import FinderPage from './pages/FinderPage';
import BlogPage from './pages/BlogPage';
import GameDetail from './components/GameDetail';
import ProfilePage from './pages/ProfilePage';
import LeagueDashboardWrapper from './pages/LeagueDashboardWrapper';


function App() {
  return (
    <Router>
      <div className="App p-4">
        <nav className="mb-4 space-x-4">
          <Link to="/" className="text-blue-600 underline">🏠 Home</Link>
          <Link to="/login" className="text-blue-600 underline">🔐 Login</Link>
          <Link to="/register" className="text-blue-600 underline">📝 Register</Link>
          <Link to="/game" className="text-blue-600 underline">🎳 Game</Link>
          <Link to="/scores" className="text-blue-600 underline">📈 Scores</Link>
          <Link to="/finder" className="text-blue-600 underline">🧭 Finder</Link>
          <Link to="/blog" className="text-blue-600 underline">📝 Blog</Link>
          <Link to="/profile" className="text-blue-600 underline">👤 Profile</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/scores" element={<ScoreSummaryPage />} />
          <Route path="/finder" element={<FinderPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/league/:id" element={<LeagueDashboardWrapper />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
