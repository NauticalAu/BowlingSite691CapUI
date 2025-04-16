import React, { useState } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://bowling-api.onrender.com/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = '/profile';
      } else {
        setMessage(data.error || '❌ Invalid login');
      }
    } catch (err) {
      setMessage('❌ Error connecting to server');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto bg-white p-6 rounded shadow">
      {message && <p className="text-sm text-red-600">{message}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="bg-[#1976d2] hover:bg-blue-700 text-white w-full py-2 rounded font-semibold"
      >
        🔐 Log In
      </button>
    </form>
  );
}

export default LoginForm;
