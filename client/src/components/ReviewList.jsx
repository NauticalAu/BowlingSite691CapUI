import React from 'react';

export default function ReviewList({ reviews }) {
  if (!reviews.length) return <p className="text-gray-500">No reviews yet.</p>;
  return (
    <ul className="space-y-4">
      {reviews.map(r => (
        <li key={r.review_id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-primary">{r.reviewer}</span>
            <span>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
          </div>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{r.content}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}