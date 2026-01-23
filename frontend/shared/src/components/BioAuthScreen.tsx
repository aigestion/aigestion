import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Scan, ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export const BioAuthScreen: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS'>('IDLE');
  const { playWuaw, playHover } = useSound();

  const handleStartScan = () => {
    playHover();
    setStatus('SCANNING');
    setTimeout(() => {
      setStatus('SUCCESS');
      playWuaw();
      setTimeout(onAuth, 1000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-nexus-violet/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-orbitron font-black text-white tracking-[0.4em] uppercase">NEXUS_BIO</h2>
          <p className="text-[10px] font-mono text-nexus-silver/40 tracking-[0.5em] uppercase italic">RECONOCIMIENTO_DE_SOBERANÍA</p>
        </div>

        <div className="relative group">
          <motion.div
            animate={status === 'SCANNING' ? {
                boxShadow: ['0 0 20px rgba(0,245,255,0.1)', '0 0 60px rgba(0,245,255,0.4)', '0 0 20px rgba(0,245,255,0.1)']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={handleStartScan}
            className={`w-48 h-48 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-500
              ${status === 'SUCCESS' ? 'border-green-400 bg-green-400/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
          >
            <AnimatePresence mode="wait">
              {status === 'IDLE' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Fingerprint size={80} className="text-white/20 group-hover:text-white/40" />
                </motion.div>
              )}
              {status === 'SCANNING' && (
                <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Scan size={80} className="text-nexus-cyan-glow animate-pulse" />
                </motion.div>
              )}
              {status === 'SUCCESS' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <ShieldCheck size={80} className="text-green-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Scanner Line */}
          {status === 'SCANNING' && (
            <motion.div
              initial={{ top: '20%' }}
              animate={{ top: '80%' }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-nexus-cyan/50 shadow-[0_0_10px_rgba(0,245,255,0.8)] z-20"
            />
          )}
        </div>

        <div className="space-y-6">
          <p className="text-[9px] font-orbitron font-black text-white/30 tracking-widest uppercase animate-pulse">
            {status === 'IDLE' ? 'PRESIONE_PARA_ESCANEAR' : status === 'SCANNING' ? 'ANALIZANDO_BIOMETRÍA...' : 'IDENTIDAD_CONFIRMADA'}
          </p>

          <div className="flex items-center gap-4 justify-center text-nexus-silver/10 text-[8px] font-mono italic">
            <Lock size={12} />
            ENCLAVE_DE_HARDWARE_ACTIVO // AES_256_FIPS
          </div>
        </div>
      </motion.div>

      <button className="absolute bottom-12 text-[10px] font-orbitron font-black text-white/10 hover:text-white/30 transition-colors uppercase tracking-[0.3em] flex items-center gap-2">
        MÉTODO_ALTERNO <ChevronRight size={14} />
      </button>
    </div>
  );
};
