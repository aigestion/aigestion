import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';
import { danielaApi } from '../services/daniela-api.service';
import { useDanielaVoice } from '../hooks/useDanielaVoice';

export const DanielaConversationPanel: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Hola, soy Daniela. ¿En qué puedo ayudarte hoy?' },
  ]);
  const [input, setInput] = useState('');
  const { isListening, transcript, isSpeaking, toggleListening, speak } = useDanielaVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');

    try {
      const response = await danielaApi.chat(userText, 'website-user', `session-${Date.now()}`);
      const aiText = response.response;
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      speak(aiText);
    } catch (error) {
      console.error('Daniela API Error:', error);
      const fallbackMsg =
        'Disculpa, estoy experimentando una breve interrupción en mis sistemas neuronales. ¿Podrías repetir eso?';
      setMessages(prev => [...prev, { role: 'ai', text: fallbackMsg }]);
      speak(fallbackMsg);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-nexus-cyan">
              <img
                src="/images/daniela-avatar.jpg"
                alt="Daniela"
                className="w-full h-full object-cover"
                onError={e =>
                  (e.currentTarget.src =
                    'https://ui-avatars.com/api/?name=Daniela+AI&background=00f5ff&color=fff')
                }
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Daniela AI</h3>
            <p className="text-nexus-cyan text-xs font-mono">ONLINE // V2.4</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isSpeaking && (
            <div className="flex gap-1 h-3 items-end">
              <motion.div
                className="w-1 bg-nexus-cyan"
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              <motion.div
                className="w-1 bg-nexus-cyan"
                animate={{ height: [6, 10, 2] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
              <motion.div
                className="w-1 bg-nexus-cyan"
                animate={{ height: [2, 8, 3] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-nexus-violet/20 text-white rounded-tr-sm border border-nexus-violet/30'
                  : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
              }`}
            data-testid="daniela-message"
          >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="relative flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/50'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            data-testid="daniela-mic"
          >
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Escribe o habla con Daniela..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-sm focus:outline-none focus:border-nexus-cyan/50 placeholder-gray-500"
            data-testid="daniela-input"
          />
          <button
            onClick={handleSend}
            className="p-3 bg-nexus-cyan text-black rounded-full hover:bg-cyan-400 transition-colors"
            data-testid="daniela-send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
