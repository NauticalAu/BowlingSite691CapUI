import React, { useState } from 'react';
import Layout from '../components/Layout';

function FinderPage() {
  const [zip, setZip] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await fetch(`/api/alleys?zip=${zip}`);
      const data = await res.json();

      if (data.alleys && data.alleys.length > 0) {
        setResults(data.alleys);
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

  return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Find a Bowling Alley</h1>
          <p className="text-[18px] text-gray-700 mt-1">
            Search for bowling alleys near you by zip code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
              Enter Zip Code:
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
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Results</h2>
            <ul className="space-y-2 text-gray-700">
              {results.map((alley, idx) => (
                <li key={idx} className="p-3 rounded bg-gray-50 shadow-sm border border-gray-200">
                  <p className="font-bold text-primary">🎳 {alley.name}</p>
                  <p>📍 {alley.address}</p>
                  <p>📞 {alley.phone}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
  );
}

export default FinderPage;
