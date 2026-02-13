import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  stats: { label: string; value: string }[];
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const InteractiveShowcase: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const { playHover, playClick } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'daniela-ai',
      title: 'DANIELA AI',
      category: 'Asistente Virtual',
      description:
        'Inteligencia artificial conversacional avanzada con procesamiento de lenguaje natural y aprendizaje contextual.',
      image: '/images/daniela/lab.png',
      features: [
        'Procesamiento NLP avanzado',
        'Aprendizaje contextual continuo',
        'Multilingüe en tiempo real',
        'Integración omnicanal',
      ],
      stats: [
        { label: 'Idiomas', value: '50+' },
        { label: 'Precisión', value: '99.7%' },
        { label: 'Respuesta', value: '<100ms' },
      ],
      color: 'from-nexus-violet to-purple-600',
    },
    {
      id: 'nexus-control',
      title: 'NEXUS CONTROL',
      category: 'Sistema Operativo',
      description:
        'Plataforma central de automatización y control de infraestructura con capacidades de auto-optimización.',
      image: '/images/nexus/collaboration.png',
      features: [
        'Orquestación automática',
        'Predicción de fallos',
        'Escalado elástico',
        'Recuperación automática',
      ],
      stats: [
        { label: 'Tareas/hora', value: '10K+' },
        { label: 'Uptime', value: '99.99%' },
        { label: 'Eficiencia', value: '300%' },
      ],
      color: 'from-nexus-cyan to-blue-600',
    },
    {
      id: 'metaverse-hub',
      title: 'METAVERSE HUB',
      category: 'Realidad Virtual',
      description:
        'Espacios virtuales colaborativos con interfaces holográficas y experiencias inmersivas 3D.',
      image: '/images/nexus/hero.png',
      features: [
        'Mundos virtuales persistentes',
        'Avatares personalizados',
        'Colaboración real-time',
        'Integración blockchain',
      ],
      stats: [
        { label: 'Usuarios', value: '100K+' },
        { label: 'Mundos', value: '500+' },
        { label: 'Transacciones/s', value: '10K' },
      ],
      color: 'from-nexus-gold to-yellow-600',
    },
  ];

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? '#8A2BE2' : '#00F5FF',
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setActiveItem(prev => (prev + 1) % showcaseItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev =>
        prev.map(particle => {
          let { x, y, vx, vy } = particle;

          x += vx;
          y += vy;

          if (x <= 0 || x >= 100) vx = -vx;
          if (y <= 0 || y >= 100) vy = -vy;

          return { ...particle, x, y, vx, vy };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const currentItem = showcaseItems[activeItem];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-nexus-obsidian overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      {/* Animated Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: isInteracting ? 0.8 : 0.3,
            }}
            animate={{
              scale: isInteracting ? [1, 1.5, 1] : [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Mouse Follow Effect */}
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)',
          x: springX,
          y: springY,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black font-orbitron mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-nexus-violet-glow via-white to-nexus-cyan-glow">
              ECOSISTEMA DIGITAL
            </span>
          </h2>
          <p className="text-xl text-nexus-silver/80 max-w-3xl mx-auto">
            Explora nuestro universo de soluciones inteligentes diseñadas para transformar tu
            empresa
          </p>
        </motion.div>

        {/* Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Interactive Cards */}
          <div className="space-y-6">
            {showcaseItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={playHover}
                onClick={() => {
                  setActiveItem(index);
                  playClick();
                }}
                className={`premium-glass p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  activeItem === index
                    ? 'border-nexus-cyan/50 shadow-[0_0_40px_rgba(0,245,255,0.3)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-lg">{item.title.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold font-orbitron">{item.title}</h3>
                      <span className="text-xs text-nexus-silver/60 font-orbitron tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-nexus-silver/70 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 mt-4">
                      {item.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-nexus-cyan-glow rounded-full" />
                          <span className="text-xs text-nexus-silver/60">
                            <span className="text-white font-bold">{stat.value}</span> {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Feature Display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                transition={{ duration: 0.6 }}
                className="premium-glass p-8 rounded-3xl border border-white/10"
              >
                {/* Image Placeholder */}
                <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-nexus-obsidian to-nexus-obsidian-light">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${currentItem.color} flex items-center justify-center`}
                    >
                      <span className="text-4xl font-bold text-white">
                        {currentItem.title.charAt(0)}
                      </span>
                    </motion.div>
                  </div>

                  {/* Animated Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                {/* Features List */}
                <h4 className="text-lg font-bold font-orbitron mb-4 text-nexus-cyan-glow">
                  Características Principales
                </h4>
                <div className="space-y-3">
                  {currentItem.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-nexus-violet-glow rounded-full" />
                      <span className="text-sm text-nexus-silver/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className={`w-full mt-6 py-3 rounded-xl font-orbitron font-bold tracking-wider text-white bg-gradient-to-r ${currentItem.color} transition-all duration-300`}
                >
                  EXPLORAR {currentItem.title}
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Floating Elements */}
            {particles.slice(0, 5).map((particle, index) => (
              <motion.div
                key={`floating-${index}`}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  backgroundColor: particle.color,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center gap-4">
          {showcaseItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveItem(index);
                playClick();
              }}
              onMouseEnter={playHover}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeItem === index ? 'bg-nexus-cyan-glow w-12' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
