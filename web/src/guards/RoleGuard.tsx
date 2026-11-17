import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Unauthenticated user -> redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    // Authenticated but insufficient permission -> redirect to 403 Forbidden page
    return <Navigate to="/403" state={{ attemptedPath: location.pathname, requiredRoles: allowedRoles }} replace />;
  }

  return <Outlet />;
};
