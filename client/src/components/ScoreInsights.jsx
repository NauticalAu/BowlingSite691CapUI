import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function ScoreInsights() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameTotals, setGameTotals] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('https://bowling-api.onrender.com/api/games/summary', {
          credentials: 'include'
        });
        const data = await res.json();

        if (res.ok) {
          const frames = data.summary || [];
          setSummary(frames);
          computeStats(frames);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('❌ Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    };

    const computeStats = (frames) => {
      const groupedByGame = {};
      frames.forEach((f) => {
        if (!groupedByGame[f.game_id]) groupedByGame[f.game_id] = [];
        groupedByGame[f.game_id].push(f.frame_score || 0);
      });

      const totals = Object.entries(groupedByGame).map(([gameId, scores]) => ({
        gameId,
        total: scores.reduce((sum, val) => sum + val, 0)
      }));

      const totalGames = totals.length;
      const sum = totals.reduce((acc, obj) => acc + obj.total, 0);
      const avg = totalGames ? sum / totalGames : 0;
      const high = totals.length ? Math.max(...totals.map(g => g.total)) : 0;

      setGameTotals(totals);
      setAverage(Math.round(avg));
      setHighScore(high);
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading score insights...</p>;

  const totalGames = new Set(summary.map(s => s.game_id)).size;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">🎯 Performance Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-blue-100 p-4 rounded shadow"
        >
          <h3 className="text-lg font-semibold text-blue-800">Total Games</h3>
          <p className="text-3xl font-bold text-blue-900">{totalGames}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-100 p-4 rounded shadow"
        >
          <h3 className="text-lg font-semibold text-green-800">Average Score</h3>
          <p className="text-3xl font-bold text-green-900">{average}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-yellow-100 p-4 rounded shadow"
        >
          <h3 className="text-lg font-semibold text-yellow-800">Highest Game</h3>
          <p className="text-3xl font-bold text-yellow-900">{highScore}</p>

          {/* 🏅 Bonus Badge */}
          {highScore >= 200 && (
            <div className="mt-2 inline-block bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold shadow">
              🏅 Personal Best!
            </div>
          )}
        </motion.div>
      </div>

      {/* 📊 Chart Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-center mb-2">📊 Score Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={gameTotals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gameId" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ScoreInsights;
// Compare this snippet from client/src/components/ScoreEntry.jsx: