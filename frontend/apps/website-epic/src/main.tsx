// 🌌 Sentry MUST be first import
import './lib/sentry';

import { SentryErrorBoundary } from '@aigestion/sentry-config';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp';
import { AppProvider } from './contexts/AppContext';
import { useServiceWorker } from './hooks/useServiceWorker';
import './index.css';

// Service Worker Component
function ServiceWorkerManager() {
  const { isSupported, isRegistered, showUpdatePrompt, applyUpdate, dismissUpdate } =
    useServiceWorker();

  React.useEffect(() => {
    if (showUpdatePrompt) {
      const shouldUpdate = window.confirm('A new version is available! Would you like to update?');
      if (shouldUpdate) {
        applyUpdate();
      } else {
        dismissUpdate();
      }
    }
  }, [showUpdatePrompt, applyUpdate, dismissUpdate]);

  return null;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SentryErrorBoundary>
        <AppProvider>
          <MainApp />
          <ServiceWorkerManager />
        </AppProvider>
      </SentryErrorBoundary>
    </React.StrictMode>
  );
}

// Enhanced Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register enhanced service worker
    navigator.serviceWorker
      .register('/sw-enhanced.js', {
        scope: '/',
      })
      .then(registration => {
        console.log('✅ [SW] Enhanced Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 [SW] New content available, refreshing...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('❌ [SW] Enhanced Service Worker registration failed:', error);

        // Fallback: Force unregister old workers
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister().then(() => {
              console.log('💥 [SW] Force Unregistered:', registration.scope);
            });
          }
        });
      });
  });
}
