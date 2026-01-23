import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostAlert {
  id: string;
  message: string;
  type: 'PREDICTIVE' | 'HEALTH' | 'SECURITY';
}

export const GhostModeAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<GhostAlert[]>([]);

  // Simulation of Daniela AI "Whispers"
  useEffect(() => {
    const messages = [
      { message: 'Daniela: Detectando pico de tráfico en 3... 2... 1...', type: 'PREDICTIVE' },
      { message: 'Daniela: Nodo C-04 optimizado automáticamente.', type: 'HEALTH' },
      { message: 'Daniela: Intento de acceso inusual bloqueado en Admin-Hub.', type: 'SECURITY' }
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const id = Math.random().toString(36).substr(2, 9);
        setAlerts(prev => [...prev, { ...msg, id } as GhostAlert]);

        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== id));
        }, 5000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 0.6, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="absolute top-10 right-10 flex items-center gap-4"
          >
            <div className={`w-[2px] h-12 bg-linear-to-b ${
              alert.type === 'PREDICTIVE' ? 'from-nexus-cyan-glow' :
              alert.type === 'HEALTH' ? 'from-green-400' : 'from-red-500'
            } to-transparent animate-pulse`} />
            <div className="font-mono text-[9px] tracking-widest text-white/40 uppercase italic">
              {alert.message}
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border border-white/10 rounded-xs flex items-center justify-center"
            >
              <div className="w-1 h-1 bg-white/20 rounded-full" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Edge Glyphs (Subliminal Static) */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 opacity-10">
        <div className="w-8 h-[1px] bg-white/40" />
        <div className="w-4 h-[1px] bg-white/40" />
        <div className="text-[6px] font-mono text-white/40">NEXUS_SYNC_STABLE</div>
      </div>
    </div>
  );
};
