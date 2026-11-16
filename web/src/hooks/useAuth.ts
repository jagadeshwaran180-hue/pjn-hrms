import { useState, useEffect } from 'react';

export interface UserSession {
  email: string;
  name: string;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
}

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const raw = localStorage.getItem('pjn_demo_auth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = (email: string, role: 'ADMIN' | 'HR' | 'EMPLOYEE' = 'ADMIN') => {
    const session: UserSession = {
      email,
      name: email.split('@')[0],
      role
    };
    localStorage.setItem('pjn_demo_auth', JSON.stringify(session));
    setUser(session);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('pjn_demo_auth');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout };
};
