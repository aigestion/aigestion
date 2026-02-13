/**
 * Authentication Middleware - Security Layer
 * Protección avanzada para autenticación AIGestion
 */

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { useState, useEffect } from 'react';

// Environment variables con validación
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Schema para validación de datos de usuario
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'client', 'demo']),
  created_at: z.string().datetime(),
  last_sign_in_at: z.string().datetime().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxAttempts: 5, // Máximo 5 intentos
  blockDurationMs: 30 * 60 * 1000, // Bloquear por 30 minutos
};

// Almacenamiento de intentos (en producción usar Redis)
const loginAttempts = new Map<
  string,
  { count: number; lastAttempt: number; blockedUntil?: number }
>();

/**
 * Verifica si un usuario está bloqueado por demasiados intentos
 */
export function isUserBlocked(identifier: string): boolean {
  const attempts = loginAttempts.get(identifier);
  if (!attempts) return false;

  if (attempts.blockedUntil && Date.now() < attempts.blockedUntil) {
    return true;
  }

  // Resetear si el bloqueo expiró
  if (attempts.blockedUntil && Date.now() >= attempts.blockedUntil) {
    loginAttempts.delete(identifier);
    return false;
  }

  return false;
}

/**
 * Registra un intento de login fallido
 */
export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: 0 };

  attempts.count++;
  attempts.lastAttempt = now;

  // Bloquear si excede el máximo
  if (attempts.count >= RATE_LIMIT_CONFIG.maxAttempts) {
    attempts.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
  }

  loginAttempts.set(identifier, attempts);
}

/**
 * Limpia intentos fallidos tras login exitoso
 */
export function clearLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * Validación de contraseña segura
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }

  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Verificación de email administrador
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com'];
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Middleware de autenticación con seguridad avanzada
 */
export class AuthMiddleware {
  /**
   * Login con rate limiting y validación
   */
  static async secureLogin(email: string, password: string) {
    // Verificar rate limiting
    if (isUserBlocked(email)) {
      throw new Error('Demasiados intentos. Por favor, espera 30 minutos.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        recordFailedLogin(email);
        throw new Error('Credenciales inválidas');
      }

      // Limpiar intentos fallidos tras login exitoso
      clearLoginAttempts(email);

      // Validar datos del usuario
      if (data.user) {
        const validatedUser = UserSchema.safeParse({
          id: data.user.id,
          email: data.user.email!,
          role: isAdminEmail(data.user.email!) ? 'admin' : 'client',
          created_at: data.user.created_at!,
          last_sign_in_at: data.user.last_sign_in_at || undefined,
        });

        if (!validatedUser.success) {
          throw new Error('Datos de usuario inválidos');
        }

        return {
          user: validatedUser.data,
          session: data.session,
        };
      }

      throw new Error('Error en autenticación');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error interno del servidor');
    }
  }

  /**
   * Registro con validación de contraseña
   */
  static async secureRegister(email: string, password: string, metadata?: any) {
    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: isAdminEmail(email) ? 'admin' : 'client',
            ...metadata,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error en registro');
    }
  }

  /**
   * Logout seguro
   */
  static async secureLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error('Error al cerrar sesión');
    }
  }

  /**
   * Verificación de sesión activa
   */
  static async verifySession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    // Validar que el usuario siga existiendo y sea válido
    const validatedUser = UserSchema.safeParse({
      id: session.user.id,
      email: session.user.email!,
      role: isAdminEmail(session.user.email!) ? 'admin' : 'client',
      created_at: session.user.created_at!,
      last_sign_in_at: session.user.last_sign_in_at || undefined,
    });

    if (!validatedUser.success) {
      await this.secureLogout();
      return null;
    }

    return {
      user: validatedUser.data,
      session,
    };
  }

  /**
   * Refrescar token de sesión
   */
  static async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      throw new Error('Error al refrescar sesión');
    }

    return data;
  }
}

/**
 * Hook personalizado para autenticación segura
 */
export function useSecureAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await AuthMiddleware.verifySession();
        if (sessionData) {
          setUser(sessionData.user);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await AuthMiddleware.secureLogin(email, password);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await AuthMiddleware.secureLogout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
