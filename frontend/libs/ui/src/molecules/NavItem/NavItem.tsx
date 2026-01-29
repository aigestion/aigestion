import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '../../utils/cn';

export interface NavItemProps {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  icon?: React.ReactNode;
  className?: string;
  layoutId?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  onClick,
  isActive,
  icon,
  className,
  layoutId = 'activeNavBackground',
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative group px-5 py-2.5 rounded-xl transition-all duration-500 overflow-hidden outline-none',
        isActive ? 'text-white' : 'text-gray-400 hover:text-white',
        className
      )}
      whileHover={{ y: -2 }}
    >
      <span className="relative z-10 flex items-center gap-2 text-xs font-orbitron font-bold tracking-widest uppercase">
        {icon && (
          <span className="text-sm opacity-80 group-hover:scale-125 transition-transform duration-300">
            {icon}
          </span>
        )}
        {label}
      </span>

      {/* Active Indicator & Background */}
      {isActive ? (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-nexus-violet/30 to-nexus-cyan/30 border border-white/10"
          layoutId={layoutId}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      ) : (
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
      )}

      {/* Magnetic Glow Effect */}
      <div className="absolute -inset-2 bg-nexus-cyan/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.button>
  );
};
