import { useState } from 'react';

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
      const gameRes = await fetch('http://localhost:8080/api/games/start', {
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
          await fetch('http://localhost:8080/api/games/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gameId: newGameId, frame: frameNum, pins: parseInt(roll1) })
          });
        }

        if (roll2 !== '') {
          await fetch('http://localhost:8080/api/games/score', {
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

  // Function to calculate the total score based on entered frame data
  const calculateTotalScore = () => {
    return scores.reduce((total, frame) => {
      const roll1 = parseInt(frame.roll1) || 0;
      const roll2 = parseInt(frame.roll2) || 0;
      return total + roll1 + roll2;
    }, 0);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Enter Scores</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {scores.map((frame, i) => (
          <div key={i} className="border p-2 rounded shadow-sm">
            <h2 className="font-semibold mb-2">Frame {i + 1}</h2>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Roll 1"
                className="border px-2 py-1 w-20"
                value={frame.roll1}
                onChange={(e) => handleChange(i, 'roll1', e.target.value)}
                min={0}
                max={10}
              />
              <input
                type="number"
                placeholder="Roll 2"
                className="border px-2 py-1 w-20"
                value={frame.roll2}
                onChange={(e) => handleChange(i, 'roll2', e.target.value)}
                min={0}
                max={10}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Game
      </button>

      {message && <p className="mt-4 font-semibold">{message}</p>}

      {/* Show total score */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Current Total Score: {calculateTotalScore()}</h3>
      </div>
    </div>
  );
}

export default GamePage;
