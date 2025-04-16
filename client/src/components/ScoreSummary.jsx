import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ScoreSummary() {
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch('https://bowling-api.onrender.com/api/games/summary', {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          console.log('📦 summary data:', data.summary);
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

  // Utility to label frame results
  const getFrameLabel = (frame) => {
    const first = frame.first_roll;
    const second = frame.second_roll;
    const bonus = frame.bonus_roll;

    if (frame.frame_number < 10) {
      if (first === 10) return 'X'; // strike
      if ((first || 0) + (second || 0) === 10) return `${first} /`; // spare
      return `${first} ${second ?? ''}`;
    } else {
      // 10th frame logic
      let rolls = `${first ?? ''}`;
      if (second !== null) rolls += ` / ${second}`;
      if (bonus !== null) rolls += ` + ${bonus}`;
      return rolls;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-red-600 text-center font-semibold">{error}</p>
      )}
      {!summary.length && !error && (
        <p className="text-center text-gray-600">⏳ Loading scores...</p>
      )}

      {Object.entries(grouped).map(([gameId, frames]) => {
        const totalScore = frames.reduce((sum, f) => sum + (f.frame_score || 0), 0);
        return (
          <div
            key={gameId}
            className="border border-gray-200 rounded-xl bg-white shadow-sm p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-secondary">
                Game #{gameId}
              </h3>
              <span className="text-primary font-bold text-lg">
                🧮 Total Score: {totalScore}
              </span>
            </div>

            <Link
              to={`/game/${gameId}`}
              className="text-blue-500 hover:underline text-sm mb-4 inline-block"
            >
              🔍 View Frame Details
            </Link>

            <ul className="text-[18px] text-gray-700 space-y-1 mt-2">
              {frames.map((frame, idx) => (
                <li key={idx}>
                  🎳 Frame {frame.frame_number}:&nbsp;
                  <span className="font-semibold">
                    {getFrameLabel(frame)} → {frame.frame_score} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default ScoreSummary;
