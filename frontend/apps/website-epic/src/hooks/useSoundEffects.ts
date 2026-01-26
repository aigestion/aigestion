import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useSoundContext } from '../contexts/SoundContext';

const SOUND_URLS = {
  tick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  thud: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  glass: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  pop: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  toggle: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
};

const useHowl = (src: string, options: { volume: number; soundEnabled: boolean }) => {
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    howlRef.current = new Howl({
      src: [src],
      preload: true,
      volume: options.volume,
    });

    return () => {
      howlRef.current?.unload();
    };
  }, [src]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(options.volume);
    }
  }, [options.volume]);

  const play = useCallback(() => {
    if (options.soundEnabled && howlRef.current) {
      howlRef.current.play();
    }
  }, [options.soundEnabled]);

  return [play];
};

export const useSoundEffects = () => {
  const { isMuted, volume } = useSoundContext();

  const [playTick] = useHowl(SOUND_URLS.tick, { volume: volume * 0.2, soundEnabled: !isMuted });
  const [playThud] = useHowl(SOUND_URLS.thud, { volume: volume * 0.4, soundEnabled: !isMuted });
  const [playSuccess] = useHowl(SOUND_URLS.glass, { volume: volume * 0.3, soundEnabled: !isMuted });
  const [playWhoosh] = useHowl(SOUND_URLS.whoosh, {
    volume: volume * 0.15,
    soundEnabled: !isMuted,
  });

  const [playPop] = useHowl(SOUND_URLS.pop, { volume: volume * 0.25, soundEnabled: !isMuted });
  const [playError] = useHowl(SOUND_URLS.error, { volume: volume * 0.4, soundEnabled: !isMuted });
  const [playToggle] = useHowl(SOUND_URLS.toggle, { volume: volume * 0.2, soundEnabled: !isMuted });

  return {
    playHover: playTick,
    playClick: playThud,
    playSuccess,
    playWhoosh,
    playPop,
    playError,
    playToggle,
  };
};
