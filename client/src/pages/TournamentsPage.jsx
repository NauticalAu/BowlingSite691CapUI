import React, { useEffect, useState } from 'react';
import CreateTournamentForm from '../components/CreateTournamentForm';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    tournament_id: null,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    bowling_alley_id: ''
  });

  // Helper to format date strings
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  // Fetch tournaments from API
  const fetchTournaments = () => {
    fetch('https://bowling-api.onrender.com/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
      .catch(err => console.error('Failed to fetch tournaments', err));
  };

  // Initial fetch on load
  useEffect(() => {
    fetchTournaments();
  }, []);

  // Start editing a tournament
  const startEdit = (tourney) => {
    setEditing(true);
    setFormData({
      tournament_id: tourney.tournament_id,
      name: tourney.name,
      description: tourney.description,
      start_date: tourney.start_date.split('T')[0],
      end_date: tourney.end_date.split('T')[0],
      bowling_alley_id: tourney.bowling_alley_id
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${formData.tournament_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );
      if (!res.ok) throw new Error('Update failed');
      alert('✅ Tournament updated');
      setEditing(false);
      fetchTournaments();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update tournament');
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditing(false);
  };

  // Delete handler
  const handleDelete = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${tournamentId}`,
        { method: 'DELETE' }
      );
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

  // Join handler
  const handleJoin = async (tournamentId) => {
    const userId = 1; // replace with session user ID
    try {
      await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${tournamentId}/join`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        }
      );
      alert('✅ Joined tournament!');
      fetchTournaments();
    } catch {
      alert('❌ Failed to join tournament.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ color: '#d32f2f', fontFamily: 'Arial', fontSize: '24px', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Upcoming Tournaments
      </h1>

      <div style={{ marginBottom: '3rem' }}>
        <CreateTournamentForm onCreated={fetchTournaments} />
      </div>

      {editing && (
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '5px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ color: '#1976d2', fontFamily: 'Arial', fontSize: '20px', marginBottom: '0.5rem' }}>Edit Tournament</h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                Save
              </button>
              <button type="button" onClick={handleCancel} style={{ backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {tournaments.length === 0 ? (
        <p style={{ fontFamily: 'Arial', fontSize: '18px' }}>
          No tournaments available right now.
        </p>
      ) : (
        <div>
          {tournaments.map(tourney => (
            <div
              key={tourney.tournament_id}
              style={{ backgroundColor: 'white', borderRadius: '5px', padding: '1rem', margin: '1rem 0', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
            >
              <h2 style={{ fontSize: '20px', color: '#1976d2', margin: '0' }}>{tourney.name}</h2>
              <p style={{ margin: '0.5rem 0' }}>{tourney.description}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Dates:</strong> {formatDate(tourney.start_date)} – {formatDate(tourney.end_date)}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Location:</strong> {tourney.alley_name || 'TBD'}</p>
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Status:</strong>{' '}
                <span style={{ fontWeight: 'bold', color: tourney.status === 'open' ? '#43a047' : '#b71c1c' }}>
                  {tourney.status === 'open' ? '🟢 Open' : '🔒 Closed'}
                </span>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => handleJoin(tourney.tournament_id)}
                  style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Join Tournament
                </button>
                <button
                  onClick={() => startEdit(tourney)}
                  style={{ backgroundColor: '#fbc02d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(tourney.tournament_id)}
                  style={{ backgroundColor: '#b71c1c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
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
