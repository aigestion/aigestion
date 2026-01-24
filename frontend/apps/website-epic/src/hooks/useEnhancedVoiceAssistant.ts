import { useCallback, useEffect, useRef, useState } from 'react';

interface ConversationMessage {
  id: string;
  text: string;
  speaker: 'daniela' | 'client';
  timestamp: Date;
  emotion?: string;
  confidence?: number;
}

interface EmotionalAnalysis {
  emotion: string;
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
}

interface SuggestedAction {
  id: string;
  text: string;
  type: 'response' | 'action' | 'question';
  priority: 'high' | 'medium' | 'low';
  context: string;
}

interface ConversationResponse {
  transcription?: string;
  emotionalAnalysis?: EmotionalAnalysis;
  response: string;
  audioResponse?: string;
  suggestedActions: SuggestedAction[];
  context: {
    messages: ConversationMessage[];
    emotionalHistory: EmotionalAnalysis[];
    clientProfile: {
      preferences: string[];
      previousTopics: string[];
      interactionStyle: string;
    };
  };
}

export type CallStatus = 'idle' | 'connecting' | 'active' | 'error';

interface UseEnhancedVoiceAssistantOptions {
  sessionId?: string;
  userId?: string;
  onMessageReceived?: (message: ConversationMessage) => void;
  onEmotionalChange?: (analysis: EmotionalAnalysis) => void;
  maxDurationSeconds?: number;
}

export function useEnhancedVoiceAssistant(options: UseEnhancedVoiceAssistantOptions = {}) {
  const {
    sessionId = `session_${Date.now()}`,
    userId = 'anonymous',
    onMessageReceived,
    onEmotionalChange,
    maxDurationSeconds = 120
  } = options;

  const [status, setStatus] = useState<CallStatus>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Initialize session
  useEffect(() => {
    // Load conversation history if exists
    loadConversationHistory();
  }, [sessionId]);

  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`/api/enhanced-voice/history?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setMessages(data.data.messages || []);
          setEmotionalAnalysis(data.data.emotionalHistory?.[data.data.emotionalHistory.length - 1] || null);
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('active');
      setError(null);

      // Auto-stop after max duration
      timerRef.current = setTimeout(() => {
        stopRecording();
      }, maxDurationSeconds * 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError('No se pudo acceder al micrófono');
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const response = await fetch('/api/enhanced-voice/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userId,
            audio: base64Audio.split(',')[1] // Remove data:audio/wav;base64, prefix
          })
        });

        if (response.ok) {
          const data: ConversationResponse = await response.json();
          handleConversationResponse(data);
        } else {
          throw new Error('Error processing audio');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Error procesando el audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendTextMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/enhanced-voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId,
          text
        })
      });

      if (response.ok) {
        const data: ConversationResponse = await response.json();
        handleConversationResponse(data);
      } else {
        throw new Error('Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error enviando mensaje');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConversationResponse = (data: ConversationResponse) => {
    // Add client message if transcription exists
    if (data.transcription) {
      const clientMessage: ConversationMessage = {
        id: Date.now().toString(),
        text: data.transcription,
        speaker: 'client',
        timestamp: new Date(),
        emotion: data.emotionalAnalysis?.emotion,
        confidence: data.emotionalAnalysis?.confidence
      };
      setMessages(prev => [...prev, clientMessage]);
      onMessageReceived?.(clientMessage);
    }

    // Add Daniela's response
    const danielaMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      text: data.response,
      speaker: 'daniela',
      timestamp: new Date(),
      emotion: 'professional'
    };
    setMessages(prev => [...prev, danielaMessage]);
    onMessageReceived?.(danielaMessage);

    // Update emotional analysis
    if (data.emotionalAnalysis) {
      setEmotionalAnalysis(data.emotionalAnalysis);
      onEmotionalChange?.(data.emotionalAnalysis);
    }

    // Update suggested actions
    setSuggestedActions(data.suggestedActions);

    setStatus('active');
  };

  const clearConversation = async () => {
    try {
      await fetch('/api/enhanced-voice/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      setMessages([]);
      setEmotionalAnalysis(null);
      setSuggestedActions([]);
      setStatus('idle');
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const playAudioResponse = async (audioBase64: string) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
    };
  }, []);

  return {
    // State
    status,
    messages,
    emotionalAnalysis,
    suggestedActions,
    isRecording,
    isProcessing,
    error,

    // Actions
    startRecording,
    stopRecording,
    sendTextMessage,
    clearConversation,
    playAudioResponse,

    // Computed
    isConnected: status === 'active',
    canRecord: !isRecording && !isProcessing,
    canSend: !isProcessing
  };
}
