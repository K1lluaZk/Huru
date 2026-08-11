import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { getErrorMessage } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('huru_user');
    const storedToken = localStorage.getItem('huru_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Validate the token is still good and refresh user data in the background.
      authService
        .me()
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem('huru_user', JSON.stringify(res.data.data));
        })
        .catch(() => {
          localStorage.removeItem('huru_token');
          localStorage.removeItem('huru_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const persistSession = (nextUser: User, token: string) => {
    localStorage.setItem('huru_token', token);
    localStorage.setItem('huru_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login(email, password);
      persistSession(res.data.data.user, res.data.data.token);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await authService.register(name, email, password);
      persistSession(res.data.data.user, res.data.data.token);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const logout = () => {
    localStorage.removeItem('huru_token');
    localStorage.removeItem('huru_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return ctx;
}
