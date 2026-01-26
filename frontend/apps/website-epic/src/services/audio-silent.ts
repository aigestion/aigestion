export const audioService = {
  play: (type: string) => {
    console.log(`[AudioService] Playing: ${type} (silent mode)`);
  },
  startAmbience: () => {
    console.log('[AudioService] Ambience started (silent mode)');
  },
  stopAmbience: () => {
    console.log('[AudioService] Ambience stopped (silent mode)');
  },
  toggleMute: () => {
    console.log('[AudioService] Mute toggled (silent mode)');
    return false;
  },
  getMutedState: () => false,
};

export type SoundType =
  | 'hover_glass'
  | 'click_activate'
  | 'menu_open'
  | 'success_chime'
  | 'error_buzzer'
  | 'nexus_hum'
  | 'wuaw_subtle'
  | 'data_pulse';
