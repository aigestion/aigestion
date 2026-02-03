import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export interface ChatBubbleProps {
  message: string;
  isAI?: boolean;
  timestamp?: string;
  className?: string;
}

const ChatBubble = ({ message, isAI = true, timestamp, className }: ChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: isAI ? -20 : 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className={cn(
        'flex flex-col gap-1 max-w-[80%]',
        isAI ? 'self-start' : 'self-end items-end',
        className
      )}
    >
      <div
        className={cn(
          'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
          isAI
            ? 'bg-[#16161a] border border-[#8a2be2]/30 text-white rounded-tl-none'
            : 'bg-[#8a2be2] text-white rounded-tr-none'
        )}
      >
        {message}
      </div>
      {timestamp && (
        <span className="text-[10px] text-gray-500 px-1">
          {timestamp}
        </span>
      )}
    </motion.div>
  );
};

export { ChatBubble };
