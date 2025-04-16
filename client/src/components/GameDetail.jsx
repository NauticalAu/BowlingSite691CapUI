import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';

function GameDetail() {
  const { id } = useParams();
  const [frames, setFrames] = useState([]);
  const [error, setError] = useState('');
  const [gameDate, setGameDate] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch('http://bowling-api.onrender.com/api/games/summary', {
          credentials: 'include'
        });
        const data = await res.json();

        if (res.ok) {
          const filtered = data.summary.filter(row => row.game_id === Number(id));
          setFrames(filtered);

          // Extract date from the first frame, assuming they all share it
          if (filtered.length > 0 && filtered[0].created_at) {
            setGameDate(new Date(filtered[0].created_at));
          }
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
  const bestFrame = frames.reduce((best, current) => {
    return current.pins > (best?.pins || 0) ? current : best;
  }, null);

  return (
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <div className="text-right">
          <Link to="/scores" className="text-blue-600 hover:underline text-sm">
            ← Back to Scores
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-primary text-center">Game #{id}</h2>

        {gameDate && (
          <p className="text-center text-sm text-gray-500">
            🗓 Played on {gameDate.toLocaleDateString()} at {gameDate.toLocaleTimeString()}
          </p>
        )}

        {error && <p className="text-center text-red-600 font-medium">{error}</p>}
        {!frames.length && !error && (
          <p className="text-center text-gray-600">⏳ Loading game data...</p>
        )}

        {frames.length > 0 && (
          <>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-secondary">
                🧮 Total Score: {totalScore}
              </h3>
            </div>

            {bestFrame && (
              <div className="bg-[#f1f5f9] border border-gray-200 rounded-md p-4 text-center">
                🏆 <span className="font-semibold">Best Frame:</span> Frame {bestFrame.frame} with {bestFrame.pins} pins!
              </div>
            )}

            <div>
              <h4 className="text-lg font-bold mb-2">🎯 Frame-by-Frame Summary</h4>
              <ul className="space-y-2 text-[18px] text-gray-800">
                {frames.map((frame, i) => (
                  <li
                    key={i}
                    className="p-2 border-b border-gray-200 flex items-center gap-2"
                  >
                    <span className="text-lg">🎳</span>
                    <span>
                      Frame {frame.frame}:{' '}
                      <span className="font-semibold">{frame.pins} pins</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
  );
}

export default GameDetail;
