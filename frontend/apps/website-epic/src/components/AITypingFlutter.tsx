import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AITypingFlutterProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onComplete?: () => void;
}

export const AITypingFlutter: React.FC<AITypingFlutterProps> = ({
  text,
  speed = 30,
  className = '',
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let currentIdx = 0;
    const timer = setInterval(() => {
      if (currentIdx < text.length) {
        setDisplayedText(prev => prev + text[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(timer);
        setIsDone(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <div className={`relative inline-block ${className}`}>
      {displayedText}
      {!isDone && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-nexus-cyan ml-1 align-middle shadow-[0_0_8px_rgba(0,245,255,0.8)]"
        />
      )}
    </div>
  );
};
