import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, ShieldX, Terminal, Radio, HardDrive, Cpu } from 'lucide-react';

export const WarRoomMobile: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ y: '100%' }}
           animate={{ y: 0 }}
           exit={{ y: '100%' }}
           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
           className="fixed inset-0 z-[300000] bg-red-950/95 backdrop-blur-3xl flex flex-col"
        >
          <div className="p-12 flex-1 flex flex-col justify-center items-center text-center">
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mb-12 shadow-[0_0_100px_rgba(239,68,68,0.4)]"
            >
                <ShieldX size={48} className="text-red-500" />
            </motion.div>

            <h2 className="text-5xl font-orbitron font-black text-white tracking-widest uppercase mb-4">CRISIS_MODE</h2>
            <p className="text-[10px] font-mono text-white/40 tracking-[0.6em] uppercase mb-16 italic"> PROTOCOLO_OMEGA_SECURE </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {[
                    { icon: Radio, label: 'COMMS_LOCK', value: 'ENCRYPTED' },
                    { icon: HardDrive, label: 'DATA_VAULT', value: 'OFFLINE' },
                    { icon: Cpu, label: 'CORE_LIMIT', value: '30%' },
                    { icon: Terminal, label: 'ROOT_SHELL', value: 'ACTIVE' },
                ].map((item, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center gap-3">
                        <item.icon size={20} className="text-red-500/50" />
                        <span className="text-[8px] font-orbitron font-black text-white/30 uppercase tracking-widest">{item.label}</span>
                        <span className="text-[10px] font-mono text-red-400 font-bold">{item.value}</span>
                    </div>
                ))}
            </div>
          </div>

          <div className="p-12 space-y-4">
            <button
                onClick={onClose}
                className="w-full py-8 bg-white text-black font-orbitron font-black text-xs tracking-[0.4em] uppercase rounded-3xl active:scale-95 transition-all"
            >
                ABORTAR_PROTOCOLO
            </button>
            <p className="text-[8px] font-mono text-white/10 text-center uppercase">Confirmación Biométrica Requerida para Acción Total</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
