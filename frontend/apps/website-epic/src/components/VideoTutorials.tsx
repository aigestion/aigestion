import { motion } from 'framer-motion';
import React from 'react';

const videos = [
  {
    title: 'Inducción Soberana',
    description: 'Aprende a desplegar tu arquitectura Nexus desde cero.',
    url: '/videos/tutorial_onboarding.mp4',
    professional: true,
  },

  {
    title: 'Automatización Avanzada',
    description: 'Gestión de flujos de trabajo con Daniela IA.',
    url: '/videos/tutorial_features.mp4',
    professional: true,
  },
  {
    title: 'Casos y Demos',
    query: 'aigestiontiene demo tutorial',
    professional: false,
  },
];

export const VideoTutorials: React.FC = () => (
  <section id="tutoriales" className="py-32 bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-[#020205]" />
    <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] opacity-5 bg-repeat" />
    <div className="absolute inset-0 bg-radial-at-top from-nexus-cyan/20 via-transparent to-transparent opacity-30" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-4">
          TUTORIALES <span className="text-nexus-cyan text-glow">EN VIDEO</span>
        </h2>
        <p className="text-lg text-nexus-silver/70 max-w-3xl mx-auto">
          Aprende paso a paso con el canal oficial de AIGestion.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {videos.map(video => (
          <div
            key={video.title}
            className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-nexus-cyan/30 transition-all group"
          >
            <div className="aspect-video bg-black relative">
              {video.professional ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="/images/nexus/video_placeholder.png"
                >
                  <source src={video.url} type="video/mp4" />
                  Tu navegador no soporta videos.
                </video>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(video.query || '')}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-nexus-cyan transition-colors">
                  {video.title}
                </h3>
                {video.professional && (
                  <span className="text-[8px] font-mono border border-nexus-cyan/30 px-2 py-0.5 rounded text-nexus-cyan">
                    PROFESIONAL
                  </span>
                )}
              </div>
              <p className="text-sm text-nexus-silver/70 leading-relaxed">
                {video.description || 'Contenido oficial de alta fidelidad para la gestión Nexus.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href="https://www.youtube.com/@aigestiontiene"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/30 text-nexus-cyan-glow hover:bg-nexus-cyan/20 transition-all font-orbitron text-[10px] tracking-[0.2em] uppercase"
        >
          Visitar canal AIGestion
        </a>
      </div>
    </div>
  </section>
);
