import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ScoreSummary() {
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch('http://bowling-api.onrender.com/api/games/summary', {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setSummary(data.summary);
        } else {
          setError(data.error || 'Failed to fetch summary');
        }
      } catch (err) {
        setError('Error fetching score summary');
        console.error(err);
      }
    };

    fetchScores();
  }, []);

  // Group scores by game
  const grouped = summary.reduce((acc, row) => {
    const gameId = row.game_id;
    if (!acc[gameId]) {
      acc[gameId] = [];
    }
    acc[gameId].push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-red-600 text-center font-semibold">{error}</p>
      )}
      {!summary.length && !error && (
        <p className="text-center text-gray-600">⏳ Loading scores...</p>
      )}

      {Object.entries(grouped).map(([gameId, frames]) => (
        <div
          key={gameId}
          className="border border-gray-200 rounded-xl bg-white shadow-sm p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-secondary">
              Game #{gameId}
            </h3>
            <Link
              to={`/game/${gameId}`}
              className="text-primary hover:underline font-medium"
            >
              🔍 View Details
            </Link>
          </div>
          <ul className="text-[18px] text-gray-700 space-y-1">
            {frames.map((frame, idx) => (
              <li key={idx}>
                🎳 Frame {frame.frame}: <span className="font-semibold">{frame.pins} pins</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ScoreSummary;
