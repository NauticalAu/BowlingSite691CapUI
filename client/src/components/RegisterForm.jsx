import React, { useState } from 'react';

function RegisterForm() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://bowling-api.onrender.com/api/users/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Registered ${data.user.full_name}`);
        setFormData({ fullName: '', email: '', password: '' });
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <p className={`text-sm text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <input
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
      />
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        type="email"
        className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-2 border border-gray-300 rounded focus:ring-secondary focus:border-secondary"
      />

      <button
        type="submit"
        className="w-full py-2 bg-primary text-white rounded hover:bg-red-700 font-semibold"
      >
        📝 Register
      </button>
    </form>
  );
}

export default RegisterForm;
// This code defines a RegisterForm component that allows users to register by providing their full name, email, and password.
// It handles form submission, sends the data to the server, and displays success or error messages based on the response.
// The form includes input fields for the user's full name, email, and password, and a submit button.
// The component uses React hooks to manage state and handle form submission.