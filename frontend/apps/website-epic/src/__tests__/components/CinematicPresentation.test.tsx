import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CinematicPresentation } from '@/components/CinematicPresentation';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useSpring: () => ({ opacity: 1, y: 0 }),
}));

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

  it('renders first slide correctly', () => {
    render(<CinematicPresentation />);

    expect(screen.getByText('🚀 AIGESTION')).toBeInTheDocument();
    expect(screen.getByText('EL SISTEMA MÁGICO')).toBeInTheDocument();
  });

  it('displays navigation controls', () => {
    render(<CinematicPresentation />);

    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  });

  it('shows fun facts when clicking the button', async () => {
    render(<CinematicPresentation />);

    const funFactButton = screen.getByRole('button', { name: /fun fact/i });
    fireEvent.click(funFactButton);

    await waitFor(() => {
      expect(screen.getByText(/💡 ¡Sabías que?/i)).toBeInTheDocument();
    });
  });

  it('navigates to next slide when clicking next button', async () => {
    render(<CinematicPresentation />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('🤖 CONTROL NEXUS')).toBeInTheDocument();
    });
  });

  it('toggles play/pause state', () => {
    render(<CinematicPresentation />);

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    expect(playButton).toHaveAttribute('aria-label', 'pause');
  });

  it('shows progress indicators', () => {
    render(<CinematicPresentation />);

    const indicators = screen.getAllByRole('button', { name: /slide/i });
    expect(indicators).toHaveLength(6); // Total number of slides
  });

  it('is accessible with proper ARIA labels', () => {
    render(<CinematicPresentation />);

    expect(screen.getByRole('region', { name: /presentation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toHaveAttribute('aria-label');
  });
});
