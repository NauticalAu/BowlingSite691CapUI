import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('https://bowling-api.onrender.com/api/favorites', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setFavorites(data.favorites);
        } else {
          setMessage(data.error || '❌ Failed to load favorites');
        }
      } catch (err) {
        console.error(err);
        setMessage('❌ Error loading favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this favorite?')) return;

    try {
      const res = await fetch(`https://bowling-api.onrender.com/api/favorites/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setFavorites(favorites.filter(fav => fav.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || '❌ Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error deleting favorite');
    }
  };

  return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-primary text-center">🎯 Your Favorite Alleys</h1>

        {message && <p className="text-sm text-gray-700 text-center">{message}</p>}

        {loading ? (
          <p className="text-center text-gray-500">Loading your favorites...</p>
        ) : favorites.length === 0 ? (
          <p className="text-center text-gray-500">No favorites yet.</p>
        ) : (
          <>
            <p className="text-center text-sm text-gray-600">
              You have {favorites.length} saved {favorites.length === 1 ? 'alley' : 'alleys'}.
            </p>

            <ul className="space-y-3">
              {favorites.map((fav) => (
                <li
                  key={fav.id}
                  className="border p-4 rounded bg-gray-50 shadow-sm flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold text-primary text-lg">{fav.name}</p>
                    <p className="text-gray-600">{fav.address}</p>
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${fav.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    🗑️ Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="text-center mt-4">
              <Link to="/finder" className="text-sm text-blue-600 hover:underline">
                🔍 Back to Alley Finder
              </Link>
            </div>
          </>
        )}
      </div>
  );
}

export default FavoritesPage;
// Compare this snippet from client/src/components/ScoreSummary.jsx:
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Layout from '../components/Layout';   