import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SoundContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setGlobalVolume: (val: number) => void;
  playSfx: (sound: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('nexus-audio-muted');
    return saved ? JSON.parse(saved) : false;
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('nexus-audio-volume');
    return saved ? JSON.parse(saved) : 0.5;
  });

  useEffect(() => {
    localStorage.setItem('nexus-audio-muted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('nexus-audio-volume', JSON.stringify(volume));
  }, [volume]);

  const toggleMute = useCallback(() => setIsMuted((prev: boolean) => !prev), []);
  const setGlobalVolume = useCallback((val: number) => setVolume(val), []);

  // Placeholder for sound player - will be used by hooks
  const playSfx = useCallback(
    (sound: string) => {
      if (isMuted) return;
      // Implementation will be handled by specific hooks to avoid heavy preloading in context
      console.log(`[SoundContext] Playing: ${sound}`);
    },
    [isMuted]
  );

  return (
    <SoundContext.Provider value={{ isMuted, volume, toggleMute, setGlobalVolume, playSfx }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};
