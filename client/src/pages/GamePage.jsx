import { useState } from 'react';
import Layout from '../components/Layout';

function GamePage() {
  const [scores, setScores] = useState(
    Array(10).fill({ firstRoll: '', secondRoll: '', bonusRoll: '' })
  );
  const [gameId, setGameId] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (frameIndex, rollKey, value) => {
    const updated = [...scores];
    updated[frameIndex] = {
      ...updated[frameIndex],
      [rollKey]: value
    };
    setScores(updated);
  };

  const startGame = async () => {
    try {
      const res = await fetch('https://bowling-api.onrender.com/api/games/start', {
        method: 'POST',
        credentials: 'include'
      });
  
      const data = await res.json();
      console.log('📦 Response status:', res.status);
      console.log('📦 Response body:', data);
  
      if (res.ok && data?.game?.game_id) {
        setGameId(data.game.game_id);
        setMessage(`🎳 Game #${data.game.game_id} started`);
      } else {
        const fallback = data?.error || `Unexpected response: ${JSON.stringify(data)}`;
        setMessage(`❌ Failed to start game: ${fallback}`);
      }
    } catch (err) {
      console.error('❌ Error starting game:', err);
      setMessage('❌ Error starting game');
    }
  };
  

  const handleSubmit = async () => {
    setMessage('');
    if (!gameId) {
      setMessage('❌ Please start a game first');
      return;
    }
    try {
      for (let i = 0; i < scores.length; i++) {
        const frameNum = i + 1;
        const { firstRoll, secondRoll, bonusRoll } = scores[i];

        const body = {
          gameId: gameId,
          frame: frameNum,
          firstRoll: firstRoll !== '' ? Number(firstRoll) : null,
          secondRoll: secondRoll !== '' ? Number(secondRoll) : null,
          bonusRoll: bonusRoll !== '' ? Number(bonusRoll) : null
        };

        console.log(`Submitting Frame ${frameNum}:`, body);

        if (body.firstRoll !== null || body.secondRoll !== null) {
          await fetch('https://bowling-api.onrender.com/api/games/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
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
      const r1 = parseInt(frame.firstRoll) || 0;
      const r2 = parseInt(frame.secondRoll) || 0;
      const b = parseInt(frame.bonusRoll) || 0;
      return total + r1 + r2 + b;
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        🎳 Enter Your Scores
      </h2>

      <div className="text-center space-y-2">
        <button
          onClick={startGame}
          className="bg-secondary hover:bg-blue-800 text-white px-4 py-2 rounded font-semibold"
        >
          ➕ Start New Game
        </button>
        {gameId && (
          <div className="text-sm text-gray-700">
            Current Game ID: <span className="text-primary font-semibold">{gameId}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {scores.map((frame, i) => (
          <div
            key={i}
            className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold mb-2 text-secondary">
              Frame {i + 1}
            </h3>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Roll 1"
                name="firstRoll"
                className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                value={frame.firstRoll}
                onChange={(e) =>
                  handleChange(i, 'firstRoll', e.target.value)
                }
                min={0}
                max={10}
                disabled={!gameId}
              />
              <input
                type="number"
                placeholder="Roll 2"
                name="secondRoll"
                className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                value={frame.secondRoll}
                onChange={(e) =>
                  handleChange(i, 'secondRoll', e.target.value)
                }
                min={0}
                max={10}
                disabled={!gameId}
              />
              {i === 9 && (
                <input
                  type="number"
                  placeholder="Bonus Roll"
                  name="bonusRoll"
                  className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                  value={frame.bonusRoll}
                  onChange={(e) =>
                    handleChange(i, 'bonusRoll', e.target.value)
                  }
                  min={0}
                  max={10}
                  disabled={!gameId}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
          disabled={!gameId}
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
