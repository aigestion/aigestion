import React from 'react';
import { useSound } from './mock-audio';
import { AdminDanielaPanel, DashboardLayout, DecisionSynthesizer, GodViewMap, NeonCard, SecurityMatrix, Skeleton, WearableBridge } from './mock-components';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [isDecisionOpen, setIsDecisionOpen] = React.useState(false);
  const { playClick, playWuaw } = useSound();

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <DashboardLayout title="COMANDO OMNIPOTENTE" type="ADMIN">
      <DecisionSynthesizer isOpen={isDecisionOpen} onClose={() => setIsDecisionOpen(false)} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h4 style={{
            fontSize: '10px',
            color: '#00ffff',
            textTransform: 'uppercase',
            letterSpacing: '0.5em',
            fontWeight: 'bold'
          }}>
            Status: Predictive_Mode_Active
          </h4>
        </div>
        <button
          onClick={() => {
            playClick();
            setIsDecisionOpen(true);
          }}
          onMouseEnter={playWuaw}
          style={{
            padding: '12px 24px',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            color: '#00ffff',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          SINTETIZAR DECISIÓN IA
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {[
          { label: 'NODOS ACTIVOS', value: '142', trend: '+12%', color: '#00ffff' },
          { label: 'AUTOMATIZACIONES', value: '24', trend: 'STABLE', color: '#ff6400' },
          { label: 'GOOGLE CLOUD', value: 'ONLINE', trend: 'LAT: 12ms', color: '#ffd700' }
        ].map((stat, i) => (
          loading ? <Skeleton key={i} /> : (
            <NeonCard key={i} title={stat.label}>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '10px',
                fontFamily: 'monospace'
              }}>
                {stat.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  color: '#888'
                }}>
                  {stat.trend}
                </span>
              </div>
            </NeonCard>
          ))
        )}
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '4px',
            height: '32px',
            backgroundColor: '#00ffff',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
          }} />
          GOD VIEW // GLOBAL INFRASTRUCTURE
        </h3>
        {loading ? <Skeleton /> : <GodViewMap />}
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '4px',
            height: '32px',
            backgroundColor: '#ff6400',
            boxShadow: '0 0 10px rgba(255, 100, 0, 0.8)'
          }} />
          MATRIX DE SEGURIDAD // LIVE THREATS
        </h3>
        {loading ? <Skeleton /> : <SecurityMatrix />}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <NeonCard title="LOG STREAMER // CONSOLA NEXUS">
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '10px',
            lineHeight: '1.5'
          }}>
            {[
              { time: '17:51:01', msg: 'n8n Workflow [Sync_Stock] executed successfully', status: 'OK' },
              { time: '17:51:05', msg: 'Google Cloud: Snapshot created for Node-01', status: 'CLD' },
              { time: '17:51:10', msg: 'AIGestion: New API Key generated for Admin-Hub', status: 'SEC' }
            ].map((log, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer'
                }}
                onMouseEnter={playWuaw}
                onClick={playClick}
              >
                <span style={{ color: '#00ffff', opacity: 0.6 }}>{log.time}</span>
                <span style={{ color: '#888' }}>[{log.status}]</span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{log.msg}</span>
              </div>
            ))}
          </div>
        </NeonCard>

        <NeonCard title="VISUALIZADOR NEURONAL" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            marginBottom: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 215, 0, 0.05)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              filter: 'blur(8px)'
            }} />
          </div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            color: '#888',
            textTransform: 'uppercase'
          }}>
            SISTEMA LISTO PARA PROYECCIÓN
          </h3>
        </NeonCard>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '4px',
            height: '32px',
            backgroundColor: 'rgba(255,255,255,0.2)'
          }} />
          VINCULACIÓN NEURONAL // WEARABLES
        </h3>
        {loading ? <Skeleton /> : <WearableBridge />}
      </div>

      <div style={{ marginBottom: '40px' }}>
        <AdminDanielaPanel />
      </div>
    </DashboardLayout>
  );
};

export default App;
