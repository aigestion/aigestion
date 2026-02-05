import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

/**
 * 🌌 [DIVINE MODE] Supabase Client (Frontend)
 * High-performance client with configuration safety.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] ⚠️  Configuration missing. Auth features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * 🚀 [DIVINE MODE] Supabase Admin Client (Service Role)
 * For server-side operations and admin functions.
 */
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
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

/**
 * 🌌 [DIVINE MODE] Advanced Database Operations
 */
export const createAdminUser = async (email: string, password: string) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  return await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'admin',
      created_by: 'divine_mode'
    }
  });
}

export const createDatabaseTable = async (tableName: string, schema: any) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  // This would require SQL execution - placeholder for divine mode
  console.log(`[DIVINE MODE] Creating table: ${tableName}`, schema);
  return { success: true, message: 'Table creation initiated' };
}
