import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ShieldAlert } from 'lucide-react';

export const FlashAlertSystem: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [alertType, setAlertType] = useState<'CRITICAL' | 'SECURITY' | 'SYSTEM'>('SYSTEM');

  // Logic to trigger alerts (for demo purposes)
  useEffect(() => {
    const triggerDemo = () => {
      const types: ('CRITICAL' | 'SECURITY' | 'SYSTEM')[] = ['CRITICAL', 'SECURITY', 'SYSTEM'];
      setAlertType(types[Math.floor(Math.random() * types.length)]);
      setIsActive(true);
      setTimeout(() => setIsActive(false), 2000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.8) triggerDemo();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, repeat: 1 }}
          className={`fixed inset-0 z-[20000] pointer-events-none flex items-center justify-center
            ${alertType === 'CRITICAL' ? 'bg-red-500/30' :
              alertType === 'SECURITY' ? 'bg-blue-500/30' : 'bg-yellow-500/30'}
          `}
        >
          {/* Strobe Effect */}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="absolute inset-0 bg-white"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-black/80 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl flex flex-col items-center gap-4 text-center"
          >
            {alertType === 'CRITICAL' && <AlertTriangle size={48} className="text-red-500 animate-bounce" />}
            {alertType === 'SECURITY' && <ShieldAlert size={48} className="text-blue-500 animate-pulse" />}
            {alertType === 'SYSTEM' && <Zap size={48} className="text-yellow-500 animate-spin" />}

            <div>
              <h2 className="text-2xl font-black italic tracking-tighter">
                {alertType === 'CRITICAL' ? 'COLAPSO_DETECTADO' :
                 alertType === 'SECURITY' ? 'INTRUSION_BLOCK' : 'SISTEMA_REINICIANDO'}
              </h2>
              <p className="text-xs font-mono text-white/50 uppercase tracing-[0.3em] mt-1">
                ALERTA_VISUAL_NV5
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
