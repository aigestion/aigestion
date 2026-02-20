import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { cn } from '../utils/cn';
import { ChevronRight, ExternalLink } from 'lucide-react';

// 3D Tilt Wrapper
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 20); // Increased tilt for more dramatic effect
    y.set(yPct * -20);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: y, rotateY: x, transformStyle: 'preserve-3d' }}
      className={cn("perspective-1000", className)}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  );
};

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  stats: { label: string; value: string }[];
  color: string;
  borderGlow: string;
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
      category: 'ASISTENTE SOBERANA',
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
        { label: 'Precisión', value: '99.9%' },
        { label: 'Latencia', value: '<50ms' },
      ],
      color: 'from-nexus-violet-glow to-purple-600',
      borderGlow: 'border-nexus-violet',
    },
    {
      id: 'nexus-control',
      title: 'NEXUS CONTROL',
      category: 'SISTEMA OPERATIVO',
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
        { label: 'Ops/min', value: '1M+' },
        { label: 'Uptime', value: '100%' },
        { label: 'Eficiencia', value: '∞' },
      ],
      color: 'from-nexus-cyan-glow to-blue-600',
      borderGlow: 'border-nexus-cyan',
    },
    {
      id: 'metaverse-hub',
      title: 'METAVERSE HUB',
      category: 'REALIDAD EXTENDIDA',
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
        { label: 'Usuarios', value: 'GLOBAL' },
        { label: 'Mundos', value: '∞' },
        { label: 'FPS', value: '120+' },
      ],
      color: 'from-amber-500 to-yellow-600',
      borderGlow: 'border-amber-500',
    },
  ];

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2, // Slower for elegance
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#8A2BE2' : '#00F5FF',
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      if (!isInteracting) {
        setActiveItem(prev => (prev + 1) % showcaseItems.length);
      }
    }, 8000); // Slower auto-rotation

    return () => clearInterval(interval);
  }, [isInteracting]);

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
      className="relative min-h-screen bg-nexus-obsidian overflow-hidden py-24"
      onMouseMove={handleMouseMove}
    >
      {/* Background Grid & Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full blur-[1px]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: 0.4,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random(),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Mouse Follow Glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${currentItem.color.includes('cyan') ? 'rgba(0,245,255,0.1)' : 'rgba(138,43,226,0.1)'} 0%, transparent 70%)`,
          x: springX,
          y: springY,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-nexus-cyan/30 bg-nexus-cyan/5 text-nexus-cyan text-[10px] font-orbitron tracking-[0.2em] uppercase backdrop-blur-md">
            Arquitectura del Sistema
          </div>
          <h2 className="text-5xl md:text-7xl font-black font-orbitron mb-6">
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              ECOSISTEMA
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan to-nexus-violet">
              DIGITAL
            </span>
          </h2>
          <p className="text-xl text-nexus-silver/60 max-w-2xl mx-auto font-light tracking-wide">
            Explora nuestro universo de soluciones inteligentes diseñadas para la soberanía tecnológica.
          </p>
        </motion.div>

        {/* Main Content Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Navigation List */}
          <div className="lg:col-span-5 space-y-4">
            {showcaseItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => {
                  setIsInteracting(true);
                  // Optional: prefetch or prepare
                }}
                onMouseLeave={() => setIsInteracting(false)}
                onClick={() => {
                  setActiveItem(index);
                  playClick();
                }}
                className={`group relative p-6 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                  activeItem === index
                    ? `bg-white/5 ${item.borderGlow} border-l-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]`
                    : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {/* Active Indicator Background */}
                {activeItem === index && (
                  <motion.div
                    layoutId="activeGlow"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10`}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg`}>
                        <span className="font-bold text-white text-lg">{item.title.charAt(0)}</span>
                     </div>
                     <div>
                        <h3 className={`text-lg font-bold font-orbitron tracking-wide transition-colors ${activeItem === index ? 'text-white' : 'text-nexus-silver/70 group-hover:text-white'}`}>
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-nexus-cyan/80 uppercase tracking-widest font-mono">
                          {item.category}
                        </p>
                     </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeItem === index ? 'text-nexus-cyan translate-x-1' : 'text-nexus-silver/30 group-hover:text-white'}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: 3D Preview Card */}
          <div className="lg:col-span-7 perspective-1000 h-[600px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <TiltCard key={currentItem.id} className="w-full max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  className="relative bg-nexus-obsidian/80 backdrop-blur-xl border border-white/10 rounded-3xl p-1 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    {/* Inner Border Gradient */}
                    <div className={`absolute inset-0 rounded-3xl opacity-30 bg-gradient-to-br ${currentItem.color}`} />
                    
                    <div className="relative bg-black/40 rounded-[22px] p-8 h-full">
                       {/* Holographic Header */}
                       <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                          <div>
                             <h2 className="text-3xl font-black font-orbitron text-white mb-2 tracking-wide kinetic-text">
                               {currentItem.title}
                             </h2>
                             <p className="text-nexus-silver/80 text-sm leading-relaxed max-w-md">
                               {currentItem.description}
                             </p>
                          </div>
                          <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${currentItem.borderGlow} text-white bg-white/5`}>
                             V2.0.5 ACTIVE
                          </div>
                       </div>

                       {/* Stats Grid */}
                       <div className="grid grid-cols-3 gap-4 mb-8">
                          {currentItem.stats.map((stat, i) => (
                             <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-nexus-cyan/30 transition-colors">
                                <div className="text-2xl font-bold text-white mb-1 font-orbitron">{stat.value}</div>
                                <div className="text-[10px] uppercase text-nexus-silver/50 tracking-wider font-mono">{stat.label}</div>
                             </div>
                          ))}
                       </div>

                       {/* Features List */}
                       <div className="space-y-3 mb-8">
                          {currentItem.features.map((feature, i) => (
                             <motion.div 
                               key={i}
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: 0.3 + (i * 0.1) }}
                               className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                             >
                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${currentItem.color}`} />
                                <span className="text-sm text-nexus-silver/90 font-light">{feature}</span>
                             </motion.div>
                          ))}
                       </div>

                       {/* Action Footer */}
                       <div className="flex items-center justify-between pt-6 border-t border-white/10">
                          <button 
                            className="text-xs text-nexus-silver/50 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
                            onMouseEnter={playHover}
                          >
                             Documentación <ExternalLink className="w-3 h-3" />
                          </button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={playClick}
                            className={`px-8 py-3 rounded-xl bg-gradient-to-r ${currentItem.color} text-white font-bold font-orbitron text-sm tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow`}
                          >
                             INICIAR SISTEMA
                          </motion.button>
                       </div>
                    </div>
                </motion.div>
              </TiltCard>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};
