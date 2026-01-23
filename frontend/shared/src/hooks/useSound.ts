import { useCallback } from 'react';
import { audioService, type SoundType } from '../services/AudioService';

export const useSound = () => {
    const play = useCallback((type: SoundType) => {
        audioService.play(type);
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
