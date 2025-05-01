import React from 'react';
import { motion } from 'framer-motion';
import { useScores } from '../context/ScoresContext';
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
  const { summary } = useScores();

  // Aggregate frame scores into total per game
  const grouped = summary.reduce((acc, frame) => {
    acc[frame.game_id] = (acc[frame.game_id] || 0) + (frame.frame_score || 0);
    return acc;
  }, {});

  const gameTotals = Object.entries(grouped).map(([id, total]) => ({ gameId: Number(id), total }));
  const scores = gameTotals.map(g => g.total);
  const totalGames = scores.length;
  const average = totalGames ? (scores.reduce((a, b) => a + b, 0) / totalGames).toFixed(1) : '0';
  const highScore = totalGames ? Math.max(...scores) : 0;
  const lastFive = gameTotals.slice(-5).map((g, idx) => ({ name: `Game ${totalGames - 5 + idx + 1}`, score: g.total }));

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Total Games" value={totalGames} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Average Score" value={average} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard title="Highest Game" value={highScore} />
        </motion.div>
      </div>

      {/* Chart */}
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
