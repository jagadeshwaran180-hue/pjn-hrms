import { useState } from 'react';

export interface UserSession {
  email: string;
  name: string;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
}

const getStoredSession = (): UserSession | null => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('pjn_demo_auth') : null;
    if (raw) {
      return JSON.parse(raw) as UserSession;
    }
  } catch {
    // Ignore invalid JSON in localStorage
  }
  return null;
};

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(getStoredSession);
  const isAuthenticated = user !== null;

  const login = (email: string, role: 'ADMIN' | 'HR' | 'EMPLOYEE' = 'ADMIN') => {
    const session: UserSession = {
      email,
      name: email.split('@')[0],
      role
    };
    localStorage.setItem('pjn_demo_auth', JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem('pjn_demo_auth');
    setUser(null);
  };

  return { user, isAuthenticated, login, logout };
};
