import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Navigation, Phone, X, Activity, Satellite } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from '../services/api';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SIMAOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: { name: string; color: string };
}

export const SIMAOverlay: React.FC<SIMAOverlayProps> = ({ isOpen, onClose, activePersona }) => {
  const [isListening, setIsListening] = React.useState(false);
  const [isCalling, setIsCalling] = React.useState(false);
  const [telemetry] = React.useState({
    lat: 38.7223,
    lng: -9.1393,
    sector: 'ALPHA-7',
    signal: 98,
  });

  const handleRadarScan = async () => {
    try {
      setIsListening(true);
      await api.startAstraeaSession('default_sovereign_user', {
        lat: telemetry.lat,
        lng: telemetry.lng,
      });
      setTimeout(() => setIsListening(false), 3000); // Simulate processing
    } catch (error) {
      console.error('Radar scan failed', error);
      setIsListening(false);
    }
  };

  const handleInduceCall = async () => {
    try {
      setIsCalling(true);
      await api.induceAstraeaCall('default_sovereign_user', '+34600000000'); // Placeholder sovereign target
      setTimeout(() => setIsCalling(false), 2000);
    } catch (error) {
      console.error('Call induction failed', error);
      setIsCalling(false);
    }
  };

  // Mock voice activity waves
  const waves = Array.from({ length: 12 }).map((_, i) => i);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed inset-x-4 bottom-24 z-50 md:inset-x-auto md:right-8 md:bottom-24 md:w-80"
        >
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20">
            {/* Header / Telemetry Bar */}
            <div className="bg-white/5 border-b border-white/5 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Satellite className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-mono text-white/60 tracking-tighter">
                  {telemetry.sector} | {telemetry.lat.toFixed(4)}, {telemetry.lng.toFixed(4)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* Main Content */}
            <div className="p-6 flex flex-col items-center gap-6">
              {/* Voice Visualizer */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div
                  className={cn(
                    'absolute inset-0 rounded-full bg-linear-to-br opacity-20 blur-2xl animate-pulse',
                    activePersona.color
                  )}
                />

                <div className="relative flex items-end justify-center gap-1 h-12">
                  {waves.map(i => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isListening ? [8, Math.random() * 40 + 10, 8] : 8,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5 + Math.random() * 0.5,
                        ease: 'easeInOut',
                      }}
                      className="w-1 bg-white/40 rounded-full"
                    />
                  ))}
                </div>

                <motion.div
                  animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={cn(
                    'absolute -bottom-2 -right-2 p-3 rounded-full shadow-lg',
                    isListening ? 'bg-purple-500' : 'bg-white/10 border border-white/10'
                  )}
                >
                  {isListening ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white/40" />
                  )}
                </motion.div>
              </div>

              <div className="text-center">
                <h3 className="text-white font-semibold">{activePersona.name}</h3>
                <p className="text-white/40 text-xs">Astraea Connection Active</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={handleRadarScan}
                  disabled={isListening}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50',
                    isListening
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                      : 'bg-white/5 border border-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  <Navigation className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Radar</span>
                </button>
                <button
                  onClick={handleInduceCall}
                  disabled={isCalling}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-white/60 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50',
                    isCalling && 'bg-green-500/20 border-green-500/40 text-green-400'
                  )}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Llamada</span>
                </button>
              </div>
            </div>

            {/* Monitoring Footer */}
            <div className="px-4 py-2 bg-purple-500/10 flex items-center gap-2 border-t border-purple-500/20">
              <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
              <span className="text-[9px] text-purple-400/80 font-medium uppercase tracking-[0.2em]">
                Neural Sync 99.8%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
