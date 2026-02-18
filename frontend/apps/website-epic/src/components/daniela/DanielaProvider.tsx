import { danielaApi } from '../../services/daniela-api.service';
import { DanielaConfig, DanielaContextType, DanielaMessage, DanielaState } from './DanielaTypes';

const initialState: DanielaState = {
  messages: [],
  isConnected: false,
  isTyping: false,
  isSpeaking: false,
  volume: 0,
  error: null,
  config: {
    variant: 'assistant',
    context: 'website',
    voice: {
      enabled: true,
      provider: 'elevenlabs', // 🌌 Optimizado para ElevenLabs
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - español España perfecto
      autoStart: false,
    },
    personality: {
      mode: 'professional',
      language: 'es',
      name: 'Daniela',
    },
    features: {
      memory: true,
      analytics: true,
      multiUser: false,
      realTime: true,
    },
  },
};

type DanielaAction =
  | { type: 'ADD_MESSAGE'; payload: DanielaMessage }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_SPEAKING'; payload: { speaking: boolean; volume?: number } }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_CONFIG'; payload: Partial<DanielaConfig> };

function danielaReducer(state: DanielaState, action: DanielaAction): DanielaState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'SET_SPEAKING':
      return {
        ...state,
        isSpeaking: action.payload.speaking,
        volume: action.payload.volume || state.volume,
      };
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };
    default:
      return state;
  }
}

const DanielaContext = createContext<DanielaContextType | null>(null);

export const useDaniela = () => {
  const context = useContext(DanielaContext);
  if (!context) {
    throw new Error('useDaniela must be used within DanielaProvider');
  }
  return context;
};

interface DanielaProviderProps {
  children: ReactNode;
  config?: Partial<DanielaConfig>;
}

export const DanielaProvider: React.FC<DanielaProviderProps> = ({ children, config }) => {
  const [state, dispatch] = useReducer(danielaReducer, {
    ...initialState,
    config: config ? { ...initialState.config, ...config } : initialState.config,
  });

  const sendMessage = async (text: string) => {
    const userMessage: DanielaMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_TYPING', payload: true });

    try {
      const response = await danielaApi.chat(text, 'website-user', `session-${Date.now()}`);

      // 🌌 TO-DO LISTO PARA DANIELA CON ELEVENLABS
      // 1. Síntesis de voz con ElevenLabs optimizado
      const audioResponse = await elevenLabsService.textToSpeech({
        text: response.response,
        voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - voz española perfecta
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: 0.65,
          use_speaker_boost: true,
        },
      });

      // 2. Reproducción automática del audio
      await elevenLabsService.playAudio(audioResponse.audio);

      // 3. Mensaje con metadata de audio
      const danielaMessage: DanielaMessage = {
        id: `daniela-${Date.now()}`,
        text: response.response,
        sender: 'daniela',
        timestamp: new Date(),
        audioUrl: URL.createObjectURL(new Blob([audioResponse.audio], { type: 'audio/mpeg' })),
        audioDuration: audioResponse.duration_ms,
        suggestions: ['Saber más sobre AIGestion', 'Ver casos de éxito', 'Contactar con experto'],
        sentiment: response.sentiment || 'positive',
        confidence: response.confidence || 0.95,
        voiceProvider: 'elevenlabs',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
      };

      dispatch({ type: 'ADD_MESSAGE', payload: danielaMessage });

      // 4. Estado de speaking
      dispatch({
        type: 'SET_SPEAKING',
        payload: {
          speaking: true,
          volume: 0.8,
        },
      });

      // 5. Limpiar estado de speaking después del audio
      if (audioResponse.duration_ms) {
        setTimeout(() => {
          dispatch({ type: 'SET_SPEAKING', payload: { speaking: false, volume: 0 } });
        }, audioResponse.duration_ms + 500);
      }
    } catch (error) {
      console.error('Error en sendMessage con ElevenLabs:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al generar voz con ElevenLabs' });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const updateConfig = (newConfig: Partial<DanielaConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: newConfig });
  };

  const setTyping = (typing: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: typing });
  };

  const setSpeaking = (speaking: boolean, volume = 0) => {
    dispatch({ type: 'SET_SPEAKING', payload: { speaking, volume } });
  };

  const value: DanielaContextType = {
    state,
    sendMessage,
    clearMessages,
    updateConfig,
    setTyping,
    setSpeaking,
  };

  return <DanielaContext.Provider value={value}>{children}</DanielaContext.Provider>;
};
