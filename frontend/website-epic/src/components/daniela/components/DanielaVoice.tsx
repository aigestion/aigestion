import React, { useEffect, useCallback } from "react";
import { useVoiceAssistant } from "../../../hooks/useVoiceAssistant";
import { useDaniela } from "../DanielaProvider";

export const DanielaVoice: React.FC = () => {
  const { state, setSpeaking, setTyping } = useDaniela();
  
  const {
    status,
    isSpeaking: isVapiSpeaking,
    volume: vapiVolume,
    error: vapiError,
    start,
    stop,
    isConnected
  } = useVoiceAssistant({
    idleTimeoutSeconds: 45,
    maxDurationSeconds: 180,
    onSpeechStart: () => {
      setSpeaking(true, vapiVolume);
    },
    onSpeechEnd: () => {
      setSpeaking(false, 0);
    },
  });

  // Sync voice state with Daniela state
  useEffect(() => {
    setSpeaking(isVapiSpeaking, vapiVolume);
  }, [isVapiSpeaking, vapiVolume, setSpeaking]);

  const toggleVoice = useCallback(async () => {
    if (isConnected || isVapiSpeaking) {
      stop?.();
      setSpeaking(false, 0);
    } else {
      setTyping(true);
      try {
        await start?.();
        setTyping(false);
      } catch (error) {
        console.error("Error starting voice:", error);
        setTyping(false);
      }
    }
  }, [isConnected, isVapiSpeaking, start, stop, setSpeaking, setTyping]);

  // Auto-connect if voice is enabled in config
  useEffect(() => {
    if (state.config.voice.enabled && state.config.voice.autoStart && !isConnected) {
      toggleVoice();
    }
  }, [state.config.voice.enabled, state.config.voice.autoStart, isConnected, toggleVoice]);

  // Handle voice errors
  useEffect(() => {
    if (vapiError) {
      console.error("Voice assistant error:", vapiError);
    }
  }, [vapiError]);

  return (
    <div className="daniela-voice">
      {/* Voice control button */}
      <button
        onClick={toggleVoice}
        className={`voice-toggle ${isConnected || isVapiSpeaking ? "active" : ""}`}
        disabled={!state.config.voice.enabled}
      >
        <div className="voice-icon">
          {isConnected || isVapiSpeaking ? "🔊" : "🎤"}
        </div>
        <div className="voice-status">
          {isConnected || isVapiSpeaking ? "Desconectar" : "Conectar voz"}
        </div>
      </button>

      {/* Voice status indicator */}
      <div className="voice-indicator">
        <div className={`status-dot ${status}`} />
        <span className="status-text">
          {status === "idle" && "Inactivo"}
          {status === "connecting" && "Conectando..."}
          {status === "active" && "Activo"}
          {status === "error" && "Error"}
        </span>
      </div>

      {/* Volume indicator */}
      {(isConnected || isVapiSpeaking) && (
        <div className="volume-indicator">
          <div className="volume-bar">
            <div 
              className="volume-level" 
              style={{ width: `${vapiVolume * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error display */}
      {vapiError && (
        <div className="voice-error">
          <span className="error-icon">⚠️</span>
          {vapiError}
        </div>
      )}
    </div>
  );
};
