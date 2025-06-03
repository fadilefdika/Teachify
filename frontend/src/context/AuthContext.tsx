'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type User = {
  id: string;
  Username: string;
  Email: string;
  CreatedAt: string;
  CreatorProfile: {
    BankAccount: string;
    PhoneNumber: string;
    Address: string;
    KTPUrl: string;
    CVUrl: string;
    SelfieUrl: string;
    PortfolioUrl: string;
    SocialMedia: string;
    Biography: string;
    UserID: string;
    Status: string;
  } | null;
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

  const logout = useCallback(async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const fetchUser = useCallback(
    async (signal: AbortSignal) => {
      try {
        const res = await fetch('/api/profile', {
          method: 'GET',
          credentials: 'include', // penting jika pakai cookie
          signal,
        });

        const text = await res.text();

        if (!res.ok) throw new Error(`Unauthorized - Status ${res.status}`);

        const data = JSON.parse(text);
        setUser(data.user);
        console.log('[AuthContext] User data:', data.user);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('[AuthContext] Failed to fetch user:', error.message);
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
