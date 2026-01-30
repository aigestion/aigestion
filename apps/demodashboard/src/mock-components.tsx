import React from 'react';
import { useSound } from './mock-audio';

// Mock components for demodashboard
export const DashboardLayout: React.FC<{ children: React.ReactNode; title: string; type: string }> = ({ children, title }) => {
  const { playWuaw } = useSound();

  React.useEffect(() => {
    playWuaw(); // Efecto wuaw al cargar el dashboard
  }, [playWuaw]);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh'
    }}>
      <header style={{
        borderBottom: '2px solid #00ffff',
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#00ffff',
          fontSize: '24px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          {title}
        </h1>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export const NeonCard: React.FC<{ children: React.ReactNode; title: string; accentColor?: string; className?: string }> = ({ children, title }) => {
  const { playHover } = useSound();

  return (
    <div
      style={{
        border: '1px solid #00ffff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: 'rgba(0, 255, 255, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseEnter={playHover}
    >
      <h3 style={{
        color: '#00ffff',
        marginBottom: '15px',
        fontSize: '14px',
        textTransform: 'uppercase'
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = () => (
  <div style={{
    backgroundColor: '#333',
    height: '100px',
    borderRadius: '8px',
    marginBottom: '20px'
  }} />
);

export const NexusHome: React.FC = () => {
  const { playWuaw } = useSound();

  return (
    <div
      style={{
        backgroundColor: '#111',
        height: '400px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        cursor: 'pointer'
      }}
      onMouseEnter={playWuaw}
    >
      Nexus Home IoT Control Panel
    </div>
  );
};

export const GlobalParticleMesh: React.FC = () => null;
export const DanielaOmniWidget: React.FC = () => null;
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
