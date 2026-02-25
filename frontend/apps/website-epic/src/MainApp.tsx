import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AppContent, LoadingFallback } from './AppContent';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import { NetworkToast } from './components/NetworkToast';
import { NetworkProvider } from './contexts/NetworkContext';
import { NexusProvider } from './contexts/NexusContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SoundProvider } from './contexts/SoundContext';
import { useAuth } from './hooks/useAuth';
import { QueryProvider } from './providers/QueryProvider';

function MainApp() {
  return (
    <ErrorBoundaryEnhanced
      onError={(error, errorInfo) => {
        console.error('MainApp Error Boundary caught:', error, errorInfo);
      }}
    >
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
    </ErrorBoundaryEnhanced>
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
