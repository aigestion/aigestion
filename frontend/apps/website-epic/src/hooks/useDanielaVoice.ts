import { useState, useCallback, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';

// 🌌 Daniela Sovereign Assistant Configuration
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

// Singleton instance to prevent multiple connections
let vapiInstance: Vapi | null = null;
if (VAPI_PUBLIC_KEY && typeof window !== 'undefined') {
  vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
}

export const useDanielaVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Ref for native fallback
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!vapiInstance) return;

    vapiInstance.on('call-start', () => {
      setIsListening(true);
      setIsConnected(true);
    });

    vapiInstance.on('call-end', () => {
      setIsListening(false);
      setIsConnected(false);
    });

    vapiInstance.on('speech-start', () => setIsSpeaking(true));
    vapiInstance.on('speech-end', () => setIsSpeaking(false));

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'partial') {
        setTranscript(message.transcript);
      }
    });

    vapiInstance.on('error', (e) => {
      console.error('Vapi Error:', e);
      setIsListening(false);
    });

    return () => {
      vapiInstance?.removeAllListeners();
    };
  }, []);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      vapiInstance?.stop();
      setIsListening(false);
    } else {
      if (vapiInstance) {
        // Start a conversation with a default assistant or just open the channel
        // In a real scenario, we might pass an assistantId or a transient assistant config
        try {
          await vapiInstance.start({
            name: 'Daniela Sovereign',
            model: {
              provider: 'openai',
              model: 'gpt-4',
              messages: [{ role: 'system', content: 'Eres Daniela, la IA soberana de AIGestion Nexus. Eres asertiva, profesional y protectora del sistema.' }]
            },
            voice: { provider: '11labs', voiceId: 'daniela' }, // Placeholder matching backend config
            transcriber: { provider: 'deepgram', model: 'nova-2', language: 'es' }
          });
          setIsListening(true);
        } catch (err) {
          console.warn('Vapi start failed, falling back to native recognition', err);
          startNativeListening();
        }
      } else {
        startNativeListening();
      }
    }
  }, [isListening]);

  // 🏥 NATIVE FALLBACKS
  const startNativeListening = () => {
    const { webkitSpeechRecognition }: any = window;
    if (!webkitSpeechRecognition) return;

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const results = event.results;
      const currentTranscript = results[results.length - 1][0].transcript;
      setTranscript(currentTranscript);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.start();
  };

  const speak = (text: string) => {
    if (vapiInstance && isListening) {
      // Vapi handles its own TTS during a call
      return;
    }
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    
    // Attempt to find a high-quality Spanish female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang === 'es-ES' && (v.name.includes('Female') || v.name.includes('Google')));
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return { isListening, transcript, isSpeaking, isConnected, toggleListening, speak };
};
