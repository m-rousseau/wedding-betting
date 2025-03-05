import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { User, AuthResponse } from '../types';
import * as authService from '../services/authService';
import { isCustomError, getErrorMessage, logError } from '../utils/errorHandler';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await authService.getProfile();

        if (isCustomError(result)) {
          setError(getErrorMessage(result));
          setUser(null);
        } else {
          setUser(result as User);
        }
      } catch (err) {
        logError(err, 'useAuth.loadUser');
        setError(getErrorMessage(err));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session) {
          loadUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = useCallback(
    async (email: string, password: string, name: string, selfieUri?: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await authService.signUp(email, password, name, selfieUri);

        if (isCustomError(result)) {
          setError(getErrorMessage(result));
          return false;
        } else {
          setUser((result as AuthResponse).user);
          return true;
        }
      } catch (err) {
        logError(err, 'useAuth.signUp');
        setError(getErrorMessage(err));
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.login(email, password);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return false;
      } else {
        setUser((result as AuthResponse).user);
        return true;
      }
    } catch (err) {
      logError(err, 'useAuth.login');
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.logout();

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return false;
      } else {
        setUser(null);
        return true;
      }
    } catch (err) {
      logError(err, 'useAuth.logout');
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    login,
    logout,
    isAuthenticated: !!user,
  };
}; 