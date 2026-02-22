import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { GodModeText } from './GodModeText';

interface NexusCommandBarProps {
  title: string;
  subtitle?: string;
  status?: React.ReactNode;
  className?: string;
  typing?: boolean;
  glitch?: boolean;
}

const TypingText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="font-mono text-nexus-cyan/60 text-xs">
      {'> '}{displayed}
      <motion.span
        className="inline-block w-[6px] h-3.5 bg-nexus-cyan/80 ml-0.5 align-text-bottom"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  );
};

export const NexusCommandBar: React.FC<NexusCommandBarProps> = ({
  title,
  subtitle,
  status,
  className,
  typing = true,
  glitch = true,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'relative px-8 py-6 bg-black/40 backdrop-blur-2xl border-b border-white/[0.04] overflow-hidden',
        className
      )}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Moving scanner line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan/40 to-transparent pointer-events-none"
        initial={{ top: 0 }}
        animate={{ top: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-orbitron font-black text-white uppercase tracking-[0.15em]">
            {glitch ? (
              <GodModeText text={title} effect="glitch" />
            ) : (
              title
            )}
          </h1>
          {subtitle && typing ? (
            <div className="mt-1.5">
              <TypingText text={subtitle} />
            </div>
          ) : subtitle ? (
            <p className="text-white/30 text-xs mt-1.5 font-mono uppercase tracking-wider">
              {subtitle}
            </p>
          ) : null}
        </div>

        {status && (
          <div className="hidden md:flex items-center gap-4">
            {status}
          </div>
        )}
      </div>
    </motion.header>
  );
};
