import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Users,
  Monitor,
  Brain,
  Zap,
  Globe,
  Shield,
  Layers,
  DraftingCompass,
  ChevronLeft,
  CheckCircle2,
  Building2,
  Video,
  Mic,
  Palette,
  Sparkles,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────
// 3D CSS Building Component
// ─────────────────────────────────────────────
const Office3DBuilding: React.FC = () => {
  const [tick, setTick] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const autoRotate = (tick * 0.4) % 360;
  const rotateY = hovering ? autoRotate : autoRotate;

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ perspective: '1000px', minHeight: 340 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        animate={{ rotateY: autoRotate }}
        transition={{ duration: 0, ease: 'linear' }}
        style={{ transformStyle: 'preserve-3d', width: 220, height: 280 }}
      >
        {/* Main building body - front */}
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 280,
            background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)',
            border: '1px solid rgba(0,245,255,0.3)',
            boxShadow: '0 0 40px rgba(0,245,255,0.15), inset 0 0 60px rgba(0,245,255,0.05)',
            transform: 'translateZ(55px)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Windows grid - front */}
          <div
            style={{
              padding: '24px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 6,
            }}
          >
            {Array.from({ length: 32 }).map((_, i) => {
              const lit = (i + tick) % 7 < 5;
              return (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: lit
                      ? `rgba(0,245,255,${0.3 + (i % 3) * 0.15})`
                      : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(0,245,255,0.1)',
                    boxShadow: lit ? '0 0 6px rgba(0,245,255,0.3)' : 'none',
                    transition: 'all 0.4s ease',
                  }}
                />
              );
            })}
          </div>
          {/* Logo bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(0,245,255,0.8)',
              textShadow: '0 0 10px rgba(0,245,255,0.6)',
            }}
          >
            AIGESTION HQ
          </div>
        </div>

        {/* Right face */}
        <div
          style={{
            position: 'absolute',
            width: 110,
            height: 280,
            background: 'linear-gradient(180deg, #060f1e 0%, #091829 100%)',
            border: '1px solid rgba(0,245,255,0.15)',
            transform: 'rotateY(90deg) translateZ(55px)',
            left: 110,
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            style={{
              padding: '24px 10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gap: 5,
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const lit = (i * 3 + tick) % 9 < 6;
              return (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: lit ? 'rgba(138,43,226,0.25)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(138,43,226,0.1)',
                    boxShadow: lit ? '0 0 5px rgba(138,43,226,0.2)' : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Left face */}
        <div
          style={{
            position: 'absolute',
            width: 110,
            height: 280,
            background: 'linear-gradient(180deg, #060f1e 0%, #091829 100%)',
            border: '1px solid rgba(0,245,255,0.15)',
            transform: 'rotateY(-90deg) translateZ(55px)',
            left: 0,
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            style={{
              padding: '24px 10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gap: 5,
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const lit = (i * 2 + tick + 4) % 8 < 5;
              return (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: lit ? 'rgba(0,245,255,0.2)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(0,245,255,0.08)',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Back face */}
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 280,
            background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)',
            border: '1px solid rgba(0,245,255,0.1)',
            transform: 'rotateY(180deg) translateZ(55px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Top face / roof */}
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 110,
            background:
              'linear-gradient(135deg, rgba(0,245,255,0.15) 0%, rgba(0,245,255,0.05) 100%)',
            border: '1px solid rgba(0,245,255,0.25)',
            boxShadow: '0 0 20px rgba(0,245,255,0.1)',
            transform: 'rotateX(90deg) translateZ(0px)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Antenna */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 3,
              height: 30,
              background: 'rgba(0,245,255,0.8)',
              boxShadow: '0 0 10px rgba(0,245,255,0.6)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'rgba(0,245,255,1)',
                boxShadow: '0 0 15px rgba(0,245,255,0.9)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Ground glow shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          width: 180,
          height: 20,
          background: 'radial-gradient(ellipse, rgba(0,245,255,0.2) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Coordinate badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(0,245,255,0.3)',
          borderRadius: 6,
          padding: '4px 10px',
          fontFamily: 'monospace',
          fontSize: 11,
          color: 'rgba(0,245,255,0.8)',
          letterSpacing: '0.1em',
        }}
      >
        DCL: -51, 114
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const FEATURES = [
  {
    icon: Video,
    title: 'Reuniones Inmersivas',
    desc: 'Sala de juntas virtual con avatares personalizables. Habla, comparte pantalla y colabora como si estuvieras físicamente presente.',
    color: '#00f5ff',
  },
  {
    icon: Brain,
    title: 'Daniela IA en Vivo',
    desc: 'Tu asistente de inteligencia artificial integrada en la oficina. Responde preguntas, gestiona tareas y ayuda a tus clientes 24/7.',
    color: '#8a2be2',
  },
  {
    icon: Monitor,
    title: 'Dashboard en Tiempo Real',
    desc: 'Paredes de datos holográficas que muestran tus métricas de negocio en directo, conectadas a tus sistemas AIGestion.',
    color: '#00ff88',
  },
  {
    icon: Globe,
    title: 'Acceso Global',
    desc: 'Accesible desde cualquier lugar del mundo. No requiere hardware especial: solo un navegador. Compatible con VR.',
    color: '#ff6b6b',
  },
  {
    icon: Palette,
    title: 'Diseño Personalizado',
    desc: 'Tu oficina refleja tu marca. Colores, logotipo, layout personalizado. Actualizaciones sin límite durante tu suscripción.',
    color: '#ffd93d',
  },
  {
    icon: Shield,
    title: 'Blockchain Seguro',
    desc: 'La propiedad de tu espacio está registrada en la blockchain de Decentraland, garantizando titularidad y permanencia.',
    color: '#4ecdc4',
  },
  {
    icon: Mic,
    title: 'Voz y Chat',
    desc: 'Sistema de voz espacial: los sonidos se escuchan más fuerte cuando estás cerca, igual que en la vida real.',
    color: '#a29bfe',
  },
  {
    icon: Sparkles,
    title: 'Efectos Visuales IA',
    desc: 'Partículas cuánticas, hologramas y ambientes dinámicos que se adaptan a la hora del día y la actividad en la oficina.',
    color: '#fd79a8',
  },
];

const SANDBOX_PLANS = [
  {
    name: 'Parcela Standard',
    size: '1×1',
    sqm: '96 m² virtuales',
    price: 99,
    period: '/mes',
    color: '#8a2be2',
    features: [
      'Tienda o showroom básico',
      'Hasta 10 visitantes simultáneos',
      'Plantilla disponible en 48h',
      'Soporte técnico incluido',
    ],
    badge: null,
  },
  {
    name: 'Estate Premium',
    size: '3×3',
    sqm: '864 m² virtuales',
    price: 290,
    period: '/mes',
    color: '#00f5ff',
    features: [
      'Espacio grande para eventos',
      'Visitantes ilimitados',
      'Diseño a medida incluido',
      'Integración con CRM AIGestion',
      'Daniela IA en tu parcela',
    ],
    badge: 'MÁS POPULAR',
  },
  {
    name: 'Flagship Experience',
    size: '5×5+',
    sqm: 'Personalizado',
    price: null,
    period: '',
    color: '#ffd93d',
    features: [
      'Arquitectura completamente única',
      'Eventos virtuales hasta 500 personas',
      'NFT gallery integrada',
      'Soporte prioritario 24/7',
      'Acceso a todas las integraciones',
    ],
    badge: 'ENTERPRISE',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Reserva tu espacio',
    desc: 'Contáctanos para seleccionar la parcela y plan que mejor se adapta a tu empresa.',
  },
  {
    step: '02',
    title: 'Configuramos tu oficina',
    desc: 'Nuestro equipo construye y personaliza tu espacio en 5-10 días laborables.',
  },
  {
    step: '03',
    title: 'Entramos al metaverso',
    desc: 'Te entregamos tu oficina y te enseñamos a visitarla, gestionarla y sacarle el máximo partido.',
  },
  {
    step: '04',
    title: 'Creces sin límites',
    desc: 'Amplía tu presencia virtual, añade nuevas parcelas o conecta más servicios AIGestion cuando quieras.',
  },
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const VirtualOfficePreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  const [activeTab, setActiveTab] = useState<'decentraland' | 'sandbox'>('decentraland');

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-nexus-obsidian text-white relative overflow-x-hidden"
    >
      {/* ── Back Link ── */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/#metaverse"
          className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-sm text-white/70 hover:text-white hover:border-white/30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Volver
        </Link>
      </div>

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background grid & glow */}
        <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] bg-center opacity-30 [mask-image:radial-gradient(80%_80%_at_center,white,transparent)]" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nexus-cyan/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-nexus-violet/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full relative z-10"
        >
          {/* ── Left: Text ── */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-nexus-cyan/20 rounded-full bg-nexus-cyan/5 backdrop-blur-md">
                <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse" />
                <span className="text-xs font-orbitron tracking-[0.3em] text-nexus-cyan/80 uppercase">
                  Decentraland · Parcela -51, 114
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-orbitron font-black leading-tight">
                <span className="text-white">TU OFICINA</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan via-white to-nexus-violet">
                  EN EL FUTURO
                </span>
              </h1>

              <p className="text-lg text-white/60 leading-relaxed mt-6 max-w-lg">
                AIGestion tiene su sede global en{' '}
                <strong className="text-white">Decentraland</strong> — uno de los mundos virtuales
                más grandes del planeta. Un edificio de oficinas completamente funcional, visitable
                desde cualquier dispositivo, sin cuentas ni descargas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle2 className="w-4 h-4 text-nexus-cyan" />
                Sin instalación
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle2 className="w-4 h-4 text-nexus-cyan" />
                Compatible con VR y móvil
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle2 className="w-4 h-4 text-nexus-cyan" />
                20+ sistemas activos
              </div>
            </motion.div>

            {/* Main CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <a
                href="https://play.decentraland.org/?position=-51%2C114&island=I0"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-nexus-cyan to-nexus-cyan/80 text-black font-bold font-orbitron tracking-widest text-sm rounded-sm hover:shadow-[0_0_40px_rgba(0,245,255,0.5)] hover:scale-105 transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
                IR A LA OFICINA
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <a
                href="https://play.decentraland.org/?position=-51%2C114&island=I0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/40 hover:text-white/80 transition-colors flex items-center gap-1 font-mono"
              >
                play.decentraland.org <ArrowUpRight className="w-3 h-3" />
              </a>
            </motion.div>
          </div>

          {/* ── Right: 3D Building ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-nexus-cyan/10 blur-[80px] rounded-full" />
            <div
              className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden"
              style={{ minHeight: 380 }}
            >
              {/* Scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.015) 2px, rgba(0,245,255,0.015) 4px)',
                }}
              />
              <Office3DBuilding />

              {/* Status bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex gap-2">
                  {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((c, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                  ))}
                </div>
                <div className="text-[10px] font-mono text-white/30 tracking-widest">
                  AIGESTION · NEXTGEN OFFICE
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-green-400">LIVE</span>
                </div>
              </div>
            </div>

            {/* Stats strip below */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Sistemas Activos', value: '20+' },
                { label: 'Visitantes Hoy', value: '∞' },
                { label: 'Uptime', value: '99.9%' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="text-center p-3 rounded-xl bg-white/3 border border-white/5"
                >
                  <div className="text-lg font-orbitron font-bold text-nexus-cyan">{s.value}</div>
                  <div className="text-[10px] text-white/40 tracking-widest">
                    {s.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <div className="text-[10px] font-mono tracking-widest">SCROLL PARA EXPLORAR</div>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ─────────────── WHAT IS DECENTRALAND ─────────────── */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-white/10 rounded-full bg-white/5">
              <Globe className="w-4 h-4 text-nexus-cyan" />
              <span className="text-xs font-orbitron tracking-[0.3em] text-white/60">
                ¿QUÉ ES EL METAVERSO?
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-6">
              Como internet, pero en <span className="text-nexus-cyan">3D</span>
            </h2>
            <p className="text-lg text-white/50 max-w-3xl mx-auto leading-relaxed">
              Decentraland es un mundo virtual permanente que existe en internet. Puedes caminar por
              él, entrar a edificios, hablar con personas reales y hacer negocios — todo desde tu
              navegador. <br />
              <br />
              <strong className="text-white">La oficina de AIGestion</strong> ya está construida en
              las coordenadas <code className="text-nexus-cyan">-51, 114</code>. Al hacer clic en
              "Ir a la Oficina", tu navegador te lleva directamente a ella — como cuando abres
              Google Maps pero en 3D.
            </p>
          </motion.div>

          {/* Analogy cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: '🌐',
                title: 'Como una página web',
                desc: 'Tiene una dirección permanente (coordenadas -51, 114). Siempre estará ahí, visitable 24/7.',
                color: 'from-blue-500/10 to-cyan-500/10',
              },
              {
                icon: '🏢',
                title: 'Como una oficina real',
                desc: 'Tiene recepción, salas de reuniones, áreas de trabajo y hasta una asistente de IA. Pero sin alquiler físico.',
                color: 'from-violet-500/10 to-purple-500/10',
              },
              {
                icon: '🎮',
                title: 'Fácil como un juego',
                desc: 'Te mueves con el ratón y el teclado. No necesitas experiencia previa. En 30 segundos ya estás dentro.',
                color: 'from-green-500/10 to-emerald-500/10',
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-2xl bg-gradient-to-br ${c.color} border border-white/5 hover:border-white/20 transition-all`}
              >
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="font-orbitron font-bold text-white mb-3">{c.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexus-violet/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-4">
              Todo lo que encontrarás
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              La oficina virtual de AIGestion tiene 20+ sistemas activos. Aquí los más importantes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-white/15 transition-all group cursor-default"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-orbitron font-bold text-sm text-white mb-2">{f.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── VIRTUAL REAL ESTATE (TABS) ─────────────── */}
      <section className="py-32 relative" id="real-estate">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-nexus-violet/30 rounded-full bg-nexus-violet/5">
              <Layers className="w-4 h-4 text-nexus-violet" />
              <span className="text-xs font-orbitron tracking-[0.3em] text-nexus-violet/80">
                INMOBILIARIO VIRTUAL
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-4">
              ¿Quieres tu propia parcela?
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
              Hemos reservado espacios estratégicos en{' '}
              <strong className="text-white">The Sandbox</strong> — el otro gran metaverso — para
              que tu empresa pueda estar presente en el metaverso desde hoy mismo. Modelo de
              alquiler flexible, sin necesidad de comprar LAND.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-full">
              {(['decentraland', 'sandbox'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-xs font-orbitron tracking-widest uppercase transition-all ${
                    activeTab === tab
                      ? 'bg-white/15 text-white shadow-lg'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab === 'decentraland' ? 'Decentraland' : 'The Sandbox'}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'decentraland' ? (
              <motion.div
                key="dcl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-nexus-cyan" />
                    <span className="font-orbitron tracking-widest text-sm text-nexus-cyan">
                      COORD: -51, 114
                    </span>
                  </div>
                  <h3 className="text-3xl font-orbitron font-bold mb-4">Sede Central AIGestion</h3>
                  <p className="text-white/50 leading-relaxed mb-6">
                    Nuestra oficina existe permanentemente en Decentraland. Visítala ahora mismo —
                    está abierta 24/7, completamente gratuita para visitar, sin registro.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Arquitectura cuántica proceduralmente generada',
                      'Auditorio Neural para eventos de 500+ personas',
                      'Galería NFT e integración blockchain',
                      'Salas de reunión privadas encriptadas',
                      'Daniela IA en tiempo real dentro del espacio',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-nexus-cyan shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://play.decentraland.org/?position=-51%2C114&island=I0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-nexus-cyan text-black font-bold font-orbitron tracking-widest text-sm rounded-sm hover:bg-nexus-cyan/80 hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all"
                  >
                    <Building2 className="w-4 h-4" />
                    IR A LA OFICINA AHORA
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/50">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2837.0!2d2.154007!3d41.390205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIzJzI0LjciTiAywrA5JzE0LjQiRQ!5e0!3m2!1ses!2ses!4v1611583224!5m2!1ses!2ses"
                    className="w-full h-full opacity-0 absolute"
                    title="map"
                  />
                  {/* Custom visual since we can't embed Decentraland */}
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative z-10 p-8">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                    <div className="relative z-10 text-center">
                      <div className="text-5xl mb-4">🌐</div>
                      <p className="font-orbitron text-sm text-white/60 mb-2">
                        Accede desde tu navegador
                      </p>
                      <code className="text-nexus-cyan text-xs">
                        play.decentraland.org/?position=-51,114
                      </code>
                    </div>
                    <a
                      href="https://play.decentraland.org/?position=-51%2C114&island=I0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 flex items-center gap-2 px-6 py-3 bg-nexus-cyan/20 border border-nexus-cyan/40 text-nexus-cyan text-sm font-orbitron tracking-widest hover:bg-nexus-cyan/30 transition-all"
                    >
                      ABRIR EN NUEVA PESTAÑA <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sandbox"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-nexus-violet/10 border border-nexus-violet/30 rounded-full mb-6">
                    <MapPin className="w-4 h-4 text-nexus-violet" />
                    <span className="font-orbitron tracking-[0.15em] text-sm">
                      SANDBOX LAND: <span className="text-nexus-violet font-bold">(-141, 25)</span>
                    </span>
                    <a
                      href="https://www.sandbox.game/en/map/?x=-141&y=25"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-nexus-violet/20 hover:bg-nexus-violet/40 rounded-full transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-nexus-violet" />
                    </a>
                  </div>
                  <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
                    Parcelas estratégicas en The Sandbox con altísimo tráfico de usuarios. Modelo de{' '}
                    <strong className="text-white">alquiler mensual</strong> — sin necesidad de
                    comprar LAND. Soporte técnico completo incluido.
                  </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-6">
                  {SANDBOX_PLANS.map((plan, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative p-8 rounded-2xl bg-white/3 border transition-all hover:scale-[1.02] ${
                        plan.badge === 'MÁS POPULAR'
                          ? 'border-nexus-cyan/40 shadow-[0_0_30px_rgba(0,245,255,0.1)]'
                          : 'border-white/8 hover:border-white/20'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span
                            className="px-4 py-1 text-[10px] font-orbitron tracking-widest text-black font-bold rounded-full"
                            style={{ background: plan.color }}
                          >
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="mb-6">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="font-orbitron font-bold text-lg text-white">
                            {plan.name}
                          </span>
                        </div>
                        <div className="text-sm text-white/40">
                          {plan.size} · {plan.sqm}
                        </div>
                      </div>

                      <div className="mb-6">
                        {plan.price ? (
                          <div className="font-orbitron">
                            <span className="text-4xl font-black" style={{ color: plan.color }}>
                              €{plan.price}
                            </span>
                            <span className="text-white/30 text-sm">{plan.period}</span>
                          </div>
                        ) : (
                          <div
                            className="font-orbitron text-2xl font-black"
                            style={{ color: plan.color }}
                          >
                            Cotización
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2.5 mb-8">
                        {plan.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-white/50">
                            <Star
                              className="w-3 h-3 shrink-0 mt-0.5"
                              style={{ color: plan.color }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          const el = document.querySelector('#contact-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          else window.location.href = '/#contact';
                        }}
                        className="w-full py-3.5 text-xs font-orbitron tracking-widest border transition-all hover:scale-105"
                        style={{
                          borderColor: `${plan.color}40`,
                          color: plan.color,
                          background: `${plan.color}08`,
                        }}
                      >
                        {plan.price ? 'CONSULTAR DISPONIBILIDAD' : 'CONTACTAR'}
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-nexus-violet/5 border border-nexus-violet/20 text-center">
                  <p className="text-white/50 text-sm">
                    💡 <strong className="text-white">Sin compromisos.</strong> Puedes cancelar tu
                    alquiler en cualquier momento con 30 días de preaviso. Te ayudamos en todo el
                    proceso de instalación.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-4">Cómo funciona</h2>
            <p className="text-white/40 max-w-lg mx-auto">
              De cero a tu propia oficina virtual en 4 pasos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-nexus-cyan/30 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full border-2 border-nexus-cyan/30 bg-nexus-cyan/5 flex items-center justify-center mx-auto mb-5">
                    <span className="font-orbitron font-black text-nexus-cyan text-lg">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-orbitron font-bold text-sm text-white mb-2">{step.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── FINAL CTA ─────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet/20 via-transparent to-nexus-cyan/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nexus-cyan/5 blur-[150px] rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/20">
              <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse" />
              <span className="text-nexus-cyan text-xs font-orbitron tracking-[0.3em]">
                LA OFICINA ESTÁ ABIERTA AHORA
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6 leading-tight">
              ¿Listo para
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan to-nexus-violet">
                entrar?
              </span>
            </h2>

            <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto leading-relaxed">
              Solo un clic te separa. Tu navegador abrirá Decentraland directamente en las
              coordenadas de nuestra oficina. Funciona en Chrome, Firefox y Edge. No necesitas
              cuenta.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://play.decentraland.org/?position=-51%2C114&island=I0"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-nexus-cyan to-nexus-cyan/70 text-black font-black font-orbitron tracking-widest text-base rounded-sm hover:shadow-[0_0_60px_rgba(0,245,255,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Building2 className="w-6 h-6" />
                IR A LA OFICINA
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>

              <Link
                to="/"
                className="flex items-center gap-3 px-8 py-5 border border-white/15 text-white/60 hover:text-white hover:border-white/40 font-orbitron tracking-widest text-sm rounded-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                VOLVER AL INICIO
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-white/25 text-[11px] font-mono tracking-widest">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Conexión Segura
                HTTPS
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75" /> Sin
                Instalación
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150" />{' '}
                Gratis Visitar
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VirtualOfficePreview;
