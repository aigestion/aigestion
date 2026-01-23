import { createClient } from '@supabase/supabase-js';

// Usamos variables de entorno que deben estar en cada app o en el monorepo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const signInWithGoogle = async () => {
    if (!supabase) return { error: { message: 'Supabase no configurado' } };
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });

    return { data, error };
};

export const signOut = async () => {
    if (!supabase) return { error: { message: 'Supabase no configurado' } };
    const { error } = await supabase.auth.signOut();
    return { error };
};
