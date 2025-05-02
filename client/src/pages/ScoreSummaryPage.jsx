import React from 'react';
import Layout from '../components/Layout';
import ScoreSummary from '../components/ScoreSummary';
import ScoreInsights from '../components/ScoreInsights';

export default function ScoreSummaryPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-primary text-center">
          📈 Your Score History
        </h2>
        <p className="text-[18px] text-gray-700 text-center">
          Review your past games and track your progress over time.
        </p>

        {/* Performance summary */}
        <ScoreInsights />

        {/* Game history */}
        <h3 className="text-2xl font-semibold text-primary text-center">
          🎳 Game History
        </h3>
        <ScoreSummary />
      </div>
    </Layout>
  );
}

// Compare this snippet from client/src/components/ScoreSummary.jsx:
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useUser } from '../context/UserContext';
// import { useLeague } from '../context/LeagueContext';
// import { useScores } from '../context/ScoresContext';
// import { useNavigate } from 'react-router-dom';  