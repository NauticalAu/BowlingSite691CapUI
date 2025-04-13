import React from 'react';
import Layout from '../components/Layout';
import ScoreSummary from '../components/ScoreSummary';

function ScoreSummaryPage() {
  return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-primary text-center">📈 Your Score History</h2>
        <p className="text-[18px] text-gray-700 text-center">
          Review your past games and track your progress over time.
        </p>

        <ScoreSummary />
      </div>
  );
}

export default ScoreSummaryPage;
// Compare this snippet from client/src/components/ScoreSummary.jsx:
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useUser } from '../context/UserContext';
// import { useLeague } from '../context/LeagueContext';
// import { useScores } from '../context/ScoresContext';
// import { useNavigate } from 'react-router-dom';  