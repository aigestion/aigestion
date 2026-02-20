import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, ArrowRight, Shield, Fingerprint, Activity, Cpu, Database } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SpotlightWrapper } from '../components/design-system/SpotlightWrapper';
import { GodModeText } from '../components/design-system/GodModeText';
import { TiltCard } from '../components/design-system/TiltCard';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('LAS CREDENCIALES NO COINCIDEN');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/verify-email');
    } catch (err: any) {
      setError(err.message || 'FALLO EN LA INICIALIZACIÓN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpotlightWrapper className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4 py-20">
      {/* Operative Grid & Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-[length:100%_4px] animate-scan" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10"
      >
        <TiltCard className="premium-glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 lg:p-12 relative">
            {/* Enrollment HUD Header */}
            <div className="flex justify-between items-start mb-12">
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-nexus-cyan">
                   <Fingerprint className="w-5 h-5 animate-pulse" />
                   <span className="font-mono text-xs tracking-[0.4em] uppercase">Initial Enrollment</span>
                 </div>
                 <GodModeText text="NUEVO OPERATIVO" effect="glitch" className="text-4xl font-black" />
               </div>
               <div className="hidden sm:flex gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-nexus-silver/40 uppercase tracking-widest">Node Status</div>
                    <div className="text-[10px] font-mono text-nexus-cyan uppercase tracking-wider">Ready for Sync</div>
                  </div>
                  <Cpu className="w-8 h-8 text-nexus-cyan/20" />
               </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Identity Section */}
              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                       <User className="w-3 h-3 text-nexus-cyan" />
                       <label className="text-[10px] font-mono text-nexus-cyan/60 uppercase tracking-[0.2em]">Core Identity</label>
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="CODENAME / ALIAS"
                        className="w-full px-4 py-4 bg-black/40 border border-white/5 rounded-xl text-white placeholder-nexus-silver/10 focus:outline-none focus:border-nexus-cyan/40 transition-all font-mono text-sm"
                        required
                      />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                       <Mail className="w-3 h-3 text-nexus-cyan" />
                       <label className="text-[10px] font-mono text-nexus-cyan/60 uppercase tracking-[0.2em]">Communication Channel</label>
                    </div>
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="AGENT@NEXUS.AI"
                        className="w-full px-4 py-4 bg-black/40 border border-white/5 rounded-xl text-white placeholder-nexus-silver/10 focus:outline-none focus:border-nexus-cyan/40 transition-all font-mono text-sm"
                        required
                      />
                    </div>
                 </div>
              </div>

              {/* Security Section */}
              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                       <Lock className="w-3 h-3 text-nexus-violet" />
                       <label className="text-[10px] font-mono text-nexus-violet tracking-[0.2em] uppercase">Access Key</label>
                    </div>
                    <div className="relative group">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-violet/50 transition-all font-mono text-sm"
                        required
                      />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                       <Shield className="w-3 h-3 text-nexus-violet" />
                       <label className="text-[10px] font-mono text-nexus-violet tracking-[0.2em] uppercase">Verify Handshake</label>
                    </div>
                    <div className="relative group">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-violet/50 transition-all font-mono text-sm"
                        required
                      />
                    </div>
                 </div>
              </div>

              {/* Status Bar / Error Message */}
              <div className="md:col-span-2">
                 <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-500/5 border border-red-500/30 rounded-xl flex items-center gap-3 mb-6"
                      >
                         <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                         <span className="font-mono text-[11px] text-red-400 uppercase tracking-widest">{error}</span>
                      </motion.div>
                    )}
                 </AnimatePresence>

                 <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-2/3 py-5 bg-black border border-nexus-cyan text-nexus-cyan font-orbitron font-black tracking-[0.4em] rounded-2xl hover:bg-nexus-cyan hover:text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all relative overflow-hidden group uppercase text-xs"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? 'INITIALIZING...' : 'AUTORIZAR INGRESO'}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />}
                      </span>
                    </motion.button>

                    <div className="flex flex-1 justify-around w-full opacity-40">
                       <div className="flex flex-col items-center gap-1">
                          <Activity className="w-4 h-4 text-nexus-cyan" />
                          <div className="text-[8px] font-mono">FLOW</div>
                       </div>
                       <div className="flex flex-col items-center gap-1">
                          <Database className="w-4 h-4 text-nexus-cyan" />
                          <div className="text-[8px] font-mono">DATA</div>
                       </div>
                       <div className="flex flex-col items-center gap-1">
                          <Zap className="w-4 h-4 text-nexus-cyan" />
                          <div className="text-[8px] font-mono">SYNC</div>
                       </div>
                    </div>
                 </div>
              </div>
            </form>

            {/* Login Link Terminal Footer */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-nexus-silver/30 text-[10px] font-mono tracking-widest uppercase">
                EXISTING OPERATIVE? {' '}
                <Link
                  to="/login"
                  className="text-nexus-cyan hover:text-white transition-colors underline decoration-nexus-cyan/30 underline-offset-4"
                >
                  ACCESS TERMINAL
                </Link>
              </p>
              <div className="flex gap-4 opacity-20">
                 <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse" />
                 <div className="w-2 h-2 bg-nexus-violet rounded-full animate-pulse delay-75" />
                 <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse delay-150" />
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Hardware Status Markers */}
        <div className="mt-6 flex justify-between px-6 opacity-20 select-none">
           <div className="font-mono text-[8px] tracking-[0.5em] uppercase">Enrollment://Nexus/Core</div>
           <div className="font-mono text-[8px] tracking-[0.5em] uppercase">Handshake ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
        </div>
      </motion.div>
    </SpotlightWrapper>
  );
};
