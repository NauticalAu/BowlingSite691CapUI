import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function GameDetail() {
  const { id } = useParams(); // game ID from URL
  const [frames, setFrames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/games/summary', {
          credentials: 'include'
        });
        const data = await res.json();

        if (res.ok) {
          const filtered = data.summary.filter(row => row.game_id === Number(id));
          setFrames(filtered);
        } else {
          setError(data.error || 'Failed to load game data');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching game');
      }
    };

    fetchGame();
  }, [id]);

  const totalScore = frames.reduce((sum, frame) => sum + frame.pins, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Game #{id}</h2>
      
      {error && <p className="text-red-600">{error}</p>}
      {!frames.length && !error && <p>Loading game data...</p>}

      {/* Frame-by-frame display */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Total Score: {totalScore}</h3>

        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Frame-by-Frame Summary:</h4>
          <ul className="list-disc pl-5">
            {frames.map((frame, i) => (
              <li key={i}>
                Frame {frame.frame}: {frame.pins} pins
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
