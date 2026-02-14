import { useState, useCallback, useRef } from 'react';

// Speech Recognition Type Definition

export const useDanielaVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening]);

  const startListening = () => {
    const { webkitSpeechRecognition }: any = window;
    if (!webkitSpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const results = event.results;
      const transcript = results[results.length - 1][0].transcript;
      setTranscript(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speak = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      v => v.name.includes('Female') || v.name.includes('Google Español') || v.lang === 'es-ES'
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return { isListening, transcript, isSpeaking, toggleListening, speak };
};
