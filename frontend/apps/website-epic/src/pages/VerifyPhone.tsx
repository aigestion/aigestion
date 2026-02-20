import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface VerifyPhonePageProps {
  onVerifyPhone: (phone: string, code: string) => Promise<void>;
  onSendCode: (phone: string) => Promise<void>;
}

export const VerifyPhone: React.FC<VerifyPhonePageProps> = ({ onVerifyPhone, onSendCode }) => {
  const { user, isAuthenticated } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'success'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if already verified
  if (user.phoneVerified) {
    return <Navigate to="/dashboard/client" replace />;
  }

  const formatPhoneNumber = (value: string) => {
    // Format phone number (assuming international format)
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Por favor ingresa un número de teléfono válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSendCode(phone);
      setStep('code');
      startCountdown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Por favor ingresa el código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onVerifyPhone(phone, code);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setTimeLeft(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await onSendCode(phone);
      startCountdown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'code') {
      setStep('phone');
      setCode('');
      setError('');
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Verificado!</h2>
            <p className="text-gray-300 mb-6">
              Tu número de teléfono ha sido verificado exitosamente.
            </p>
            <button
              onClick={() => (window.location.href = '/dashboard/client')}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-bold text-white hover:scale-105 transition-all"
            >
              Ir a mi Panel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verifica tu Teléfono</h1>
          <p className="text-gray-300 text-sm">
            {step === 'phone'
              ? 'Ingresa tu número de teléfono para proteger tu cuenta'
              : 'Enviamos un código de verificación a tu teléfono'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número de Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formatPhoneNumber(phone)}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="+1 (555) 123-4567"
                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={15}
                  />
                </div>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-bold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Código de Verificación
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Ingresa el código de 6 dígitos que enviamos a {formatPhoneNumber(phone)}
                </p>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-bold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : 'Verificar Código'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend || loading}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canResend ? 'Reenviar código' : `Reenviar en ${timeLeft}s`}
                </button>
              </div>
            </form>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-300">
                <p className="font-semibold mb-1">🔒 Protección Anti-Fraude</p>
                <p>
                  Esta verificación ayuda a proteger tu cuenta contra accesos no autorizados. Tu
                  número de teléfono solo se usa para fines de seguridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
