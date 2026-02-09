import { useCallback, useEffect } from "react";
import { useDaniela } from "../DanielaProvider";
import { useVoiceAssistant } from "../../../hooks/useVoiceAssistant";

export const useDanielaCore = () => {
  const { state, sendMessage, setSpeaking, setTyping, updateConfig } = useDaniela();
  
  const {
    status: voiceStatus,
    isSpeaking: isVapiSpeaking,
    volume: vapiVolume,
    start: startVoice,
    stop: stopVoice,
    isConnected: isVoiceConnected,
    error: voiceError
  } = useVoiceAssistant({
    idleTimeoutSeconds: state.config.voice?.autoStart ? 30 : 45,
    maxDurationSeconds: 180,
    onSpeechStart: () => {
      setSpeaking(true, vapiVolume);
    },
    onSpeechEnd: () => {
      setSpeaking(false, 0);
    },
  });

  // Enhanced message sending with voice support
  const sendMessageWithVoice = useCallback(async (text: string, useVoice = false) => {
    await sendMessage(text);
    
    if (useVoice && state.config.voice?.enabled) {
      // Convert text to speech if voice is available
      try {
        // This would integrate with ElevenLabs or native TTS
        console.log("Converting to speech:", text);
      } catch (error) {
        console.error("Text-to-speech error:", error);
      }
    }
  }, [sendMessage, state.config.voice]);

  // Toggle voice assistant
  const toggleVoice = useCallback(async () => {
    if (isVapiSpeaking || isVoiceConnected) {
      stopVoice?.();
      setSpeaking(false, 0);
    } else {
      setTyping(true);
      try {
        await startVoice?.();
        setTyping(false);
      } catch (error) {
        console.error("Error starting voice:", error);
        setTyping(false);
      }
    }
  }, [isVapiSpeaking, isVoiceConnected, startVoice, stopVoice, setSpeaking, setTyping]);

  // Auto-configure based on context
  useEffect(() => {
    switch (state.config.context) {
      case "admin":
        updateConfig({
          personality: { ...state.config.personality, mode: "strategic" },
          features: { ...state.config.features, analytics: true, multiUser: true }
        });
        break;
      case "client":
        updateConfig({
          personality: { ...state.config.personality, mode: "friendly" },
          features: { ...state.config.features, analytics: false, multiUser: false }
        });
        break;
      case "demo":
        updateConfig({
          personality: { ...state.config.personality, mode: "professional" },
          features: { ...state.config.features, realTime: true }
        });
        break;
      case "mobile":
        updateConfig({
          voice: { ...state.config.voice, autoStart: false },
          features: { ...state.config.features, memory: true }
        });
        break;
      default:
        // Keep default website configuration
        break;
    }
  }, [state.config.context, updateConfig]);

  return {
    // State
    state,
    
    // Actions
    sendMessage: sendMessageWithVoice,
    toggleVoice,
    
    // Voice state
    voiceStatus,
    isVapiSpeaking,
    vapiVolume,
    isVoiceConnected,
    voiceError,
    
    // Combined state
    isAnySpeaking: state.isSpeaking || isVapiSpeaking,
    currentVolume: Math.max(state.volume, vapiVolume),
    
    // Status
    isFullyConnected: state.isConnected && isVoiceConnected,
    hasError: !!state.error || !!voiceError,
  };
};
