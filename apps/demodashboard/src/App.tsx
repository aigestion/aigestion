import {
  DanielaOmniWidget,
  DashboardLayout,
  GlobalParticleMesh,
  NeonCard,
  NexusHome,
  Skeleton,
  SocketProvider,
} from '@shared/index';
import '@shared/index.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { motion } from 'framer-motion';
import React from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <DashboardLayout title="DOMINIO INTELIGENTE" type="DEMO">
      <GlobalParticleMesh />
      <DanielaOmniWidget />
      <div className="max-w-7xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-orbitron font-black mb-8 leading-[0.9] tracking-tighter"
        >
          CONTROLA TU MUNDO CON <span className="text-nexus-cyan-glow">PRECISIÓN NEURONAL</span>
        </motion.h3>

        <div className="mt-12">
          <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4">
            <div className="w-1 h-8 bg-nexus-cyan-glow" />
            NEXUS HOME IOT // LIVE DEMO
          </h3>
          {loading ? <Skeleton className="h-[500px] w-full" /> : <NexusHome />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-12">
          <NeonCard title="SIMULACIÓN DE ESCENAS" accentColor="rgba(168, 85, 247, 0.3)">
            <div className="grid grid-cols-1 gap-4">
              {['Modo Enfoque Máximo', 'Seguridad Total', 'Cena de Negocios'].map((scene, i) => (
                <button
                  key={i}
                  className="py-4 rounded-xl bg-white/5 border border-white/5 hover:border-nexus-violet/40 text-center font-orbitron text-[10px] tracking-widest text-nexus-silver/60 uppercase transition-all"
                >
                  ACTIVAR {scene}
                </button>
              ))}
            </div>
          </NeonCard>

          <NeonCard
            title="VOZ DANIELA AI"
            accentColor="rgba(0, 245, 255, 0.3)"
            className="flex flex-col justify-center items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-nexus-cyan/5 border border-nexus-cyan/20 flex items-center justify-center mb-6">
              <div className="w-4 h-4 rounded-full bg-nexus-cyan-glow animate-ping" />
            </div>
            <p className="text-nexus-silver/60 italic text-sm">
              "Daniela: Ajustando clima a 22 grados en oficina principal..."
            </p>
            <span className="mt-4 text-[8px] font-mono text-nexus-cyan-glow tracking-[0.4em] uppercase">
              Audio Output Active
            </span>
          </NeonCard>
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </DashboardLayout>
  );
};

const WrappedApp: React.FC = () => (
  <SocketProvider>
    <App />
  </SocketProvider>
);

export default WrappedApp;
