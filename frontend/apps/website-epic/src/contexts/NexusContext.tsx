import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface NexusContextType {
  godMode: boolean; // Ultra-high graphics/effects
  setGodMode: (enabled: boolean) => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [godMode, setGodMode] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const { playSuccess } = useSoundEffects();

  useEffect(() => {
    if (godMode) {
      document.body.classList.add('nexus-god-mode');
      // Play a subtle entry sound if just mounted, but maybe better to control it via user action
    } else {
      document.body.classList.remove('nexus-god-mode');
    }
  }, [godMode]);

  useEffect(() => {
    // Initial activation sound
    const timer = setTimeout(() => {
      playSuccess();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleReduceMotion = () => setReduceMotion(prev => !prev);

  const value = React.useMemo(
    () => ({
      godMode,
      setGodMode,
      reduceMotion,
      toggleReduceMotion,
    }),
    [godMode, reduceMotion]
  );

  return <NexusContext.Provider value={value}>{children}</NexusContext.Provider>;
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};
