import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define checkAuth outside useEffect so login() can access it
  const checkAuth = async () => {
    try {
      const res = await fetch('http://bowling-api.onrender.com/api/users/me', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUserId(data.userId);
      } else {
        setUserId(null);
      }
    } catch {
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => checkAuth();

  const logout = async () => {
    await fetch('http://bowling-api.onrender.com/api/users/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
// This code defines an AuthContext using React's Context API to manage user authentication state.
// It provides a way to check if a user is authenticated, log in, and log out.
// The AuthProvider component wraps the application and provides the authentication state and functions to its children.
// The useAuth hook allows components to access the authentication context easily.
// The checkAuth function checks if the user is authenticated by making a request to the server.