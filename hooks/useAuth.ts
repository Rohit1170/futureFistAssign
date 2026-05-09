'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  userId: string;
  email: string;
  role: 'admin' | 'analyst';
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
  });

  // Verify auth status on mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();

        if (data.authenticated && data.user) {
          setState({
            user: data.user,
            loading: false,
            authenticated: true,
          });
        } else {
          setState({
            user: null,
            loading: false,
            authenticated: false,
          });
        }
      } catch (error) {
        console.error('[v0] Auth verification error:', error);
        setState({
          user: null,
          loading: false,
          authenticated: false,
        });
      }
    }

    verifyAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setState({
        user: null,
        loading: false,
        authenticated: false,
      });
      router.push('/login');
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  }, [router]);

  return {
    ...state,
    logout,
  };
}
