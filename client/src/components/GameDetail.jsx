import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function GameDetail() {
  const { id } = useParams();
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameDate, setGameDate] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const url =
          (process.env.REACT_APP_API_URL || 'https://bowling-api.onrender.com') +
          '/api/games/summary';
        const res = await fetch(url, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load game data');

        // Keep only this game’s frames
        const gameFrames = data.summary.filter(f => f.game_id === Number(id));
        setFrames(gameFrames);

        // Record the date from the first frame (if available)
        if (gameFrames[0]?.created_at) {
          setGameDate(new Date(gameFrames[0].created_at));
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  // Sum up all frame_score values
  const totalScore = frames.reduce((sum, f) => sum + (f.frame_score || 0), 0);

  // Find the frame with the highest frame_score
  const bestFrame = frames.reduce((best, f) => {
    return f.frame_score > (best.frame_score || 0) ? f : best;
  }, { frame_score: 0 });

  // Helper to render X, spare, or pin counts (including 10th frame)
  const getFrameLabel = ({
    first_roll,
    second_roll,
    bonus_roll,
    frame_number
  }) => {
    if (frame_number < 10) {
      if (first_roll === 10) return 'X';
      if ((first_roll || 0) + (second_roll || 0) === 10) return `${first_roll} /`;
      return `${first_roll ?? 0} ${second_roll ?? 0}`;
    }
    // 10th frame: show all rolls
    const parts = [`${first_roll ?? 0}`];
    if (second_roll != null) parts.push(`${second_roll}`);
    if (bonus_roll   != null) parts.push(`${bonus_roll}`);
    return parts.join(' + ');
  };

  if (loading) {
    return <p className="text-center py-10">⏳ Loading game...</p>;
  }
  if (error) {
    return <p className="text-red-600 text-center py-10">{error}</p>;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        <div className="text-right">
          <Link to="/scores" className="text-blue-600 hover:underline text-sm">
            ← Back to Scores
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-primary text-center">
          Game #{id}
        </h2>

        {gameDate && (
          <p className="text-center text-sm text-gray-500">
            🗓 Played on{' '}
            {gameDate.toLocaleDateString()}{' '}
            at {gameDate.toLocaleTimeString()}
          </p>
        )}

        <div className="text-center">
          <h3 className="text-xl font-semibold text-secondary">
            🧮 Total Score: {totalScore}
          </h3>
        </div>

        {bestFrame.frame_score > 0 && (
          <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-center">
            🏆 <span className="font-semibold">
              Best Frame:</span> Frame {bestFrame.frame_number} with {bestFrame.frame_score} pins!
          </div>
        )}

        <div>
          <h4 className="text-lg font-bold mb-2">🎯 Frame-by-Frame Summary</h4>
          <ul className="space-y-2 text-[18px] text-gray-800">
            {frames.map((f, i) => (
              <li
                key={i}
                className="p-2 border-b border-gray-200 flex justify-between items-center"
              >
                <span>🎳 Frame {f.frame_number}</span>
                <span className="font-semibold">
                  {getFrameLabel(f)} → {f.frame_score} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
