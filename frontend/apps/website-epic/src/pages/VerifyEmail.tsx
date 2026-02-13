import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const VerifyEmail: React.FC = () => {
  const { user, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError('No se ha encontrado el usuario. Por favor regístrate nuevamente.');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(user.id, code);
      navigate('/onboarding/role');
    } catch (err: any) {
      setError(err.message || 'Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nexus-cyan/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="premium-glass p-8 rounded-2xl neon-border neon-glow-cyan text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-nexus-cyan/10 p-4 rounded-full ring-1 ring-nexus-cyan/50 shadow-[0_0_20px_rgba(0,245,255,0.3)]">
              <Mail className="h-10 w-10 text-nexus-cyan" />
            </div>
          </div>

          <h1 className="text-2xl font-orbitron font-bold text-white mb-2 tracking-wider">
            VERIFICAR EMAIL
          </h1>
          <p className="text-nexus-silver/60 text-sm mb-6">
            Hemos enviado un código a{' '}
            <span className="text-nexus-cyan font-semibold">{user?.email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 text-left">
              <label className="text-xs font-orbitron text-nexus-cyan tracking-widest uppercase ml-1">
                Código de Seguridad
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full text-center text-3xl tracking-[0.5em] font-orbitron py-3 bg-nexus-obsidian/60 border border-white/10 rounded-xl text-white placeholder-nexus-silver/10 focus:outline-none focus:border-nexus-cyan/50 focus:ring-1 focus:ring-nexus-cyan/50 transition-all nexus-input-focus"
                required
                maxLength={6}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center text-red-400 text-xs bg-red-500/10 p-2 rounded-lg"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-4 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-nexus-obsidian font-orbitron font-bold tracking-[0.2em] rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">VERIFICANDO...</span>
              ) : (
                <>
                  CONFIRMAR <CheckCircle className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-nexus-silver/40 text-xs mt-6">
            Revisa tu bandeja de spam si no encuentras el código. <br />
            El código expira en 15 minutos.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
