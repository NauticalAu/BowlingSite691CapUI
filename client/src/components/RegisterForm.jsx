import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => prev.filter(err => err.param !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);

    try {
      const res = await fetch('https://bowling-api.onrender.com/api/users/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
      } else if (res.ok) {
        setMessage(`✅ Registered ${data.user.full_name}`);
        setFormData({ fullName: '', email: '', password: '' });
      } else {
        setMessage(`❌ ${data.error || 'Registration failed'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {message && (
        <p className={`text-sm text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <div>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
        />
        {errors.filter(e => e.param === 'fullName').map((e, i) => (
          <p key={i} className="text-sm text-red-600 mt-1">{e.msg}</p>
        ))}
      </div>

      <div>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          type="email"
          className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
        />
        {errors.filter(e => e.param === 'email').map((e, i) => (
          <p key={i} className="text-sm text-red-600 mt-1">{e.msg}</p>
        ))}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
        />
        <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters.</p>
        {errors.filter(e => e.param === 'password').map((e, i) => (
          <p key={i} className="text-sm text-red-600 mt-1">{e.msg}</p>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-primary text-white rounded hover:bg-red-700 font-semibold"
      >
        📝 Register
      </button>
    </form>
  );
}
