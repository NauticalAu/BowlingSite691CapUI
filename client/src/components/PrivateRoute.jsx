// This component is used to protect routes that require authentication.
// It checks if the user is authenticated and either renders the children components or redirects to the login page.
// It uses the useAuth context to get the user's authentication status and loading state.
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { userId, loading } = useAuth();

  if (loading) return <p className="text-center p-4">⏳ Loading...</p>;
  return userId ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
// This component checks if the user is authenticated before rendering the children components.
// If the user is not authenticated, it redirects them to the login page.
// If the user is authenticated, it renders the children components.    