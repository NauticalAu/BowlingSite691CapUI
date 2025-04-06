import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ScoreSummary() {
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/games/summary', {
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
    <div>
      <h2>Score Summary</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!summary.length && !error && <p>Loading scores...</p>}
      {Object.entries(grouped).map(([gameId, frames]) => (
        <div key={gameId} style={{ marginBottom: '1rem' }}>
          <h4>
            Game #{gameId} — <Link to={`/game/${gameId}`}>View Details</Link>
          </h4>
          <ul>
            {frames.map((frame, idx) => (
              <li key={idx}>
                Frame {frame.frame}: {frame.pins} pins
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ScoreSummary;
// This code defines a ScoreSummary component that fetches and displays the summary of bowling scores.  