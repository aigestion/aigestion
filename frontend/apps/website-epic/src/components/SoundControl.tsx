import React, { useState } from 'react';
import { audioService } from '../services/audio';

export const SoundControl: React.FC = () => {
    const [isMuted, setIsMuted] = useState(audioService.getMutedState());

    const toggleSound = () => {
        const newState = audioService.toggleMute();
        setIsMuted(newState);

        // Play a verification chime if unmuted
        if (!newState) {
            audioService.play('success_chime');
        }
    };

    return (
        <button
            onClick={toggleSound}
            className="p-2 text-white/50 hover:text-nexus-cyan transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
            {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            )}
        </button>
    );
};
