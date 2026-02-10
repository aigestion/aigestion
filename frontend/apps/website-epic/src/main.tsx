import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp';
import { AppProvider } from './contexts/AppContext';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </React.StrictMode>
  );
}

// Service Worker registration
// 💥 NUCLEAR OPTION: Force Unregister Service Workers
// This is necessary because the previous SW cache is broken and preventing updates.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log('💥 [SW] Force Unregistered:', registration.scope);
          // Optional: Force reload if we found and removed one
          // window.location.reload();
        });
      }
    });
  });
}
