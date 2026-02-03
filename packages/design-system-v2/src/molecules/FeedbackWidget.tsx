import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

export interface FeedbackWidgetProps {
  onFeedback: (positive: boolean) => void;
  className?: string;
}

const FeedbackWidget = ({ onFeedback, className }: FeedbackWidgetProps) => {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (voted) return;
    setVoted(type);
    onFeedback(type === 'up');
  };

  return (
    <div className={cn('flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm', className)}>
      <AnimatePresence mode="wait">
        {voted ? (
          <motion.div
            key="voted"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 text-[10px] text-nexus-cyan-glow font-bold uppercase tracking-widest"
          >
            <Check className="w-3 h-3" />
            Feedback Received
          </motion.div>
        ) : (
          <motion.div key="buttons" className="flex items-center gap-1">
            <button
              onClick={() => handleVote('up')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-green-400"
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-white/10" />
            <button
              onClick={() => handleVote('down')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-red-400"
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { FeedbackWidget };
