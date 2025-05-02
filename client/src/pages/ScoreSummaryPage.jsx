import React from 'react';
import ScoreSummary from '../components/ScoreSummary';
import ScoreInsights from '../components/ScoreInsights';

export default function ScoreSummaryPage() {
  const handleReset = async () => {
    if (!window.confirm('Delete ALL your games? This cannot be undone.')) return;
  
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const res = await fetch(`${apiUrl}/api/games`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(`Reset failed (${res.status})`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">📈 Your Score History</h2>
            <p className="text-[18px] text-gray-700">
              Review your past games and track your progress over time.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-red-600 hover:underline"
            title="Delete all your game history"
          >
            🗑️ Start Over
          </button>
        </div>

        {/* Performance summary */}
        <ScoreInsights />

        {/* Game history */}
        <h3 className="text-2xl font-semibold text-primary text-center">
          🎳 Game History
        </h3>
        <ScoreSummary />
      </div>
  );
}


// Compare this snippet from client/src/components/ScoreSummary.jsx:
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useUser } from '../context/UserContext';
// import { useLeague } from '../context/LeagueContext';
// import { useScores } from '../context/ScoresContext';
// import { useNavigate } from 'react-router-dom';  