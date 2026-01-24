import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Global declaration for Vapi SDK when loaded via CDN
 */
declare global {
  interface Window {
    Vapi: any;
  }
}

export type CallStatus = 'idle' | 'connecting' | 'active' | 'error';

interface UseVoiceAssistantOptions {
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  maxDurationSeconds?: number;
  idleTimeoutSeconds?: number;
}

// Temporary disable Vapi functionality
const VAPI_DISABLED = true;

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  // Early return if VAPI is disabled
  if (VAPI_DISABLED) {
    return {
      status: 'idle' as CallStatus,
      isSpeaking: false,
      volume: 0,
      error: null,
      startCall: () => { },
      stopCall: () => { },
      toggleMute: () => { },
      isMuted: false,
      duration: 0,
      suggestedActions: [],
      isProcessing: false,
      startRecording: () => { },
      stopRecording: () => { }
    };
  }

  const {
    maxDurationSeconds = 120, // 2 minutes max to save credits
    idleTimeoutSeconds = 30    // 30 seconds of silence to disconnect
  } = options;

  const [status, setStatus] = useState<CallStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const vapiRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const totalTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Initialize Vapi
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Vapi && !vapiRef.current) {
      const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || '67c74f53-b26a-4d23-9f5b-91c68e1a6c4b'; // Placeholder if missing
      vapiRef.current = new window.Vapi(publicKey);

      vapiRef.current.on('call-start', () => {
        setStatus('active');
        setError(null);
        startTotalTimer();
      });

      vapiRef.current.on('call-end', () => {
        setStatus('idle');
        stopTimers();
      });

      vapiRef.current.on('speech-start', () => {
        setIsSpeaking(true);
        resetIdleTimer();
        options.onSpeechStart?.();
      });

      vapiRef.current.on('speech-end', () => {
        setIsSpeaking(false);
        startIdleTimer();
        options.onSpeechEnd?.();
      });

      vapiRef.current.on('volume-level', (level: number) => {
        setVolume(level);
      });

      vapiRef.current.on('error', (err: any) => {
        console.error('Vapi Error:', err);
        setError(err.message || 'Error de conexión con Daniela');
        setStatus('error');
      });
    }

    return () => {
      stopTimers();
    };
  }, []);

  const startTotalTimer = () => {
    if (totalTimerRef.current) { clearTimeout(totalTimerRef.current); }
    totalTimerRef.current = setTimeout(() => {
      console.log('[VoiceAssistant] Max duration reached. Disconnecting to save credits.');
      stop();
    }, maxDurationSeconds * 1000);
  };

  const startIdleTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); }
    timerRef.current = setTimeout(() => {
      console.log('[VoiceAssistant] Idle timeout reached. Disconnecting.');
      stop();
    }, idleTimeoutSeconds * 1000);
  };

  const resetIdleTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); }
  };

  const stopTimers = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); }
    if (totalTimerRef.current) { clearTimeout(totalTimerRef.current); }
  };

  const start = useCallback(async () => {
    if (!vapiRef.current) {
      setError('Vapi SDK no cargado. Reintentando...');
      return;
    }

    setStatus('connecting');
    try {
      // Configuration for Daniela (Best of Both: Vapi Loop + ElevenLabs Voice)
      const assistantConfig = {
        name: "Daniela - AIGestion",
        firstMessage: "Hola, soy Daniela de AIGestion. ¿En qué puedo ayudarte hoy?",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "es"
        },
        voice: {
          provider: "elevenlabs",
          voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL", // 'Bella' as default high quality
        },
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Eres Daniela, la embajadora digital de AIGestion.net. Tu objetivo es ayudar a los usuarios a entender cómo la IA soberana y la arquitectura de AIGestion pueden transformar sus empresas. Eres profesional, futurista, amable y experta en tecnología. Mantén tus respuestas concisas y claras."
            }
          ]
        }
      };

      await vapiRef.current.start(assistantConfig);
    } catch (err: any) {
      setError(err.message || 'No se pudo iniciar la conversación');
      setStatus('error');
    }
  }, []);

  const stop = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setStatus('idle');
  }, []);

  return {
    status,
    isSpeaking,
    volume,
    error,
    start,
    stop,
    isConnected: status === 'active'
  };
}
