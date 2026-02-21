import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpotlightWrapper } from '../design-system/SpotlightWrapper';
import { GodModeText } from '../design-system/GodModeText';
import { useAuth } from '../../hooks/useAuth';

export const EmailVerification: React.FC = () => {
    const navigate = useNavigate();
    const { verifyEmail, user, loading } = useAuth();
    const [code, setCode] = useState(['', '', '', '', '', '']);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length !== 6) return;

        try {
            if (user?.id) {
                await verifyEmail(user.id, fullCode);
                navigate('/verify-phone');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMockVerify = () => {
        // For development flow
        navigate('/verify-phone');
    };


    return (
      <SpotlightWrapper className="min-h-screen bg-nexus-obsidian flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="grain-overlay opacity-30" />
          <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] bg-center opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="p-8 premium-glass rounded-2xl border border-white/10 text-center">
            <div className="w-20 h-20 mx-auto bg-nexus-cyan/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Mail className="w-10 h-10 text-nexus-cyan" />
            </div>

            <GodModeText
              text="VÍNCULO DE CORREO ELECTRÓNICO"
              effect="neon"
              className="text-2xl font-bold mb-4"
            />

            <p className="text-nexus-silver/60 text-sm font-mono mb-8">
              Introduce la clave de cifrado de 6 dígitos enviada a tu frecuencia asignada.
            </p>

            <div className="flex gap-2 justify-center mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-12 h-14 bg-black/40 border border-white/20 rounded-lg text-center text-xl font-bold font-mono text-white focus:border-nexus-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleMockVerify} // Using mock for now to bypass real backend req
              disabled={loading || code.join('').length !== 6}
              className="w-full py-4 bg-nexus-gradient text-white font-orbitron font-bold tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all uppercase flex items-center justify-center gap-3"
            >
              <span>VERIFICAR ENLACE</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-4 text-center">
              <button className="text-nexus-silver/40 text-xs font-mono hover:text-white transition-colors">
                REENVIAR SEÑAL
              </button>
            </div>
          </div>
        </motion.div>
      </SpotlightWrapper>
    );
};
