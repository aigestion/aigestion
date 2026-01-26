import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Users, Layout, Monitor, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { MagneticWrapper } from '../components/MagneticWrapper';
import { GlitchText } from '../components/GlitchText';

const VirtualOfficePreview: React.FC = () => {
  const { playHover, playClick, playWhoosh } = useSoundEffects();

  // Parallax & Scroll Effects
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  const zones = [
    {
      title: 'Sala de Reuniones',
      description:
        'Un lugar donde puedes hablar con otras personas como si estuvieras allí mismo. Ideal para charlar y compartir ideas.',
      icon: Users,
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'group-hover:neon-glow-cyan',
    },
    {
      title: 'Exposición de Inventos',
      description:
        'Mira nuestros proyectos y productos en 3D. Puedes moverlos y verlos desde todos los ángulos.',
      icon: Sparkles,
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'group-hover:neon-glow-violet',
    },
    {
      title: 'Tu Mesa de Trabajo',
      description:
        'Un espacio tranquilo donde tienes toda la información de tu negocio siempre a mano.',
      icon: Monitor,
      color: 'from-green-500/20 to-emerald-500/20',
      border: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    },
    {
      title: 'Fotos con IA',
      description:
        'Usa nuestra tecnología para crear imágenes increíbles de tu oficina o productos al instante.',
      icon: Camera,
      color: 'from-orange-500/20 to-yellow-500/20',
      border: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    },
  ];

  // Card Tilt Effect Hook
  const MouseTiltCard = ({
    children,
    className = '',
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
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
        onMouseEnter={() => playHover()}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian pt-32 pb-24 px-6 relative overflow-hidden perspective-1000">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50 mix-blend-overlay"></div>
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent pointer-events-none"
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-nexus-cyan/5 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.header
          style={{ opacity: opacityHero }}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'circOut' }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-silver to-white mb-6 animate-pulse-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <GlitchText text="TU OFICINA DEL FUTURO" />
          </h1>
          <p className="text-nexus-silver/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            <span className="text-nexus-cyan-glow">●</span> Antes de entrar, queremos que sepas que
            vas a viajar a un mundo virtual. Es como un videojuego, pero hecho para que tu empresa
            sea la mejor del mundo.
          </p>
        </motion.header>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {zones.map((zone, i) => {
            const Icon = zone.icon;
            return (
              <MouseTiltCard key={zone.title} className="perspective-1000">
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className={`relative z-10 h-full p-8 rounded-[2rem] bg-gradient-to-br ${zone.color} border border-white/5 backdrop-blur-sm group transition-all duration-300 ${zone.border}`}
                >
                  <div className="flex gap-6 items-start transform-style-3d group-hover:translate-z-10 transition-transform">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-orbitron font-bold mb-3 text-white group-hover:text-glow-cyan transition-all">
                        {zone.title}
                      </h2>
                      <p className="text-nexus-silver/80 text-sm leading-relaxed font-light">
                        {zone.description}
                      </p>
                    </div>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
              </MouseTiltCard>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="premium-glass p-12 rounded-[3rem] text-center border-white/10 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-nexus-violet/20 via-transparent to-nexus-cyan/20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute -inset-[100%] top-0 block h-[200%] w-[10px] -rotate-[20deg] bg-white/20 blur-[5px] animate-[shine_5s_infinite_linear]" />

          <h3 className="text-3xl font-orbitron font-bold mb-6 text-white relative z-10">
            ¿Estás listo para el viaje?
          </h3>
          <p className="text-nexus-silver/70 mb-10 max-w-xl mx-auto relative z-10">
            Haz clic en el botón de abajo y te llevaremos directamente a tu sede oficial. Solo
            necesitas tu ratón para moverte y explorar.
          </p>

          <div className="flex justify-center">
            <MagneticWrapper strength={50}>
              <Link
                to="/virtual-office/go"
                onMouseEnter={() => playHover()}
                onMouseDown={() => playClick()}
                onClick={() => playWhoosh()}
                className="relative z-10 btn-enterprise px-12 py-5 rounded-full text-lg font-orbitron font-black tracking-widest inline-flex items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(138,43,226,0.5)] group-hover:shadow-[0_0_80px_rgba(0,245,255,0.5)]"
              >
                ENTRAR AHORA <ArrowRight className="w-6 h-6 animate-pulse" />
              </Link>
            </MagneticWrapper>
          </div>

          <div className="mt-12 flex justify-center gap-8 opacity-40 text-[10px] uppercase tracking-[0.3em] font-mono">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Conexión
              Segura
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div> Modo
              Inmersivo
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150"></div>{' '}
              100% Gratis
            </span>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default VirtualOfficePreview;
