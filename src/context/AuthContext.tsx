import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiClient.login(username, password);
      setUser(data.user);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      throw e;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await apiClient.register(username, email, password);
      // Backend returns userId on register, but usually login is required after.
      // However, if we want auto-login, we need the full user object.
      // My API returns userId. Let's assume we can construct a basic user object or just require login.
      // But wait, the previous logic did auto-login. The new API returns { message, userId }.
      // So we can't fully auto-login without the username/email (which we have).
      // Let's construct it.
      const newUser = { id: data.userId, username, email };
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return data;
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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
