import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Box, Zap, Crosshair } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export const ARVisualizer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { playWuaw } = useSound();

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => console.error("AR Error:", err));
    } else {
      stream?.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    return () => stream?.getTracks().forEach(track => track.stop());
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200000] bg-black overflow-hidden"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-125"
          />

          {/* AR Overlay Grid */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border border-nexus-cyan/20 rounded-full animate-pulse flex items-center justify-center">
                <Crosshair size={32} className="text-nexus-cyan-glow opacity-40" />
            </div>
          </div>

          {/* Daniela Hologram Placeholder */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center"
          >
            <div className="w-48 h-48 bg-linear-to-b from-nexus-cyan/40 to-transparent blur-3xl animate-pulse rounded-full mx-auto" />
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative -mt-40"
            >
                <img
                    src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Daniela"
                    className="w-32 h-32 mx-auto drop-shadow-[0_0_20px_rgba(0,245,255,0.8)] opacity-80"
                    alt="Daniela AR"
                />
                <div className="mt-4 p-4 rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/10">
                    <p className="text-[8px] font-orbitron font-black text-nexus-cyan-glow tracking-[0.3em] uppercase">SYSTEM_OVERLAY_ACTIVE</p>
                    <p className="text-[10px] text-white/60 font-mono mt-2 uppercase italic">"Analizando entorno físico..."</p>
                </div>
            </motion.div>
          </motion.div>

          {/* UI Controls */}
          <div className="absolute top-12 left-12 right-12 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/20 flex items-center justify-center">
                    <Box size={20} className="text-nexus-cyan-glow" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-orbitron font-black text-white tracking-widest uppercase">NEXUS_AR_v1.0</p>
                    <p className="text-[8px] text-nexus-cyan-glow/40 font-mono">SCAN_LEVEL: GOD_MODE</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
            >
                <X size={24} className="text-white" />
            </button>
          </div>

          <div className="absolute bottom-12 inset-x-12 flex justify-center gap-6">
                <button className="flex items-center gap-2 px-8 py-4 bg-nexus-cyan-glow text-black rounded-full font-orbitron font-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all">
                    <Zap size={16} /> ANALIZAR OBJETO
                </button>
                <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-orbitron font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all">
                    <Camera size={16} /> CAPTURAR DATA
                </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
