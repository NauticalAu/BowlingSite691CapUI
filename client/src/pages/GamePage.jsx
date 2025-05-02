import { useState } from 'react';
import Layout from '../components/Layout';

export default function GamePage() {
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
      const res = await fetch(
        'https://bowling-api.onrender.com/api/games/start',
        { method: 'POST', credentials: 'include' }
      );
      const data = await res.json();
      console.log('📦 Start game response:', data);
      if (res.ok && data?.game?.game_id) {
        setGameId(data.game.game_id);
        setMessage(`🎳 Game #${data.game.game_id} started`);
      } else {
        const fallback = data?.error || JSON.stringify(data);
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

        // Default blanks to 0 so every frame is recorded
        const body = {
          gameId,
          frameNumber: frameNum,
          firstRoll:  firstRoll  !== '' ? Number(firstRoll)  : 0,
          secondRoll: secondRoll !== '' ? Number(secondRoll) : 0,
          bonusRoll:  bonusRoll  !== '' ? Number(bonusRoll)  : 0
        };

        console.log(`Submitting Frame ${frameNum}:`, body);

        const apiUrl =
          process.env.REACT_APP_API_URL ||
          'https://bowling-api.onrender.com';

        const res = await fetch(
          `${apiUrl}/api/games/score`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
          }
        );

        const payload = await res.json();
        console.log(`Frame ${frameNum} →`, res.status, payload);

        if (!res.ok) {
          throw new Error(
            `Frame ${frameNum} failed: ${
              payload.errors
                ? payload.errors.map(e => e.msg).join(', ')
                : payload.error || res.statusText
            }`
          );
        }
      }

      setMessage('✅ Game saved successfully!');
    } catch (err) {
      console.error('Error saving score:', err);
      setMessage(`❌ Failed to save score: ${err.message}`);
    }
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
              Current Game ID:{' '}
              <span className="text-primary font-semibold">{gameId}</span>
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
                  className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                  value={frame.firstRoll}
                  onChange={e => handleChange(i, 'firstRoll', e.target.value)}
                  min={0}
                  max={10}
                  disabled={!gameId}
                />
                <input
                  type="number"
                  placeholder="Roll 2"
                  className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                  value={frame.secondRoll}
                  onChange={e => handleChange(i, 'secondRoll', e.target.value)}
                  min={0}
                  max={10}
                  disabled={!gameId}
                />
                {i === 9 && (
                  <input
                    type="number"
                    placeholder="Bonus Roll"
                    className="w-full p-2 border rounded-md focus:ring-secondary focus:border-secondary"
                    value={frame.bonusRoll}
                    onChange={e => handleChange(i, 'bonusRoll', e.target.value)}
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
            Total Score will be shown after submission
          </h3>
        </div>
      </div>
  );
}
