import React from 'react';
import { useSound } from './mock-audio';

// Mock components to avoid @shared dependencies
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

export const NeonCard: React.FC<{ children: React.ReactNode; title: string; accentColor?: string; style?: React.CSSProperties }> = ({ children, title, style }) => {
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
        transition: 'all 0.3s',
        ...style
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

export const DecisionSynthesizer: React.FC<{ isOpen: boolean; onClose: () => void }> = () => null;
export const GodViewMap: React.FC = () => (
  <div style={{
    backgroundColor: '#111',
    height: '300px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  }}>
    God View Map
  </div>
);
export const SecurityMatrix: React.FC = () => (
  <div style={{
    backgroundColor: '#111',
    height: '300px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  }}>
    Security Matrix
  </div>
);
export const WearableBridge: React.FC = () => (
  <div style={{
    backgroundColor: '#111',
    height: '200px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  }}>
    Wearable Bridge
  </div>
);

export const AdminDanielaPanel: React.FC = () => {
  const { playWuaw } = useSound();

  return (
    <NeonCard title="PANEL DE ADMINISTRACIÓN DANIELA IA">
      <div style={{ color: '#fff' }}>
        <p>Sistema de IA administrativo listo para operar</p>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          Estado: Activo | Conectado: Sí
        </div>
        <button
          onClick={playWuaw}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            border: '1px solid #00ffff',
            color: '#00ffff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Test Audio Wuaw
        </button>
      </div>
    </NeonCard>
  );
};
