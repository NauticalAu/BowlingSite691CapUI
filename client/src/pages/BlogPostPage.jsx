import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        const data = await res.json();
        setPost(data.post);
        setComments(data.comments);
      } catch (err) {
        console.error('Error loading post:', err);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/blog/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: commentText })
      });
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
      setMessage('✅ Comment added!');
    } catch (err) {
      console.error('Failed to submit comment:', err);
      setMessage('❌ Failed to comment');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      navigate('/blog');
    } catch (err) {
      console.error('Failed to delete:', err);
      setMessage('❌ Failed to delete post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {post ? (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary">{post.title}</h1>
              <p className="text-sm text-gray-500 mb-2">
                by {post.full_name} on {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>

            {userId === post.user_id && (
              <div className="space-x-2">
                <Link
                  to={`/blog/${post.id}/edit`}
                  className="text-sm text-blue-600 hover:underline font-semibold"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-600 hover:underline font-semibold"
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>

          <p className="text-[18px] text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-secondary mb-2">💬 Comments</h2>
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet. Be the first!</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="border-l-4 border-primary pl-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{c.full_name}</span> • {new Date(c.created_at).toLocaleString()}
                    </p>
                    <p className="text-[16px] text-gray-800">{c.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {userId && (
            <form onSubmit={handleCommentSubmit} className="mt-6 space-y-2">
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700"
              >
                💬 Submit Comment
              </button>
              {message && <p className="text-sm text-center text-green-600">{message}</p>}
            </form>
          )}
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
}

export default BlogPostPage;
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
//
// const BlogPostPage = () => {