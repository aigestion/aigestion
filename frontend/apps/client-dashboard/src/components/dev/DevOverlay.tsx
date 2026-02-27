import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Database, Maximize, Terminal } from 'lucide-react';

export const DevOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [breakpoint, setBreakpoint] = useState('');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs/sm');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    window.addEventListener('resize', updateBreakpoint);
    updateBreakpoint();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') setIsVisible(!isVisible);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', updateBreakpoint);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-6 left-6 z-[9999] glass-panel p-4 w-64 border-purple-500/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Dev Nexus</span>
          </div>
          <button onClick={() => setIsVisible(false)} className="text-zinc-500 hover:text-white transition-colors">
            <Maximize size={14} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            <span className="text-[10px] text-zinc-400 uppercase">Breakpoint</span>
            <span className="text-xs font-mono text-purple-300 font-bold">{breakpoint}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Layout size={12} className="text-blue-400" />
              <span className="text-[10px] text-zinc-400 uppercase">Bento Grid</span>
            </div>
            <div className="w-8 h-4 bg-zinc-800 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Database size={12} className="text-emerald-400" />
              <span className="text-[10px] text-zinc-400 uppercase">Cache State</span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">HYDRATED</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[9px] text-zinc-500 text-center italic">Ctrl + D para cerrar</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
