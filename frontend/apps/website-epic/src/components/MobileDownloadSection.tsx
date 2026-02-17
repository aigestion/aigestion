import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Apple, PlayCircle, QrCode, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const MobileDownloadSection: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDownload = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role === 'client' && user?.subscription && user.subscription !== 'free') {
      // Logic for download
      window.location.href = '#'; // Replace with actual APK link
      alert('Iniciando descarga de Nexus Command APK...');
    } else {
      alert('Acceso denegado. Se requiere una suscripción activa para descargar Nexus Command.');
    }
  };

  return (
    <section className="py-48 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-nexus-cyan-glow" />
            <span className="text-[10px] font-orbitron text-nexus-cyan-glow tracking-[0.5em] uppercase font-black">
              Nexus_Mobile_v1.0
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-8 leading-tight uppercase">
            TU COMANDO <br />
            <span className="text-nexus-violet-glow italic underline decoration-nexus-cyan-glow/30 underline-offset-8">
              EN EL BOLSILLO
            </span>
          </h2>

          <p className="text-nexus-silver/40 text-lg mb-12 font-light leading-relaxed max-w-xl">
            Lleva la potencia de Daniela AI y la transparencia de AIGestion.net a cualquier parte.
            Sincronización instantánea con el núcleo mediante biometría avanzada.
          </p>

          <div className="flex flex-wrap gap-6">
            <button className="flex items-center gap-4 px-8 py-4 bg-nexus-obsidian-deep border-2 border-white/20 text-white rounded-2xl hover:bg-white/5 hover:border-white/40 hover:scale-105 active:scale-95 transition-all group">
              <Apple size={24} />
              <div className="text-left">
                <p className="text-[8px] uppercase font-bold opacity-40">Descargar en la</p>
                <p className="text-sm font-black font-orbitron tracking-tight">App Store</p>
              </div>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-4 px-8 py-4 bg-nexus-obsidian-deep border border-white/10 text-white rounded-2xl hover:bg-white/5 hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-nexus-cyan-glow/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <PlayCircle size={24} className="text-nexus-cyan-glow relative z-10" />
              <div className="text-left relative z-10">
                <p className="text-[8px] uppercase font-bold opacity-40">Disponible en</p>
                <p className="text-sm font-black font-orbitron tracking-tight">Nexus Repository</p>
              </div>
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 w-fit">
            <QrCode size={64} className="text-white opacity-20" />
            <div>
              <p className="text-[9px] font-orbitron font-black text-nexus-cyan-glow uppercase tracking-widest mb-1">
                ACCESO RÁPIDO
              </p>
              <p className="text-[7px] font-mono text-nexus-silver/20 uppercase">
                Escanea para descargar la APK de comando
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Mockup Mobile */}
          <div className="relative mx-auto w-72 h-[600px] bg-nexus-obsidian-deep border-[8px] border-white/5 rounded-[3rem] shadow-[0_0_100px_rgba(138,43,226,0.1)] overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />
            <div className="absolute inset-0 bg-linear-to-b from-nexus-violet/20 via-transparent to-transparent opacity-40" />

            {/* Simulación Dashboard en Mobile */}
            <div className="p-6 pt-12 space-y-6">
              <div className="w-10 h-10 rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/20 flex items-center justify-center">
                <Smartphone size={20} className="text-nexus-cyan-glow" />
              </div>
              <h4 className="text-xs font-orbitron font-black text-white uppercase tracking-widest">
                NEXUS_IOS_STATUS
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'CPU', val: '12%' },
                  { label: 'MEM', val: '420MB' },
                  { label: 'BAT', val: '88%' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-xl"
                  >
                    <span className="text-[8px] text-white/40 uppercase">{s.label}</span>
                    <span className="text-[10px] text-nexus-cyan-glow font-mono">{s.val}</span>
                  </div>
                ))}
              </div>
              <div className="w-full h-32 rounded-2xl bg-linear-to-br from-nexus-violet/20 to-nexus-cyan/20 border border-white/5 animate-pulse" />
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-nexus-cyan/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-nexus-violet/5 blur-3xl animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
};
