import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, WifiOff, Users, MapPin, RefreshCw } from 'lucide-react';
import { useMobileGodMode } from '../contexts/MobileGodModeContext';
import { useSound } from '../hooks/useSound';

export const EcosytemMonitor: React.FC = () => {
  const { isOffline, syncStatus, activeSessions, currentZone } = useMobileGodMode();
  const { playHover } = useSound();

  return (
    <div className="flex flex-wrap gap-4 mb-8 lg:hidden">
        {/* Offline Indicator */}
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500"
                >
                    <WifiOff size={14} />
                    <span className="text-[8px] font-orbitron font-black uppercase tracking-widest">MODO_OFFLINE_ACTIVO</span>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Sync Status */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <motion.div
                animate={syncStatus === 'PENDING' ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <RefreshCw size={14} className={syncStatus === 'SYNCED' ? 'text-nexus-cyan-glow' : 'text-nexus-gold'} />
            </motion.div>
            <span className="text-[8px] font-orbitron font-black text-white/40 uppercase tracking-widest">{syncStatus}</span>
        </div>

        {/* Multi-Dashboard Sync */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <Users size={14} className="text-nexus-violet-glow" />
            <span className="text-[8px] font-orbitron font-black text-white/40 uppercase tracking-widest">{activeSessions} SESIONES NEXUS</span>
        </div>

        {/* Geofencing Zone */}
        {currentZone && (
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-nexus-cyan/10 border border-nexus-cyan/20 rounded-2xl text-nexus-cyan-glow"
            >
                <MapPin size={14} />
                <span className="text-[8px] font-orbitron font-black uppercase tracking-widest">{currentZone}</span>
            </motion.div>
        )}
    </div>
  );
};
