import React from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const NexusCursor: React.FC = () => {
  const [isHovering, setIsHovering] = React.useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  React.useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
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

    globalThis.addEventListener('mousemove', moveCursor);
    globalThis.addEventListener('mouseover', handleMouseOver);

    document.body.classList.add('custom-cursor');

    return () => {
      globalThis.removeEventListener('mousemove', moveCursor);
      globalThis.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-nexus-cyan pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovering ? 1.5 : 1,
        }}
        animate={{
          borderColor: isHovering ? 'var(--color-nexus-violet)' : 'var(--color-nexus-cyan)',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-nexus-cyan rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 12,
          translateY: 12,
        }}
        animate={{
          backgroundColor: isHovering ? 'var(--color-nexus-violet)' : 'var(--color-nexus-cyan)',
        }}
      />
    </>
  );
};
