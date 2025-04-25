import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewList from '../components/ReviewList';

export default function AlleyDetailsPage() {
  const { id: placeId } = useParams();
  const [alley, setAlley]     = useState(null);
  const [error, setError]     = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating]   = useState(5);
  const [content, setContent] = useState('');

  // Fetch alley details
  useEffect(() => {
    fetch(`bowling-api.onrender.com/api/alleys/${placeId}`)
      .then(res => {
        if (!res.ok) throw new Error('Alley not found');
        return res.json();
      })
      .then(data => setAlley(data))
      .catch(err => setError(err.message));
  }, [placeId]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res  = await fetch(`bowling-api.onrender.com/api/places/${placeId}/reviews`, { credentials: 'include' });
      const data = await res.json();
      setReviews(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => { fetchReviews(); }, [placeId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await fetch(`bowling-api.onrender.com/api/places/${placeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, content })
      });
      setContent('');
      setRating(5);
      fetchReviews();
    } catch {
      // ignore
    }
  };

  if (error) {
    return <div className="p-6 text-red-700 font-[Arial] text-center">❌ {error}</div>;
  }
  if (!alley) {
    return <div className="p-6 text-gray-700 font-[Arial] text-center">⏳ Loading alley details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6 font-[Arial]">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
        <h1 className="text-3xl font-bold text-[#1976d2]">{alley.name}</h1>
        <p>📍 {alley.address}</p>
        <p>📞 {alley.phone}</p>
        {alley.website_url && (
          <p>
            🌐 <a href={alley.website_url} target="_blank" rel="noopener noreferrer" className="text-[#d32f2f] underline">
              Visit Website
            </a>
          </p>
        )}
        {alley.open_hours && <p>🕒 Open Hours: {alley.open_hours}</p>}
        {alley.rating && <p>⭐ Rating: {alley.rating}/5</p>}
      </div>

      {/* Reviews Section */}
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Leave a Review</h2>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <label className="block">
            Rating: {' '}
            <select
              value={rating}
              onChange={e => setRating(+e.target.value)}
              className="p-2 border rounded"
            >
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
            </select>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 border rounded"
            rows={4}
          />
          <button type="submit" className="btn-primary">Submit Review</button>
        </form>
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Reviews</h2>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}