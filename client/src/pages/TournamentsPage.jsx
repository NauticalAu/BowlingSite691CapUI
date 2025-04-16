import React, { useEffect, useState } from 'react';
import CreateTournamentForm from '../components/CreateTournamentForm';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);

  // Helper to format date strings
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  // Fetch tournaments from API
  const fetchTournaments = () => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        console.log('🎯 Fetched tournaments:', data);
        setTournaments(data); // ✅ use top-level array
      })
      .catch(err => console.error('Failed to fetch tournaments', err));
  };

  // Initial fetch on load
  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleJoin = async (tournamentId) => {
    const userId = 1; // Replace with actual session value later
    try {
      await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      alert("✅ Joined tournament!");
      fetchTournaments(); // Refresh list
    } catch {
      alert("❌ Failed to join tournament.");
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
        fetchTournaments();
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

      <div style={{ marginBottom: '3rem' }}>
        <CreateTournamentForm onCreated={fetchTournaments} />
      </div>

      {tournaments.length === 0 ? (
        <p style={{ fontFamily: 'Arial', fontSize: '18px' }}>
          No tournaments available right now.
        </p>
      ) : (
        <div>
          {tournaments.map(tourney => (
            <div
              key={tourney.tournament_id}
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
                <strong>Dates:</strong> {formatDate(tourney.start_date)} – {formatDate(tourney.end_date)}<br />
                <strong>Location:</strong> {tourney.alley_name || 'TBD'}<br />
                <strong>Status:</strong>{' '}
                <span style={{ fontWeight: 'bold', color: tourney.status === 'open' ? '#43a047' : '#b71c1c' }}>
                  {tourney.status === 'open' ? '🟢 Open' : '🔒 Closed'}
                </span>
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
                onClick={() => handleJoin(tourney.tournament_id)}
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
                  onClick={() => handleDelete(tourney.tournament_id)}
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
// This component fetches and displays a list of tournaments from the server. 