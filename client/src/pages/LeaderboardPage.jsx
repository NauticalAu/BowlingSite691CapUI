import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // needed for profile links
import { useAuth } from '../context/AuthContext'; // optional: highlight logged-in user

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth(); // optional: current user ID for highlighting

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('https://bowling-api.onrender.com/api/leaderboard');
        const data = await res.json();
        if (res.ok) setLeaderboard(data.leaderboard || []);
        else console.error(data.error);
      } catch (err) {
        console.error('❌ Error loading leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-primary">🏆 Leaderboard</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="text-sm text-gray-600 border-b">
              <tr>
                <th className="py-2">Rank</th>
                <th className="py-2">Player</th>
                <th className="py-2 text-green-700">Avg</th>
                <th className="py-2 text-yellow-700">High</th>
                <th className="py-2 text-blue-700">Games</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={user.user_id}
                  className={`border-b text-sm hover:bg-gray-50 ${
                    index === 0 ? 'bg-yellow-100' :
                    index === 1 ? 'bg-gray-100' :
                    index === 2 ? 'bg-orange-100' : ''
                  } ${user.user_id === userId ? 'bg-blue-50 font-semibold' : ''}`}
                >
                  <td className="py-2 font-semibold">{getMedal(index)}</td>
                  <td className="py-2 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-xs font-bold flex items-center justify-center">
                      {getInitials(user.full_name)}
                    </div>
                    <Link
                      to={`/profile/${user.user_id}`}
                      className="text-blue-700 hover:underline"
                    >
                      {user.full_name}
                    </Link>
                  </td>
                  <td className="py-2 text-green-800 font-bold">{user.average_score}</td>
                  <td className="py-2 text-yellow-800 font-bold">{user.highest_score}</td>
                  <td className="py-2 text-blue-800">{user.games_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeaderBoardPage;
