import React, { useState } from 'react';

function LogoutButton() {
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    const res = await fetch('https://bowling-api.onrender.com/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('👋 You have been logged out.');
    } else {
      setMessage(`❌ Logout failed: ${data.error}`);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LogoutButton;
// This code defines a LogoutButton component that allows users to log out of their account.