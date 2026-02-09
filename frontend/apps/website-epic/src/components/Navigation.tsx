import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Lock, Menu, Rocket, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { MagneticWrapper } from './MagneticWrapper';
import { SoundControl } from './SoundControl';

export const Navigation: React.FC = () => {
  const { playHover, playClick } = useSoundEffects();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Servicios', path: '#services', isHash: true },
    { label: 'Casos de Éxito', path: '#cases', isHash: true },
    { label: 'Precios', path: '#pricing', isHash: true },
    { label: 'Soluciones', path: '#plan', isHash: true },
    { label: 'Tutoriales', path: '#tutoriales', isHash: true },
    { label: 'Contacto', path: '#contact', isHash: true },
    { label: 'Panel de Control', path: '/dashboard' },
  ];

  const handleLinkClick = (path: string, isHash?: boolean) => {
    playClick();
    setIsMobileMenuOpen(false);
    if (isHash) {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-nexus-obsidian-deep/95 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Professional Logo Section */}
        <Link
          to="/"
          onClick={() => handleLinkClick('/')}
          onMouseEnter={playHover}
          className="group flex items-center gap-0 relative"
        >
          <div className="relative z-10 w-10 h-10 mr-3 transition-transform duration-500 group-hover:scale-105">
            <div className="absolute inset-0 bg-nexus-cyan/20 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <img
              src="/images/brand/logo.png"
              alt="Logo"
              className="w-full h-full object-contain filter brightness-110"
            />
          </div>

          <div className="flex flex-col justify-center h-10">
            <h1 className="font-orbitron font-bold text-xl tracking-[0.2em] leading-none text-white transition-all duration-300">
              AIGESTION
              <span className="text-nexus-cyan-glow">.NET</span>
            </h1>
            <span className="text-[9px] font-mono text-nexus-silver/40 tracking-[0.4em] uppercase mt-1">
              Arquitectura de Inteligencia Soberana
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.path}
              onClick={e => {
                if (item.isHash) {
                  e.preventDefault();
                  handleLinkClick(item.path, true);
                } else {
                  handleLinkClick(item.path);
                }
              }}
              onMouseEnter={playHover}
              className={`relative font-orbitron text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:text-white ${
                location.pathname === item.path ? 'text-nexus-cyan-glow' : 'text-nexus-silver/60'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-nexus-cyan-glow transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}
              />
            </Link>
          ))}
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-6">
          <SoundControl />

          <MagneticWrapper strength={10}>
            <Link
              to="/login"
              onMouseEnter={() => {
                playHover();
              }}
              onClick={playClick}
              className="hidden sm:flex group relative items-center gap-3 px-6 py-2.5 overflow-hidden rounded-sm bg-white/5 border border-white/10 hover:border-nexus-cyan/50 transition-all duration-500 shadow-lg shadow-nexus-cyan/5"
            >
              <div className="absolute inset-0 bg-linear-to-r from-nexus-cyan/10 to-nexus-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Lock
                size={14}
                className="text-nexus-cyan-glow group-hover:text-white transition-colors"
              />
              <span className="relative font-orbitron font-medium text-[10px] tracking-[0.2em] uppercase text-white">
                Acceso Clientes
              </span>
              <ChevronRight
                size={14}
                className="text-nexus-silver/40 group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </Link>
          </MagneticWrapper>

          <button
            className="lg:hidden p-2 text-white hover:text-nexus-cyan-glow transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Professional Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full w-full bg-nexus-obsidian-deep/98 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={e => {
                      if (item.isHash) {
                        e.preventDefault();
                        handleLinkClick(item.path, true);
                      } else {
                        handleLinkClick(item.path);
                      }
                    }}
                    className="flex items-center justify-between py-4 border-b border-white/5 group"
                  >
                    <span className="font-orbitron font-medium text-[11px] tracking-[0.3em] uppercase text-nexus-silver/60 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-nexus-cyan/30 group-hover:text-nexus-cyan transition-all"
                    />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link
                  to="/login"
                  onClick={() => handleLinkClick('/login')}
                  className="w-full py-4 bg-white/5 border border-white/10 flex items-center justify-center gap-3 group hover:bg-white/10 transition-all"
                >
                  <span className="font-orbitron font-bold text-[10px] tracking-[0.3em] uppercase text-white">
                    Acceso al Hub
                  </span>
                  <Rocket className="w-4 h-4 text-nexus-cyan-glow" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
