import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Menu, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useSoundEffects } from '../hooks/useSoundEffects';

export const Navigation: React.FC = () => {
  const { playHover, playClick } = useSoundEffects();
  const { setIsContactModalOpen } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Muestra', path: '#demo-dashboard', isHash: true },
    { label: 'Inteligencia', path: '/intelligence', isHash: false },
    { label: 'Mercado', path: '/marketplace', isHash: false },
    { label: 'Qué hacemos', path: '#services', isHash: true },
    { label: 'Cómo te ayuda', path: '#plan', isHash: true },
    { label: 'Vídeos de ayuda', path: '#tutoriales', isHash: true },
    { label: 'Hablar con nosotros', path: '#contact', isHash: true, isModal: true },
  ];

  const handleLinkClick = (path: string, isHash?: boolean, isModal?: boolean) => {
    playClick();
    setIsMobileMenuOpen(false);
    if (isModal) {
      setIsContactModalOpen(true);
      return;
    }
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
          ? 'bg-nexus-obsidian/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">
        {/* Professional Logo Section */}
        <Link
          to="/"
          onClick={() => handleLinkClick('/')}
          onMouseEnter={playHover}
          className="group flex items-center gap-0 relative"
        >
          <div className="relative z-10 w-10 h-10 mr-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-nexus-cyan/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-6 h-6 border-[1.5px] border-nexus-cyan/50 rounded-lg rotate-45 group-hover:rotate-[135deg] transition-transform duration-1000 ease-out flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse shadow-[0_0_15px_rgba(0,245,255,0.8)]" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-orbitron font-black text-2xl tracking-tighter text-white transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              AIGESTION.NET
            </span>
            <span className="text-[10px] text-nexus-cyan tracking-[0.3em] font-orbitron opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-14 drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]">
              NEXUS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(item => {
            const commonProps = {
              key: item.label,
              onMouseEnter: playHover,
              className:
                'text-sm font-medium text-gray-300 hover:text-white transition-all relative group px-4 py-2 font-orbitron tracking-wide rounded-lg hover:bg-white/5',
            };

            const content = (
              <>
                <span className="relative z-10 group-hover:text-nexus-cyan transition-colors duration-300">
                  {item.label}
                </span>
                <span className="absolute bottom-1 left-4 w-0 h-[1px] bg-nexus-cyan transition-all duration-300 group-hover:w-[calc(100%-2rem)] shadow-[0_0_8px_#22d3ee]" />
              </>
            );

            if (item.isHash) {
              return (
                <a
                  {...commonProps}
                  href={item.path}
                  onClick={e => {
                    e.preventDefault();
                    handleLinkClick(item.path, item.isHash, item.isModal);
                  }}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                {...commonProps}
                to={item.path}
                onClick={() => handleLinkClick(item.path, false, false)}
              >
                {content}
              </Link>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="tel:+16185381369"
            onMouseEnter={playHover}
            onClick={playClick}
            className="text-xs font-black font-orbitron text-nexus-cyan/50 hover:text-nexus-cyan transition-all hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] tracking-[0.3em] uppercase flex items-center gap-2"
          >
            <span className="text-lg">🤖</span>
            Llama a Daniela IA
          </a>
          <Link
            to="/login"
            onMouseEnter={playHover}
            onClick={playClick}
            className="text-xs font-black font-orbitron text-nexus-silver/50 hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-[0.3em] uppercase"
          >
            ACCEDER
          </Link>
          <Link
            to="/register"
            onMouseEnter={playHover}
            onClick={playClick}
            className="group relative px-8 py-3 bg-transparent overflow-hidden transition-all duration-500 rounded-xl"
          >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 p-[2px] rounded-xl bg-gradient-to-r from-nexus-cyan via-nexus-violet to-nexus-cyan bg-[length:200%_auto] animate-gradient-x opacity-30 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-black rounded-[10px]" />
            </div>

            <div className="absolute inset-0 bg-nexus-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 font-orbitron font-black text-[10px] tracking-[0.4em] text-white group-hover:text-nexus-cyan transition-colors">
              EMPEZAR GRATIS
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            playClick();
            setIsMobileMenuOpen(true);
          }}
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors tappable"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-nexus-obsidian border-l border-nexus-cyan/20 z-50 p-6 md:hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-bold font-orbitron text-white glitch-text">MENÚ</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 text-gray-400 hover:text-nexus-cyan hover:bg-white/5 rounded-lg transition-colors tappable"
                  aria-label="Cerrar menú"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {navItems.map(item => {
                  const content = (
                    <>
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-nexus-cyan/20 transition-colors border border-transparent group-hover:border-nexus-cyan/30">
                        <ChevronRight className="w-5 h-5 group-hover:text-nexus-cyan transition-colors" />
                      </div>
                      <span className="text-lg font-medium font-orbitron tracking-wide group-hover:text-nexus-cyan transition-colors">
                        {item.label}
                      </span>
                    </>
                  );

                  const commonProps = {
                    key: item.label,
                    className:
                      'flex items-center space-x-4 text-gray-300 hover:text-white group p-3 hover:bg-white/5 rounded-xl transition-all tappable',
                  };

                  if (item.isHash) {
                    return (
                      <a
                        {...commonProps}
                        href={item.path}
                        onClick={e => {
                          e.preventDefault();
                          handleLinkClick(item.path, item.isHash, item.isModal);
                        }}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      {...commonProps}
                      to={item.path}
                      onClick={() => handleLinkClick(item.path, false, false)}
                    >
                      {content}
                    </Link>
                  );
                })}

                <div className="h-px bg-white/10 my-6" />

                <a
                  href="tel:+16185381369"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 text-nexus-cyan hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all"
                >
                  <div className="p-2 bg-nexus-cyan/10 rounded-lg border border-nexus-cyan/30">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <span className="text-lg font-medium font-orbitron tracking-wide">
                      Llamar a Daniela IA
                    </span>
                    <div className="text-sm text-nexus-cyan/70">Asistente Virtual</div>
                  </div>
                </a>

                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 text-gray-300 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all"
                >
                  <div className="p-2 bg-white/5 rounded-lg border border-transparent hover:border-nexus-violet/30">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium font-orbitron tracking-wide">Acceder</span>
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full mt-4 bg-nexus-cyan/10 border border-nexus-cyan/50 text-nexus-cyan py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-nexus-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                >
                  <span className="font-orbitron tracking-wide">COMENZAR AHORA</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
