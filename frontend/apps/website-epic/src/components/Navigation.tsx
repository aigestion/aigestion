import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Lock, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { MagneticWrapper } from './MagneticWrapper';
import { SoundControl } from './SoundControl';

export const Navigation: React.FC = () => {
  const { playHover, playClick, playWhoosh } = useSoundEffects();
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
    { label: 'Casos', path: '#cases', isHash: true },
    { label: 'Precios', path: '#pricing', isHash: true },
    { label: 'Plan', path: '#plan', isHash: true },
    { label: 'Tutoriales', path: '#tutoriales', isHash: true },
    { label: 'Contacto', path: '#contact', isHash: true },
    { label: 'Daniela AI', path: '/daniela' },
    { label: 'Dashboard', path: '/dashboard' },
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
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Fused Logo Section */}
        <Link
          to="/"
          onClick={() => handleLinkClick('/')}
          onMouseEnter={playHover}
          className="group flex items-center gap-0 relative"
        >
          <div className="relative z-10 w-10 h-10 mr-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            <div className="absolute inset-0 bg-nexus-violet/50 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <img
              src="/images/brand/logo.png"
              alt="Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(138,43,226,0.5)]"
            />
          </div>

          <div className="flex flex-col justify-center h-10">
            <h1 className="font-orbitron font-black text-xl tracking-[0.1em] leading-none text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-nexus-cyan group-hover:to-nexus-violet transition-all duration-300">
              AIGESTION
              <span className="text-nexus-cyan-glow">.NET</span>
            </h1>
            <span className="text-[8px] font-mono text-nexus-silver/50 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
              CONTROL MAESTRO
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={(e) => {
                if (item.isHash) {
                  e.preventDefault();
                  handleLinkClick(item.path, true);
                } else {
                  handleLinkClick(item.path);
                }
              }}
              onMouseEnter={playHover}
              className={`relative font-orbitron text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:text-white hover:scale-105 ${location.pathname === item.path ? 'text-nexus-cyan' : 'text-nexus-silver/70'
                }`}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-nexus-cyan transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <SoundControl />

          <MagneticWrapper strength={20}>
            <Link
              to="/login"
              onMouseEnter={() => {
                playHover();
                playWhoosh();
              }}
              onClick={playClick}
              className="hidden sm:flex group relative items-center gap-3 px-6 py-2.5 overflow-hidden rounded-full bg-white/5 border border-white/10 hover:border-nexus-violet/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-nexus-violet/20 via-nexus-cyan/20 to-nexus-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

              <Lock
                size={14}
                className="text-nexus-violet-glow group-hover:text-white transition-colors"
              />
              <span className="relative font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:text-shadow-glow">
                ENTRAR
              </span>
              <ChevronRight
                size={14}
                className="text-nexus-silver/50 group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </Link>
          </MagneticWrapper>

          <button
            className="lg:hidden p-2 text-white hover:text-nexus-cyan transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-nexus-obsidian/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => {
                    if (item.isHash) {
                      e.preventDefault();
                      handleLinkClick(item.path, true);
                    } else {
                      handleLinkClick(item.path);
                    }
                  }}
                  className="font-orbitron text-sm font-bold tracking-widest text-nexus-silver hover:text-white hover:pl-2 transition-all border-b border-white/5 pb-4"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => handleLinkClick('/login')}
                className="btn-primary mt-4 w-full justify-center"
              >
                ENTRAR
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
