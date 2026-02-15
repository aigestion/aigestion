import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetwork } from '../contexts/NetworkContext';
import { Wifi, WifiOff, Activity } from 'lucide-react';

export const NetworkToast = () => {
  const { isOnline, effectiveType, isMetered } = useNetwork();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'error' | 'warning' | 'info'>('info');

  useEffect(() => {
    if (!isOnline) {
      setMessage('SISTEMA OFFLINE - CONEXIÓN PERDIDA');
      setType('error');
      setShowToast(true);
    } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      setMessage('CONEXIÓN INESTABLE - MODO LIGERO ACTIVADO');
      setType('warning');
      setShowToast(true);
    } else if (showToast && isOnline) {
      // Recovery message
      setMessage('CONEXIÓN RESTABLECIDA - SISTEMA ONLINE');
      setType('info');
      
      // Auto-hide after recovery
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, effectiveType]);

  const getColors = () => {
    switch (type) {
      case 'error': return 'border-red-500/50 shadow-red-500/20 text-red-400';
      case 'warning': return 'border-amber-500/50 shadow-amber-500/20 text-amber-400';
      case 'info': return 'border-nexus-cyan/50 shadow-nexus-cyan/20 text-nexus-cyan';
      default: return 'border-nexus-cyan/50 shadow-nexus-cyan/20 text-nexus-cyan';
    }
  };

  const getIcon = () => {
    if (!isOnline) return <WifiOff className="w-5 h-5" />;
    if (type === 'warning') return <Activity className="w-5 h-5" />;
    return <Wifi className="w-5 h-5" />;
  };

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div className={`
            flex items-center gap-3 px-6 py-3 rounded-full
            bg-black/80 backdrop-blur-xl border
            shadow-[0_0_30px_-5px]
            font-orbitron tracking-wider text-sm
            ${getColors()}
          `}>
            {getIcon()}
            <span>{message}</span>
            
            {/* Pulsing indicator */}
            <span className="relative flex h-2 w-2 ml-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${type === 'error' ? 'bg-red-400' : 'bg-nexus-cyan'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${type === 'error' ? 'bg-red-500' : 'bg-nexus-cyan'}`}></span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
