import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useSoundContext } from '../contexts/SoundContext';

const SOUND_URLS = {
  tick: '/website-epic/sounds/hover_glass.mp3',
  thud: '/website-epic/sounds/click_activate.mp3',
  glass: '/website-epic/sounds/success_chime.mp3',
  whoosh: '/website-epic/sounds/menu_open.mp3',
  pop: '/website-epic/sounds/data_pulse.mp3',
  error: '/website-epic/sounds/error_buzzer.mp3',
  click: '/website-epic/sounds/click_activate.mp3',
  toggle: '/website-epic/sounds/menu_open.mp3',
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
