import { BrowserRouter as Router } from 'react-router-dom';
import { AppContent, LoadingFallback } from './AppContent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NexusProvider } from './contexts/NexusContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SoundProvider } from './contexts/SoundContext';
import { useAuth } from './hooks/useAuth';
import { QueryProvider } from './providers/QueryProvider';

function App() {
  const { loading, isAuthenticated, user, login, logout } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <Router>
          <SoundProvider>
            <NexusProvider>
              <NotificationProvider>
                <AppContent
                  loading={loading}
                  isAuthenticated={isAuthenticated}
                  currentUser={user}
                  handleLogin={login}
                  handleLogout={logout}
                />
              </NotificationProvider>
            </NexusProvider>
          </SoundProvider>
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  );
}
export default App;
