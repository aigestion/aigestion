import { useCallback, useEffect } from 'react';

export type SoundType =
  | 'hover_glass'
  | 'click_activate'
  | 'menu_open'
  | 'success_chime'
  | 'error_buzzer'
  | 'nexus_hum'
  | 'wuaw_subtle'
  | 'data_pulse';

interface AudioCache {
  audio: HTMLAudioElement;
  isLoaded: boolean;
  error: boolean;
}

class AudioService {
  private audioCache = new Map<string, AudioCache>();
  private isMuted = false;
  private ambiencePlaying: HTMLAudioElement | null = null;
  private loadingPromises = new Map<string, Promise<HTMLAudioElement>>();
  private maxCacheSize = 20;
  private preloadQueue: SoundType[] = ['hover_glass', 'click_activate', 'success_chime'];

  constructor() {
    // Preload essential sounds asynchronously
    this.preloadEssentialSounds();
  }

  private async preloadEssentialSounds(): Promise<void> {
    // Preload in background without blocking
    setTimeout(() => {
      this.preloadQueue.forEach(async (sound) => {
        try {
          await this.loadSound(sound);
        } catch (error) {
          // Silent fail for preloading
        }
      });
    }, 1000);
  }

  private cleanupCache(): void {
    if (this.audioCache.size <= this.maxCacheSize) return;

    // Remove least recently used items
    const entries = Array.from(this.audioCache.entries());
    const toRemove = entries.slice(0, entries.length - this.maxCacheSize);

    toRemove.forEach(([key]) => {
      const cache = this.audioCache.get(key);
      if (cache?.audio) {
        cache.audio.pause();
        cache.audio.src = '';
      }
      this.audioCache.delete(key);
    });
  }

  private loadSound(type: SoundType): Promise<HTMLAudioElement> {
    // Return existing promise if loading
    if (this.loadingPromises.has(type)) {
      return this.loadingPromises.get(type)!;
    }

    const loadPromise = new Promise<HTMLAudioElement>((resolve) => {
      const existingCache = this.audioCache.get(type);
      if (existingCache?.isLoaded) {
        resolve(existingCache.audio);
        return;
      }

      const createSilentFallback = (): HTMLAudioElement => {
        const silentAudio = new Audio();
        silentAudio.volume = 0;
        return silentAudio;
      };

      const tryLoad = (src: string): Promise<HTMLAudioElement> => {
        return new Promise((resolveLoad) => {
          const audio = new Audio();
          audio.src = src;
          audio.volume = 0.3;
          audio.preload = 'auto';

          const timeout = setTimeout(() => {
            console.warn(`[AudioService] Timeout loading ${type} from ${src}`);
            resolveLoad(createSilentFallback());
          }, 5000);

          audio.addEventListener('canplaythrough', () => {
            clearTimeout(timeout);
            const cache: AudioCache = { audio, isLoaded: true, error: false };
            this.audioCache.set(type, cache);
            this.cleanupCache();
            resolveLoad(audio);
          }, { once: true });

          audio.addEventListener('error', () => {
            clearTimeout(timeout);
            console.debug(`[AudioService] Failed to load ${type} from ${src}`);
            resolveLoad(createSilentFallback());
          }, { once: true });

          audio.load();
        });
      };

      // Try .wav first, then .mp3
      tryLoad(`/sounds/${type}.wav`)
        .catch(() => tryLoad(`/sounds/${type}.mp3`))
        .then((audio) => {
          this.loadingPromises.delete(type);
          resolve(audio);
        });
    });

    this.loadingPromises.set(type, loadPromise);
    return loadPromise;
  }

  async play(type: SoundType): Promise<void> {
    if (this.isMuted) return;

    try {
      let audio = this.audioCache.get(type)?.audio;

      if (!audio || !this.audioCache.get(type)?.isLoaded) {
        audio = await this.loadSound(type);
      }

      // Reset and play with error handling
      try {
        audio.currentTime = 0;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Autoplay was prevented - this is expected in some browsers
            if (error.name !== 'NotAllowedError') {
              console.debug(`[AudioService] Error playing ${type}:`, error);
            }
          });
        }
      } catch (playError) {
        console.debug(`[AudioService] Playback error for ${type}:`, playError);
      }
    } catch (error) {
      // Fail silently for better UX
      console.debug(`[AudioService] Failed to play ${type}:`, error);
    }
  }

  async startAmbience(): Promise<void> {
    if (this.isMuted || this.ambiencePlaying) return;

    try {
      const audio = await this.loadSound('nexus_hum');
      if (audio.volume === 0) return; // Skip if silent fallback

      audio.loop = true;
      audio.volume = 0.05; // Very low volume for ambience

      try {
        await audio.play();
        this.ambiencePlaying = audio;
      } catch (error) {
        console.debug('[AudioService] Ambience autoplay prevented:', error);
      }
    } catch (error) {
      console.debug('[AudioService] Error starting ambience:', error);
    }
  }

  stopAmbience(): void {
    if (this.ambiencePlaying) {
      this.ambiencePlaying.pause();
      this.ambiencePlaying.currentTime = 0;
      this.ambiencePlaying = null;
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopAmbience();
      // Pause all cached audio
      this.audioCache.forEach((cache) => {
        if (cache.isLoaded) {
          cache.audio.pause();
        }
      });
    }

    return this.isMuted;
  }

  getMutedState(): boolean {
    return this.isMuted;
  }

  // Performance monitoring
  getCacheStats(): { size: number; loaded: number; errors: number } {
    const entries = Array.from(this.audioCache.values());
    return {
      size: entries.length,
      loaded: entries.filter(c => c.isLoaded && !c.error).length,
      errors: entries.filter(c => c.error).length,
    };
  }

  // Cleanup method
  destroy(): void {
    this.stopAmbience();
    this.audioCache.forEach((cache) => {
      if (cache.audio) {
        cache.audio.pause();
        cache.audio.src = '';
      }
    });
    this.audioCache.clear();
    this.loadingPromises.clear();
  }
}

// Singleton instance
export const audioService = new AudioService();

// React hook for audio
export const useSound = () => {
  const play = useCallback((type: SoundType) => {
    audioService.play(type);
  }, []);

  const playHover = useCallback(() => play('hover_glass'), [play]);
  const playClick = useCallback(() => play('click_activate'), [play]);
  const playWuaw = useCallback(() => play('wuaw_subtle'), [play]);
  const playPulse = useCallback(() => play('data_pulse'), [play]);
  const playSuccess = useCallback(() => play('success_chime'), [play]);
  const playError = useCallback(() => play('error_buzzer'), [play]);
  const playMenu = useCallback(() => play('menu_open'), [play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optional cleanup if needed
    };
  }, []);

  return {
    play,
    playHover,
    playClick,
    playWuaw,
    playPulse,
    playSuccess,
    playError,
    playMenu,
    startAmbience: () => audioService.startAmbience(),
    stopAmbience: () => audioService.stopAmbience(),
    toggleMute: () => audioService.toggleMute(),
    getMutedState: () => audioService.getMutedState(),
    getCacheStats: () => audioService.getCacheStats(),
  };
};
