import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp.tsx';
import { AppProvider } from './contexts/AppContext';
import './index.css';

// Mobile detection and error handling
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

// Main App Entry with mobile error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <AppProvider>
          <MainApp />
        </AppProvider>
      </React.StrictMode>
    );

    // Mobile-specific logging
    if (isMobile) {
      console.log('📱 Mobile device detected - App loaded successfully');
    }
  } catch (error) {
    console.error('❌ Failed to render React app:', error);

    // Fallback for mobile if React fails
    if (isMobile) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: white; font-family: system-ui;">
          <h2>🌌 AIGestion / NEXUS V1</h2>
          <p>Cargando aplicación optimizada para móvil...</p>
          <button onclick="window.location.reload()" style="
            background: #7c3aed;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 10px;
          ">Recargar</button>
        </div>
      `;
    }
  }
}

// Progressive Web App - Service Worker registration (disabled for local dev)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New content available; please refresh.');
              }
            });
          }
        });
      })
      .catch(error => {
        console.warn('⚠️ Service Worker registration failed:', error);
      });
  });
}
