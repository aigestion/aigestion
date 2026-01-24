import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Edit3, Send, Brain, Sparkles, MessageSquare, Volume2, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  speaker: 'daniela' | 'client';
  timestamp: Date;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'excited' | 'professional';
  isEditing?: boolean;
}

interface EmotionalState {
  emotion: string;
  confidence: number;
  suggestions: string[];
}

interface SuggestedAction {
  id: string;
  text: string;
  type: 'response' | 'action' | 'question';
  icon: React.ReactNode;
}

export const DanielaConversationPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([]);
  const [inputText, setInputText] = useState('');
  const [volume, setVolume] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, speaker: 'daniela' | 'client', emotion?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      speaker,
      timestamp: new Date(),
      emotion: emotion as any || 'neutral'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, text: newText, isEditing: false } : msg
    ));
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      addMessage(inputText, 'client');
      // Simulate Daniela's response
      setTimeout(() => {
        addMessage('Entendido perfectamente. Analizando tu solicitud...', 'daniela', 'professional');
      }, 1000);
      setInputText('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic
      setSuggestedActions([
        { id: '1', text: '¿Cómo puedo ayudarte hoy?', type: 'question', icon: <MessageSquare size={16} /> },
        { id: '2', text: 'Mostrar dashboard', type: 'action', icon: <Brain size={16} /> },
        { id: '3', text: 'Analizar métricas', type: 'response', icon: <Zap size={16} /> }
      ]);
    }
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return 'text-nexus-cyan-glow';
      case 'concerned': return 'text-orange-400';
      case 'excited': return 'text-nexus-violet-glow';
      case 'professional': return 'text-nexus-gold';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black/90 backdrop-blur-3xl border border-nexus-cyan/20 rounded-[2rem] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-black text-white">DANIELA</h2>
            <p className="text-xs font-mono text-nexus-silver/60">Asistente IA Futurista</p>
          </div>
        </div>

        {/* Emotional State Indicator */}
        {emotionalState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full"
          >
            <span className="text-xs font-orbitron text-nexus-cyan-glow">
              {emotionalState.emotion.toUpperCase()} {emotionalState.confidence}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Voice Waveform */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-nexus-cyan/5 border border-nexus-cyan/20 rounded-xl"
          >
            <div className="flex items-center justify-center gap-1 h-12">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 32, 8] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                  className="w-1 bg-nexus-cyan-glow rounded-full"
                />
              ))}
            </div>
            <p className="text-center text-xs font-orbitron text-nexus-cyan-glow mt-2">
              ESCUCHANDO...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-96">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.speaker === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] group relative`}>
              <div
                className={`p-4 rounded-2xl ${
                  message.speaker === 'client'
                    ? 'bg-nexus-violet/20 border border-nexus-violet/30'
                    : 'bg-nexus-cyan/10 border border-nexus-cyan/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.speaker === 'client' ? 'bg-nexus-violet/50' : 'bg-nexus-cyan/50'
                  }`}>
                    {message.speaker === 'client' ? (
                      <MessageSquare className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    {message.isEditing ? (
                      <input
                        type="text"
                        defaultValue={message.text}
                        onBlur={(e) => handleEditMessage(message.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleEditMessage(message.id, (e.target as HTMLInputElement).value);
                          }
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white"
                        autoFocus
                      />
                    ) : (
                      <p className={`text-sm ${getEmotionColor(message.emotion)}`}>
                        {message.text}
                      </p>
                    )}
                    <p className="text-xs text-nexus-silver/40 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.speaker === 'client' && (
                    <button
                      onClick={() => {
                        setMessages(prev => prev.map(msg =>
                          msg.id === message.id ? { ...msg, isEditing: true } : msg
                        ));
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 className="w-4 h-4 text-nexus-silver/60" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      {suggestedActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <p className="text-xs font-orbitron text-nexus-silver/60 mb-2">SUGERENCIAS RÁPIDAS:</p>
          <div className="flex gap-2 flex-wrap">
            {suggestedActions.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInputText(action.text)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                {action.icon}
                <span className="text-xs text-nexus-silver/80">{action.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Controls */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRecording}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-nexus-cyan-glow text-black shadow-[0_0_30px_rgba(0,245,255,0.6)]'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
          placeholder="Escribe o habla con Daniela..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder-nexus-silver/40 focus:outline-none focus:border-nexus-cyan/50"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendText}
          className="w-12 h-12 rounded-full bg-nexus-cyan/20 border border-nexus-cyan/30 text-nexus-cyan-glow flex items-center justify-center hover:bg-nexus-cyan/30 transition-colors"
        >
          <Send size={20} />
        </motion.button>
      </div>

      {/* Volume Indicator */}
      {isRecording && (
        <div className="mt-4">
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-nexus-cyan-glow"
              style={{ width: `${volume * 100}%` }}
              animate={{ width: [`${volume * 100}%`, `${(volume + 0.2) * 100}%`, `${volume * 100}%`] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
