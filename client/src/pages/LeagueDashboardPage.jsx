import { useState, useEffect } from 'react';

const LeagueDashboardPage = ({ leagueId, userId }) => {
  const [standings, setStandings] = useState([]);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [createSuccess, setCreateSuccess] = useState(false);

  // Load standings for the league
  useEffect(() => {
    fetch(`https://bowling-api.onrender.com/api/leagues/${leagueId}/standings`)
      .then(res => res.json())
      .then(data => setStandings(data))
      .catch(err => console.error('Failed to load standings:', err));
  }, [leagueId]);

  const handleJoin = () => {
    fetch(`https://bowling-api.onrender.com/api/leagues/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueId, userId }),
    })
      .then(res => res.json())
      .then(() => setJoinSuccess(true))
      .catch(err => console.error('Join failed:', err));
  };

  const handleCreateLeague = (e) => {
    e.preventDefault();
    fetch(`https://bowling-api.onrender.com/api/leagues/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...createForm, createdBy: userId }),
    })
      .then(res => res.json())
      .then(() => {
        setCreateSuccess(true);
        setCreateForm({ name: '', description: '' });
      })
      .catch(err => console.error('Create failed:', err));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">League Dashboard</h1>

      {/* Standings Table */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Standings</h2>
        {standings.length > 0 ? (
          <table className="w-full border table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Rank</th>
                <th className="border p-2">Player</th>
                <th className="border p-2">Avg Score</th>
                <th className="border p-2">Games</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, index) => (
                <tr key={s.user_id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{s.full_name}</td>
                  <td className="border p-2 text-center">{s.avg_score}</td>
                  <td className="border p-2 text-center">{s.games_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No scores submitted yet.</p>
        )}
      </section>

      {/* Join League */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Join This League</h2>
        {joinSuccess ? (
          <p className="text-green-600">✅ You joined the league!</p>
        ) : (
          <button
            onClick={handleJoin}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Join League
          </button>
        )}
      </section>

      {/* Create New League */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Create New League</h2>
        {createSuccess && <p className="text-green-600">✅ League created!</p>}
        <form onSubmit={handleCreateLeague} className="space-y-4">
          <div>
            <label className="block mb-1">League Name</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="border p-2 w-full"
              rows={3}
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Create League
          </button>
        </form>
      </section>
    </div>
  );
};

export default LeagueDashboardPage;

// Note: This component assumes that the `leagueId` and `userId` props are passed down from a parent component or obtained from context or routing. 