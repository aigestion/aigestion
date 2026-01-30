import { Howl, Howler } from 'howler';

// Sound definition types
export type SoundType = 'hover_glass' | 'click_activate' | 'menu_open' | 'success_chime' | 'error_buzzer' | 'nexus_hum' | 'wuaw_subtle' | 'data_pulse';

interface SoundAsset {
    src: string;
    volume: number;
    loop?: boolean;
}

// Get the base path for sounds - handle both dev and prod
const getBasePath = () => {
    if (import.meta.env.DEV) {
        return '/sounds';
    }
    return '/sounds';
};

const SOUND_ASSETS: Record<SoundType, SoundAsset> = {
  hover_glass: { src: `${getBasePath()}/hover_glass.mp3`, volume: 0.1 },
  click_activate: { src: `${getBasePath()}/click_activate.mp3`, volume: 0.3 },
  menu_open: { src: `${getBasePath()}/menu_open.mp3`, volume: 0.2 },
  success_chime: { src: `${getBasePath()}/success_chime.mp3`, volume: 0.2 },
  error_buzzer: { src: `${getBasePath()}/error_buzzer.mp3`, volume: 0.2 },
  nexus_hum: { src: `${getBasePath()}/nexus_hum.mp3`, volume: 0.05, loop: true },
  wuaw_subtle: { src: `${getBasePath()}/wuaw_subtle.mp3`, volume: 0.15 },
  data_pulse: { src: `${getBasePath()}/data_pulse.mp3`, volume: 0.1 },
};

class AudioService {
    private static instance: AudioService;
    private sounds = new Map<SoundType, Howl>();
    private isMuted = false;
    private ambienceId: number | null = null;

    private constructor() {
        // Initialize mute state from localStorage
        const savedMute = localStorage.getItem('aigestion_mute');
        if (savedMute) {
            this.isMuted = JSON.parse(savedMute);
            Howler.mute(this.isMuted);
        }

        // Preload critical interaction sounds
        this.loadSound('hover_glass');
        this.loadSound('click_activate');
    }

    public static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    private loadSound(type: SoundType): Howl {
        if (this.sounds.has(type)) {
            return this.sounds.get(type)!;
        }

        const asset = SOUND_ASSETS[type];
        const sound = new Howl({
            src: [asset.src],
            volume: asset.volume,
            loop: asset.loop,
            preload: true,
            onloaderror: (_id: number, _err: any) => {
                // Suppress errors for missing placeholder files
                // console.warn(`Failed to load sound: ${type}`, err);
            }
        });

        this.sounds.set(type, sound);
        return sound;
    }

    public play(type: SoundType): void {
        if (this.isMuted && type !== 'nexus_hum') { return; }

        const sound = this.loadSound(type);
        sound.play();
    }

    public startAmbience(): void {
        if (this.isMuted || this.ambienceId) { return; }

        const sound = this.loadSound('nexus_hum');
        if (!sound.playing()) {
            this.ambienceId = sound.play();
            sound.fade(0, SOUND_ASSETS.nexus_hum.volume, 2000, this.ambienceId);
        }
    }

    public stopAmbience(): void {
        const sound = this.sounds.get('nexus_hum');
        if (sound && this.ambienceId) {
            sound.fade(sound.volume(), 0, 2000, this.ambienceId);
            setTimeout(() => {
                sound.stop();
                this.ambienceId = null;
            }, 2000);
        }
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
        localStorage.setItem('aigestion_mute', JSON.stringify(this.isMuted));

        // Handle ambience specifically
        if (this.isMuted) {
            this.stopAmbience();
        } else {
            // Optional: Don't auto-start ambience on unmute unless explicitly desired
            // this.startAmbience();
        }

        return this.isMuted;
    }

    public getMutedState(): boolean {
        return this.isMuted;
    }
}

export const audioService = AudioService.getInstance();
