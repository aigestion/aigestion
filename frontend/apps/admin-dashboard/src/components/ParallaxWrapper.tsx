
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  strength?: number;
}

const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({ children, strength = 20 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [strength, -strength]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-strength, strength]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseOver) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      x.set((e.clientX - centerX) / rect.width);
      y.set((e.clientY - centerY) / rect.height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMouseOver, x, y]);

  return (
    <div 
      ref={ref}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => {
        setIsMouseOver(false);
        x.set(0);
        y.set(0);
      }}
      className="perspective-1000"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxWrapper;
