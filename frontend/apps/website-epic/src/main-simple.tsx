import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Simple fallback app for debugging
const SimpleApp = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀 AIGestion Nexus</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center' }}>
        The Sovereign Intelligence Platform
      </p>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✅ Vite Dev Server Funcionando</h2>
        <p style={{ marginBottom: '1rem' }}>React está cargando correctamente</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>URL: {window.location.href}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            marginTop: '1rem',
            cursor: 'pointer',
          }}
        >
          Recargar
        </button>
      </div>
    </div>
  );
};

// Main App Entry with error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML =
    '<div style="color: white; text-align: center; padding: 20px;">❌ Root element not found</div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(<SimpleApp />);
    console.log('✅ Simple React app rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: white; font-family: system-ui;">
        <h2>❌ Error Loading React App</h2>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" style="
          background: #ef4444;
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
