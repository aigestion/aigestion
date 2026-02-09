import { motion } from 'framer-motion';
import { Brain, Cpu, Globe, Shield, Sparkles, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { DanielaWebsite } from '../components/DanielaWebsite';

export const DanielaDemo: React.FC = () => {
  const [demoMode, setDemoMode] = useState<'conversation' | 'features' | 'analytics'>(
    'conversation',
  );
  const [variant, setVariant] = useState<'widget' | 'assistant' | 'advisor'>('assistant');
  const [context, setContext] = useState<'homepage' | 'contact' | 'pricing' | 'about'>('homepage');

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Inteligencia Emocional',
      description: 'Análisis en tiempo real del estado emocional del cliente',
      color: 'from-nexus-cyan to-blue-500',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Respuestas Contextuales',
      description: 'Memoria conversacional y adaptación al contexto',
      color: 'from-nexus-violet to-purple-500',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Acciones Proactivas',
      description: 'Sugerencias inteligentes basadas en la conversación',
      color: 'from-nexus-gold to-yellow-500',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Seguridad Total',
      description: 'Encriptación de extremo a extremo y privacidad garantizada',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multiidioma',
      description: 'Soporte para español, inglés y más idiomas',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Procesamiento Neural',
      description: 'Modelos de IA de última generación',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const stats = [
    { label: 'Conversaciones', value: '12,847', trend: '+23%' },
    { label: 'Satisfacción', value: '98.2%', trend: '+5%' },
    { label: 'Respuesta Rápida', value: '<200ms', trend: '-15%' },
    { label: 'Precisión', value: '99.7%', trend: '+2%' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-cyan/10 via-transparent to-nexus-violet/10" />
        <div className="relative container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-orbitron font-black mb-4 bg-gradient-to-r from-nexus-cyan-glow to-nexus-violet-glow bg-clip-text text-transparent">
              DANIELA
            </h1>
            <p className="text-xl text-nexus-silver/80 mb-8">
              La experiencia futurista de conversación IA que transformará tu negocio
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDemoMode('conversation')}
                className={`px-8 py-3 rounded-full font-orbitron font-black tracking-wider transition-all ${
                  demoMode === 'conversation'
                    ? 'bg-nexus-cyan-glow text-black'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                PROBAR CONVERSACIÓN
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDemoMode('features')}
                className={`px-8 py-3 rounded-full font-orbitron font-black tracking-wider transition-all ${
                  demoMode === 'features'
                    ? 'bg-nexus-violet-glow text-black'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                CARACTERÍSTICAS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDemoMode('analytics')}
                className={`px-8 py-3 rounded-full font-orbitron font-black tracking-wider transition-all ${
                  demoMode === 'analytics'
                    ? 'bg-nexus-gold text-black'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                ANALÍTICA
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Conversation Demo */}
        {demoMode === 'conversation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-orbitron font-black mb-4">
                Conversa con <span className="text-nexus-cyan-glow">Daniela</span>
              </h2>
              <p className="text-nexus-silver/60 mb-6">
                Experimenta una conversación natural con análisis emocional en tiempo real
              </p>

              {/* Variant and Context Selectors */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex gap-2">
                  <span className="text-sm text-nexus-silver/60 py-2">Variante:</span>
                  {(['widget', 'assistant', 'advisor'] as const).map((v) => (
                    <motion.button
                      key={v}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVariant(v)}
                      className={`px-4 py-2 rounded-lg text-sm font-orbitron transition-all ${
                        variant === v
                          ? 'bg-nexus-cyan-glow text-black'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <span className="text-sm text-nexus-silver/60 py-2">Contexto:</span>
                  {(['homepage', 'contact', 'pricing', 'about'] as const).map((c) => (
                    <motion.button
                      key={c}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setContext(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-orbitron transition-all ${
                        context === c
                          ? 'bg-nexus-violet-glow text-black'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="relative">
                  {variant === 'widget' && (
                    <div className="h-96 relative">
                      <DanielaWebsite variant="widget" context={context} />
                    </div>
                  )}
                  {variant === 'assistant' && (
                    <div className="h-96">
                      <DanielaWebsite variant="assistant" context={context} />
                    </div>
                  )}
                  {variant === 'advisor' && (
                    <div className="h-96">
                      <DanielaWebsite variant="advisor" context={context} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Variant Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-cyan-glow">
                    CONFIGURACIÓN ACTUAL
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-nexus-silver/60">Variante</span>
                      <span className="text-sm font-orbitron font-black text-white">
                        {variant.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-nexus-silver/60">Contexto</span>
                      <span className="text-sm font-orbitron font-black text-white">
                        {context.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feature Description */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-violet-glow">
                    CARACTERÍSTICAS
                  </h3>
                  <div className="space-y-3 text-sm text-nexus-silver/60">
                    {variant === 'widget' && (
                      <p>
                        Widget flotante ideal para esquinas de sitios web. Minimalista y expansible.
                      </p>
                    )}
                    {variant === 'assistant' && (
                      <p>
                        Asistente completo con panel de conversación y estado del sistema en tiempo
                        real.
                      </p>
                    )}
                    {variant === 'advisor' && (
                      <p>Asesor integrado con capacidades avanzadas y análisis contextual.</p>
                    )}
                  </div>
                </div>

                {/* Context Description */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-gold">CONTEXTO</h3>
                  <div className="space-y-3 text-sm text-nexus-silver/60">
                    {context === 'homepage' && (
                      <p>
                        Diseñado para la página principal con enfoque en servicios y tecnología.
                      </p>
                    )}
                    {context === 'contact' && (
                      <p>Orientado a generar conexiones y agendar reuniones con expertos.</p>
                    )}
                    {context === 'pricing' && (
                      <p>Especializado en planes, precios y cálculo de ROI para clientes.</p>
                    )}
                    {context === 'about' && (
                      <p>Enfocado en mostrar la historia, misión y tecnología de la empresa.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Demo */}
        {demoMode === 'features' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-orbitron font-black mb-4">
                Características <span className="text-nexus-violet-glow">Futuristas</span>
              </h2>
              <p className="text-xl text-nexus-silver/60">
                Tecnología de vanguardia para una experiencia única
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                    }}
                  />
                  <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-orbitron font-bold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-nexus-silver/60 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics Demo */}
        {demoMode === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-orbitron font-black mb-4">
                Analítica en <span className="text-nexus-gold">Tiempo Real</span>
              </h2>
              <p className="text-xl text-nexus-silver/60">
                Métricas e insights del rendimiento de Daniela
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className="text-3xl font-orbitron font-black text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-nexus-silver/60 mb-2">{stat.label}</div>
                  <div className="text-xs font-orbitron text-green-400">{stat.trend}</div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-orbitron font-bold mb-6 text-nexus-gold">
                Rendimiento de Conversaciones
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-nexus-gold/20 to-nexus-gold/5 border border-nexus-gold/30 flex items-center justify-center">
                    <Zap className="w-16 h-16 text-nexus-gold" />
                  </div>
                  <p className="text-nexus-silver/60">
                    Sistema de análisis emocional en tiempo real
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
