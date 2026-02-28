import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CinematicPresentation } from '@/components/CinematicPresentation';
import { AppProvider } from '@/contexts/AppContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

// Mock framer-motion
vi.mock('framer-motion', () => {
  const React = require('react');
  const mockMotion =
    (tag: string) =>
    ({ children, ...props }: any) => {
      const Component = tag as any;
      // VERY IMPORTANT: ensure aria-label is passed down
      return <Component {...props}>{children}</Component>;
    };

  const motionProxy = new Proxy({} as any, {
    get: (_target, prop: string) => mockMotion(prop),
  });

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useSpring: () => ({ opacity: 1, y: 0, set: vi.fn() }),
    useTransform: () => ({ opacity: 1 }),
  };
});

// Mock hooks
vi.mock('@/hooks/useSentimentUI', () => ({
  useSentimentUI: () => ({
    sentiment: 'positive',
    updateSentiment: vi.fn(),
  }),
}));

vi.mock('@/hooks/useSound', () => ({
  useSound: () => ({
    play: vi.fn(),
    pause: vi.fn(),
    isPlaying: false,
  }),
}));

describe('CinematicPresentation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<CinematicPresentation />, { wrapper });
    // Look for any button to see if they exist
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('is accessible', () => {
    render(<CinematicPresentation />, { wrapper });
    expect(screen.getByRole('region', { name: /presentation/i })).toBeInTheDocument();
  });
});
