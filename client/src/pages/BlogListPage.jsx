import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://bowling-api.onrender.com/api/blog', { credentials: 'include' });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Begin edit
  const startEdit = post => {
    setEditingId(post.id);
    setFormData({ title: post.title, content: post.content });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '' });
  };

  // Handle input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // Submit update
  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/blog/${editingId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        }
      );
      if (!res.ok) throw new Error();
      cancelEdit();
      fetchPosts();
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('❌ Could not update post');
    }
  };

  // Delete post
  const handleDelete = async id => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await fetch(
        `https://bowling-api.onrender.com/api/blog/${id}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (!res.ok) throw new Error();
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('❌ Could not delete post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-primary">📝 Bowling Hub Blog</h1>

      <div className="text-right">
        <Link to="/blog/create" className="btn-primary inline-block mb-4">
          ➕ New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
              {editingId === post.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Title"
                  />
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    placeholder="Content"
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-2xl text-primary font-bold hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    by {post.full_name} on {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-gray-700 line-clamp-3">
                    {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button onClick={() => startEdit(post)} className="btn-accent text-sm">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="btn-secondary text-sm">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
