import React, { useState } from 'react';

function FinderPage() {
  const [zip, setZip] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!zip.match(/^\d{5}$/)) {
      setMessage('❌ Please enter a valid 5-digit zip code');
      setResults([]);
      return;
    }

    setMessage(`🔍 Searching for alleys near ${zip}...`);

    // Simulate API results
    setTimeout(() => {
      const fakeResults = [
        { name: 'Lucky Lanes', address: '123 Bowl St, Funville' },
        { name: 'Strike City', address: '456 Pin Ave, Rolltown' },
        { name: 'Kingpin Alley', address: '789 Strike Blvd, Alleytown' }
      ];
      setResults(fakeResults);
      setMessage(`✅ Found ${fakeResults.length} results for ${zip}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
          Find a Bowling Alley
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Search for bowling alleys near you by zip code.
        </p>

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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Search
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Results</h2>
            <ul className="space-y-2 text-gray-700">
              {results.map((alley, idx) => (
                <li key={idx}>🎳 {alley.name} – {alley.address}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinderPage;
