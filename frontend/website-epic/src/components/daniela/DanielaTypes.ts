export interface DanielaMessage {
  id: string;
  text: string;
  sender: "user" | "daniela";
  timestamp: Date;
  suggestions?: string[];
  sentiment?: "positive" | "neutral" | "negative";
  confidence?: number;
}

export interface DanielaConfig {
  variant: "widget" | "assistant" | "advisor" | "full";
  context: "website" | "admin" | "client" | "demo" | "mobile";
  voice: {
    enabled: boolean;
    provider: "vapi" | "elevenlabs" | "native";
    voiceId: string;
    autoStart: boolean;
  };
  personality: {
    mode: "professional" | "friendly" | "strategic" | "creative";
    language: "es" | "en" | "pt";
    name: string;
  };
  features: {
    memory: boolean;
    analytics: boolean;
    multiUser: boolean;
    realTime: boolean;
  };
}

export interface DanielaState {
  messages: DanielaMessage[];
  isConnected: boolean;
  isTyping: boolean;
  isSpeaking: boolean;
  volume: number;
  error: string | null;
  config: DanielaConfig;
}

export type CallStatus = "idle" | "connecting" | "active" | "error";

export interface DanielaContextType {
  state: DanielaState;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  updateConfig: (config: Partial<DanielaConfig>) => void;
  setTyping: (typing: boolean) => void;
  setSpeaking: (speaking: boolean, volume?: number) => void;
  getInsights: () => Promise<any[]>;
}
