import React, { useState } from 'react';

function ScoreEntry() {
  const [gameId, setGameId] = useState(() => localStorage.getItem('gameId') || null);
  const [formData, setFormData] = useState({ frame: '', pins: '' });
  const [message, setMessage] = useState('');

  const startGame = async () => {
    try {
      const res = await fetch('https://bowling-api.onrender.com/api/games/start', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setGameId(data.game.id);
        localStorage.setItem('gameId', data.game.id);
        setMessage(`🎳 Game #${data.game.id} started`);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error starting game');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const frameNum = Number(formData.frame);
    const pinsNum = Number(formData.pins);

    if (frameNum < 1 || frameNum > 10) {
      setMessage('❌ Frame must be between 1 and 10');
      return;
    }

    if (pinsNum < 0 || pinsNum > 10) {
      setMessage('❌ Pins must be between 0 and 10');
      return;
    }

    if (!gameId) {
      setMessage('❌ Please start a game first');
      return;
    }

    try {
      const res = await fetch('https://bowling-api.onrender.com/api/scores/submit ', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, frame: frameNum, pins: pinsNum })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Frame ${frameNum} submitted: ${pinsNum} pins`);
        setFormData({ frame: '', pins: '' });
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error submitting score');
    }
  };

  return (
    <div className="bg-white max-w-md mx-auto rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">🎳 Score Entry</h2>

      <div className="space-y-2 text-center">
        <button
          onClick={startGame}
          className="bg-secondary hover:bg-blue-800 text-white px-4 py-2 rounded font-semibold"
        >
          ➕ Start New Game
        </button>

        {gameId && (
          <div className="mt-2 text-sm">
            <p className="text-gray-700 font-medium">Current Game ID: <span className="text-primary">{gameId}</span></p>
            <button
              onClick={() => {
                setGameId(null);
                localStorage.removeItem('gameId');
                setMessage('🧹 Game cleared');
              }}
              className="text-sm text-red-600 underline mt-1"
            >
              Clear Current Game
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="frame"
          placeholder="Frame #"
          value={formData.frame}
          onChange={handleChange}
          min="1"
          max="10"
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
        />
        <input
          type="number"
          name="pins"
          placeholder="Pins"
          value={formData.pins}
          onChange={handleChange}
          min="0"
          max="10"
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white rounded hover:bg-red-700 font-semibold"
        >
          ✅ Submit Score
        </button>
      </form>

      {message && (
        <p className={`text-sm text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ScoreEntry;
