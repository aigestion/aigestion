import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContent, LoadingFallback } from './AppContent';
import { NexusProvider } from './contexts/NexusContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SoundProvider } from './contexts/SoundContext';
import { supabase } from './services/supabase';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      const role = user.user_metadata?.role || 'client';

      // Check if admin
      const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com'];
      const isMobileApp = window.location.hostname === 'localhost' || window.location.protocol.includes('capacitor');

      if ((adminEmails.includes(user.email!) || role === 'admin') && !isMobileApp) {
        window.location.href = 'https://admin.aigestion.net';
        return;
      }

      setSession(data.session);
      setCurrentUser({
        email: user.email!,
        name: user.user_metadata?.name || user.email!.split('@')[0],
        subscription: user.user_metadata?.subscription || 'free',
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase no configurado; usando modo demo');
      setTimeout(() => setLoading(false), 0);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        setSession(session);
        if (session) {
          const user = session.user;
          const role = user.user_metadata?.role || 'client';

          // Check if admin
          const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com'];
          const isMobileApp = window.location.hostname === 'localhost' || window.location.protocol.includes('capacitor');
          
          if ((adminEmails.includes(user.email!) || role === 'admin') && !isMobileApp) {
            window.location.href = 'https://admin.aigestion.net';
            return;
          }

          setCurrentUser({
            email: user.email!,
            name: user.user_metadata?.name || user.email!.split('@')[0],
            subscription: user.user_metadata?.subscription || 'free',
          });
          setIsAuthenticated(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Supabase Session Error:', err);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      if (session) {
        const user = session.user;
        const role = user.user_metadata?.role || 'client';

        // Check if admin
        // Check if admin
        const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com'];
        // [GOD MODE FIX] Don't redirect if running in Capacitor/Mobile App to allow Super App access
        const isCapacitor = window.location.protocol === 'file:' || window.location.port === ''; 
        // Note: Capacitor often serves from localhost with port, but protocol checks help. 
        // Better: Check local storage or route. For now, assume if we are at /weapon we stay.
        
        const isMobileApp = window.location.hostname === 'localhost' || window.location.protocol.includes('capacitor');

        if ((adminEmails.includes(user.email!) || role === 'admin') && !isMobileApp) {
          window.location.href = 'https://admin.aigestion.net';
          return;
        }

        setCurrentUser({
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          subscription: user.user_metadata?.subscription || 'free',
        });
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Router>
      <SoundProvider>
        <NexusProvider>
          <NotificationProvider>
            <AppContent
              loading={loading}
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            />
          </NotificationProvider>
        </NexusProvider>
      </SoundProvider>
    </Router>
  );
}
export default App;
