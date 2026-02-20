import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Zap,
  Shield,
  Users,
  Globe,
  ArrowRight,
  Activity,
  Smartphone,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpotlightWrapper } from '../design-system/SpotlightWrapper';
import { GodModeText } from '../design-system/GodModeText';
import { TiltCard } from '../design-system/TiltCard';
import { useAuth } from '../../hooks/useAuth';

export const SubscriptionSelect: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'family' | 'enterprise'>('family');
  const [hoveredPlan, setHoveredPlan] = useState<'family' | 'enterprise' | null>(null);

  const handleSelect = async () => {
    navigate(`/payment?plan=${selectedPlan}`);
  };

  const PlanCard = ({ type, price, features, recommended = false }: any) => {
    const isActive = selectedPlan === type;
    const isHovered = hoveredPlan === type;

    return (
      <TiltCard tiltMaxAngleX={5} tiltMaxAngleY={5} className="h-full">
        <div
          onClick={() => setSelectedPlan(type)}
          onMouseEnter={() => setHoveredPlan(type)}
          onMouseLeave={() => setHoveredPlan(null)}
          className={`cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-700 h-full overflow-hidden ${
            isActive
              ? 'bg-nexus-obsidian/90 border-nexus-cyan shadow-[0_0_60px_rgba(34,211,238,0.2)]'
              : 'bg-black/40 border-white/5 hover:border-white/20'
          }`}
        >
          {/* Holographic Scanlines */}
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] pointer-events-none z-10 opacity-30 group-hover:opacity-50 transition-opacity"
            style={{ backgroundSize: '100% 4px, 3px 100%' }}
          />

          {/* Ambient Glow */}
          <div
            className={`absolute -inset-20 bg-gradient-radial from-nexus-cyan/10 to-transparent blur-3xl opacity-0 transition-opacity duration-700 pointer-events-none z-0 ${isActive || isHovered ? 'opacity-100' : ''}`}
          />

          {/* HUD Badge */}
          <div className="absolute top-4 right-4 flex gap-1 z-30">
            {isActive && (
              <motion.div
                layoutId="activeDot"
                className="w-2 h-2 rounded-full bg-nexus-cyan shadow-[0_0_8px_#22d3ee]"
              />
            )}
            <div
              className={`w-2 h-2 rounded-full ${isActive ? 'bg-nexus-cyan/20' : 'bg-white/5'}`}
            />
            <div
              className={`w-2 h-2 rounded-full ${isActive ? 'bg-nexus-cyan/20' : 'bg-white/5'}`}
            />
          </div>

          {recommended && (
            <div className="absolute -top-1 right-12 z-20">
              <div className="bg-nexus-cyan/20 backdrop-blur-md border border-nexus-cyan/30 px-3 py-1 rounded-b-xl">
                <span className="text-[9px] font-orbitron font-bold text-nexus-cyan tracking-[0.2em] uppercase flex items-center gap-1">
                  <BadgeCheck size={10} /> Reco
                </span>
              </div>
            </div>
          )}

          <div className="relative z-20 flex flex-col h-full">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 transform ${
                isActive
                  ? 'bg-nexus-cyan/20 text-nexus-cyan scale-110 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                  : 'bg-white/5 text-nexus-silver/40 group-hover:text-white group-hover:scale-105'
              }`}
            >
              {type === 'family' ? (
                <Users strokeWidth={1.5} size={32} />
              ) : (
                <Globe strokeWidth={1.5} size={32} />
              )}
            </div>

            <div className="mb-2">
              <GodModeText
                text={type === 'family' ? 'FAMILIA' : 'EMPRESA'}
                effect={isActive ? 'neon' : isHovered ? 'glitch' : 'none'}
                className="text-3xl font-black tracking-tight"
              />
              <div
                className={`h-[1px] w-12 transition-all duration-700 mt-2 ${isActive ? 'bg-nexus-cyan w-full shadow-[0_0_10px_#22d3ee]' : 'bg-white/5 w-12'}`}
              />
            </div>

            <div className="flex items-baseline gap-2 mb-8 mt-4">
              <span className="text-4xl font-black font-orbitron text-white">{price}</span>
              <span className="text-nexus-silver/40 text-xs font-mono tracking-widest uppercase">
                / mes
              </span>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {features.map((feature: string, idx: number) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 text-sm text-nexus-silver/70 group/item"
                >
                  <div
                    className={`mt-1 p-0.5 rounded-sm transition-colors ${isActive ? 'text-nexus-cyan' : 'text-nexus-silver/30 group-hover/item:text-white/60'}`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="leading-tight font-sans tracking-wide">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <button
              className={`w-full py-5 rounded-2xl border-2 transition-all duration-500 uppercase font-orbitron text-[10px] font-black tracking-[0.3em] overflow-hidden group/btn relative ${
                isActive
                  ? 'bg-nexus-cyan/10 border-nexus-cyan/40 text-nexus-cyan shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                  : 'bg-transparent border-white/5 text-nexus-silver/30 hover:border-white/20 hover:text-white'
              }`}
            >
              <div
                className={`absolute inset-0 bg-nexus-cyan opacity-0 transition-opacity duration-300 group-hover/btn:opacity-10 ${isActive ? 'opacity-10' : ''}`}
              />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isActive ? 'PLAN SELECCIONADO' : 'SELECCIONAR NIVEL'}
                {isActive && <Activity size={14} className="animate-pulse" />}
              </div>
            </button>
          </div>
        </div>
      </TiltCard>
    );
  };

  return (
    <SpotlightWrapper className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden py-24">
      {/* Background Atmosphere */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-nexus-cyan/30" />
            <span className="text-nexus-cyan font-mono text-xs tracking-[0.5em] uppercase">
              Security Clearance Level
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-nexus-cyan/30" />
          </div>

          <GodModeText
            text="COBERTURA SOBERANA"
            effect="hologram"
            className="text-5xl md:text-7xl font-black mb-6"
          />
          <p className="text-nexus-silver/50 max-w-2xl mx-auto text-lg leading-relaxed font-sans">
            Selecciona tu rango de operaciones. Desbloquea procesamiento neuronal avanzado,
            encriptación de grado militar y soporte prioritario 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 max-w-4xl mx-auto">
          <PlanCard
            type="family"
            price="29€"
            features={[
              'Hasta 5 Nodos de Usuario',
              'Análisis Neuronal Básico',
              'Encriptación Estándar AES-256',
              'Soporte vía Canal de Telegram',
              'Acceso Móvil Omnipresente',
              'Backup Semanal en Nube Segura',
            ]}
          />
          <PlanCard
            type="enterprise"
            price="99€"
            recommended={true}
            features={[
              'Nodos de Usuario Ilimitados',
              'Procesamiento AI de Enjambre',
              'Seguridad Blindada Cuántica',
              'Línea Directa con Soporte God',
              'Acceso API Full & Webhooks',
              'Integraciones Personalizadas Hub',
            ]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-8"
        >
          <button
            onClick={handleSelect}
            className="group relative px-16 py-6 bg-nexus-cyan text-black font-orbitron font-black tracking-[0.4em] rounded-2xl hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all uppercase flex items-center gap-4 text-xl overflow-hidden active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
            <span className="relative z-10">AUTORIZAR ACCESO</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
          </button>

          <div className="flex items-center gap-6 text-[10px] text-nexus-silver/30 font-mono tracking-[4px] uppercase">
            <div className="flex items-center gap-2">
              <Lock size={12} /> SSL SECURE
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Shield size={12} /> PROTECCIÓN TOTAL
            </div>
          </div>
        </motion.div>
      </div>
    </SpotlightWrapper>
  );
};
