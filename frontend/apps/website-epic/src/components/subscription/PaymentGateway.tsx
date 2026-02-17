import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  CheckCircle,
  Shield,
  Calendar,
  CreditCard as CCIcon,
  Fingerprint,
  Zap,
  Activity,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SpotlightWrapper } from '../design-system/SpotlightWrapper';
import { GodModeText } from '../design-system/GodModeText';
import { TiltCard } from '../design-system/TiltCard';

export const PaymentGateway: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'family';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  // Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  // Formatters
  const formatCard = (val: string) => {
    return val
      .replaceAll(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
  };
  const formatExpiry = (val: string) => {
    return val
      .replaceAll(/\D/g, '')
      .replace(/(.{2})/, '$1/')
      .substring(0, 5);
  };

  const { user, updatePlan } = useAuth();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthStep(1);

    // Multi-stage biometric simulation
    setTimeout(() => setAuthStep(2), 1500);
    setTimeout(() => setAuthStep(3), 3000);

    setTimeout(async () => {
      try {
        if (user?.id) {
          await updatePlan(user.id, plan);
        }
        setLoading(false);
        setSuccess(true);

        // Redirect after success animation
        setTimeout(() => {
          navigate('/client');
        }, 3000);
      } catch (error) {
        console.error('Payment error:', error);
        setLoading(false);
        setAuthStep(0);
        // Add notification logic if needed
      }
    }, 4500);
  };

  return (
    <SpotlightWrapper className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden py-20">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-10" />

      <motion.div
        className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Summary Section / HUD Info */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-nexus-cyan mb-2">
              <Shield className="w-5 h-5 animate-pulse" />
              <span className="font-mono text-xs tracking-[0.4em] uppercase">
                Security Protocol v4.2
              </span>
            </div>
            <GodModeText text="TERMINAL DE" className="text-5xl font-black block" effect="glitch" />
            <GodModeText
              text="AUTORIZACIÓN"
              className="text-5xl font-black text-nexus-cyan block"
              effect="neon"
            />
            <p className="text-nexus-silver/50 font-sans text-lg max-w-md leading-relaxed">
              Estás a punto de activar tu cobertura soberana. Todos los datos están encriptados
              mediante protocolos cuánticos AES-256.
            </p>
          </div>

          <TiltCard tiltMaxAngleX={3} tiltMaxAngleY={3} className="h-full">
            <div className="p-8 bg-nexus-obsidian/80 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden group">
              {/* Decorative HUD corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-nexus-cyan/30 rounded-tl-3xl transition-all group-hover:scale-110" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-nexus-cyan/30 rounded-br-3xl transition-all group-hover:scale-110" />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-nexus-silver/40 font-mono text-[10px] tracking-widest uppercase">
                    Resumen del Nivel
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan shadow-[0_0_8px_#22d3ee]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan/20" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-nexus-silver/60 font-mono text-xs">RANGO ELEGIDO</span>
                    <span className="text-white font-orbitron tracking-widest uppercase text-nexus-cyan font-bold text-sm">
                      {plan.toUpperCase()} CLASS
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-nexus-silver/60 font-mono text-xs">FRECUENCIA</span>
                    <span className="text-white font-mono text-xs uppercase tracking-widest">
                      Mensual
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-nexus-silver/60 font-mono text-xs">NODOS AI</span>
                    <span className="text-white font-mono text-xs">
                      {plan === 'enterprise' ? 'ILIMITADOS' : '5 ACTUADORES'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div className="flex justify-between items-end">
                  <span className="text-nexus-silver/40 font-mono text-xs">TOTAL A DEBITAR</span>
                  <div className="text-right">
                    <span className="text-5xl font-orbitron font-black text-white leading-none block">
                      {plan === 'enterprise' ? '99' : '29'}
                      <span className="text-2xl ml-1 group-hover:text-nexus-cyan transition-colors">
                        €
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Payment Form / Virtual Card */}
        <div className="flex flex-col gap-6">
          {/* Virtual Card Preview */}
          <motion.div
            className="relative h-56 rounded-3xl p-8 bg-gradient-to-br from-nexus-obsidian via-black to-nexus-cyan/20 border border-white/10 shadow-2xl overflow-hidden group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,black_2px,black_4px)]" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-nexus-cyan font-orbitron font-black text-xs italic tracking-tighter">
                    NEXUS SOBERANO
                  </span>
                  <Activity className="text-nexus-cyan mt-1 animate-pulse" size={14} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-2xl font-mono text-white tracking-[0.2em]">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-nexus-silver/40 font-mono tracking-widest uppercase mb-1">
                      Titular
                    </span>
                    <span className="text-xs font-mono text-white uppercase tracking-widest">
                      {name || 'OPERADOR NEXUS'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-nexus-silver/40 font-mono tracking-widest uppercase mb-1">
                      Expira
                    </span>
                    <span className="text-xs font-mono text-white tracking-widest">
                      {expiry || 'MM/YY'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Hud */}
          <TiltCard tiltMaxAngleX={2} tiltMaxAngleY={2}>
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
              <AnimatePresence>
                {(loading || success) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-center p-8 backdrop-blur-md"
                  >
                    {success ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-24 h-24 rounded-full bg-nexus-cyan/20 border-2 border-nexus-cyan flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                          <CheckCircle className="w-12 h-12 text-nexus-cyan animate-bounce" />
                        </div>
                        <GodModeText
                          text="AUTORIZADO"
                          effect="neon"
                          className="text-3xl font-black mb-2"
                        />
                        <p className="text-nexus-silver/50 font-mono text-xs tracking-widest">
                          ORDEN DE CLEARANCE DESBLOQUEADA
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-8 w-full">
                        <div className="relative">
                          <Fingerprint
                            className={`w-20 h-20 transition-colors duration-500 ${authStep >= 2 ? 'text-nexus-cyan' : 'text-nexus-silver/20'}`}
                          />
                          <motion.div
                            className="absolute top-0 left-0 right-0 h-1 bg-nexus-cyan shadow-[0_0_10px_#22d3ee] z-10"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          />
                        </div>
                        <div className="space-y-4 w-full px-12">
                          <div className="flex justify-between text-[10px] font-mono text-nexus-cyan uppercase tracking-widest mb-1">
                            <span>
                              {authStep === 1
                                ? 'Escaneando Biometría...'
                                : authStep === 2
                                  ? 'Verificando Hash...'
                                  : 'Autorizando Créditos...'}
                            </span>
                            <span>{authStep * 33}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-nexus-cyan"
                              initial={{ width: '0%' }}
                              animate={{ width: `${authStep * 33}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron text-nexus-cyan/50 tracking-[0.3em] uppercase ml-1 flex items-center gap-2">
                      <Cpu size={10} /> Operador
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="ID DE OPERADOR"
                      className="w-full px-5 py-4 bg-black/40 border-2 border-white/5 rounded-2xl text-white placeholder-white/5 focus:outline-none focus:border-nexus-cyan/40 transition-all font-mono text-sm uppercase"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron text-nexus-cyan/50 tracking-[0.3em] uppercase ml-1 flex items-center gap-2">
                      <CCIcon size={10} /> Canal de Pago
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCard(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full px-5 py-4 bg-black/40 border-2 border-white/5 rounded-2xl text-white placeholder-white/5 focus:outline-none focus:border-nexus-cyan/40 transition-all font-mono text-sm tracking-widest"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron text-nexus-cyan/50 tracking-[0.3em] uppercase ml-1 flex items-center gap-2">
                      <Calendar size={10} /> Ciclo
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-5 py-4 bg-black/40 border-2 border-white/5 rounded-2xl text-white placeholder-white/5 focus:outline-none focus:border-nexus-cyan/40 transition-all font-mono text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron text-nexus-cyan/50 tracking-[0.3em] uppercase ml-1 flex items-center gap-2">
                      <Lock size={10} /> Token
                    </label>
                    <input
                      type="password"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-5 py-4 bg-black/40 border-2 border-white/5 rounded-2xl text-white placeholder-white/5 focus:outline-none focus:border-nexus-cyan/40 transition-all font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-6 mt-4 bg-nexus-cyan text-black font-orbitron font-black tracking-[0.4em] rounded-2xl hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] disabled:opacity-50 transition-all uppercase text-lg group/submit relative overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    <RefreshCw
                      className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`}
                    />
                    <span>CONFIRMAR ACCESO</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                </button>

                <div className="flex items-center justify-center gap-8 pt-4 border-t border-white/5">
                  <div
                    className="flex items-center gap-2 text-nexus-silver/20 grayscale hover:grayscale-0 transition-all cursor-help"
                    title="Conexión Encriptada"
                  >
                    <Zap size={14} className="fill-current" />
                    <span className="font-mono text-[8px] tracking-[0.2em] uppercase">
                      POWERED BY NEXUS
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-nexus-silver/20 grayscale hover:grayscale-0 transition-all cursor-help"
                    title="Seguridad Bancaria"
                  >
                    <Shield size={14} />
                    <span className="font-mono text-[8px] tracking-[0.2em] uppercase">
                      PCI COMPLIANT
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </TiltCard>
        </div>
      </motion.div>
    </SpotlightWrapper>
  );
};
