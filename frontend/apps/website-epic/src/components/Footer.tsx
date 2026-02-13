import { motion } from 'framer-motion';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const Footer: React.FC = () => {
  const { setIsContactModalOpen } = useAppContext();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'SOLUCIONES',
      links: [
        { name: 'Arquitectura Neural', href: '#' },
        { name: 'Soberanía de Datos', href: '#' },
        { name: 'Automatización Elite', href: '#' },
        { name: 'Seguridad Cuántica', href: '#' },
      ],
    },
    {
      title: 'ECOSISTEMA',
      links: [
        { name: 'Nexus V2', href: '#' },
        { name: 'Daniela AI', href: '#' },
        { name: 'Swarms de Ejecución', href: '#' },
        { name: 'Bridge Soberano', href: '#' },
      ],
    },
    {
      title: 'RECURSOS',
      links: [
        { name: 'Documentación', href: '#' },
        { name: 'Terminal SSH', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Whitepaper', href: '#' },
      ],
    },
  ];

  return (
    <footer className="relative py-32 bg-black border-t border-white/5 overflow-hidden z-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-nexus-cyan/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nexus-violet/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-nexus-cyan/20 to-transparent" />
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
              <div className="w-10 h-10 border border-nexus-cyan/20 rounded-lg rotate-45 flex items-center justify-center group-hover:rotate-0 transition-transform duration-700">
                <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
              </div>
              <h3 className="font-orbitron font-black text-2xl tracking-tighter text-white">
                AIGESTION<span className="text-nexus-cyan font-extralight">.NET</span>
              </h3>
            </motion.div>

            <p className="text-nexus-silver/40 text-sm leading-relaxed max-w-md font-light italic">
              "La orquestación de la inteligencia no es solo una herramienta, es el fundamento de la
              soberanía digital en el nuevo siglo."
            </p>

            {/* Newsletter / CTA */}
            <div className="premium-glass p-1 rounded-full border-white/5 bg-white/2 max-w-sm flex items-center group focus-within:ring-2 ring-nexus-cyan/20 transition-all">
              <input
                type="email"
                placeholder="UNIRSE AL DESPLIEGUE"
                className="bg-transparent border-none focus:ring-0 text-[10px] font-orbitron tracking-widest px-6 flex-grow uppercase placeholder:text-nexus-silver/20"
              />
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-nexus-cyan text-black px-6 py-3 rounded-full text-[10px] font-orbitron font-black tracking-widest hover:bg-white transition-colors"
              >
                ACTIVAR
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
                <h4 className="text-white text-[11px] font-orbitron font-black tracking-[0.3em] uppercase">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link.name}>
                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="text-nexus-silver/30 hover:text-nexus-cyan transition-colors text-[10px] font-orbitron tracking-widest uppercase flex items-center gap-2 group"
                      >
                        <span className="w-0 h-px bg-nexus-cyan group-hover:w-4 transition-all duration-300" />
                        {link.name}
                      </button>
                    </li>
                  ))}
                  {section.title === 'RECURSOS' && (
                    <>
                      <li>
                        <a
                          href="#privacy"
                          className="text-nexus-silver/30 hover:text-nexus-cyan transition-colors text-[10px] font-orbitron tracking-widest uppercase flex items-center gap-2 group"
                        >
                          <span className="w-0 h-px bg-nexus-cyan group-hover:w-4 transition-all duration-300" />
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#terms"
                          className="text-nexus-silver/30 hover:text-nexus-cyan transition-colors text-[10px] font-orbitron tracking-widest uppercase flex items-center gap-2 group"
                        >
                          <span className="w-0 h-px bg-nexus-cyan group-hover:w-4 transition-all duration-300" />
                          Terms of Service
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-[9px] font-orbitron tracking-[0.4em] text-nexus-silver/20 uppercase">
              © {currentYear} SOVEREIGN NEXUS | ENTERPRISE INFRASTRUCTURE V2.1
            </div>
            <div className="flex items-center gap-4 text-[8px] font-mono text-nexus-cyan/30">
              <span>
                ESTADO DEL SISTEMA: <span className="text-green-500 animate-pulse">OPERATIVO</span>
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span>LATENCIA: 14MS</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {['Twitter', 'Discord', 'LinkedIn', 'YouTube'].map(social => (
              <a
                key={social}
                href="#"
                className="text-nexus-silver/20 hover:text-white transition-colors text-[10px] font-orbitron tracking-widest uppercase hover:blur-[0.5px]"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
