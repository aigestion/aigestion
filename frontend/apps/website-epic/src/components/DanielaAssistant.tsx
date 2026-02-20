import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, MessageCircle, X } from 'lucide-react';

interface DanielaAssistantProps {
  className?: string;
}

export const DanielaAssistant: React.FC<DanielaAssistantProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'daniela'; text: string }>>(
    [
      {
        role: 'daniela',
        text: '¡Hola! Soy Daniela, tu asistente de IA. ¿En qué puedo ayudarte hoy?',
      },
    ]
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, text: message };
    setChatHistory(prev => [...prev, userMessage]);

    // Simulate Daniela response
    setTimeout(() => {
      const responses = [
        '¡Excelente pregunta! Déjame ayudarte con eso.',
        'Estoy procesando tu solicitud con mi red neuronal avanzada...',
        'Puedo ayudarte con acceso a dashboards, información del sistema, y más.',
        '¿Te gustaría que te muestre nuestras capacidades de IA?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { role: 'daniela', text: randomResponse }]);
    }, 500);

    setMessage('');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Pulsing glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur-xl"
          />

          {/* Button content */}
          <div className="relative bg-gradient-to-r from-violet-600 to-cyan-600 p-4 rounded-full shadow-2xl">
            <Bot className="w-8 h-8 text-white" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </motion.div>
          </div>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-96 h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-violet-500/30 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-8 h-8 text-white" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white">Daniela</h3>
                  <p className="text-xs text-white/80">Asistente IA Neuronal</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[350px]">
              {chatHistory.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {msg.role === 'daniela' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-4 h-4" />
                        <span className="text-xs font-semibold text-violet-400">Daniela</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 p-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
