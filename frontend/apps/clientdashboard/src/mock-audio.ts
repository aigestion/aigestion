// Mock Audio Service para efectos wuaw sutiles - Client Dashboard
export const useSound = () => ({
  playHover: () => {
    // Efecto hover sutil
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  },

  playClick: () => {
    // Efecto click más definido
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
  },

  playWuaw: () => {
    // Efecto wuaw sutil característico
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configuración para efecto wuaw
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.3);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.6);

    oscillator.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 8;

    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.7);
  },

  playPulse: () => {
    // Efecto pulse para datos
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 900;
    oscillator.type = 'triangle';
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.10, audioContext.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }
});

export const useAuth = () => ({
  user: null,
  role: 'CLIENT' as const,
  loading: false,
});

export const supabase = null;
