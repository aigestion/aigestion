import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-at-center from-nexus-violet/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-cyan to-transparent opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="premium-glass p-8 rounded-2xl neon-border neon-glow-violet">
          <div className="text-center mb-8">
             <motion.h1
               className="text-3xl font-orbitron font-black text-white mb-2 tracking-wider"
               initial={{ y: -20 }}
               animate={{ y: 0 }}
             >
               NUEVA CUENTA
             </motion.h1>
             <p className="text-nexus-silver/60 text-sm">
               Accede al sistema de inteligencia soberana
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Nombre</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40 group-focus-within:text-nexus-cyan transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu Nombre"
                  className="w-full pl-10 pr-4 py-3 bg-nexus-obsidian/60 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 focus:ring-1 focus:ring-nexus-cyan/50 transition-all nexus-input-focus"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40 group-focus-within:text-nexus-cyan transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-nexus-obsidian/60 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 focus:ring-1 focus:ring-nexus-cyan/50 transition-all nexus-input-focus"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40 group-focus-within:text-nexus-cyan transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-nexus-obsidian/60 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 focus:ring-1 focus:ring-nexus-cyan/50 transition-all nexus-input-focus"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
             <div className="space-y-1">
              <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Confirmar</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40 group-focus-within:text-nexus-cyan transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-nexus-obsidian/60 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 focus:ring-1 focus:ring-nexus-cyan/50 transition-all nexus-input-focus"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center text-red-400 text-xs bg-red-500/10 p-2 rounded-lg border border-red-500/20"
              >
                <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-nexus-violet to-nexus-cyan text-white font-orbitron font-bold tracking-[0.2em] rounded-xl hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="animate-pulse">PROCESANDO...</span>
              ) : (
                <>
                  REGISTRARSE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center mt-6">
                <p className="text-nexus-silver/40 text-xs">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-nexus-cyan hover:text-white transition-colors underline decoration-nexus-cyan/30 underline-offset-4">
                        Iniciar Sesión
                    </Link>
                </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
