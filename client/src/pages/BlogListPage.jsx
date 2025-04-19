import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-secondary">📝 Bowling Hub Blog</h1>

      <div className="text-right">
        <Link
          to="/blog/create"
          className="inline-block bg-primary text-white font-semibold px-4 py-2 rounded hover:bg-red-700"
        >
          ➕ New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-600">No blog posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 shadow rounded border border-gray-200"
            >
              <Link to={`/blog/${post.id}`} className="text-2xl text-primary font-bold hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">
                by {post.full_name} on {new Date(post.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-2 line-clamp-3">
                {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogListPage;
