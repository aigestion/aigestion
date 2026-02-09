
import { useCallback } from 'react';
import { audioService } from '../services/audio-service';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'click_activate' | 'hover_glass' | 'wuaw_subtle' | 'data_pulse' | 'success_chime';

export const useAudio = () => {
    const play = useCallback((type: SoundType) => {
        try {
            audioService.play(type);
        } catch (error) {
            console.log(`[Audio] Failed to play sound: ${type}`, error);
        }
    }, []);

    const playHover = useCallback(() => play('hover_glass'), [play]);
    const playClick = useCallback(() => play('click_activate'), [play]);
    const playWuaw = useCallback(() => play('wuaw_subtle'), [play]);
    const playPulse = useCallback(() => play('data_pulse'), [play]);
    const playSuccess = useCallback(() => play('success_chime'), [play]);

    return {
        play,
        playHover,
        playClick,
        playWuaw,
        playPulse,
        playSuccess
    };
};
