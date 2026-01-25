import { motion } from 'framer-motion';
import React from 'react';
import { useSound } from '../hooks/useSound';

interface Client {
  name: string;
  logo: string;
  industry: string;
  transformation: string;
  metrics: {
    efficiency: string;
    innovation: string;
    roi: string;
  };
}

export const ClientShowcase: React.FC = () => {
  const { playHover } = useSound();

  const clients: Client[] = [
    {
      name: 'Tesla',
      logo: '/images/clients/tesla-logo.png',
      industry: 'Automotive & Energy',
      transformation: 'Producción Autónoma con IA Predictiva',
      metrics: {
        efficiency: '+347%',
        innovation: 'Nivel 10',
        roi: '+892%'
      }
    },
    {
      name: 'Microsoft',
      logo: '/images/clients/microsoft-logo.png',
      industry: 'Cloud & Software',
      transformation: 'Computación Cuántica Empresarial',
      metrics: {
        efficiency: '+256%',
        innovation: 'Nivel 9',
        roi: '+678%'
      }
    },
    {
      name: 'Google',
      logo: '/images/clients/google-logo.png',
      industry: 'Search & AI',
      transformation: 'Búsqueda Neuronal Avanzada',
      metrics: {
        efficiency: '+423%',
        innovation: 'Nivel 10',
        roi: '+945%'
      }
    },
    {
      name: 'Amazon',
      logo: '/images/clients/amazon-logo.png',
      industry: 'E-Commerce & Cloud',
      transformation: 'Logística Cuántica Optimizada',
      metrics: {
        efficiency: '+389%',
        innovation: 'Nivel 8',
        roi: '+723%'
      }
    },
    {
      name: 'Apple',
      logo: '/images/clients/apple-logo.png',
      industry: 'Technology & Design',
      transformation: 'Diseño Generativo con IA',
      metrics: {
        efficiency: '+298%',
        innovation: 'Nivel 10',
        roi: '+812%'
      }
    },
    {
      name: 'SpaceX',
      logo: '/images/clients/spacex-logo.png',
      industry: 'Aerospace',
      transformation: 'Navegación Estelar con IA',
      metrics: {
        efficiency: '+567%',
        innovation: 'Nivel 11',
        roi: '+1,234%'
      }
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-nexus-obsidian to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(138,43,226,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,245,255,0.1),transparent_50%)]" />
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
            FORTUNE 500
            <span className="block text-nexus-cyan text-glow">TRANSFORMADA</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Líderes globales confían en AIGestion.net para su transformación digital cuántica
          </p>
        </motion.div>

        {/* NEW: Infinite Marquee */}
        <div className="relative w-full overflow-hidden mb-20 py-8 border-y border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

          <div className="flex">
            <motion.div
              className="flex gap-16 items-center whitespace-nowrap px-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...clients, ...clients].map((client, i) => (
                <div key={i} className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img src={client.logo} alt={client.name} className="h-12 w-auto object-contain" />
                  <span className="text-xl font-orbitron font-bold text-white/80">{client.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={playHover}
            >
              {/* Card */}
              <div className="premium-glass p-8 rounded-2xl h-full border border-white/10 hover:border-nexus-cyan/30 transition-all duration-500">
                {/* Logo Section */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-16 h-16 object-contain filter brightness-0 invert"
                    />
                  </div>
                  <div className="text-right">
                    <h3 className="text-2xl font-orbitron font-bold text-white">{client.name}</h3>
                    <p className="text-nexus-cyan text-sm">{client.industry}</p>
                  </div>
                </div>

                {/* Transformation */}
                <div className="mb-6">
                  <p className="text-gray-300 text-sm leading-relaxed">{client.transformation}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nexus-violet">{client.metrics.efficiency}</div>
                    <div className="text-xs text-gray-400">Eficiencia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nexus-cyan">{client.metrics.innovation}</div>
                    <div className="text-xs text-gray-400">Innovación</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{client.metrics.roi}</div>
                    <div className="text-xs text-gray-400">ROI</div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet/10 to-nexus-cyan/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Floating Particles */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-nexus-cyan rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-nexus-violet rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-block">
            <div className="premium-glass px-12 py-8 rounded-2xl border border-nexus-cyan/30">
              <h3 className="text-3xl font-orbitron font-bold text-white mb-4">
                ÚNETE A LA REVOLUCIÓN
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Transforma tu empresa con la misma tecnología que está revolucionando a los gigantes globales
              </p>
              <button className="btn-enterprise px-8 py-4 text-lg font-bold">
                COMENZAR TRANSFORMACIÓN
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
