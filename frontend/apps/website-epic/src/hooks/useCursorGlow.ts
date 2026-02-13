import { useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export const useCursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useTransform(mouseX, x => x - 8);
  const cursorY = useTransform(mouseY, y => y - 8);

  const glowX = useTransform(mouseX, x => x - 20);
  const glowY = useTransform(mouseY, y => y - 20);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return { cursorX, cursorY, glowX, glowY };
};
