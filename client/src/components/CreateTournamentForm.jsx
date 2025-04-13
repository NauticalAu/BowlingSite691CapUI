import React, { useState } from 'react';

function CreateTournamentForm({ onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Convert camelCase to snake_case
    const payload = {
      name: formData.name,
      description: formData.description,
      start_date: formData.startDate,
      end_date: formData.endDate,
      alley_id: null,
      organizer_id: null
    };

    console.log('📦 Submitting tournament payload:', payload);

    try {
      const res = await fetch('http://localhost:8080/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Tournament created!');
        setFormData({ name: '', description: '', startDate: '', endDate: '' });
        if (onCreated) onCreated(); // trigger refresh
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error creating tournament');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto mb-8">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">🏆 Create Tournament</h2>

      {message && (
        <p className={`text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
        />
        <textarea
          name="description"
          placeholder="Tournament Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
        ></textarea>
        <div className="flex gap-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-red-700 font-semibold"
        >
          ➕ Create Tournament
        </button>
      </form>
    </div>
  );
}

export default CreateTournamentForm;
// This component allows users to create a new tournament by filling out a form.    