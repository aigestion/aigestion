// Core exports
export { DanielaCore } from './DanielaCore';
export { DanielaProvider, useDaniela } from './DanielaProvider';

// Components
export { DanielaChat } from './components/DanielaChat';
export { DanielaAvatar } from './components/DanielaAvatar';
export { DanielaVoice } from './components/DanielaVoice';

// Hooks
export { useDanielaCore } from './hooks/useDanielaCore';

// Types
export type {
  DanielaMessage,
  DanielaConfig,
  DanielaState,
  DanielaContextType,
  CallStatus,
} from './DanielaTypes';

// Legacy exports for backward compatibility
export { default as DanielaWebsite } from './DanielaCore';
export { default as DanielaAssistant } from './DanielaCore';
export { default as DanielaAI } from './DanielaCore';
