import { useState } from 'react';
import Layout from '../components/Layout';

function GamePage() {
  const [scores, setScores] = useState(Array(10).fill({ roll1: '', roll2: '' }));
  const [gameId, setGameId] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (frameIndex, rollKey, value) => {
    const updated = [...scores];
    updated[frameIndex] = { ...updated[frameIndex], [rollKey]: value };
    setScores(updated);
  };

  const handleSubmit = async () => {
    setMessage('');
    try {
      const gameRes = await fetch('https://bowling-api.onrender.com/api/games/start', {
        method: 'POST',
        credentials: 'include'
      });
      const gameData = await gameRes.json();
      const newGameId = gameData.game.id;
      setGameId(newGameId);

      for (let i = 0; i < scores.length; i++) {
        const frameNum = i + 1;
        const { roll1, roll2 } = scores[i];

        if (roll1 !== '') {
          await fetch('https://bowling-api.onrender.com/api/games/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gameId: newGameId, frame: frameNum, pins: parseInt(roll1) })
          });
        }

        if (roll2 !== '') {
          await fetch('https://bowling-api.onrender.com/api/games/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gameId: newGameId, frame: frameNum, pins: parseInt(roll2) })
          });
        }
      }

      setMessage('✅ Game saved successfully!');
    } catch (err) {
      console.error('Error saving score:', err);
      setMessage('❌ Failed to save score');
    }
  };

  const calculateTotalScore = () => {
    return scores.reduce((total, frame) => {
      const roll1 = parseInt(frame.roll1) || 0;
      const roll2 = parseInt(frame.roll2) || 0;
      return total + roll1 + roll2;
    }, 0);
  };

  return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h2 className="text-3xl font-bold text-primary text-center">🎳 Enter Your Scores</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scores.map((frame, i) => (
            <div key={i} className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-2 text-secondary">Frame {i + 1}</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Roll 1"
                  className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                  value={frame.roll1}
                  onChange={(e) => handleChange(i, 'roll1', e.target.value)}
                  min={0}
                  max={10}
                />
                <input
                  type="number"
                  placeholder="Roll 2"
                  className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                  value={frame.roll2}
                  onChange={(e) => handleChange(i, 'roll2', e.target.value)}
                  min={0}
                  max={10}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
          >
            💾 Submit Game
          </button>
          {message && <p className="mt-4 font-semibold">{message}</p>}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-secondary mt-6">
            Total Score: {calculateTotalScore()}
          </h3>
        </div>
      </div>
  );
}

export default GamePage;
// Note: This code assumes you have a backend API running at https://bowling-api.onrender.com/api/games/start and https://bowling-api.onrender.com/api/games/score
// that accepts POST requests to start a game and submit scores, respectively. Adjust the API endpoints as necessary based on your backend implementation.
// The gameId is set when the game starts, and the scores are submitted for each frame.
// The calculateTotalScore function computes the total score based on the entered scores.
// The UI is responsive and uses Tailwind CSS classes for styling.
// The game page allows users to enter scores for each frame and submit them to the server. 