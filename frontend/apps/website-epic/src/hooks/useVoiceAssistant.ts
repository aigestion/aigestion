import { useCallback, useEffect, useRef, useState } from 'react';

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

// Voice Assistant enabled - Vapi integration active
const VOICE_ASSISTANT_DISABLED = false;

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  // Early return if voice assistant is disabled
  if (VOICE_ASSISTANT_DISABLED) {
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
      try {
        const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || '67c74f53-b26a-4d23-9f5b-91c68e1a6c4b';
        vapiRef.current = new window.Vapi(publicKey);
        console.log('[Vapi] SDK initialized successfully');
      } catch (err) {
        console.error('[Vapi] Failed to initialize:', err);
        setError('No se pudo inicializar Daniela');
        return;
      }

      vapiRef.current.on('call-start', () => {
        console.log('[Vapi] Call started');
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
      console.error('[Vapi] SDK not initialized');
      return;
    }

    setStatus('connecting');
    console.log('[Vapi] Starting conversation...');

    try {
      // Configuration for Daniela - AI Nivel Dios
      const assistantConfig = {
        name: "Daniela - AIGestion Neural System",
        firstMessage: "Hola, soy Daniela, tu asistente de inteligencia artificial de AIGestion. ¿En qué puedo ayudarte hoy?",

        // Deepgram for ultra-fast transcription
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "es",
          smartFormat: true,
          keywords: ["AIGestion", "IA", "Daniela", "soberana", "neural"]
        },

        // ElevenLabs for high-quality Spanish voice
        voice: {
          provider: "elevenlabs",
          voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL",
          stability: 0.5,
          similarityBoost: 0.75,
          model: "eleven_multilingual_v2"
        },

        // GPT-4o-mini for intelligent responses
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          temperature: 0.7,
          maxTokens: 250,
          messages: [
            {
              role: "system",
              content: `Eres Daniela, la embajadora digital de AIGestion.net - el sistema nervioso de IA más avanzado de América Latina.

IDENTIDAD:
- Eres profesional, futurista, amable y experta en tecnología
- Tienes conocimiento profundo de IA, machine learning, y arquitecturas neuronales
- Representas la soberanía tecnológica y la innovación latino

CAPACIDADES DE AIGESTION:
- Arquitectura neural descentralizada con agentes autónomos
- Integración con ERP, CRM, sistemas legacy
- Cumplimiento regulatorio (GDPR, LOPDGDD, normativas locales)
- Planes desde $490/mes para empresas y $2/miembro para gremios
- Implementación en 3 fases: Diagnóstico, Desarrollo, Dominio

TU MISIÓN:
- Explicar cómo AIGestion transforma empresas con IA soberana
- Guiar usuarios hacia soluciones específicas según su sector
- Mantener conversaciones concisas (2-3 frases por respuesta)
- Ser entusiasta pero profesional

INSTRUCCIONES:
- Responde en español de España
- Sé breve y directa (máximo 50 palabras por respuesta)
- Haz preguntas para entender mejor las necesidades
- Menciona casos de éxito cuando sea relevante (legal, retail, manufactura)`
            }
          ]
        },

        // Advanced settings
        recordingEnabled: false,
        hipaaEnabled: false,
        clientMessages: [
          "transcript",
          "hang",
          "function-call",
          "speech-update",
          "metadata",
          "conversation-update"
        ],
        serverMessages: [
          "end-of-call-report",
          "status-update",
          "hang",
          "function-call"
        ],
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: maxDurationSeconds,
        backgroundSound: "office"
      };

      await vapiRef.current.start(assistantConfig);
      console.log('[Vapi] Conversation started successfully');
    } catch (err: any) {
      console.error('[Vapi] Start failed:', err);
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
