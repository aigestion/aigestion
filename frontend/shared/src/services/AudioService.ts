import { Howl, Howler } from 'howler';

export type SoundType = 'hover_glass' | 'click_activate' | 'menu_open' | 'success_chime' | 'error_buzzer' | 'nexus_hum' | 'wuaw_subtle' | 'data_pulse';

interface SoundAsset {
    src: string;
    volume: number;
    loop?: boolean;
}

const SOUND_ASSETS: Record<SoundType, SoundAsset> = {
    hover_glass: { src: '/sounds/hover_glass.mp3', volume: 0.1 },
    click_activate: { src: '/sounds/click_activate.mp3', volume: 0.3 },
    menu_open: { src: '/sounds/menu_open.mp3', volume: 0.2 },
    success_chime: { src: '/sounds/success_chime.mp3', volume: 0.2 },
    error_buzzer: { src: '/sounds/error_buzzer.mp3', volume: 0.2 },
    nexus_hum: { src: '/sounds/nexus_hum.mp3', volume: 0.05, loop: true },
    wuaw_subtle: { src: '/sounds/wuaw_subtle.mp3', volume: 0.15 },
    data_pulse: { src: '/sounds/data_pulse.mp3', volume: 0.1 },
};

class AudioService {
    private static instance: AudioService;
    private sounds = new Map<SoundType, Howl>();
    private isMuted = false;
    private ambienceId: number | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            const savedMute = localStorage.getItem('aigestion_mute');
            if (savedMute) {
                this.isMuted = JSON.parse(savedMute);
                Howler.mute(this.isMuted);
            }
        }
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
            preload: true
        });

        this.sounds.set(type, sound);
        return sound;
    }

    public play(type: SoundType): void {
        if (this.isMuted && type !== 'nexus_hum') return;
        try {
            const sound = this.loadSound(type);
            sound.play();
        } catch (e) {
            // Silently fail if audio asset is missing
        }
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
        localStorage.setItem('aigestion_mute', JSON.stringify(this.isMuted));
        return this.isMuted;
    }
}

export const audioService = AudioService.getInstance();
