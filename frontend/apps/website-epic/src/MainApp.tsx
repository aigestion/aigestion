import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AppContent, LoadingFallback } from './AppContent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NexusProvider } from './contexts/NexusContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SoundProvider } from './contexts/SoundContext';
import { useAuth } from './hooks/useAuth';
import { QueryProvider } from './providers/QueryProvider';
import { NetworkProvider } from './contexts/NetworkContext';
import { NetworkToast } from './components/NetworkToast';
import { AnalyticsProvider } from './components/AnalyticsProvider';

function MainApp() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Router>
          <SoundProvider>
            <NexusProvider>
              <NotificationProvider>
                <NetworkProvider>
                  <AnalyticsProvider>
                    <NetworkToast />
                    <AppContentWithAuth />
                  </AnalyticsProvider>
                </NetworkProvider>
              </NotificationProvider>
            </NexusProvider>
          </SoundProvider>
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  );
}

function AppContentWithAuth() {
  const { loading, isAuthenticated, user, login, logout } = useAuth();
  const location = useLocation();

  // Permite que la demo de Daniela cargue incluso si el estado de Auth está cargando
  const isPublicRoute = location.pathname.startsWith('/daniela');

  if (loading && !isPublicRoute) {
    return <LoadingFallback />;
  }

  return (
    <AppContent
      loading={loading}
      isAuthenticated={isAuthenticated}
      currentUser={user}
      handleLogin={login}
      handleLogout={logout}
    />
  );
}

export default MainApp;
