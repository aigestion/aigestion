import type { Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export interface AuthUser {
  email: string;
  name: string;
  subscription: 'free' | 'premium' | 'enterprise';
  role: 'client' | 'admin' | 'superadmin';
  avatar?: string;
  phone?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface AuthState {
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMobileApp: boolean;
}

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
  verifyPhone: (phone: string, code: string) => Promise<void>;
  sendPhoneVerificationCode: (phone: string) => Promise<void>;
  checkPhoneVerification: () => boolean;
}

const ADMIN_EMAILS = ['admin@aigestion.net', 'nemisanalex@gmail.com'];
const ADMIN_REDIRECT_URL = 'https://admin.aigestion.net';

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    isMobileApp: false,
  });

  const checkMobileApp = useCallback((): boolean => {
    return (
      window.location.hostname === 'localhost' ||
      window.location.protocol.includes('capacitor') ||
      window.location.protocol === 'file:' ||
      window.location.port === ''
    );
  }, []);

  const createAuthUser = useCallback((user: User): AuthUser => {
    const metadata = user.user_metadata || {};
    return {
      email: user.email!,
      name: metadata.name || user.email!.split('@')[0],
      subscription: metadata.subscription || 'free',
      role: metadata.role || 'client',
      avatar: metadata.avatar,
      phone: metadata.phone,
      phoneVerified: metadata.phoneVerified || false,
      emailVerified: user.email_confirmed_at != null,
      lastLogin: new Date(),
      createdAt: user.created_at ? new Date(user.created_at) : new Date(),
    };
  }, []);

  const checkAdminRedirect = useCallback(
    (user: AuthUser): boolean => {
      const isAdminUser = ADMIN_EMAILS.includes(user.email) || user.role === 'admin';
      const isMobile = checkMobileApp();

      if (isAdminUser && !isMobile) {
        window.location.href = ADMIN_REDIRECT_URL;
        return true;
      }
      return false;
    },
    [checkMobileApp]
  );

  const handleSessionChange = useCallback(
    async (session: Session | null) => {
      setState(prev => ({ ...prev, loading: true }));

      try {
        if (session?.user) {
          const authUser = createAuthUser(session.user);

          // Check for admin redirect
          if (checkAdminRedirect(authUser)) {
            return; // Will redirect, don't update state
          }

          setState({
            session,
            user: authUser,
            loading: false,
            isAuthenticated: true,
            isAdmin: ADMIN_EMAILS.includes(authUser.email) || authUser.role === 'admin',
            isMobileApp: checkMobileApp(),
          });
        } else {
          setState({
            session: null,
            user: null,
            loading: false,
            isAuthenticated: false,
            isAdmin: false,
            isMobileApp: checkMobileApp(),
          });
        }
      } catch (error) {
        console.error('Session handling error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          isAuthenticated: false,
          user: null,
          session: null,
        }));
      }
    },
    [createAuthUser, checkAdminRedirect, checkMobileApp]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setState(prev => ({ ...prev, loading: true }));

      if (!supabase) {
        console.warn('Supabase not configured. Login simulation.');
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            loading: false,
            isAuthenticated: true,
            user: {
              email,
              name: email.split('@')[0],
              subscription: 'free',
              role: 'client',
            },
            session: {} as any, // Mock session
          }));
        }, 1000);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session?.user) {
          await handleSessionChange(data.session);
        }
      } catch (error) {
        setState(prev => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [handleSessionChange]
  );

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    if (!supabase) {
      setState({
        session: null,
        user: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        isMobileApp: checkMobileApp(),
      });
      return;
    }

    try {
      await supabase.auth.signOut();
      await handleSessionChange(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      setState({
        session: null,
        user: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        isMobileApp: checkMobileApp(),
      });
    }
  }, [handleSessionChange, checkMobileApp]);

  const refreshSession = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      await handleSessionChange(data.session);
    } catch (error) {
      console.error('Session refresh error:', error);
      await handleSessionChange(null);
    }
  }, [handleSessionChange]);

  const updateUser = useCallback(
    async (updates: Partial<AuthUser>) => {
      if (!state.user || !state.session) {
        throw new Error('No authenticated user');
      }

      if (!supabase) {
        console.warn('Supabase not configured. User update simulated.');
        return;
      }

      setState(prev => ({ ...prev, loading: true }));

      try {
        const { error } = await supabase.auth.updateUser({
          data: updates,
        });

        if (error) {
          throw error;
        }

        // Refresh session to get updated metadata
        await refreshSession();
      } catch (error) {
        setState(prev => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [state.user, state.session, refreshSession]
  );

  const sendPhoneVerificationCode = useCallback(async (phone: string) => {
    if (!supabase) {
      // Demo mode - simulate sending code
      console.log('Demo: Sending verification code to', phone);
      return;
    }

    try {
      // In a real implementation, you would:
      // 1. Generate a 6-digit code
      // 2. Store it in the database with expiration
      // 3. Send SMS via Twilio or similar service
      const { error } = await supabase.functions.invoke('send-phone-verification', {
        body: { phone }
      });

      if (error) {
        throw new Error('Error al enviar código de verificación');
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  }, []);

  const verifyPhone = useCallback(async (phone: string, code: string) => {
    if (!supabase) {
      // Demo mode - simulate verification
      if (code === '123456') {
        await updateUser({ phone, phoneVerified: true });
        return;
      }
      throw new Error('Código inválido. En modo demo usa: 123456');
    }

    try {
      // In a real implementation, you would:
      // 1. Verify the code against the stored one
      // 2. Check expiration time
      // 3. Mark phone as verified
      const { error } = await supabase.functions.invoke('verify-phone-code', {
        body: { phone, code }
      });

      if (error) {
        throw new Error('Código de verificación inválido');
      }

      // Update user metadata to reflect phone verification
      await updateUser({ phone, phoneVerified: true });
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  }, [updateUser]);

  const checkPhoneVerification = useCallback((): boolean => {
    return state.user?.phoneVerified || false;
  }, [state.user]);

  useEffect(() => {
    // Check if Supabase is available
    if (!supabase) {
      console.warn('Supabase not configured; using demo mode');
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => handleSessionChange(session))
      .catch(error => {
        console.error('Initial session error:', error);
        setState(prev => ({ ...prev, loading: false }));
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSessionChange]);

  return {
    ...state,
    login,
    logout,
    refreshSession,
    updateUser,
    verifyPhone,
    sendPhoneVerificationCode,
    checkPhoneVerification,
  };
}
