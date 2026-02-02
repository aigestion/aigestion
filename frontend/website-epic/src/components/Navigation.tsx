import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Lock, Menu, Rocket, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { MagneticWrapper } from './MagneticWrapper';
import { SoundControl } from './SoundControl';

export const Navigation: React.FC = () => {
  const { playHover, playClick, playWhoosh } = useSoundEffects();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFunMode, setShowFunMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '🎮 Servicios Mágicos', path: '#services', isHash: true, emoji: '🎮' },
    { label: '📚 Casos de Éxito', path: '#cases', isHash: true, emoji: '📚' },
    { label: '💰 Precios Divertidos', path: '#pricing', isHash: true, emoji: '💰' },
    { label: '🎯 Plan Increíble', path: '#plan', isHash: true, emoji: '🎯' },
    { label: '📚 Tutoriales Fáciles', path: '#tutoriales', isHash: true, emoji: '📚' },
    { label: '💬 Contacto Amigable', path: '#contact', isHash: true, emoji: '💬' },
    { label: '🎮 Panel de Juegos', path: '/dashboard', emoji: '🎮' },
  ];

  const handleLinkClick = (path: string, isHash?: boolean) => {
    playClick();
    setIsMobileMenuOpen(false);
    if (isHash) {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFunMode = () => {
    setShowFunMode(!showFunMode);
    playWhoosh();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Super Fun Logo Section */}
        <Link
          to="/"
          onClick={() => handleLinkClick('/')}
          onMouseEnter={playHover}
          className="group flex items-center gap-0 relative"
        >
          <div className="relative z-10 w-12 h-12 mr-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white animate-pulse" />
            </div>
            <img
              src="/images/brand/logo.png"
              alt="Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(147,51,234,0.8)]"
            />
          </div>

          <div className="flex flex-col justify-center h-12">
            <h1 className="font-bold text-2xl tracking-[0.1em] leading-none text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-yellow-200 group-hover:to-pink-200 transition-all duration-300">
              🎮 AIGESTION
              <span className="text-yellow-300">.NET</span>
            </h1>
            <span className="text-[10px] font-mono text-gray-300 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
              🎮 ¡El Sistema Más Divertido!
            </span>
          </div>
        </Link>

        {/* Fun Mode Toggle */}
        <button
          onClick={toggleFunMode}
          onMouseEnter={playHover}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span className="text-sm">
            {showFunMode ? '😎' : '🎮'} Modo {showFunMode ? 'Divertido' : 'Normal'}
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
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
              className={`relative font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-110 ${
                location.pathname === item.path ? 'text-yellow-300' : 'text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-400 to-pink-400 transition-all duration-300 group-hover:w-full" />
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
              className="hidden sm:flex group relative items-center gap-3 px-6 py-3 overflow-hidden rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-white/30 hover:border-yellow-400/50 transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

              <Lock
                size={16}
                className="text-yellow-300 group-hover:text-white transition-colors animate-pulse"
              />
              <span className="relative font-bold text-sm tracking-wider uppercase text-white group-hover:text-shadow-glow">
                🎮 ¡ENTRAR AL JUEGO!
              </span>
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all"
              />
            </Link>
          </MagneticWrapper>

          <button
            className="lg:hidden p-3 text-white hover:text-yellow-300 transition-colors bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border-2 border-white/30"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <div className="flex items-center gap-2">
                <X size={24} />
                <span className="text-sm font-bold">😎</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Menu size={24} />
                <span className="text-sm font-bold">🎮</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Super Fun Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl border-b-2 border-white/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-yellow-300 mb-2">🎮 ¡Menú Mágico!</h3>
                <p className="text-sm text-gray-300">Elige tu aventura favorita</p>
              </div>

              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border-2 border-white/20 hover:border-yellow-400/50 transition-all hover:scale-105 hover:translate-x-2"
                  >
                    <span className="text-2xl animate-bounce">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">{item.label}</div>
                      <div className="text-xs text-gray-300">¡Haz clic para explorar!</div>
                    </div>
                    <ChevronRight className="text-yellow-300 animate-pulse" />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  to="/login"
                  onClick={() => handleLinkClick('/login')}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold text-white text-lg shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 border-2 border-white/30"
                >
                  <Gamepad2 className="w-6 h-6" />
                  <span>🎮 ¡COMENZAR A JUGAR!</span>
                  <Rocket className="w-6 h-6" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
