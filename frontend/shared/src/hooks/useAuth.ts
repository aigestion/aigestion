import { useEffect, useState } from 'react';
import { supabase } from '../services/SupabaseService';
import { User } from '@supabase/supabase-js';

export type UserRole = 'ADMIN' | 'CLIENT' | 'DEMO' | 'GUEST';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>('GUEST');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Obtener sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            // Simulación de RBAC: En producción esto vendría de una tabla de perfiles
            if (session?.user) {
                const email = session.user.email;
                if (email?.includes('admin')) setRole('ADMIN');
                else if (email?.includes('client')) setRole('CLIENT');
                else setRole('DEMO');
            }
            setLoading(false);
        });

        // Escuchar cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const email = session.user.email;
                if (email?.includes('admin')) setRole('ADMIN');
                else if (email?.includes('client')) setRole('CLIENT');
                else setRole('DEMO');
            } else {
                setRole('GUEST');
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, role, loading };
};
