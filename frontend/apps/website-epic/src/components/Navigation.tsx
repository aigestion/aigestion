import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Menu, X, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useAppContext } from '../contexts/AppContext';

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
    { label: 'Qué hacemos', path: '#services', isHash: true },
    { label: 'Cómo te ayuda', path: '#plan', isHash: true },
    { label: 'Vídeos de ayuda', path: '#tutoriales', isHash: true },
    { label: 'Planes y Precios', path: '#pricing', isHash: true },
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
          ? 'bg-nexus-obsidian-deep/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
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
          <div className="relative z-10 w-10 h-10 mr-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-nexus-cyan/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-6 h-6 border-[1.5px] border-nexus-cyan/30 rounded-lg rotate-45 group-hover:rotate-[135deg] transition-transform duration-1000 ease-out flex items-center justify-center">
              <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="font-orbitron font-black text-2xl tracking-tighter text-white transition-all duration-300">
              AIGESTION
            </h1>
            <span className="text-[10px] text-nexus-cyan tracking-[0.3em] font-orbitron opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-14">
              NEXUS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <a
              key={item.label}
              href={item.path}
              onClick={e => {
                e.preventDefault();
                handleLinkClick(item.path, item.isHash, item.isModal);
              }}
              onMouseEnter={playHover}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group py-2 font-orbitron tracking-wide"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-nexus-cyan transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#22d3ee]" />
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/login"
            onMouseEnter={playHover}
            onClick={playClick}
            className="text-sm font-bold font-orbitron text-white/70 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wider"
          >
            ACCEDER
          </Link>
          <Link
            to="/register"
            onMouseEnter={playHover}
            onClick={playClick}
            className="group relative px-6 py-2.5 bg-white text-black font-bold text-sm tracking-wide overflow-hidden hover:scale-105 transition-transform duration-300"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
          >
            <span className="relative z-10 flex items-center gap-2 font-orbitron">
              EMPEZAR GRATIS
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-nexus-cyan via-white to-nexus-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            playClick();
            setIsMobileMenuOpen(true);
          }}
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
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
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0a0a0a] border-l border-white/10 z-50 p-6 md:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-bold font-orbitron text-white">MENÚ</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {navItems.map(item => (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={e => {
                      e.preventDefault();
                      handleLinkClick(item.path, item.isHash, item.isModal);
                    }}
                    className="flex items-center space-x-4 text-gray-300 hover:text-white group p-2 hover:bg-white/5 rounded-xl transition-all"
                  >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-nexus-cyan/20 transition-colors">
                      <ChevronRight className="w-5 h-5 group-hover:text-nexus-cyan transition-colors" />
                    </div>
                    <span className="text-lg font-medium font-orbitron tracking-wide">
                      {item.label}
                    </span>
                  </a>
                ))}

                <div className="h-px bg-white/10 my-6" />

                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 text-gray-300 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all"
                >
                  <div className="p-2 bg-white/5 rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium font-orbitron tracking-wide">Acceder</span>
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full mt-4 bg-nexus-cyan text-black py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]"
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
