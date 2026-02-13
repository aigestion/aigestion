import { useCallback, useEffect, useState } from 'react';

interface EmotionalAnalysis {
  emotion: string;
  confidence: number;
  sentiment: string;
}

interface SuggestedAction {
  id: string;
  text: string;
  type: string;
  priority: string;
  context: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionalAnalysis?: EmotionalAnalysis;
}

export const useEnhancedVoiceAssistant = (_options: {
  sessionId: string;
  userId: string;
  onEmotionalChange?: (analysis: EmotionalAnalysis) => void;
}) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock emotional analysis
  const mockEmotionalAnalysis: EmotionalAnalysis = {
    emotion: 'neutral',
    confidence: 0.85,
    sentiment: 'positive',
  };

  // Mock suggested actions
  const mockSuggestedActions: SuggestedAction[] = [
    {
      id: '1',
      text: 'Ver dashboard principal',
      type: 'navigation',
      priority: 'high',
      context: 'main',
    },
    {
      id: '2',
      text: 'Analizar métricas',
      type: 'analysis',
      priority: 'medium',
      context: 'analytics',
    },
    { id: '3', text: 'Contactar soporte', type: 'support', priority: 'low', context: 'help' },
  ];

  useEffect(() => {
    // Initialize connection
    setStatus('connecting');
    setTimeout(() => {
      setStatus('active');
      setEmotionalAnalysis(mockEmotionalAnalysis);
      setSuggestedActions(mockSuggestedActions);
    }, 1000);
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    setIsRecording(true);
    setError(null);

    // Mock recording process
    setTimeout(() => {
      const mockMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: 'Hola Daniela, ¿cómo estás?',
        timestamp: new Date(),
        emotionalAnalysis: mockEmotionalAnalysis,
      };

      setMessages(prev => [...prev, mockMessage]);

      // Mock AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '¡Hola! Estoy perfectamente, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
          timestamp: new Date(),
          emotionalAnalysis: mockEmotionalAnalysis,
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsRecording(false);
      }, 1500);
    }, 2000);
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
  }, [isRecording]);

  const sendTextMessage = useCallback(
    async (text: string) => {
      if (isProcessing) return;

      setIsProcessing(true);
      setError(null);

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date(),
        emotionalAnalysis: mockEmotionalAnalysis,
      };

      setMessages(prev => [...prev, userMessage]);

      // Mock AI response
      setTimeout(() => {
        const responses = [
          'Entendido. Estoy procesando tu solicitud.',
          'He analizado tu petión. Aquí está la respuesta.',
          'Interesante. Déjame generar un reporte para ti.',
          'Perfecto. Ejecutando la acción solicitada.',
          'Comprendido. ¿Hay algo más en lo que pueda ayudarte?',
        ];

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          emotionalAnalysis: mockEmotionalAnalysis,
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 1000);
    },
    [isProcessing]
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    status,
    messages,
    emotionalAnalysis,
    suggestedActions,
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    sendTextMessage,
    clearConversation,
  };
};
