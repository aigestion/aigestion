import React from 'react';
import { motion } from 'framer-motion';

interface PulseHistoryProps {
  history: ('nominal' | 'warning' | 'critical')[];
  className?: string;
}

export const PulseHistory: React.FC<PulseHistoryProps> = ({ history, className }) => {
  const valueMap = { nominal: 10, warning: 40, critical: 80 };
  const colorMap = { nominal: '#06B6D4', warning: '#F59E0B', critical: '#EF4444' };

  // Create points for the SVG polyline
  const points = history
    .map((status, i) => `${(i / (history.length - 1)) * 100},${100 - valueMap[status]}`)
    .join(' ');

  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-12 overflow-visible"
      >
        {/* Shadow Line */}
        <motion.polyline
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
          points={points}
        />

        {/* Main Data Line */}
        <motion.polyline
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {history.map((status, i) => (
              <stop
                key={i}
                offset={`${(i / (history.length - 1)) * 100}%`}
                stopColor={colorMap[status]}
              />
            ))}
          </linearGradient>
        </defs>

        {/* Dynamic Scan Point */}
        <motion.circle
          animate={{
            cx: [(history.length - 1) * 0, 100],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          r="2"
          fill="white"
          className="blur-[2px]"
        />
      </svg>

      <div className="flex justify-between mt-2 text-[10px] text-white/30 uppercase tracking-tighter font-mono">
        <span>T-60m</span>
        <span>Real-time Pulse</span>
        <span>Now</span>
      </div>
    </div>
  );
};
