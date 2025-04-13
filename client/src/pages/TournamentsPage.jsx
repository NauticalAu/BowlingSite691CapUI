import React, { useEffect, useState } from 'react';
import CreateTournamentForm from '../components/CreateTournamentForm';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);

  // ✅ Reusable fetch function
  const fetchTournaments = () => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        console.log('🎯 Fetched tournaments:', data);
        setTournaments(data);
      })
      .catch(err => console.error('Failed to fetch tournaments', err));
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleJoin = async (tournamentId) => {
    const userId = 1; // Replace with actual session ID later
    try {
      await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      alert("Joined tournament!");
    } catch {
      alert("Failed to join tournament.");
    }
  };

  const handleDelete = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
  
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        alert('✅ Tournament deleted');
        fetchTournaments(); // refresh the list
      } else {
        const data = await res.json();
        alert(`❌ ${data.error || 'Failed to delete'}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error while deleting');
    }
  };  

  return (
    <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{
        color: '#d32f2f',
        fontFamily: 'Arial',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        Upcoming Tournaments
      </h1>

      {/* ✅ Tournament Creation Form */}
      <div style={{ marginBottom: '3rem' }}>
        <CreateTournamentForm onCreated={fetchTournaments} />
      </div>

      {/* ✅ Tournament List */}
      {tournaments.length === 0 ? (
        <p style={{ fontFamily: 'Arial', fontSize: '18px' }}>
          No tournaments available right now.
        </p>
      ) : (
        <div>
          {tournaments.map(tourney => (
            <div
              key={tourney.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '1rem',
                margin: '1rem 0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                fontFamily: 'Arial',
                color: '#333',
              }}
            >
              <h2 style={{ fontSize: '20px', color: '#1976d2' }}>{tourney.name}</h2>
              <p>{tourney.description}</p>
              <p>
                <strong>Dates:</strong> {tourney.start_date} – {tourney.end_date}<br />
                <strong>Location:</strong> {tourney.alley_name || 'TBD'}
              </p>
              <button
                style={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => handleJoin(tourney.id)}
              >
                Join Tournament
              </button>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                    onClick={() => alert('Edit coming soon!')}
                    style={{
                    backgroundColor: '#fbc02d',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                    }}
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={() => handleDelete(tourney.id)}
                    style={{
                    backgroundColor: '#b71c1c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                    }}
                >
                    🗑️ Delete
                </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentsPage;
// This page displays a list of tournaments and allows users to create new ones.
// It fetches tournament data from an API and provides a button to join each tournament.
// The CreateTournamentForm component is used to create new tournaments.
// The tournaments are displayed in a card-like format with details such as name, description, and dates.
// The page is styled with a light background and uses a modern font for readability.
// The join button is styled with a red color to indicate its importance.
// The page is responsive and adjusts to different screen sizes.
// The code uses React hooks for state management and side effects.
// It also includes error handling for the fetch requests.
// The page is designed to be user-friendly and visually appealing.
// The code is modular, making it easy to maintain and extend in the future.
// The component can be easily integrated into a larger application.
// The page is structured to provide a clear overview of upcoming tournaments.