import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function AlleyDetailsPage() {
  const { id } = useParams();
  const [alley, setAlley] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/alleys/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Alley not found');
        return res.json();
      })
      .then((data) => setAlley(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="p-6 text-red-700 font-[Arial] text-center">
        ❌ {error}
      </div>
    );
  }

  if (!alley) {
    return (
      <div className="p-6 text-gray-700 font-[Arial] text-center">
        ⏳ Loading alley details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6 font-[Arial]">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-[#1976d2] mb-4">{alley.name}</h1>
        <p className="mb-2">📍 {alley.address}</p>
        <p className="mb-2">📞 {alley.phone}</p>
        {alley.website_url && (
          <p className="mb-2">
            🌐 <a href={alley.website_url} target="_blank" rel="noopener noreferrer" className="text-[#d32f2f] underline">
              Visit Website
            </a>
          </p>
        )}
        {alley.open_hours && (
          <p className="mb-2">🕒 Open Hours: {alley.open_hours}</p>
        )}
        {alley.rating && (
          <p className="mb-2">⭐ Rating: {alley.rating}/5</p>
        )}
      </div>
    </div>
  );
}

export default AlleyDetailsPage;
