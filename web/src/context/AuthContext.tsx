import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSession, UserRole, PermissionAction } from '../types';
import {
  getActiveSession,
  authenticateUser,
  terminateSession,
  checkPermission,
  canAccessRecord,
  canApproveRequest,
} from '../services/authService';

interface AuthContextType {
  user: UserSession | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  can: (action: PermissionAction) => boolean;
  canAccess: (recordOwnerEmpId: string) => boolean;
  canApprove: (requestOwnerEmpId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(getActiveSession);

  // Sync state if session changes in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getActiveSession());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (email: string, password?: string) => {
    const result = authenticateUser(email, password);
    if (result.success && result.session) {
      setUser(result.session);
      return { success: true };
    }
    return { success: false, error: result.error || 'Authentication failed' };
  };

  const logout = () => {
    terminateSession();
    setUser(null);
  };

  const can = (action: PermissionAction) => {
    return checkPermission(user, action);
  };

  const canAccess = (recordOwnerEmpId: string) => {
    return canAccessRecord(user, recordOwnerEmpId).allowed;
  };

  const canApprove = (requestOwnerEmpId: string) => {
    return canApproveRequest(user, requestOwnerEmpId).allowed;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        logout,
        can,
        canAccess,
        canApprove,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
