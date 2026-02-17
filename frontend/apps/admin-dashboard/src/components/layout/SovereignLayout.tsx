import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Wifi, Globe, Shield } from 'lucide-react';

interface SovereignLayoutProps {
  children: React.ReactNode;
}

const StarField = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#020617]"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      {/* Abstract Nebula Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
    </div>
  );
};

export const SovereignLayout: React.FC<SovereignLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-purple-500/30">
      <StarField />

      {/* Top Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NEXUS V1 CORE
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <Globe size={12} className="text-blue-400" />
             <span>EU-SOUTH-2</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
                <Cpu size={14} className="text-purple-400" />
                <span>NEURAL: ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
                <Activity size={14} className="text-emerald-400" />
                <span>SWARM: AUTONOMOUS</span>
            </div>
             <div className="flex items-center gap-2">
                <Shield size={14} className="text-amber-400" />
                <span>DEFENSE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
                <Wifi size={14} />
                <span>5ms</span>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 px-6 pb-6 container mx-auto max-w-7xl">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
      </main>

      {/* Grid Overlay for Sci-Fi Feel */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
  );
};
