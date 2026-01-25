import { AutomationEngine, DashboardLayout, DecisionSynthesizer, GoogleServiceHub, NeonCard, Skeleton, WearableBridge, GlobalParticleMesh, DanielaOmniWidget, SocketProvider, useMetrics, GodViewMap, SecurityMatrix } from '@shared/index';
import '@shared/index.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import React from 'react';
import { AdminDanielaPanel } from './components/AdminDanielaPanel';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [isDecisionOpen, setIsDecisionOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <DashboardLayout title="COMANDO OMNIPOTENTE" type="ADMIN">
      <DecisionSynthesizer isOpen={isDecisionOpen} onClose={() => setIsDecisionOpen(false)} />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-[10px] font-orbitron text-nexus-cyan-glow tracking-[0.5em] uppercase">Status: Predictive_Mode_Active</h4>
        </div>
        <button
          onClick={() => setIsDecisionOpen(true)}
          className="px-8 py-3 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/30 text-[10px] font-orbitron font-black tracking-widest text-nexus-cyan-glow hover:bg-nexus-cyan/20 transition-all uppercase"
        >
          SINTETIZAR DECISIÓN IA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {[
          { label: 'NODOS ACTIVOS', value: '142', trend: '+12%', color: 'rgba(0, 245, 255, 0.5)' },
          { label: 'AUTOMATIZACIONES', value: '24', trend: 'STABLE', color: 'rgba(255, 100, 0, 0.5)' },
          { label: 'GOOGLE CLOUD', value: 'ONLINE', trend: 'LAT: 12ms', color: 'rgba(255, 215, 0, 0.5)' }
        ].map((stat, i) => (
          loading ? <Skeleton key={i} className="h-44" /> : (
            <NeonCard key={i} title={stat.label} accentColor={stat.color}>
              <div className="text-5xl font-orbitron font-black text-white mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-nexus-silver/40">{stat.trend}</span>
              </div>
            </NeonCard>
          )
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4">
          <div className="w-1 h-8 bg-nexus-cyan-glow" />
          GOD VIEW // GLOBAL INFRASTRUCTURE
        </h3>
        {loading ? <Skeleton className="h-96 w-full" /> : <GodViewMap />}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4">
          <div className="w-1 h-8 bg-orange-500 shadow-[0_0_10px_rgba(255,100,0,0.8)]" />
          MATRIX DE SEGURIDAD // LIVE THREATS
        </h3>
        {loading ? <Skeleton className="h-96 w-full" /> : <SecurityMatrix />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-12">
        <NeonCard title="LOG STREAMER // CONSOLA NEXUS" accentColor="rgba(0, 245, 255, 0.3)">
          <div className="space-y-4 max-h-64 overflow-y-auto pr-4 scrollbar-hide font-mono text-[10px]">
            {[
              { time: '17:51:01', msg: 'n8n Workflow [Sync_Stock] executed successfully', status: 'OK' },
              { time: '17:51:05', msg: 'Google Cloud: Snapshot created for Node-01', status: 'CLD' },
              { time: '17:51:10', msg: 'AIGestion: New API Key generated for Admin-Hub', status: 'SEC' }
            ].map((log, i) => (
              <div key={i} className="flex gap-4 border-b border-white/5 pb-2">
                <span className="text-nexus-cyan-glow/40">{log.time}</span>
                <span className="text-nexus-silver/60">[{log.status}]</span>
                <span className="text-white/80">{log.msg}</span>
              </div>
            ))}
          </div>
        </NeonCard>

        <NeonCard title="VISUALIZADOR NEURONAL" accentColor="rgba(255, 215, 0, 0.3)" className="flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 mb-6 rounded-full bg-nexus-gold/5 border border-nexus-gold/20 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 rounded-full bg-nexus-gold/20 blur-xl" />
          </div>
          <h3 className="text-sm font-orbitron font-bold tracking-widest text-nexus-silver/80">
            SISTEMA LISTO PARA PROYECCIÓN
          </h3>
        </NeonCard>
      </div>
      <div className="mt-12">
        <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4">
          <div className="w-1 h-8 bg-white/20" />
          VINCULACIÓN NEURONAL // WEARABLES
        </h3>
        {loading ? <Skeleton className="h-64" /> : <WearableBridge />}
      </div>

      {/* Daniela AI Admin Panel */}
      <div className="mt-12">
        <AdminDanielaPanel />
      </div>

      <Analytics />
      <SpeedInsights />
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <SocketProvider>
      <AdminContent />
    </SocketProvider>
  );
};

export default App;
