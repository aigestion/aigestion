import { motion } from 'framer-motion';
import { ArrowRight, Twitter, Linkedin, Youtube,  } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const Footer: React.FC = () => {
  const { setIsContactModalOpen } = useAppContext();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'LO QUE HACEMOS',
      links: [
        { name: 'Ayuda inteligente', href: '#' },
        { name: 'Control de tus datos', href: '#' },
        { name: 'Organización total', href: '#' },
        { name: 'Seguridad máxima', href: '#' },
      ],
    },
    {
      title: 'NUESTRA TECNOLOGÍA',
      links: [
        { name: 'Centro de Control', href: '#' },
        { name: 'Asistente Daniela', href: '#' },
        { name: 'Grupos de Trabajo', href: '#' },
        { name: 'Conexión Segura', href: '#' },
      ],
    },
    {
      title: 'AYUDA Y MÁS',
      links: [
        { name: 'Guías paso a paso', href: '#' },
        { name: 'Acceso directo', href: '#' },
        { name: 'Preguntas comunes', href: '#' },
        { name: 'Nuestra historia', href: '#' },
      ],
    },
  ];

  return (
    <footer className="relative py-32 bg-nexus-obsidian border-t border-nexus-cyan/10 overflow-hidden z-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-nexus-cyan/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nexus-violet/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan/30 to-transparent shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center bg-fixed opacity-5 [mask-image:linear-gradient(0deg,white,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer flex items-center gap-4"
            >
              <div className="w-12 h-12 border border-nexus-cyan/30 rounded-lg rotate-45 flex items-center justify-center group-hover:rotate-0 transition-transform duration-700 bg-nexus-obsidian-deep shadow-[0_0_20px_rgba(0,245,255,0.1)]">
                <div className="w-3 h-3 bg-nexus-cyan rounded-full animate-pulse shadow-[0_0_15px_rgba(0,245,255,0.8)]" />
              </div>
              <h3 className="font-orbitron font-black text-3xl tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                AIGESTION<span className="text-nexus-cyan font-extralight">.NET</span>
              </h3>
            </motion.div>

            <p className="text-nexus-silver/60 text-sm leading-relaxed max-w-md font-light">
              "Organizar tu vida no debería ser un trabajo. Deja que nosotros nos ocupemos de la
              tecnología para que tú te ocupes de lo que importa."
            </p>

            {/* Newsletter / CTA */}
            <div className="premium-glass p-2 rounded-2xl border-white/5 bg-white/2 max-w-sm flex items-center group focus-within:ring-1 ring-nexus-cyan/50 transition-all shadow-xl">
              <input
                type="email"
                placeholder="RECIBE CONSEJOS ÚTILES"
                className="bg-transparent border-none focus:ring-0 text-[11px] font-orbitron tracking-widest px-4 flex-grow uppercase placeholder:text-nexus-silver/30 text-white"
              />
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-nexus-cyan text-black px-6 py-3 rounded-xl text-[10px] font-orbitron font-black tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,245,255,0.4)]"
              >
                APUNTARME
              </button>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6"
              >
                <h4 className="text-nexus-cyan text-[11px] font-orbitron font-black tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(0,245,255,0.5)]">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link.name}>
                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="text-nexus-silver/50 hover:text-white transition-colors text-[11px] font-orbitron tracking-widest uppercase flex items-center gap-2 group"
                      >
                        <span className="w-0 h-px bg-nexus-cyan group-hover:w-4 transition-all duration-300 shadow-[0_0_5px_#22d3ee]" />
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-[10px] font-orbitron tracking-[0.4em] text-nexus-silver/30 uppercase">
              © {currentYear} AIGESTION.NET | CENTRO DE CONTROL PERSONAL V2.1
            </div>
            <div className="flex items-center gap-4 text-[9px] font-mono text-nexus-cyan/50">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                ESTADO: OPERATIVO
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span>CONEXIÓN SEGURA</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {[
              <Twitter key="tw" size={16} />,
              <Linkedin key="li" size={16} />,
              <Youtube key="yt" size={16} />,
            ].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="text-nexus-silver/40 hover:text-nexus-cyan transition-colors hover:drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
