import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated visitors to login, preserving attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
