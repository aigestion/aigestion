import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Brain, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import { DanielaConversationPanel } from '@shared/components/DanielaConversationPanel';

interface DanielaWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'dark' | 'light';
  size?: 'compact' | 'full';
}

export const DanielaWidget: React.FC<DanielaWidgetProps> = ({
  position = 'bottom-right',
  theme = 'dark',
  size = 'compact'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getThemeClasses = () => {
    return theme === 'dark'
      ? 'bg-black/90 border-nexus-cyan/20'
      : 'bg-white/90 border-nexus-cyan/40';
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`w-16 h-16 rounded-full ${getThemeClasses()} backdrop-blur-3xl border flex items-center justify-center shadow-2xl group relative`}
          >
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-nexus-cyan/20 to-nexus-violet/20 animate-pulse" />
            <MessageSquare className="w-8 h-8 text-nexus-cyan-glow relative z-10" />

            {/* Floating indicator */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full mb-3 px-3 py-2 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap"
            >
              Habla con Daniela
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`relative ${size === 'full' ? 'w-[800px] h-[600px]' : 'w-[400px] h-[500px]'} ${getThemeClasses()} backdrop-blur-3xl border rounded-3xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-orbitron font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    DANIELA
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-nexus-silver/60' : 'text-black/60'}`}>
                    Asistente IA Futurista
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  {size === 'full' ? (
                    <DanielaConversationPanel />
                  ) : (
                    <div className="p-4 h-full overflow-y-auto">
                      {/* Compact version */}
                      <div className="text-center py-8">
                        <Sparkles className="w-12 h-12 text-nexus-cyan-glow mx-auto mb-4" />
                        <h4 className={`font-orbitron font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          Daniela está lista
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-nexus-silver/60' : 'text-black/60'} mb-6`}>
                          Haz clic en el micrófono para comenzar una conversación
                        </p>

                        {/* Quick actions */}
                        <div className="space-y-2">
                          {[
                            'Hola Daniela, ¿cómo estás?',
                            'Muéstrame el dashboard',
                            'Analiza mis métricas'
                          ].map((suggestion, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-3 rounded-lg text-left ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-black'} transition-colors text-sm`}
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-6 w-full py-3 bg-linear-to-r from-nexus-cyan to-nexus-violet text-white rounded-full font-orbitron font-black"
                        >
                          Iniciar Conversación
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
