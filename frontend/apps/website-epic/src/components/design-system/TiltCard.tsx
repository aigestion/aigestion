import { motion, useSpring, HTMLMotionProps } from 'framer-motion';
import React, { useRef } from 'react';
import { cn } from '../../utils/cn';

interface TiltCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  tiltMaxAngleX = 20,
  tiltMaxAngleY = 20,
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * tiltMaxAngleX);
    y.set(yPct * -tiltMaxAngleY);

    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    x.set(0);
    y.set(0);

    onMouseLeave?.(e);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: y,
        rotateY: x,
        transformStyle: 'preserve-3d',
        ...style
      }}
      className={cn("perspective-1000", className)}
      {...props}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  );
};
