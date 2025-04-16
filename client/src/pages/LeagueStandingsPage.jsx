import { useEffect, useState } from 'react';

const LeagueStandingsPage = ({ leagueId }) => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    fetch(`http://bowling-api.onrender.com/api/leagues/${leagueId}/standings`)
      .then(res => res.json())
      .then(data => setStandings(data))
      .catch(err => console.error('Error fetching standings:', err));
  }, [leagueId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">League Standings</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Player</th>
            <th className="p-2 border">Avg Score</th>
            <th className="p-2 border">Games</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, index) => (
            <tr key={s.user_id}>
              <td className="p-2 border text-center">{index + 1}</td>
              <td className="p-2 border">{s.full_name}</td>
              <td className="p-2 border text-center">{s.avg_score}</td>
              <td className="p-2 border text-center">{s.games_played}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueStandingsPage;
