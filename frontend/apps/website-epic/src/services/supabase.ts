import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * 🌌 [GOD MODE] Supabase Client (Frontend)
 * High-performance client with configuration safety.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] ⚠️  Configuration missing. Auth features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Optimized Authentication layer
 */
export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
}

export const signOut = async () => {
  if (!supabase) return;
  return await supabase.auth.signOut();
}

/**
 * Health check utility
 */
export const checkSupabaseHealth = async (): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('users').select('id').limit(1).maybeSingle();
    return !error;
  } catch {
    return false;
  }
}
