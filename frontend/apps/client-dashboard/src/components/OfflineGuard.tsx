import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, AlertTriangle, RefreshCcw } from 'lucide-react';

export const OfflineGuard = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
        >
          <div className="glass-card bg-red-500/10 border-red-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <WifiOff className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white tracking-tight">Conexión Perdida</h4>
              <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Operando en modo Local-First</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
