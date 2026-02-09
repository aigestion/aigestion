import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp.tsx';
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
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('✅ [SW] Registered:', reg.scope))
      .catch(err => console.error('❌ [SW] Registration Failed:', err));
  });
}
