'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    // tidak perlu nookies.destroy karena cookie HttpOnly tidak bisa dihapus dari client
    setUser(null);
    setIsLoading(false);
  }, []);

  const fetchUser = useCallback(
    async (signal: AbortSignal) => {
      try {
        const res = await fetch('http://localhost:3000/api/profile', {
          method: 'GET',
          credentials: 'include',
          signal,
        });

        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setUser(data.user);
        console.log('[AuthContext] User data:', data.user);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('[AuthContext] Failed to fetch user:', error.message);
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller.signal);

    return () => controller.abort();
  }, [fetchUser]);

  return <AuthContext.Provider value={{ user, isLoading, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
