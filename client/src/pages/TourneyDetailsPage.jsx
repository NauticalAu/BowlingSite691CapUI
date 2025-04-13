import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TourneyDetailsPage = () => {
  const { id } = useParams();
  const [tourney, setTourney] = useState(null);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Fetch tournament details
    fetch(`/api/tournaments/${id}`)
      .then(res => res.json())
      .then(data => setTourney(data))
      .catch(err => {
        console.error('Failed to fetch tournament', err);
        setMessage('❌ Failed to load tournament.');
      });

    // Fetch participants
    fetch(`/api/tournaments/${id}/participants`)
      .then(res => res.json())
      .then(data => setParticipants(data))
      .catch(err => console.error('Failed to fetch participants', err));
  }, [id]);

  const handleJoin = async () => {
    const userId = 1; // Replace with session-based ID later
    try {
      const res = await fetch(`/api/tournaments/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setMessage('✅ You joined the tournament!');

        // Refresh participants after joining
        const updated = await fetch(`/api/tournaments/${id}/participants`);
        const data = await updated.json();
        setParticipants(data);
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Error joining tournament.');
    }
  };

  if (!tourney && !message) {
    return <p className="text-center text-[18px] text-gray-700 font-[Arial] mt-10">⏳ Loading tournament...</p>;
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6 font-[Arial]">
        {message && (
          <p className={`text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <h1 className="text-3xl font-bold text-primary">{tourney?.name}</h1>
        <p className="text-[18px] text-gray-700">{tourney?.description}</p>

        <div className="text-[16px] text-gray-800 space-y-1">
          <p>🗓 <strong>Start:</strong> {tourney?.start_date}</p>
          <p>🏁 <strong>End:</strong> {tourney?.end_date}</p>
          <p>📍 <strong>Alley:</strong> {tourney?.alley_name || 'TBD'}</p>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={handleJoin}
            className="bg-primary hover:bg-red-700 text-white py-2 px-6 rounded font-semibold"
          >
            ➕ Join This Tournament
          </button>
        </div>

        {/* Registered Players Section */}
        <div className="pt-8">
          <h2 className="text-xl font-bold text-secondary mb-2">👥 Registered Players</h2>

          {participants.length === 0 ? (
            <p className="text-gray-600">No players have joined yet.</p>
          ) : (
            <ul className="space-y-2 text-gray-800 text-[16px]">
              {participants.map((user) => (
                <li
                  key={user.user_id}
                  className="bg-gray-50 p-3 rounded shadow-sm flex justify-between items-center"
                >
                  <span>🎳 {user.full_name}</span>
                  <span className="text-sm text-gray-500">User #{user.user_id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            🔙 Back to Tournaments
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">© 2023 Bowling League. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TourneyDetailsPage;
// This code defines a React component for displaying tournament details.
// It fetches tournament data and participants from an API, allows users to join the tournament,
// and displays a list of registered players.
// The component uses hooks for state management and side effects.
// It also includes error handling and loading states.  