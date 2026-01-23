import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';

export const EnhancedROI: React.FC = () => {
  const [companySize, setCompanySize] = useState('medium');
  const [industry, setIndustry] = useState('technology');
  const [currentROI, setCurrentROI] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const { playHover, playClick } = useSound();

  const companySizes = [
    { id: 'small', label: 'Pequeña', employees: '1-50', multiplier: 1.2 },
    { id: 'medium', label: 'Mediana', employees: '51-500', multiplier: 2.5 },
    { id: 'large', label: 'Grande', employees: '501-5000', multiplier: 4.8 },
    { id: 'enterprise', label: 'Empresarial', employees: '5000+', multiplier: 8.2 }
  ];

  const industries = [
    { id: 'technology', label: 'Tecnología', baseROI: 450, icon: '💻' },
    { id: 'finance', label: 'Finanzas', baseROI: 380, icon: '💰' },
    { id: 'healthcare', label: 'Salud', baseROI: 320, icon: '🏥' },
    { id: 'retail', label: 'Retail', baseROI: 290, icon: '🛍️' },
    { id: 'manufacturing', label: 'Manufactura', baseROI: 410, icon: '🏭' },
    { id: 'logistics', label: 'Logística', baseROI: 360, icon: '🚚' }
  ];

  const benefits = [
    { category: 'Automatización', value: 45, description: 'Reducción de tareas manuales' },
    { category: 'Eficiencia', value: 67, description: 'Aumento de productividad' },
    { category: 'Costos', value: -38, description: 'Reducción de gastos operativos' },
    { category: 'Innovación', value: 89, description: 'Capacidad de innovación' },
    { category: 'Satisfacción', value: 72, description: 'Mejora en satisfacción del cliente' },
    { category: 'Velocidad', value: 156, description: 'Aceleración de procesos' }
  ];

  useEffect(() => {
    calculateROI();
  }, [companySize, industry]);

  const calculateROI = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const size = companySizes.find(s => s.id === companySize);
      const ind = industries.find(i => i.id === industry);

      if (size && ind) {
        const roi = Math.round(ind.baseROI * size.multiplier);
        setCurrentROI(roi);
      }

      setIsCalculating(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const annualSavings = currentROI * 1000; // Simplified calculation

  return (
    <section id="roi" className="relative py-32 bg-gradient-to-b from-black via-nexus-obsidian to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.05),transparent_70%)]" />

        {/* Animated Chart Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#00F5FF" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${i * 25}% 100% Q${i * 25 + 12.5}% ${50 - i * 10}% ${i * 25 + 25}% 0%`}
              stroke="url(#chartGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.3 }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6">
            CALCULADORA DE
            <span className="block text-nexus-cyan text-glow">RETORNO DE INVERSIÓN</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre cuánto puede transformar tu empresa con AIGestion.net
          </p>
        </motion.div>

        {/* Calculator */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Input Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Company Size */}
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Tamaño de Empresa</h3>
              <div className="grid grid-cols-2 gap-4">
                {companySizes.map((size) => (
                  <motion.button
                    key={size.id}
                    onClick={() => {
                      playClick();
                      setCompanySize(size.id);
                    }}
                    className={`premium-glass p-4 rounded-xl border-2 transition-all ${companySize === size.id
                        ? 'border-nexus-cyan bg-nexus-cyan/20'
                        : 'border-white/20 hover:border-white/40'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={playHover}
                  >
                    <div className="text-lg font-bold text-white">{size.label}</div>
                    <div className="text-sm text-gray-400">{size.employees} empleados</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Industria</h3>
              <div className="grid grid-cols-2 gap-4">
                {industries.map((ind) => (
                  <motion.button
                    key={ind.id}
                    onClick={() => {
                      playClick();
                      setIndustry(ind.id);
                    }}
                    className={`premium-glass p-4 rounded-xl border-2 transition-all ${industry === ind.id
                        ? 'border-nexus-cyan bg-nexus-cyan/20'
                        : 'border-white/20 hover:border-white/40'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={playHover}
                  >
                    <div className="text-2xl mb-2">{ind.icon}</div>
                    <div className="text-lg font-bold text-white">{ind.label}</div>
                    <div className="text-sm text-nexus-cyan">+{ind.baseROI}% ROI base</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Main ROI Display */}
            <div className="premium-glass p-8 rounded-3xl border-2 border-nexus-cyan/30 text-center">
              <h3 className="text-xl font-orbitron text-nexus-cyan mb-4">ROI ESTIMADO</h3>

              <AnimatePresence mode="wait">
                {isCalculating ? (
                  <motion.div
                    key="calculating"
                    className="py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-16 h-16 border-4 border-nexus-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Calculando tu ROI...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    className="py-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="text-6xl md:text-8xl font-orbitron font-black bg-gradient-to-r from-nexus-violet to-nexus-cyan bg-clip-text text-transparent">
                      +{currentROI}%
                    </div>
                    <p className="text-gray-300 mt-4">Retorno de Inversión Anual</p>
                    <div className="mt-6 text-2xl text-green-400 font-bold">
                      {formatCurrency(annualSavings)} / año
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Benefits Breakdown */}
            <div className="premium-glass p-6 rounded-2xl border border-white/20">
              <h4 className="text-lg font-orbitron text-white mb-4">Desglose de Beneficios</h4>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.category}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{benefit.category}</div>
                      <div className="text-xs text-gray-400">{benefit.description}</div>
                    </div>
                    <div className={`text-lg font-bold ${benefit.value > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                      {benefit.value > 0 ? '+' : ''}{benefit.value}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-block">
            <div className="premium-glass px-12 py-8 rounded-3xl border border-nexus-violet/30">
              <h3 className="text-3xl font-orbitron font-bold text-white mb-4">
                ¿LISTO PARA TRANSFORMAR TU EMPRESA?
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Comienza tu journey hacia la excelencia operativa con IA cuántica
              </p>
              <button className="btn-enterprise px-8 py-4 text-lg font-bold">
                SOLICITAR DEMO PERSONALIZADA
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
