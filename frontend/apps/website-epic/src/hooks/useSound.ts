import { useCallback } from 'react';

import { audioService, type SoundType } from '../services/audio';

export const useSound = () => {
  const play = useCallback((type: SoundType) => {
    try {
      audioService.play(type);
    } catch (error) {
      // Fail silently for UI effects
    }
  }, []);

  const playHover = useCallback(() => play('hover_glass'), [play]);
  const playClick = useCallback(() => play('click_activate'), [play]);
  const playWuaw = useCallback(() => play('wuaw_subtle'), [play]);
  const playPulse = useCallback(() => play('data_pulse'), [play]);

  return {
    play,
    playHover,
    playClick,
    playWuaw,
    playPulse
  };
};
