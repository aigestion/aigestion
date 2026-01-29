import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">DA</span>
          </motion.div>
          <h1 className="text-3xl font-orbitron font-black text-white mb-2">
            Bienvenido a Daniela
          </h1>
          <p className="text-nexus-silver/60 text-sm">
            Tu asistente de IA emocional está lista para ayudarte
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8 bg-nexus-obsidian/40 backdrop-blur-xl border border-white/10 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-orbitron text-nexus-cyan">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 bg-nexus-obsidian/60 border border-white/10 rounded-lg text-white placeholder-nexus-silver/40 focus:outline-none focus:border-nexus-cyan disabled:opacity-50"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-400 text-sm">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-orbitron text-nexus-cyan">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2 bg-nexus-obsidian/60 border border-white/10 rounded-lg text-white placeholder-nexus-silver/40 focus:outline-none focus:border-nexus-cyan disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-nexus-silver/40 hover:text-nexus-silver/60 disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-sm">{fieldErrors.password}</p>
              )}
            </div>

            {/* Error General */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <div className="flex items-center text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-nexus-violet text-white font-orbitron tracking-widest rounded-lg hover:bg-nexus-violet/80 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            {/* Links Adicionales */}
            <div className="space-y-3 text-center">
              <button
                type="button"
                className="text-nexus-cyan hover:text-nexus-cyan/80 text-sm transition-colors disabled:opacity-50"
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </button>
              <div className="text-nexus-silver/40 text-sm">
                ¿Nuevo usuario?{' '}
                <button
                  type="button"
                  className="text-nexus-violet hover:text-nexus-violet/80 text-sm transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Regístrate gratis
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-nexus-silver/40 text-xs">
            Al iniciar sesión, aceptas nuestros{' '}
            <button className="text-nexus-cyan hover:text-nexus-cyan/80 underline">
              términos y condiciones
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
