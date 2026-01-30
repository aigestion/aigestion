import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppProvider } from './contexts/AppContext'
import './index.css'

// Mobile detection and error handling
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Main App Entry with mobile error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <AppProvider>
          <App />
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

// Service Worker DISABLED - CORS issues blocking
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((error) => {
//         console.log('SW registration failed: ', error);
//       });
//   });
// }
