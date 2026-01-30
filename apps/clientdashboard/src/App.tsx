import {
  BusinessIntelligence,
  DashboardLayout,
  GlobalParticleMesh,
  GoalGamification,
  GoogleServiceHub,
  IdeaSynthesizer,
  NeonCard,
  ROISimulator,
  Skeleton,
  SocketProvider,
} from '@shared/index';
import '@shared/index.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <DashboardLayout title="CENTRO DE EMPRESA DIVINO" type="CLIENT">
      <GlobalParticleMesh />

      {/* Premium Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-nexus-obsidian flex flex-col items-center justify-center"
          >
            <div className="w-32 h-32 rounded-full border-4 border-nexus-violet/20 border-t-nexus-violet animate-spin" />
            <div className="mt-8 text-nexus-violet font-orbitron tracking-widest animate-pulse">
              CONNECTING_TO_NEXUS...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <NeonCard
          title="CLIENTE PREMIUM"
          accentColor="rgba(168, 85, 247, 0.5)"
          className="lg:col-span-2"
        >
          {loading ? (
            <Skeleton className="h-44" />
          ) : (
            <div className="flex justify-between items-center h-full">
              <div>
                <h3 className="text-4xl font-orbitron font-black text-white">ALJANDRO CORP</h3>
                <p className="text-nexus-silver/40 font-mono mt-2">
                  ID: AIG-99228-G | Status: VIP GOD MODE
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-orbitron text-nexus-violet-glow tracking-widest uppercase">
                  Crédito AI
                </span>
                <p className="text-2xl font-orbitron font-bold text-white">UNLIMITED</p>
              </div>
            </div>
          )}
        </NeonCard>

        {loading ? <Skeleton className="h-44" /> : <GoalGamification />}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4 text-nexus-violet-glow">
          <div className="w-1 h-8 bg-nexus-violet-glow shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          BUSINESS INTELLIGENCE & CRM
        </h3>
        {loading ? <Skeleton className="h-96 w-full" /> : <BusinessIntelligence />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-12">
        <div>
          <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4">
            <div className="w-1 h-8 bg-nexus-cyan" />
            ROI SIMULATOR // PROJECTIONS
          </h3>
          {loading ? <Skeleton className="h-[500px]" /> : <ROISimulator />}
        </div>
        <div>
          <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4">
            <div className="w-1 h-8 bg-white/20" />
            GOOGLE WORKSPACE ECOSYSTEM
          </h3>
          {loading ? <Skeleton className="h-[500px] w-full" /> : <GoogleServiceHub />}
        </div>
      </div>

      <div className="mt-12">
        <IdeaSynthesizer />
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
