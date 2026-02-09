import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const NexusCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor
    document.body.classList.add('custom-cursor');

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-nexus-cyan/40 pointer-events-none z-9999"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovering ? 2.5 : 1,
        }}
        animate={{
          borderColor: isHovering ? 'var(--color-nexus-cyan-glow)' : 'rgba(0, 245, 255, 0.4)',
          backgroundColor: isHovering ? 'rgba(0, 245, 255, 0.05)' : 'transparent',
          backdropFilter: isHovering ? 'blur(4px)' : 'blur(0px)',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-nexus-cyan rounded-full pointer-events-none z-9999 shadow-[0_0_10px_rgba(0,245,255,0.8)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 10,
          translateY: 10,
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
          backgroundColor: isHovering ? 'var(--color-nexus-cyan-glow)' : 'var(--color-nexus-cyan)',
        }}
      />
    </>
  );
};
