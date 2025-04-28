// src/pages/TournamentsPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';      // your auth context
import CreateTournamentForm from '../components/CreateTournamentForm';

export default function TournamentsPage() {
  const { userId } = useAuth();                       
  const [tournaments, setTournaments]         = useState([]);
  const [participantsMap, setParticipantsMap] = useState({});
  const [editing, setEditing]                 = useState(false);
  const [formData, setFormData]               = useState({
    tournament_id:    null,
    name:             '',
    description:      '',
    start_date:       '',
    end_date:         '',
    bowling_alley_id: ''
  });

  // 1️⃣ Fetch tournaments & then participants for each
  const fetchTournaments = async () => {
    try {
      const res  = await fetch('https://bowling-api.onrender.com/api/tournaments', { credentials: 'include' });
      const data = await res.json();
      setTournaments(data);
      data.forEach(t => loadParticipants(t.tournament_id));
    } catch (err) {
      console.error('Failed to fetch tournaments', err);
    }
  };

  // Fetch the list of participants for a single tournament
  const loadParticipants = async (tid) => {
    try {
      const res  = await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${tid}/participants`,
        { credentials: 'include' }
      );
      const list = await res.json();
      setParticipantsMap(m => ({ ...m, [tid]: list }));
    } catch (err) {
      console.error('Failed to load participants for', tid, err);
    }
  };

  useEffect(fetchTournaments, []);

  // Format ISO date to e.g. “Apr 27, 2025”
  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString(undefined, {
      year:  'numeric',
      month: 'short',
      day:   'numeric',
    });

  // ✏️ Edit form handlers
  const startEdit = (t) => {
    setEditing(true);
    setFormData({
      tournament_id:    t.tournament_id,
      name:             t.name,
      description:      t.description,
      start_date:       t.start_date.split('T')[0],
      end_date:         t.end_date.split('T')[0],
      bowling_alley_id: t.bowling_alley_id
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${formData.tournament_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        }
      );
      if (!res.ok) throw new Error('Update failed');
      setEditing(false);
      fetchTournaments();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update tournament');
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${id}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (res.ok) fetchTournaments();
      else {
        const data = await res.json();
        alert(`❌ ${data.error || 'Delete failed'}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error while deleting');
    }
  };

  // 🔗 Join
  const handleJoin = async (id) => {
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${id}/join`,
        { method: 'POST', credentials: 'include' }
      );
      if (!res.ok) throw new Error('Join failed');
      await loadParticipants(id);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to join tournament');
    }
  };

  // 🚪 Leave
  const handleLeave = async (id) => {
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/tournaments/${id}/leave`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (!res.ok) throw new Error('Leave failed');
      await loadParticipants(id);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to leave tournament');
    }
  };

  // Helper: has current user already joined?
  const isJoined = (tid) =>
    (participantsMap[tid] || []).some(p => p.user_id === userId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Upcoming Tournaments</h1>

      {/* Create Form */}
      <div className="mb-6">
        <CreateTournamentForm onCreated={fetchTournaments} />
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold text-secondary mb-4">✏️ Edit Tournament</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text" name="name" placeholder="Name"
              value={formData.name} onChange={handleChange}
              className="w-full p-3 border rounded"
            />
            <textarea
              name="description" placeholder="Description"
              value={formData.description} onChange={handleChange}
              className="w-full p-3 border rounded"
            />
            <div className="flex space-x-4">
              <input
                type="date" name="start_date"
                value={formData.start_date} onChange={handleChange}
                className="p-3 border rounded flex-1"
              />
              <input
                type="date" name="end_date"
                value={formData.end_date} onChange={handleChange}
                className="p-3 border rounded flex-1"
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tournament List */}
      {tournaments.length === 0 ? (
        <p className="text-lg text-neutral">No tournaments available.</p>
      ) : (
        <div className="space-y-4">
          {tournaments.map(t => (
            <div
              key={t.tournament_id}
              className="bg-white rounded-lg shadow p-6 flex justify-between items-start"
            >
              <div>
                <h3 className="text-xl font-bold text-secondary">{t.name}</h3>
                <p className="text-gray-700 mt-2">{t.description}</p>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Dates:</strong> {formatDate(t.start_date)} – {formatDate(t.end_date)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {t.alley_name || 'TBD'}
                </p>
                {/* 🚩 Participants list */}
                {participantsMap[t.tournament_id]?.length > 0 && (
                  <div className="mt-4">
                    <strong>Participants:</strong>
                    <ul className="ml-4 list-disc text-gray-800">
                      {participantsMap[t.tournament_id].map(p => (
                        <li key={p.user_id}>{p.full_name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className={`font-semibold ${
                  t.status === 'open' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.status === 'open' ? '🟢 Open' : '🔒 Closed'}
                </span>
                <div className="flex space-x-2">
                  {/* Join / Joined */}
                  <button
                    onClick={() => handleJoin(t.tournament_id)}
                    disabled={isJoined(t.tournament_id) || t.status !== 'open'}
                    className={`btn-primary text-sm ${
                      isJoined(t.tournament_id) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isJoined(t.tournament_id) ? 'Joined ✓' : 'Join'}
                  </button>

                  {/* Leave */}
                  <button
                    onClick={() => handleLeave(t.tournament_id)}
                    disabled={!isJoined(t.tournament_id)}
                    className={`btn-secondary text-sm ${
                      !isJoined(t.tournament_id) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Leave
                  </button>

                  {/* Edit & Delete */}
                  <button onClick={() => startEdit(t)} className="btn-accent text-sm">Edit</button>
                  <button onClick={() => handleDelete(t.tournament_id)} className="btn-secondary text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
