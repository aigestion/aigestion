import { motion } from 'framer-motion';
import { AlertCircle, Lock, Mail, User, Briefcase, Users as UsersIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SpotlightWrapper } from '../design-system/SpotlightWrapper';
import { GodModeText } from '../design-system/GodModeText';
import { useAuth } from '../../hooks/useAuth';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth(); // Assuming register function exists in useAuth
  const [accountType, setAccountType] = useState<'family' | 'enterprise'>('family');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      // Determine redirection based on flow
      // Ideally, after registration, we go to Email Verification
      navigate('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SpotlightWrapper className="min-h-screen bg-nexus-obsidian flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="grain-overlay opacity-30" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
            <GodModeText text="NEW OPERATIVE" effect="hologram" className="text-3xl font-bold mb-2" />
            <p className="text-nexus-silver/60 text-xs font-orbitron tracking-widest uppercase">
                Initialize Protocol
            </p>
        </div>

        <div className="p-8 premium-glass rounded-2xl border border-white/10 hover:border-nexus-cyan/30 transition-all duration-500">
            {/* Account Type Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => setAccountType('family')}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        accountType === 'family' 
                        ? 'bg-nexus-cyan/10 border-nexus-cyan/50 text-nexus-cyan' 
                        : 'bg-black/20 border-white/5 text-nexus-silver/40 hover:bg-white/5'
                    }`}
                >
                    <UsersIcon className="w-6 h-6" />
                    <span className="text-xs font-orbitron tracking-widest">FAMILY</span>
                </button>
                <button
                    type="button"
                    onClick={() => setAccountType('enterprise')}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        accountType === 'enterprise' 
                        ? 'bg-nexus-violet/10 border-nexus-violet/50 text-nexus-violet' 
                        : 'bg-black/20 border-white/5 text-nexus-silver/40 hover:bg-white/5'
                    }`}
                >
                    <Briefcase className="w-6 h-6" />
                    <span className="text-xs font-orbitron tracking-widest">ENTERPRISE</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Codename / Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 transition-all font-mono text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Email Channel</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="agent@nexus.ai"
                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 transition-all font-mono text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Passkey</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 transition-all font-mono text-sm"
                                required
                            />
                        </div>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">Confirm</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-nexus-silver/20 focus:outline-none focus:border-nexus-cyan/50 transition-all font-mono text-sm"
                                required
                            />
                        </div>
                    </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center text-red-400 text-xs font-mono"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-nexus-gradient text-white font-orbitron font-bold tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all uppercase text-sm mt-4"
                >
                  {loading ? 'INITIALIZING...' : 'ESTABLISH IDENTITY'}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-nexus-silver/40 text-xs font-mono mb-4">OR AUTHENTICATE WITH</p>
                <button
                    type="button"
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-xs font-orbitron tracking-wider text-white">GOOGLE NETHUB</span>
                </button>
            </div>

            <div className="mt-6 text-center">
                <span className="text-nexus-silver/40 text-xs font-mono">ALREADY AN AGENT? </span>
                <Link to="/login" className="text-nexus-cyan hover:text-nexus-cyan-light font-bold text-xs font-orbitron tracking-wider ml-2">
                    ACCESS TERMINAL
                </Link>
            </div>
        </div>
      </motion.div>
    </SpotlightWrapper>
  );
};
