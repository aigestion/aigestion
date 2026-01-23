import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Zap } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [0, 1]);
  const scale = useTransform(y, [0, 100], [0.8, 1]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      const startY = e.touches[0].pageY;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].pageY;
        const diff = currentY - startY;
        if (diff > 0) {
          y.set(Math.min(diff * 0.4, 150));
          setPullProgress(Math.min(diff / 250, 1));
        }
      };

      const handleTouchEnd = async () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);

        if (y.get() > 100) {
          setIsRefreshing(true);
          y.set(100);
          await onRefresh();
          setIsRefreshing(false);
        }
        y.set(0);
        setPullProgress(0);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  return (
    <div onTouchStart={handleTouchStart} className="relative min-h-screen">
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute top-0 left-0 right-0 h-24 flex flex-col items-center justify-center pointer-events-none z-[9999]"
      >
        <div className="relative">
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : { rotate: pullProgress * 360 }}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { type: "spring" }}
            className="w-12 h-12 rounded-full border-2 border-nexus-cyan/20 flex items-center justify-center bg-black/40 backdrop-blur-xl"
          >
            <Zap size={24} className={isRefreshing ? "text-nexus-cyan-glow animate-pulse" : "text-nexus-cyan/60"} />
          </motion.div>
          {/* Partículas Neuronales */}
          <AnimatePresence>
            {(pullProgress > 0.5 || isRefreshing) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                      x: [0, (i % 2 === 0 ? 20 : -20), 0],
                      y: [0, (i < 3 ? 20 : -20), 0],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute w-1 h-1 rounded-full bg-nexus-cyan-glow/40"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[8px] font-orbitron font-black text-nexus-cyan-glow uppercase tracking-[0.3em] mt-4 opacity-40">
          {isRefreshing ? 'SYNCHRONIZING_CORE...' : pullProgress > 0.9 ? 'RELEASE_TO_REFRESH' : 'PULL_FOR_NEURAL_SYNC'}
        </p>
      </motion.div>
      <motion.div style={{ y: useTransform(y, (v) => v * 0.8) }}>
        {children}
      </motion.div>
    </div>
  );
};

import { AnimatePresence } from 'framer-motion';
