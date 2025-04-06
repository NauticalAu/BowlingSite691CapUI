import React, { useState } from 'react';

function ScoreEntry() {
    const [gameId, setGameId] = useState(() => {
        return localStorage.getItem('gameId') || null;
      });
      
  const [formData, setFormData] = useState({
    frame: '',
    pins: ''
  });
  const [message, setMessage] = useState('');

  const startGame = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/games/start', {
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const frameNum = Number(formData.frame);
    const pinsNum = Number(formData.pins);
  
    // ⚠️ Frame must be between 1–10
    if (frameNum < 1 || frameNum > 10) {
      setMessage('❌ Frame must be between 1 and 10');
      return;
    }
  
    // ⚠️ Pins must be between 0–10
    if (pinsNum < 0 || pinsNum > 10) {
      setMessage('❌ Pins must be between 0 and 10');
      return;
    }
  
    if (!gameId) {
      setMessage('❌ Please start a game first');
      return;
    }
  
    setMessage('');
  
    try {
      const res = await fetch('http://localhost:8080/api/games/score', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          frame: frameNum,
          pins: pinsNum
        })
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
    <div>
      <h2>Enter Score</h2>
      <button onClick={startGame}>Start New Game</button>
      {gameId && (
        <div style={{ marginTop: '1rem' }}>
            <p>Current Game ID: {gameId}</p>
            <button onClick={() => {
            setGameId(null);
            localStorage.removeItem('gameId');
            setMessage('🧹 Game cleared');
            }}>
            Clear Current Game
            </button>
        </div>
        )}


      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="frame"
          placeholder="Frame #"
          value={formData.frame}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pins"
          placeholder="Pins"
          value={formData.pins}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Score</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ScoreEntry;
// This code defines a ScoreEntry component that allows users to enter scores for a bowling game.
// It includes a form for entering the frame number and the number of pins knocked down,
// and a button to start a new game. The component manages the state of the game ID, form data,
// and messages using React's useState hook. It also handles form submission and API calls
// to start a new game and submit scores using the Fetch API. The component displays messages