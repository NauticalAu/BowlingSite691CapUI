import React, { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ScoreInsights() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL || 'https://bowling-api.onrender.com'}/api/games/summary`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load summary');
        setFrames(data.summary);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p className="text-center py-4">⏳ Loading insights...</p>;
  if (error)   return <p className="text-red-600 text-center py-4">{error}</p>;

  // Group by game_id and compute totals
  const totalsByGame = frames.reduce((acc, f) => {
    acc[f.game_id] = (acc[f.game_id] || 0) + (f.frame_score || 0);
    return acc;
  }, {});

  const gameTotals = Object.entries(totalsByGame).map(
    ([gameId, total]) => ({ gameId: Number(gameId), total })
  );

  const scores = gameTotals.map(g => g.total);
  const totalGames = scores.length;
  const average = totalGames
    ? (scores.reduce((sum, s) => sum + s, 0) / totalGames).toFixed(1)
    : '0';
  const highScore = totalGames ? Math.max(...scores) : 0;
  const lastFive = gameTotals
    .slice(-5)
    .map((g, i) => ({ name: `Game ${totalGames - 5 + i + 1}`, score: g.total }));

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Games" value={totalGames} />
        <StatCard title="Average Score" value={average} />
        <StatCard title="Highest Game" value={highScore} />
      </div>

      {/* Last 5 Games Chart */}
      <div className="w-full h-64 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-center mb-2">Last 5 Games</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lastFive} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
