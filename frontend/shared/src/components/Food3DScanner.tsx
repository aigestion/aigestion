import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, Box, RotateCcw, Check, X, Play, Info } from 'lucide-react';

interface Food3DScannerProps {
  onClose: () => void;
}

export const Food3DScanner: React.FC<Food3DScannerProps> = ({ onClose }) => {
  const [step, setStep] = useState<'IDLE' | 'SCANNING' | 'PROCESSING' | 'VIEWING'>('IDLE');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startScanner = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep('SCANNING');
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopScanner = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (step === 'SCANNING') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('PROCESSING');
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'PROCESSING') {
      const timer = setTimeout(() => {
        setStep('VIEWING');
        stopScanner();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white"
    >
      {/* Viewfinder */}
      <div className="absolute inset-0 overflow-hidden">
        {step === 'SCANNING' && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover opacity-60"
          />
        )}

        {/* AR Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-cyan-500/20 grid grid-cols-6 grid-rows-10" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center gap-2">
          <Box className="text-cyan-400" />
          <h2 className="text-lg font-bold tracking-tighter">RECONSTR_FOOD_3D</h2>
        </div>
        <button onClick={() => { stopScanner(); onClose(); }} className="p-2 bg-white/10 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* UI Content */}
      <div className="relative z-10 w-full max-w-md px-6 text-center">
        <AnimatePresence mode="wait">
          {step === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="p-8 border border-cyan-500/30 rounded-3xl bg-cyan-950/10 backdrop-blur-xl">
                <Scan size={64} className="mx-auto text-cyan-400 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2 uppercase tracking-widest">Listo para Escanear</h3>
                <p className="text-sm text-gray-400">Captura un video circular de 360° del plato para generar la malla neuronal 3D.</p>
              </div>
              <button
                onClick={startScanner}
                className="w-full py-4 bg-cyan-500 text-black font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Play fill="currentColor" size={20} />
                EMPEZAR CAPTURA
              </button>
            </motion.div>
          )}

          {step === 'SCANNING' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="text-xs font-mono text-cyan-400 bg-black/50 px-3 py-1 rounded-full border border-cyan-500/30 inline-block mb-8">
                MODO: FOTOGRAMETRÍA_REALTIME
              </div>
              <div className="w-48 h-48 border-2 border-dashed border-cyan-500/50 rounded-full mx-auto relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-cyan-400 rounded-full"
                />
                <Camera className="text-cyan-400" size={32} />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-white/50 uppercase tracing-widest">Capturando Nubes de Puntos... {progress}%</div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'PROCESSING' && (
            <motion.div
              key="processing"
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-cyan-400 font-mono text-sm animate-pulse">SINTETIZANDO TEXTURAS 8K...</p>
            </motion.div>
          )}

          {step === 'VIEWING' && (
            <motion.div
              key="viewing"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              {/* Simulated 3D Preview */}
              <div className="relative w-full aspect-square bg-gradient-to-tr from-cyan-900/20 to-purple-900/20 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                <motion.div
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  animate={{
                    rotateY: [0, 360],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-40 h-40 relative cursor-grab active:cursor-grabbing"
                >
                  <div className="absolute inset-0 bg-orange-500/80 rounded-full blur-2xl opacity-30 animate-pulse" />
                  <div className="w-full h-full bg-white/10 rounded-full border border-white/20 flex items-center justify-center shadow-2xl">
                    {/* Simulated Food Item */}
                    <div className="text-4xl">🍲</div>
                  </div>
                </motion.div>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <div className="p-2 bg-black/50 rounded-lg border border-white/10 backdrop-blur-md">
                    <Info size={14} className="text-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep('IDLE')}
                  className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} /> REPETIR
                </button>
                <button
                  onClick={() => alert("Modelo exportado al Menú VR de Restaurante")}
                  className="py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  <Check size={18} /> EXPORTAR VR
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center">
        <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
          <span>Nexus Fotogrametría v4.0</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>ALMA_CORE Engine</span>
        </div>
      </div>
    </motion.div>
  );
};
