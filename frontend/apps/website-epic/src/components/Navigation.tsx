import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSound } from '../hooks/useSound';
import { SoundControl } from './SoundControl';

interface NavigationProps {
  onTerminalToggle: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onTerminalToggle }) => {
  const { playHover, playClick, playWuaw } = useSound();

  const navItems = [
    { label: 'Visión', path: '#vision' },
    { label: 'Inteligencia', path: '#intelligence' },
    { label: 'ROI', path: '#roi' },
    { label: 'Dashboards', path: '/dashboards', highlight: true },
  ];


  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-50 px-6 py-4 premium-glass border-b-0"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="group flex items-center gap-3 outline-none"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src="/images/brand/logo.png" alt="AIGestion.net" className="h-9 w-auto filter drop-shadow-[0_0_8px_rgba(138,43,226,0.3)]" />
          </motion.div>
          <span className="text-2xl font-orbitron font-bold tracking-[0.2em] text-transparent bg-clip-text bg-linear-to-r from-nexus-violet-glow via-white to-nexus-cyan-glow hidden sm:block">
            AIGestion.net
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={item.path}
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  playWuaw();
                }}
                className={`relative font-orbitron text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:text-white group
                  ${item.highlight ? 'text-nexus-violet-glow font-bold' : 'text-nexus-silver/60'}`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-nexus-cyan transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              to="/demo"
              onMouseEnter={playHover}
              onClick={playClick}
              className="text-nexus-cyan-glow hover:text-white transition-colors font-orbitron text-[10px] tracking-[0.2em] font-bold uppercase flex items-center gap-2 px-4 py-2 rounded-full bg-nexus-cyan/5 border border-white/5 hover:bg-nexus-cyan/10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-cyan-glow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-cyan-glow"></span>
              </span>
              Demo Live
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center gap-6">
          <SoundControl />
          <button
            onClick={() => {
              playClick();
              onTerminalToggle();
            }}
            onMouseEnter={playHover}
            className="group flex items-center gap-4 px-6 py-2 rounded-full premium-glass border-nexus-cyan/20 hover:border-nexus-cyan-glow/50 transition-all duration-500"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-nexus-cyan-glow/30 transition-colors">
              <img src="/images/brand/icon.png" alt="Nexus" className="w-full h-full object-cover hue-rotate-180 brightness-125" />
            </div>
            <span className="text-[10px] font-orbitron tracking-[0.2em] uppercase text-nexus-cyan-glow group-hover:text-white transition-colors">
              God Mode Terminal
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
