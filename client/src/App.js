import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

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
import TournamentsPage from './pages/TournamentsPage';
import TourneyDetailsPage from './pages/TourneyDetailsPage';
import AlleyDetailsPage from './pages/AlleyDetailsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/finder" element={<FinderPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/alleys/:id" element={<AlleyDetailsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />


          {/* Protected Routes */}
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="/game" element={
            <PrivateRoute>
              <GamePage />
            </PrivateRoute>
          } />
          <Route path="/scores" element={
            <PrivateRoute>
              <ScoreSummaryPage />
            </PrivateRoute>
          } />
          <Route path="/league/:id" element={
            <PrivateRoute>
              <LeagueDashboardWrapper />
            </PrivateRoute>
          } />
          <Route path="/tournaments" element={
            <PrivateRoute>
              <TournamentsPage />
            </PrivateRoute>
          } />
          <Route path="/tournaments/:id" element={
            <PrivateRoute>
              <TourneyDetailsPage />
            </PrivateRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
