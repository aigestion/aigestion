import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  icon: string;
  color: string;
}

export const IllustrativeHero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const { playHover, playClick } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const floatingElements: FloatingElement[] = [
    { id: 1, x: 10, y: 20, size: 40, duration: 3, icon: '🧠', color: 'text-nexus-violet-glow' },
    { id: 2, x: 85, y: 15, size: 35, duration: 4, icon: '⚡', color: 'text-nexus-cyan-glow' },
    { id: 3, x: 15, y: 70, size: 45, duration: 5, icon: '🔮', color: 'text-nexus-violet-glow' },
    { id: 4, x: 80, y: 75, size: 38, duration: 3.5, icon: '💎', color: 'text-nexus-cyan-glow' },
    { id: 5, x: 50, y: 10, size: 42, duration: 4.5, icon: '🚀', color: 'text-nexus-gold' },
    { id: 6, x: 25, y: 45, size: 36, duration: 3.8, icon: '🌟', color: 'text-nexus-silver' },
    { id: 7, x: 75, y: 50, size: 40, duration: 4.2, icon: '💫', color: 'text-nexus-violet-glow' },
    { id: 8, x: 45, y: 80, size: 44, duration: 3.3, icon: '🔥', color: 'text-nexus-cyan-glow' },
  ];

  const features = [
    {
      title: "INTELIGENCIA ARTIFICIAL",
      subtitle: "Cerebro Digital Empresarial",
      description: "Procesamiento neuronal avanzado para decisiones óptimas en tiempo real",
      icon: "🧠",
      stats: ["10TB datos procesados", "99.9% precisión", "0.1s respuesta"],
      color: "from-nexus-violet to-nexus-cyan"
    },
    {
      title: "AUTOMATIZACIÓN TOTAL",
      subtitle: "Sistema Operativo Autónomo",
      description: "Control completo de infraestructura con intervención humana mínima",
      icon: "⚡",
      stats: ["1000+ tareas/hora", "99.99% uptime", "0 errores críticos"],
      color: "from-nexus-cyan to-nexus-violet"
    },
    {
      title: "METaverso INTEGRADO",
      subtitle: "Realidad Aumentada Empresarial",
      description: "Espacios virtuales colaborativos con interfaces holográficas",
      icon: "🔮",
      stats: ["50+ nodos activos", "1000 usuarios", "24/7 disponible"],
      color: "from-nexus-gold to-nexus-violet"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200]);
  const parallaxScale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-nexus-obsidian-deep"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(138,43,226,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(138,43,226,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${element.color} font-bold text-2xl cursor-pointer select-none`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -15, 15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.3, rotate: 360 }}
          onMouseEnter={playHover}
          onClick={playClick}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Mouse Follow Light */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)',
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
        animate={{
          x: mousePosition.x - 50,
          y: mousePosition.y - 50,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6"
        style={{ y: parallaxY, scale: parallaxScale }}
      >
        {/* Logo Animated */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(138,43,226,0.5)",
                  "0 0 40px rgba(0,245,255,0.5)",
                  "0 0 20px rgba(138,43,226,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 rounded-2xl bg-gradient-to-br from-nexus-violet to-nexus-cyan flex items-center justify-center"
            >
              <span className="text-5xl font-bold text-white">AI</span>
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-nexus-cyan/30 rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black font-orbitron text-center mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-nexus-violet-glow via-white to-nexus-cyan-glow">
            AIGESTION
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-2xl lg:text-3xl text-nexus-silver/80 text-center mb-12 max-w-4xl font-light"
        >
          Arquitectura de Inteligencia Soberana para Empresas del Futuro
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
          <AnimatePresence mode="wait">
            {features.map((feature, index) => (
              activeFeature === index && (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="premium-glass p-6 rounded-2xl border border-white/10 hover:border-nexus-cyan/30 transition-all duration-300"
                  onMouseEnter={playHover}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className={`text-lg font-bold font-orbitron mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <h4 className="text-sm text-nexus-silver/60 mb-3 font-orbitron tracking-wider">
                    {feature.subtitle}
                  </h4>
                  <p className="text-sm text-nexus-silver/80 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-nexus-cyan-glow rounded-full animate-pulse" />
                        <span className="text-xs text-nexus-silver/60 font-mono">{stat}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(138,43,226,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={playHover}
            onClick={playClick}
            className="px-12 py-4 bg-gradient-to-r from-nexus-violet to-nexus-cyan text-white font-orbitron font-bold tracking-widest rounded-full transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">INICIAR EXPANSIÓN</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-nexus-cyan to-nexus-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: "rgba(0,245,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={playHover}
            onClick={playClick}
            className="px-12 py-4 border-2 border-white/20 hover:border-nexus-cyan text-white font-orbitron font-bold tracking-widest rounded-full transition-all duration-300"
          >
            VER DEMOSTRACIÓN
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-nexus-cyan to-transparent" />
          <div className="w-2 h-2 bg-nexus-cyan-glow rounded-full mx-auto mt-2 animate-pulse" />
        </motion.div>
      </motion.div>
    </div>
  );
};
