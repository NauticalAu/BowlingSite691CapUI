import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const bowlingIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
  iconSize: [32, 32],
});

function FinderPage() {
  const [zip, setZip] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [minRating, setMinRating] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!zip.match(/^\d{5}$/)) {
      setMessage('❌ Please enter a valid 5-digit zip code');
      setResults([]);
      return;
    }

    setLoading(true);
    setMessage(`🔍 Searching for alleys near ${zip}...`);

    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/alleys/search?zip=${zip}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();

      if (data.alleys && data.alleys.length > 0) {
        setResults(data.alleys.filter(alley =>
          minRating ? alley.rating >= parseFloat(minRating) : true
        ));
        setMessage(`✅ Found ${data.alleys.length} results for ${zip}`);
      } else {
        setResults([]);
        setMessage(`🚫 No results found for ${zip}`);
      }
    } catch (err) {
      setResults([]);
      setMessage('❌ Error fetching results. Please try again later.');
      console.error(err);
    }

    setLoading(false);
  };

  const saveFavorite = async (alley) => {
    try {
      const res = await fetch(
        'https://bowling-api.onrender.com/api/favorites',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: alley.name,
            address: alley.address,
            place_id: alley.place_id,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Saved "${alley.name}" to your favorites!`);
      } else {
        alert(data.error || '❌ Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error saving favorite');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Find a Bowling Alley</h1>
          <p className="text-[18px] text-gray-700 mt-1">
            Search for bowling alleys near you by zip code.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="zipcode"
              className="block text-sm font-medium text-gray-700"
            >
              Zip Code:
            </label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 90210"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All</option>
              <option value="3.5">3.5+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-secondary hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {message && <p className="text-sm text-gray-700">{message}</p>}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Results
              </h2>
              <ul className="space-y-2 text-gray-700">
                {results.map((alley, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded bg-gray-50 shadow-sm border border-gray-200"
                  >
                    <p className="font-bold text-primary">
                      🎳{' '}
                      <Link to={`/alleys/${alley.place_id}`}>{alley.name}</Link>
                    </p>
                    <p>📍 {alley.address}</p>
                    <p>⭐ Rating: {alley.rating || 'N/A'}</p>
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${alley.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Open in Google Maps
                    </a>
                    <button
                      onClick={() => saveFavorite(alley)}
                      className="block text-sm text-red-600 hover:underline mt-1"
                    >
                      ❤️ Save to Favorites
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-[400px] rounded overflow-hidden">
              <MapContainer
                center={
                  results[0]
                    ? [results[0].location.lat, results[0].location.lng]
                    : [39.5, -98.35]
                }
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {results.map((alley, idx) => (
                  <Marker
                    key={idx}
                    position={[alley.location.lat, alley.location.lng]}
                    icon={bowlingIcon}
                  >
                    <Popup>
                      <strong>{alley.name}</strong>
                      <br />
                      {alley.address}
                      <br />
                      ⭐ {alley.rating || 'N/A'}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FinderPage;
