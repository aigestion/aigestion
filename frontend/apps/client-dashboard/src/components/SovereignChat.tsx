import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  History,
  MoreVertical
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const SovereignChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Iniciando conexión con el Nexus. Soy Daniela, ¿cómo puedo asistirte hoy?', timestamp: new Date() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Analizando: "${userMsg.content}". He procesado tu solicitud en el Swarm. Los resultados estarán disponibles en el Mission Timeline en breve.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1500);
  };

  return (
    <>
      {/* Tiny Float Button when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_8px_32px_rgba(139,92,246,0.5)] z-50 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform group"
          >
            <Bot className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '600px',
              width: isMinimized ? '200px' : '400px',
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={cn(
              "fixed bottom-6 right-6 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300",
              isMinimized ? "cursor-pointer" : ""
            )}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">Daniela Nexus</h4>
                  <p className="text-[8px] text-emerald-400 font-mono tracking-widest uppercase">Sistema Activo</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[85%] space-y-1",
                        msg.role === 'user' ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-purple-600/30 text-white rounded-tr-none border border-purple-500/20" 
                          : "bg-white/5 text-zinc-300 rounded-tl-none border border-white/5"
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-[8px] text-zinc-600 font-mono">
                        {msg.timestamp.toLocaleTimeString([], { hour: 0, minute: 0, second: 0, hour12: false })}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/[0.01] border-t border-white/5">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Escribe tu comando..."
                      className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-all"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                      onClick={handleSend}
                      className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg shadow-purple-900/20"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button className="text-[10px] text-zinc-600 flex items-center gap-1 hover:text-zinc-400 transition-colors">
                      <History className="w-3 h-3" /> Ver historial completo
                    </button>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                      <span className="text-[8px] text-zinc-700 font-mono uppercase tracking-widest">Nexus v2 AI Engine</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
