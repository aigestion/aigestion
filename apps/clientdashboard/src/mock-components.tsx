import React from 'react';
import { useSound } from './mock-audio';

// Mock components for clientdashboard
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
        borderBottom: '2px solid #a855f7',
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#a855f7',
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
        border: '1px solid #a855f7',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseEnter={playHover}
    >
      <h3 style={{
        color: '#a855f7',
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

export const BusinessIntelligence: React.FC = () => {
  const { playWuaw } = useSound();

  return (
    <div
      style={{
        backgroundColor: '#111',
        height: '300px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        cursor: 'pointer'
      }}
      onMouseEnter={playWuaw}
    >
      Business Intelligence Dashboard
    </div>
  );
};

export const GoogleServiceHub: React.FC = () => {
  const { playWuaw } = useSound();

  return (
    <div
      style={{
        backgroundColor: '#111',
        height: '300px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        cursor: 'pointer'
      }}
      onMouseEnter={playWuaw}
    >
      Google Services Integration
    </div>
  );
};

export const IdeaSynthesizer: React.FC = () => {
  const { playWuaw } = useSound();

  return (
    <NeonCard title="SINTETIZADOR DE IDEAS">
      <div style={{ color: '#fff' }}>
        <p>Sistema de generación de ideas IA activo</p>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          Estado: Conectado | Ideas generadas: 1,247
        </div>
        <button
          onClick={playWuaw}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid #a855f7',
            color: '#a855f7',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Generar Nueva Idea
        </button>
      </div>
    </NeonCard>
  );
};

export const GlobalParticleMesh: React.FC = () => null;
export const DanielaOmniWidget: React.FC = () => null;
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const ROISimulator: React.FC = () => {
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
      ROI Simulator - Proyecciones Financieras
    </div>
  );
};
export const GoalGamification: React.FC = () => {
  const { playWuaw } = useSound();

  return (
    <NeonCard title="GAMIFICACIÓN DE OBJETIVOS">
      <div style={{ color: '#fff' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>87%</div>
        <div style={{ fontSize: '12px', color: '#888' }}>Progreso mensual completado</div>
        <button
          onClick={playWuaw}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid #a855f7',
            color: '#a855f7',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Ver Logros
        </button>
      </div>
    </NeonCard>
  );
};
