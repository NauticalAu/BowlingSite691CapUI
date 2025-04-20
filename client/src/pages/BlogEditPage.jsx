import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function BlogEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://bowling-api.onrender.com/api/blog/${id}`);
        const data = await res.json();
        setTitle(data.post.title);
        setContent(data.post.content);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post');
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`https://bowling-api.onrender.com/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update post');
      }

      navigate(`/blog/${id}`);
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-3xl font-bold text-center text-secondary">✏️ Edit Blog Post</h1>

      {error && <p className="text-red-600 text-center font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Update your blog content..."
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-red-700 font-semibold"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}

export default BlogEditPage;
