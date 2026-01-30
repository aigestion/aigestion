// Mock services to avoid dependencies
export const useSound = () => ({
  playHover: () => { },
  playClick: () => { },
  playWuaw: () => { },
  playPulse: () => { },
});

export const useAuth = () => ({
  user: null,
  role: 'ADMIN' as const,
  loading: false,
});

export const supabase = null;
