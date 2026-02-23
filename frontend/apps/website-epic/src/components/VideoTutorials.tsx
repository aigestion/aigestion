import { motion } from 'framer-motion';
import React from 'react';

interface Video {
  title: string;
  subtitle: string;
  description: string;
  url?: string;
  icon: string;
  badge: string;
  badgeColor: string;
  comingSoon?: boolean;
}

const videos: Video[] = [
  {
    title: 'Sovereign Brain',
    subtitle: 'Arquitectura & Patrones Técnicos',
    description:
      'Descubre la arquitectura que impulsa AIGestion: InversifyJS, Swarm Engine, RAG con ChromaDB, y los patrones soberanos de alto rendimiento.',
    url: '/videos/notebooklm_sovereign_brain.mp4',
    icon: '🧠',
    badge: 'ARCHITECTURE',
    badgeColor: 'from-cyan-400 to-blue-500',
  },
  {
    title: 'Daniela Persona',
    subtitle: 'Voice Agent & AI Core',
    description:
      'Conoce a Daniela: agente de voz soberano con ElevenLabs, Twilio/Vapi y Gemini Pro. Identidad, lógica operativa e integración con Pixel 8.',
    url: '/videos/notebooklm_daniela_persona.mp4',
    icon: '🎙️',
    badge: 'AI AGENT',
    badgeColor: 'from-purple-400 to-pink-500',
  },
  {
    title: 'Onboarding Guide',
    subtitle: 'Primeros Pasos en el Nexus',
    description:
      'Guía rápida para configurar tu entorno God Mode y comenzar a orquestar misiones con el enjambre de agentes.',
    url: '/videos/tutorial_onboarding.mp4',
    icon: '🚀',
    badge: 'TUTORIAL',
    badgeColor: 'from-green-400 to-emerald-500',
  },
  {
    title: 'Master Features',
    subtitle: 'Capacidades Avanzadas',
    description:
      'Exploración profunda de las herramientas de percepción, navegación autónoma y el Sovereign Bridge.',
    url: '/videos/tutorial_features.mp4',
    icon: '✨',
    badge: 'FEATURES',
    badgeColor: 'from-blue-400 to-indigo-500',
  },
  {
    title: 'Mission Operations',
    subtitle: 'God Mode Runbook',
    description:
      'Pipelines de deploy, protocolos de mantenimiento y guías operativas del ecosistema AIGestion en modo soberano.',
    url: '/videos/notebooklm_sovereign_brain.mp4', // Fallback for now or placeholder
    icon: '🛰️',
    badge: 'OPS',
    badgeColor: 'from-amber-400 to-orange-500',
    comingSoon: true,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const VideoTutorials: React.FC = () => (
  <section id="tutoriales" className="py-32 bg-black relative overflow-hidden">
    {/* Background layers */}
    <div className="absolute inset-0 bg-[#020205]" />
    <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] opacity-5 bg-repeat" />
    <div className="absolute inset-0 bg-radial-at-top from-nexus-cyan/20 via-transparent to-transparent opacity-30" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Header */}
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-nexus-cyan/20 bg-nexus-cyan/5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse" />
          <span className="text-[10px] font-mono text-nexus-cyan tracking-[0.2em] uppercase">
            NotebookLM Presentations
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-4">
          SOVEREIGN <span className="text-nexus-cyan text-glow">KNOWLEDGE</span>
        </h2>
        <p className="text-lg text-nexus-silver/70 max-w-3xl mx-auto leading-relaxed">
          Presentaciones generadas por AI desde los cuadernos de conocimiento soberano de AIGestion.
          Cada video condensa la esencia de un pilar fundamental del ecosistema.
        </p>
      </motion.div>

      {/* Video Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {videos.map((video, i) => (
          <motion.div
            key={video.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-nexus-cyan/30 transition-all duration-500 group relative"
          >
            {/* Video / Coming Soon */}
            <div className="aspect-video bg-black/80 relative overflow-hidden">
              {video.comingSoon ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
                  <div className="text-5xl mb-4 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
                    {video.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400/60 animate-pulse" />
                    <span className="text-xs font-mono text-white/40 tracking-wider uppercase">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster="/images/nexus/video_placeholder.png"
                  >
                    <source src={video.url} type="video/mp4" />
                    Tu navegador no soporta videos.
                  </video>
                  {/* Hover shimmer on video area */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{video.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-nexus-cyan transition-colors duration-300">
                      {video.title}
                    </h3>
                    <p className="text-[11px] font-mono text-nexus-silver/50 tracking-wide">
                      {video.subtitle}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[8px] font-mono font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${video.badgeColor} text-black tracking-wider`}
                >
                  {video.badge}
                </span>
              </div>

              <p className="text-sm text-nexus-silver/60 leading-relaxed">
                {video.description}
              </p>

              {/* Bottom accent line */}
              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-nexus-cyan/30 transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <a
          href="https://www.youtube.com/@aigestiontiene"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/30 text-nexus-cyan hover:bg-nexus-cyan/20 transition-all duration-300 font-orbitron text-[10px] tracking-[0.2em] uppercase group"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Canal AIGestion.net
        </a>
      </div>
    </div>
  </section>
);
