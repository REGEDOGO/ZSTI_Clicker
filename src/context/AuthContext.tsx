import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  useEffect(() => {
    // If we have a token but no user, we might want to validate it or just assume logged in for now.
    // Ideally we'd have a /me endpoint, but for simplicity we rely on the login response setting the user.
    // If page reload happens, we might lose user object if not persisted.
    // Let's persist user in localStorage too for this simple app.
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiClient.login(username, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      throw e;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await apiClient.register(username, email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
