import React from 'react';
import { motion } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface GodModeNotificationProps {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
}

export const GodModeNotification: React.FC<GodModeNotificationProps> = ({
  title,
  message,
  type = 'info',
  onClose
}) => {
  const icons = {
    info: <Info className="text-nexus-cyan" size={20} />,
    success: <CheckCircle className="text-green-400" size={20} />,
    warning: <AlertTriangle className="text-yellow-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
  };

  const borders = {
    info: 'border-nexus-cyan/30',
    success: 'border-green-500/30',
    warning: 'border-yellow-500/30',
    error: 'border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95, filter: 'blur(10px)' }}
      className={`pointer-events-auto min-w-[320px] max-w-md premium-glass p-1 border ${borders[type]} rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group`}
    >
      <div className="relative p-4 flex gap-4">
        {/* Type Icon */}
        <div className="flex-shrink-0 mt-1">
          {icons[type]}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h4 className="font-orbitron text-xs font-bold text-white tracking-widest uppercase mb-1 drop-shadow-glow">
            {title}
          </h4>
          <p className="text-nexus-silver/70 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Glow Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      </div>

      {/* Progress Bar Emulation */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
        className={`h-[2px] bg-gradient-to-r ${type === 'info' ? 'from-nexus-cyan to-nexus-violet' : 'from-current to-transparent opacity-50'}`}
      />
    </motion.div>
  );
};
