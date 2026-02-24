/**
 * 🌌 Sentry Error Boundary — Sovereign Fallback UI
 *
 * Wraps any React tree with Sentry's ErrorBoundary.
 * Shows a styled fallback when an unrecoverable error occurs.
 */
import React from 'react';
import * as Sentry from '@sentry/react';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

const FallbackUI: React.FC<FallbackProps> = ({ error, resetError }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)',
      color: '#e0e0ff',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '1rem',
        padding: '3rem',
        maxWidth: '500px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Error del Sistema
      </h1>
      <p style={{ color: '#a0a0c0', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Se ha producido un error inesperado. El equipo ha sido notificado automáticamente.
      </p>
      <details
        style={{
          textAlign: 'left',
          marginBottom: '1.5rem',
          color: '#808098',
          fontSize: '0.8rem',
        }}
      >
        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
          Detalles técnicos
        </summary>
        <pre
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            maxHeight: '150px',
            fontSize: '0.75rem',
          }}
        >
          {error.message}
        </pre>
      </details>
      <button
        onClick={resetError}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.75rem 2rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
          (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.transform = 'scale(1)';
          (e.target as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        Reintentar
      </button>
    </div>
  </div>
);

export const SentryErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={({ error, resetError }) => (
      <FallbackUI error={error as Error} resetError={resetError} />
    )}
    showDialog={false}
  >
    {children}
  </Sentry.ErrorBoundary>
);
