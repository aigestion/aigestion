import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavGroup, NavItem } from '@aigestion/ui';
import { useSound } from '../hooks/useSound';
import { SoundControl } from './SoundControl';

export const EnhancedNavigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { playHover, playClick } = useSound();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Inicio', path: '#hero', icon: '🏠' },
    { label: 'Clientes', path: '#clients', icon: '🏢' },
    { label: 'Ayuda', path: '#daniela', icon: '🤖' },
    { label: 'Velocidad', path: '#nexus', icon: '⚡' },
    { label: 'Ganancias', path: '#roi', icon: '📊' },
    { label: 'Escribirnos', path: '#contact', icon: '📞' },
    { label: 'Oficina', path: '/virtual-office', icon: '🏢' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navItems.map(item => item.path.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    playClick();
    setIsMobileMenuOpen(false);

    if (path.startsWith('#')) {
      const element = document.getElementById(path.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-4 outline-none"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              <motion.div
                className="relative"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center border border-white/20 backdrop-blur-sm overflow-hidden">
                  <img
                    src="/images/brand/logo.png"
                    alt="AIGestion Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-2xl font-orbitron font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-nexus-violet via-white to-nexus-cyan glitch-text">
                  AIGESTION
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-4 bg-nexus-cyan/50" />
                  <div className="text-[10px] text-nexus-cyan/70 font-mono tracking-widest uppercase">
                    Versión Moderna
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavGroup isScrolled={isScrolled}>
              {navItems.map((item, index) => (
                <NavItem
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeSection === item.path.slice(1)}
                  onClick={() => handleNavClick(item.path)}
                  layoutId="activeNavBackground"
                  className={index === 0 ? '' : 'ml-0'}
                />
              ))}
            </NavGroup>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <SoundControl />

              {/* Mobile Menu Toggle */}
              <motion.button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 border border-white/20"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-5 flex flex-col justify-center gap-1">
                  <motion.span
                    className={`w-full h-0.5 bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                    animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }}
                  />
                  <motion.span
                    className={`w-full h-0.5 bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : ''
                    }`}
                    animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                  />
                  <motion.span
                    className={`w-full h-0.5 bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}
                    animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === item.path.slice(1)
                        ? 'bg-nexus-violet/20 text-nexus-cyan'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-orbitron font-medium">{item.label}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-nexus-cyan/20 z-50"
        initial={{ scaleX: 0 }}
        style={{ originX: 0 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-nexus-violet to-nexus-cyan"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: useScrollProgress() }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </>
  );
};

// Hook for scroll progress
function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent / 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

