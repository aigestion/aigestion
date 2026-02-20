import { motion } from 'framer-motion';
import React from 'react';
import { useSound } from '../hooks/useSound';
import { Car, HeartPulse, ShoppingBag, Utensils, TrendingUp } from 'lucide-react';

interface CaseStudy {
  title: string;
  icon: any;
  business: string;
  result: string;
  stats: {
    label: string;
    value: string;
    color: string;
  }[];
}

export const ClientShowcase: React.FC = () => {
  const { playHover } = useSound();

  const cases: CaseStudy[] = [
    {
      title: 'Ventas Automáticas',
      icon: Car,
      business: 'Concesionario de Coches',
      result:
        'Daniela atiende a los clientes por WhatsApp, les enseña fotos de los coches y cierra citas para probarlos. ¡Venden más incluso cuando duermen!',
      stats: [
        { label: 'Citas', value: '+50%', color: 'text-nexus-cyan' },
        { label: 'Ventas', value: '+20%', color: 'text-nexus-violet' },
        { label: 'Ahorro', value: 'Mucho', color: 'text-green-400' },
      ],
    },
    {
      title: 'Citas sin Esperas',
      icon: HeartPulse,
      business: 'Clínica de Salud',
      result:
        'Se acabaron las llamadas perdidas. El sistema organiza todas las citas de los pacientes solo, sin que nadie tenga que coger el teléfono.',
      stats: [
        { label: 'Tiempo', value: '-80%', color: 'text-nexus-cyan' },
        { label: 'Felicidad', value: '100%', color: 'text-nexus-violet' },
        { label: 'Errores', value: '0', color: 'text-red-400' },
      ],
    },
    {
      title: 'Tu Tienda Lista',
      icon: ShoppingBag,
      business: 'Tienda de Ropa Online',
      result:
        'Ayuda a los clientes a elegir su talla y responde dudas sobre los envíos al instante. Es como tener la mejor dependienta 24 horas.',
      stats: [
        { label: 'Dudas', value: 'Todas', color: 'text-nexus-cyan' },
        { label: 'Clientes', value: '+30%', color: 'text-nexus-violet' },
        { label: 'Devolución', value: '-15%', color: 'text-green-400' },
      ],
    },
    {
      title: 'Reservas Llenas',
      icon: Utensils,
      business: 'Restaurante Famoso',
      result:
        'Gestiona las mesas y las alergias de los clientes de forma perfecta. El restaurante siempre está lleno y los camareros más tranquilos.',
      stats: [
        { label: 'Mesas', value: 'Llenas', color: 'text-nexus-cyan' },
        { label: 'Acierto', value: 'Top', color: 'text-nexus-violet' },
        { label: 'Paz', value: 'Total', color: 'text-green-400' },
      ],
    },
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
            HISTORIAS DE
            <span className="block text-nexus-cyan text-glow uppercase">ÉXITO REAL</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Mira cómo ayudamos a negocios de todo tipo a ser mejores y más rápidos
          </p>
        </motion.div>

        {/* Infinite Marquee - Simplified */}
        <div className="relative w-full overflow-hidden mb-20 py-8 border-y border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

          <div className="flex">
            <motion.div
              className="flex gap-24 items-center whitespace-nowrap px-8"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            >
              {[
                'Concesionarios',
                'Clínicas',
                'Restaurantes',
                'Tiendas',
                'Oficinas',
                'Fábricas',
              ].map((type, i) => (
                <div key={i} className="flex items-center gap-4 opacity-30">
                  <TrendingUp className="w-6 h-6 text-nexus-cyan" />
                  <span className="text-2xl font-orbitron font-bold text-white/60 uppercase tracking-widest">
                    {type}
                  </span>
                </div>
              ))}
              {/* Duplicate for infinite effect */}
              {[
                'Concesionarios',
                'Clínicas',
                'Restaurantes',
                'Tiendas',
                'Oficinas',
                'Fábricas',
              ].map((type, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-4 opacity-30">
                  <TrendingUp className="w-6 h-6 text-nexus-cyan" />
                  <span className="text-2xl font-orbitron font-bold text-white/60 uppercase tracking-widest">
                    {type}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {cases.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.business}
                className="group relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={playHover}
              >
                <div className="premium-glass p-10 rounded-[2rem] h-full border border-white/10 hover:border-nexus-cyan/30 transition-all duration-500">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-nexus-violet/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-orbitron font-bold text-white">{item.title}</h3>
                      <p className="text-nexus-cyan text-xs uppercase tracking-widest">
                        {item.business}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed mb-8 italic">
                    "{item.result}"
                  </p>

                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    {item.stats.map(stat => (
                      <div key={stat.label} className="text-center">
                        <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
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
            <div className="premium-glass px-12 py-10 rounded-[3rem] border border-nexus-cyan/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-nexus-violet/10 to-nexus-cyan/10 pointer-events-none" />
              <h3 className="text-3xl font-orbitron font-bold text-white mb-4">
                ¿TU NEGOCIO ES EL SIGUIENTE?
              </h3>
              <p className="text-gray-300 mb-10 max-w-md mx-auto">
                No importa el tamaño de tu empresa. La inteligencia de Daniela te ayudará a crecer
                sin esfuerzo.
              </p>
              <button className="btn-enterprise px-12 py-5 text-xl font-orbitron font-black tracking-widest rounded-full">
                ¡EMPEZAR YA!
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
