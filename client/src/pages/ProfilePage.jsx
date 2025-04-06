import React, { useEffect, useState } from 'react';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/profile', {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data.profile);
          setFormData({
            fullName: data.profile.full_name,
            email: data.profile.email,
            password: ''
          });
        } else {
          setMessage(data.error || 'Error loading profile');
        }
      } catch (err) {
        setMessage('❌ Error loading profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        ...(formData.password && { password: formData.password }) // only include if filled
      };

      const res = await fetch('http://localhost:8080/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Profile updated');
        setProfile(data.profile);
        setFormData((prev) => ({ ...prev, password: '' }));
      } else {
        setMessage(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error updating profile');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <div className="text-center">
        <img
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${formData.fullName || 'user'}`}
          alt="Avatar"
          className="mx-auto h-24 w-24 rounded-full border"
        />
        <h2 className="text-2xl font-bold mt-2">My Profile</h2>
        <p className="text-sm text-gray-500">Manage your account info</p>
      </div>

      {message && <p className="text-sm text-center text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          💾 Update Profile
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
