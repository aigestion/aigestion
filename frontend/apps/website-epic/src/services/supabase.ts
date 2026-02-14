import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ═══════════════════════════════════════════════════════════════════
// 🌌 [GOD MODE] Supabase Client — Frontend
// ═══════════════════════════════════════════════════════════════════
// Security: Uses ANON key only (RLS-protected, safe for client).
// Admin operations MUST go through the backend API.
// ═══════════════════════════════════════════════════════════════════

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] ⚠️  Configuration missing. Auth features will be disabled.');
}

/**
 * God Mode Supabase client with optimized configuration.
 *
 * - Auth: Persists session in localStorage, auto-refreshes tokens
 * - Realtime: Configured with heartbeat for connection stability
 * - Global: Retry-capable fetch wrapper with exponential backoff
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true, // Required for OAuth redirect flows (Google, GitHub)
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          storageKey: 'aigestion-auth-token',
          flowType: 'pkce', // Most secure OAuth flow
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
          heartbeatIntervalMs: 15000, // Keep connection alive every 15s
        },
        global: {
          headers: {
            'x-application-name': 'aigestion-frontend',
            'x-app-version': import.meta.env.VITE_APP_VERSION || '2.0.0',
          },
          fetch: retryFetch,
        },
        db: {
          schema: 'public',
        },
      })
    : null;

// ═══════════════════════════════════════════════════════════════════
// Retry Fetch Wrapper — Exponential Backoff (3 attempts max)
// ═══════════════════════════════════════════════════════════════════

async function retryFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const maxRetries = 3;
  const baseDelay = 300; // ms

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(input, init);

      // Don't retry client errors (4xx), only server errors (5xx) and network issues
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      if (attempt === maxRetries) return response;

      // Exponential backoff: 300ms, 600ms, 1200ms
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
    }
  }

  // Fallback — should never reach here
  return fetch(input, init);
}

// ═══════════════════════════════════════════════════════════════════
// Authentication Helpers
// ═══════════════════════════════════════════════════════════════════

export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

export const signOut = async () => {
  if (!supabase) return;
  return await supabase.auth.signOut({ scope: 'global' }); // Sign out from all devices
};

export const getSession = async () => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
};

// ═══════════════════════════════════════════════════════════════════
// Health Check
// ═══════════════════════════════════════════════════════════════════

export const checkSupabaseHealth = async (): Promise<{
  connected: boolean;
  latencyMs: number;
}> => {
  if (!supabase) return { connected: false, latencyMs: -1 };

  const start = performance.now();
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
    const latencyMs = Math.round(performance.now() - start);
    return { connected: !error, latencyMs };
  } catch {
    return { connected: false, latencyMs: Math.round(performance.now() - start) };
  }
};
