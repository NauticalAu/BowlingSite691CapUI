import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BlogCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const newPost = await res.json();
      navigate(`/blog/${newPost.id}`);
    } catch (err) {
      console.error('Error creating blog post:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-3xl font-bold text-center text-secondary">➕ New Blog Post</h1>

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
          placeholder="Write your blog content here..."
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-red-700 font-semibold"
        >
          📝 Publish Post
        </button>
      </form>
    </div>
  );
}

export default BlogCreatePage;
// This code defines a React component for creating a new blog post. It includes a form with fields for the title and content of the post. When the form is submitted, it sends a POST request to the server to create the new post. If successful, it redirects to the newly created post's page.
// If there are any errors during the process, they are displayed to the user. The component uses React hooks for managing state and side effects, and it utilizes the `useNavigate` hook from `react-router-dom` for navigation.
// The form includes basic validation to ensure that both the title and content fields are filled out before submission. The component is styled with Tailwind CSS classes for a clean and modern look.
//