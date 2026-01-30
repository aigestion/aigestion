// Mock Audio Service para efectos wuaw sutiles - Demo Dashboard
export const useSound = () => ({
  playHover: () => {
    // Efecto hover sutil
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 700;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.09, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.12);
  },

  playClick: () => {
    // Efecto click más definido
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1100;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.13, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.06);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.06);
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
    oscillator.frequency.setValueAtTime(350, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(750, audioContext.currentTime + 0.25);
    oscillator.frequency.exponentialRampToValueAtTime(550, audioContext.currentTime + 0.5);

    oscillator.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 12;

    gainNode.gain.setValueAtTime(0.07, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);
  },

  playPulse: () => {
    // Efecto pulse para datos
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 950;
    oscillator.type = 'triangle';
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.11, audioContext.currentTime + 0.015);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.12);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.12);
  }
});

export const useAuth = () => ({
  user: null,
  role: 'DEMO' as const,
  loading: false,
});

export const supabase = null;
