import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavItemProps {
  label: string;
  href: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, href, onClick }) => (
  <motion.a
    href={href}
    onClick={onClick}
    whileHover={{ y: -2 }}
    className="relative text-nexus-silver/80 hover:text-nexus-cyan font-orbitron text-sm tracking-widest uppercase transition-colors group"
  >
    {label}
    <motion.div
      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-nexus-cyan to-nexus-violet"
      initial={{ width: 0 }}
      whileHover={{ width: '100%' }}
      transition={{ duration: 0.3 }}
    />
  </motion.a>
);

export const EnhancedNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItemProps[] = [
    { label: 'Inicio', href: '#home' },
    { label: 'Características', href: '#features' },
    { label: 'Casos de Uso', href: '#cases' },
    { label: 'Precios', href: '#pricing' },
    { label: 'Contacto', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-nexus-obsidian/40 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
          <div className="font-orbitron font-bold text-xl text-nexus-cyan">NEXUS</div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block px-6 py-2 bg-nexus-violet text-white font-orbitron text-sm tracking-widest rounded-lg hover:bg-nexus-violet/80 transition-colors"
        >
          COMENZAR
        </motion.button>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-nexus-cyan"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-nexus-obsidian/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map(item => (
                <NavItem key={item.label} {...item} onClick={() => setIsOpen(false)} />
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-2 bg-nexus-violet text-white font-orbitron text-sm tracking-widest rounded-lg"
              >
                COMENZAR
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ============================================================================
// CARD COMPONENT WITH 3D HOVER EFFECT
// ============================================================================

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  badge?: string;
  onClick?: () => void;
}

export const Card3D: React.FC<CardProps> = ({
  title,
  description,
  icon,
  image,
  badge,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative h-full cursor-pointer group"
      style={{
        perspective: '1000px',
      }}
      whileHover={{ y: -10 }}
    >
      {/* Card Container */}
      <motion.div
        className="relative h-full bg-gradient-to-br from-nexus-obsidian/60 to-nexus-violet/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-hidden"
        animate={{
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? -5 : 0,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Background Gradient Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-nexus-violet/20 to-nexus-cyan/20 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-4 h-full flex flex-col">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex w-fit px-3 py-1 bg-nexus-cyan/20 border border-nexus-cyan/50 rounded-full text-xs font-orbitron text-nexus-cyan"
            >
              {badge}
            </motion.div>
          )}

          {/* Icon */}
          {icon && (
            <motion.div
              animate={{ y: isHovered ? -5 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-nexus-cyan text-4xl"
            >
              {icon}
            </motion.div>
          )}

          {/* Image */}
          {image && (
            <motion.div
              className="w-full h-32 bg-gradient-to-br from-nexus-violet/30 to-nexus-cyan/30 rounded-lg overflow-hidden"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Title */}
          <motion.h3
            className="text-xl font-orbitron font-bold text-white"
            animate={{ y: isHovered ? -2 : 0 }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-nexus-silver/60 text-sm flex-grow"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            {description}
          </motion.p>

          {/* CTA Link */}
          <motion.div
            className="inline-flex items-center gap-2 text-nexus-cyan font-orbitron text-sm"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            Ver más →
          </motion.div>
        </div>

        {/* Hover Border Glow */}
        <motion.div
          className="absolute inset-0 border border-nexus-cyan rounded-xl opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered
              ? '0 0 20px rgba(0, 245, 255, 0.3), inset 0 0 20px rgba(0, 245, 255, 0.1)'
              : 'none',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// BADGE WITH PULSE ANIMATION
// ============================================================================

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const AnimatedBadge: React.FC<BadgeProps> = ({ text, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-nexus-violet/20 border-nexus-violet/50 text-nexus-violet',
    secondary: 'bg-nexus-cyan/20 border-nexus-cyan/50 text-nexus-cyan',
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  };

  return (
    <motion.div
      className={`inline-flex px-3 py-1 border rounded-full text-xs font-orbitron ${variants[variant]}`}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <motion.span
        className="inline-block w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: 'currentColor' }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {text}
    </motion.div>
  );
};

// ============================================================================
// HOW TO USE
// ============================================================================

/*
import { EnhancedNavigation, Card3D, AnimatedBadge } from './components/Phase2Components';

// In your page:
<EnhancedNavigation />

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card3D
    title="Feature 1"
    description="Description of feature"
    badge="New"
    onClick={() => console.log('clicked')}
  />
  <Card3D
    title="Feature 2"
    description="Description of feature"
    badge="Popular"
  />
</div>

<AnimatedBadge text="In Development" variant="secondary" />
*/
