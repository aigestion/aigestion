import { useCallback } from 'react';

import { audioService, type SoundType } from '../services/audio-service';

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
  const playSuccess = useCallback(() => play('success_chime'), [play]);
  const playError = useCallback(() => play('error_buzzer'), [play]);
  const playMenu = useCallback(() => play('menu_open'), [play]);

  return {
    play,
    playHover,
    playClick,
    playWuaw,
    playPulse,
    playSuccess,
    playError,
    playMenu,
  };

};
