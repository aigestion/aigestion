import { motion } from 'framer-motion';
import React from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  useWords?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  useWords = false,
}) => {
  const items = useWords ? text.split(' ') : text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: useWords ? 10 : 0,
      x: useWords ? 0 : -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={`inline-flex flex-wrap gap-1 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {items.map((item, idx) => (
        <motion.span key={idx} variants={itemVariants} className="inline-block">
          {item}
          {useWords && idx < items.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </motion.div>
  );
};
