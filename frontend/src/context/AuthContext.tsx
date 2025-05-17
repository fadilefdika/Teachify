'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data.user);
        setToken(storedToken);
      } catch (e: any) {
        setError(e.message);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }

  return <AuthContext.Provider value={{ user, token, loading, error, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
