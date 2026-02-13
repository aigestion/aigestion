import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { useAppContext } from '../contexts/AppContext';

export const EnhancedROI: React.FC = () => {
  const { setIsContactModalOpen } = useAppContext();
  const [companySize, setCompanySize] = useState('medium');
  const [industry, setIndustry] = useState('technology');
  const [currentROI, setCurrentROI] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const { playHover, playClick } = useSound();

  const companySizes = [
    { id: 'small', label: 'Pequeña', employees: '1-50', multiplier: 1.2 },
    { id: 'medium', label: 'Mediana', employees: '51-500', multiplier: 2.5 },
    { id: 'large', label: 'Grande', employees: '501-5000', multiplier: 4.8 },
    { id: 'enterprise', label: 'Empresarial', employees: '5000+', multiplier: 8.2 },
  ];

  const industries = [
    { id: 'technology', label: 'Tecnología', baseROI: 450, icon: '💻' },
    { id: 'finance', label: 'Finanzas', baseROI: 380, icon: '💰' },
    { id: 'healthcare', label: 'Salud', baseROI: 320, icon: '🏥' },
    { id: 'retail', label: 'Retail', baseROI: 290, icon: '🛍️' },
    { id: 'manufacturing', label: 'Manufactura', baseROI: 410, icon: '🏭' },
    { id: 'logistics', label: 'Logística', baseROI: 360, icon: '🚚' },
  ];

  const benefits = [
    { category: 'Automatización', value: 45, description: 'Reducción de tareas manuales' },
    { category: 'Eficiencia', value: 67, description: 'Aumento de productividad' },
    { category: 'Costos', value: -38, description: 'Reducción de gastos operativos' },
    { category: 'Innovación', value: 89, description: 'Capacidad de innovación' },
    { category: 'Satisfacción', value: 72, description: 'Mejora en satisfacción del cliente' },
    { category: 'Velocidad', value: 156, description: 'Aceleración de procesos' },
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
    <section id="roi" className="relative py-32 smooth-mesh-bg overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-nexus-cyan/20 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-center from-nexus-violet/5 via-transparent to-transparent pointer-events-none" />

        {/* Animated Chart Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#00F5FF" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[...Array(8)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${i * 15} 100 Q${i * 15 + 7.5} ${70 - i * 15} ${i * 15 + 15} 0`}
              stroke="url(#chartGradient)"
              strokeWidth="1"
              fill="none"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0.5] }}
              transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, repeatDelay: 2 }}
            />
          ))}
        </svg>

        {/* Floating Data Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-nexus-cyan/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-0.5 bg-nexus-violet-glow" />
            <span className="text-nexus-violet-glow text-xs font-orbitron tracking-[0.5em] uppercase">
              Nodo Financiero Soberano
            </span>
            <div className="w-12 h-0.5 bg-nexus-violet-glow" />
          </div>
          <h2 className="text-5xl md:text-8xl font-orbitron font-black text-white mb-6 tracking-tighter">
            CENTRO ESTRATÉGICO <span className="text-glow text-nexus-cyan">DE ROI</span>
          </h2>
          <p className="text-xl text-nexus-silver/60 max-w-3xl mx-auto font-light leading-relaxed italic">
            "La inversión no es un gasto cuando el retorno es exponencial. <br />
            Visualiza el impacto real de la inteligencia soberana en tu ecosistema."
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          {/* Controls - Left Side */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Company Size */}
            <div className="premium-glass p-8 rounded-[2.5rem] border-white/5 bg-white/2 backdrop-blur-xl">
              <h3 className="text-xl font-orbitron font-bold text-white mb-8 border-l-4 border-nexus-cyan pl-4">
                DIMENSIÓN EMPRESARIAL
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {companySizes.map(size => (
                  <motion.button
                    key={size.id}
                    onClick={() => {
                      playClick();
                      setCompanySize(size.id);
                    }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                      companySize === size.id
                        ? 'border-nexus-cyan bg-nexus-cyan/10 ring-4 ring-nexus-cyan/20'
                        : 'border-white/10 hover:border-white/20 bg-black/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={playHover}
                  >
                    <div
                      className={`text-sm font-orbitron font-bold mb-1 ${companySize === size.id ? 'text-nexus-cyan' : 'text-white'}`}
                    >
                      {size.label.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono tracking-widest">
                      {size.employees} NODOS
                    </div>
                    {companySize === size.id && (
                      <motion.div
                        layoutId="activeSize"
                        className="absolute inset-0 border-2 border-nexus-cyan rounded-2xl pointer-events-none"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Industry Selection */}
            <div className="premium-glass p-8 rounded-[2.5rem] border-white/5 bg-white/2 backdrop-blur-xl">
              <h3 className="text-xl font-orbitron font-bold text-white mb-8 border-l-4 border-nexus-violet pl-4">
                SECTOR ANALÍTICO
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {industries.map(ind => (
                  <motion.button
                    key={ind.id}
                    onClick={() => {
                      playClick();
                      setIndustry(ind.id);
                    }}
                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                      industry === ind.id
                        ? 'border-nexus-violet bg-nexus-violet/10 shadow-[0_0_20px_rgba(138,43,226,0.2)]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={playHover}
                  >
                    <span className="text-2xl mb-2">{ind.icon}</span>
                    <span className="text-[10px] font-orbitron font-bold text-gray-300 tracking-tighter truncate w-full text-center">
                      {ind.label.toUpperCase()}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Visualization - Right Side */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Main Metrics Hub */}
            <div className="premium-glass p-10 rounded-[3rem] border-nexus-cyan/20 bg-linear-to-br from-nexus-cyan/5 to-transparent relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-16 h-16 border-2 border-nexus-cyan/20 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-10 h-10 border-2 border-nexus-violet/30 rounded-full flex items-center justify-center animate-reverse-spin">
                    <div className="w-4 h-4 bg-nexus-cyan shadow-[0_0_15px_rgba(0,245,255,1)] rounded-full" />
                  </div>
                </div>
              </div>

              <h4 className="text-nexus-cyan text-xs font-orbitron tracking-[0.4em] mb-8 uppercase text-left pl-2">
                Resultado de Proyección Cuántica
              </h4>

              <AnimatePresence mode="wait">
                {isCalculating ? (
                  <motion.div
                    key="calculating"
                    className="py-20 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-8xl font-orbitron font-black text-white/5 blur-sm animate-pulse">
                      000.0%
                    </div>
                    <p className="text-nexus-cyan font-mono text-[10px] mt-4 tracking-[0.8em] animate-pulse uppercase">
                      Sincronizando Flujos de Datos...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    className="relative py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    <div className="text-8xl md:text-[10rem] font-orbitron font-black text-white leading-none tracking-tighter">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                      >
                        {currentROI}
                      </motion.span>
                      <span className="text-nexus-cyan text-glow text-6xl md:text-8xl relative -top-8">
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-8 border-t border-white/10 pt-8">
                      <div className="text-left">
                        <p className="text-nexus-silver/40 text-xs font-orbitron tracking-widest uppercase mb-1">
                          Impacto Financiero Bruto
                        </p>
                        <div className="text-4xl text-white font-orbitron font-black">
                          {formatCurrency(annualSavings)}{' '}
                          <span className="text-lg text-nexus-cyan/60">/AÑO</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-nexus-silver/40 text-xs font-orbitron tracking-widest uppercase mb-1">
                          Ratio de Eficiencia
                        </p>
                        <div className="text-2xl text-nexus-violet-glow font-orbitron font-bold">
                          12:1 ROI
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Benefits Exploded View */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.category}
              className="premium-glass p-6 rounded-3xl border-white/5 text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div
                className={`text-3xl font-orbitron font-black mb-2 ${benefit.value > 0 ? 'text-nexus-cyan' : 'text-nexus-violet-glow'}`}
              >
                {benefit.value > 0 ? '+' : ''}
                {benefit.value}%
              </div>
              <div className="text-[10px] font-orbitron text-white font-bold tracking-widest mb-1 uppercase">
                {benefit.category}
              </div>
              <div className="text-[8px] text-gray-500 uppercase leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {benefit.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-block relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-nexus-violet to-nexus-cyan rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative premium-glass px-16 py-12 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-nexus-violet via-white to-nexus-cyan" />
              <h3 className="text-4xl font-orbitron font-black text-white mb-6 tracking-tighter">
                ELEVACIÓN EMPRESARIAL <span className="text-nexus-cyan text-glow">INMEDIATA</span>
              </h3>
              <p className="text-nexus-silver/60 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                Nuestros algoritmos están listos para fusionarse con tu estructura actual. Activa tu
                nodo de inteligencia hoy.
              </p>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="btn-enterprise px-12 py-6 text-xl font-orbitron font-black tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-300"
              >
                INICIAR DESPLIEGUE
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
