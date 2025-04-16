import React, { useEffect, useState } from 'react';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('https://bowling-api.onrender.com/api/profile', {
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
        ...(formData.password && { password: formData.password })
      };

      const res = await fetch('https://bowling-api.onrender.com/api/profile', {
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
    <div className="min-h-screen bg-[#f8f8f8] p-6 font-[Arial]">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="text-center">
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${formData.fullName || 'user'}`}
            alt="Avatar"
            className="mx-auto h-24 w-24 rounded-full border"
          />
          <h2 className="text-2xl font-bold mt-2 text-[#1976d2]">My Profile</h2>
          <p className="text-sm text-gray-600">Manage your account info</p>
        </div>

        {message && <p className="text-sm text-center text-[#d32f2f]">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border border-gray-300 rounded focus:ring-[#1976d2] focus:border-[#1976d2]"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded focus:ring-[#1976d2] focus:border-[#1976d2]"
            required
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-[#fbc02d] focus:border-[#fbc02d]"
          />
          <button
            type="submit"
            className="bg-[#d32f2f] hover:bg-red-700 text-white w-full py-2 rounded font-semibold"
          >
            💾 Update Profile
          </button>
        </form>
        <button
            type="button"
            onClick={async () => {
              try {
                const res = await fetch('https://bowling-api.onrender.com/api/users/logout', {
                  method: 'POST',
                  credentials: 'include',
                });
                if (res.ok) {
                  window.location.href = '/login'; // Or wherever your login page lives
                } else {
                  alert('Logout failed.');
                }
              } catch (err) {
                alert('Error logging out.');
              }
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-full py-2 rounded font-semibold mt-2"
          >
            🚪 Log Out
          </button>
      </div>
    </div>
  );
}

export default ProfilePage;
