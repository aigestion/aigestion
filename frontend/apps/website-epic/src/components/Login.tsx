import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Lock, Mail, Shield, Zap, Activity, Cpu } from 'lucide-react';
import React, { useState } from 'react';
import { SpotlightWrapper } from './design-system/SpotlightWrapper';
import { GodModeText } from './design-system/GodModeText';
import { TiltCard } from './design-system/TiltCard';
import { useAuth } from '../hooks/useAuth';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, loading, error }) => {
  const { loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onLogin(formData.email, formData.password);
    } catch (error) {
      // Error handled by parent component
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <SpotlightWrapper className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience & Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] opacity-10 animate-scan" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg relative z-10"
      >
        <TiltCard className="premium-glass rounded-3xl border border-white/10 hover:border-nexus-cyan/30 overflow-hidden shadow-2xl shadow-nexus-cyan/5 transition-all duration-500">
           {/* Terminal Interface Header */}
           <div className="absolute top-0 left-0 right-0 h-1 bg-nexus-gradient opacity-50" />

           <div className="p-8 lg:p-12 relative overflow-hidden">
             {/* Decorative HUD Elements */}
             <div className="absolute top-4 right-4 flex gap-2">
                <Activity className="w-4 h-4 text-nexus-cyan/40 animate-pulse" />
                <Cpu className="w-4 h-4 text-nexus-violet/40 animate-pulse delay-75" />
             </div>

             <div className="text-center mb-10">
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-black border border-nexus-cyan/20 flex items-center justify-center relative group"
                >
                  <div className="absolute inset-0 rounded-2xl bg-nexus-cyan/10 blur-xl group-hover:bg-nexus-cyan/20 transition-all" />
                  <Shield className="w-10 h-10 text-nexus-cyan relative z-10" />
                </motion.div>

                <GodModeText
                  text="TERMINAL DE ACCESO"
                  effect="glitch"
                  className="text-4xl font-black mb-1"
                />
                <div className="font-mono text-[10px] tracking-[0.5em] text-nexus-cyan/60 uppercase">
                   Protocolo de Seguridad Activo
                </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6 relative">
                {/* ID Input */}
                <motion.div
                  className="space-y-2 group"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-mono text-nexus-cyan tracking-[0.2em] uppercase">Identificador de Agente</label>
                    <Zap className="w-3 h-3 text-nexus-cyan/30" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nexus-silver/20 group-focus-within:text-nexus-cyan transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="AGENT@AIGESTION.NET"
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 bg-black/60 border border-white/5 rounded-xl text-white placeholder-nexus-silver/10 focus:outline-none focus:border-nexus-cyan/40 focus:bg-nexus-cyan/5 transition-all font-mono text-sm tracking-wider"
                    />
                  </div>
                  {fieldErrors.email && <p className="text-red-400 text-[10px] font-mono ml-1 uppercase tracking-wider">{fieldErrors.email}</p>}
                </motion.div>

                {/* Secure Passkey */}
                <motion.div
                  className="space-y-2 group"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-mono text-nexus-cyan tracking-[0.2em] uppercase">Clave de Autenticación</label>
                    <Lock className="w-3 h-3 text-nexus-cyan/30" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-nexus-silver/20 group-focus-within:text-nexus-cyan transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-4 bg-black/60 border border-white/5 rounded-xl text-white placeholder-nexus-silver/10 focus:outline-none focus:border-nexus-cyan/40 focus:bg-nexus-cyan/5 transition-all font-mono text-sm tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-silver/20 hover:text-nexus-cyan transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-400 text-[10px] font-mono ml-1 uppercase tracking-wider">{fieldErrors.password}</p>}
                </motion.div>

                {/* System Error Notification */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <div className="font-mono text-[11px] text-red-400 uppercase tracking-tighter">
                         <span className="font-bold">Error de Protocolo:</span> {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Initiate Sequence Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-black border border-nexus-cyan/30 text-nexus-cyan font-orbitron font-black tracking-[0.3em] rounded-xl hover:bg-nexus-cyan hover:text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all relative overflow-hidden group uppercase text-xs"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-nexus-cyan/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                       <div className="flex items-center gap-3">
                         <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                         <span>AUTENTICANDO...</span>
                       </div>
                    ) : (
                      'INICIAR SESIÓN'
                    )}
                  </span>
                </motion.button>
             </form>

             {/* Secondary Actions */}
             <div className="mt-12 space-y-6 pt-6 border-t border-white/5 text-center">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-4 text-xs font-orbitron tracking-widest text-white group"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all" />
                  CONEXIÓN GOOGLE CLOUD
                </button>

                <div className="flex flex-col gap-2">
                  <button className="text-[10px] font-mono text-nexus-silver/30 hover:text-nexus-cyan transition-colors uppercase tracking-[0.2em]">
                    ¿Olvidaste tu identificador?
                  </button>
                  <div className="text-[11px] font-mono text-nexus-silver/20 uppercase tracking-wider">
                     ¿Sin credenciales? {' '}
                     <button
                       type="button"
                       onClick={() => window.location.href = '/register'}
                       className="text-nexus-violet hover:text-white transition-colors font-bold"
                     >
                       SOLICITAR ACCESO
                     </button>
                  </div>
                </div>
             </div>
           </div>
        </TiltCard>

        {/* Footer HUD labels */}
        <div className="mt-8 flex justify-between px-4 opacity-30 select-none">
           <div className="font-mono text-[8px] tracking-[0.4em] uppercase">Terminal://Aut/Sesión</div>
           <div className="font-mono text-[8px] tracking-[0.4em] uppercase">V2.0.26 Soberano</div>
        </div>
      </motion.div>
    </SpotlightWrapper>
  );
};
