/**
 * 🛡️ AIGestion.net Nexus SIMA Assistant Overlay
 * © 2026 Alejandro Manuel Alfonso Fernández (DNI: 28921591B). Proprietary & Restricted.
 * SHA-256 Auth Signature: NEXUS-SIMA-ASSISTANT-v1.0
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react';

export const SIMAOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola Alejandro! Soy Daniela. Estoy analizando el tráfico del Nexus y todo se ve estable. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Simular respuesta de SIMA
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Entendido. Estoy procesando tu solicitud en el ecosistema Nexus...' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-96 glass-pro rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">SIMA Intelligence</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-black text-success tracking-widest">Active System</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-black font-bold'
                      : 'bg-white/5 border border-white/10 text-white'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask SIMA anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative group
          ${isOpen ? 'bg-white text-black' : 'bg-primary text-black'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-[#020202] animate-bounce" />
        )}
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
      </motion.button>
    </div>
  );
};
