import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout'; // Importing the Layout component for consistent styling

function BlogCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://bowling-api.onrender.com/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      // Redirect to blog list after success
      navigate('/blog');
    } catch (err) {
      console.error('Blog creation error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">📝 Create a New Blog Post</h1>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post here..."
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-secondary hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded w-full"
          >
            {loading ? 'Publishing...' : '📝 Publish Post'}
          </button>
        </form>
      </div>
  );
}

export default BlogCreatePage;
