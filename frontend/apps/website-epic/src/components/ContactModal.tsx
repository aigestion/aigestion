import { AnimatePresence, motion } from 'framer-motion';
import { Mail, MessageSquare, Send, X, Shield, Zap, Globe } from 'lucide-react';
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useSound } from '../hooks/useSound';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen } = useAppContext();
  const { playHover, playClick, playSuccess } = useSound();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    playClick();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    playSuccess();
    setIsContactModalOpen(false);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <AnimatePresence>
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop with blurring effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(138,43,226,0.15)] overflow-hidden"
          >
            {/* Magical Background Halo */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.2),transparent,rgba(34,211,238,0.2),transparent)] animate-spin-slow blur-3xl" />
            </div>

            {/* God Mode Gradient Border */}

            <div className="absolute inset-px rounded-[23px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-8 pb-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-orbitron font-black text-white tracking-widest uppercase">
                    Protocolo Alfa
                  </h2>
                  <p className="text-[10px] text-nexus-cyan font-mono font-bold tracking-widest uppercase animate-pulse">
                    Conexión Soberana v5.0
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                onMouseEnter={() => playHover()}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest pl-1">
                      Identificación
                    </label>
                    <div className="relative group">
                      <input
                        required
                        type="text"
                        placeholder="Nombre"
                        value={formState.name}
                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nexus-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                        onMouseEnter={() => playHover()}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest pl-1">
                      Dirección Neural
                    </label>
                    <div className="relative group">
                      <input
                        required
                        type="email"
                        placeholder="tu@email.com"
                        value={formState.email}
                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nexus-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                        onMouseEnter={() => playHover()}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest pl-1">
                    Mensaje de Datos
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe tu transformación..."
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-nexus-cyan/50 focus:bg-white/10 transition-all placeholder:text-gray-600 resize-none"
                    onMouseEnter={() => playHover()}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full group relative py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl font-bold text-white text-sm tracking-[0.2em] uppercase overflow-hidden shadow-xl shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>Ejecutar Transmisión</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </form>

              {/* Security Badges */}
              <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-nexus-cyan" />
                  <span className="text-[8px] font-mono tracking-tighter">
                    CIFRADO AES-256 (E2EE)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-nexus-cyan" />
                  <span className="text-[8px] font-mono tracking-tighter">REPLICACIÓN GLOBAL</span>
                </div>
              </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-nexus-cyan/50 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
