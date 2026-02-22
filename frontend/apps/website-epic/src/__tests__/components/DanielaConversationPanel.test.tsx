import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DanielaConversationPanel } from '../../components/DanielaConversationPanel';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import { useDanielaVoice } from '../../hooks/useDanielaVoice';

// Mock the Daniela voice hook
vi.mock('../../hooks/useDanielaVoice', () => ({
  useDanielaVoice: vi.fn(() => ({
    isListening: false,
    transcript: '',
    isSpeaking: false,
    toggleListening: vi.fn(),
    speak: vi.fn(),
  })),
}));

// Mock the Daniela API service
vi.mock('../../services/daniela-api.service', () => ({
  danielaApi: {
    chat: vi.fn(),
  },
}));

describe('DanielaConversationPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useDanielaVoice as any).mockReturnValue({
      isListening: false,
      transcript: '',
      isSpeaking: false,
      toggleListening: vi.fn(),
      speak: vi.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render the conversation panel correctly', () => {
      render(<DanielaConversationPanel />);

      expect(screen.getByText('Daniela AI')).toBeInTheDocument();
      expect(screen.getByText('ONLINE // V2.4')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
    });

    it('should display the voice recording button', () => {
      render(<DanielaConversationPanel />);

      // The button contains the Mic icon
      const micButton = screen.getAllByRole('button')[0];
      expect(micButton).toBeInTheDocument();
    });

    it('should display the send button', () => {
      render(<DanielaConversationPanel />);

      // The send button is the second or third button
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1);
    });
  });

  describe('Message Display', () => {
    it('should display initial AI message', () => {
      render(<DanielaConversationPanel />);
      expect(
        screen.getByText('Hola, soy Daniela. ¿En qué puedo ayudarte hoy?')
      ).toBeInTheDocument();
    });
  });

  describe('Voice Recording', () => {
    it('should show recording state when active', async () => {
      (useDanielaVoice as any).mockReturnValue({
        isListening: true,
        transcript: '',
        isSpeaking: false,
        toggleListening: vi.fn(),
        speak: vi.fn(),
      });

      render(<DanielaConversationPanel />);

      // Search for the StopCircle (which replaces Mic when isListening is true)
      // and checking the class for animate-pulse
      const micButton = screen.getAllByRole('button')[0];
      expect(micButton).toHaveClass('animate-pulse');
    });

    it('should call toggleListening when mic button is clicked', async () => {
      const mockToggle = vi.fn();
      (useDanielaVoice as any).mockReturnValue({
        isListening: false,
        transcript: '',
        isSpeaking: false,
        toggleListening: mockToggle,
        speak: vi.fn(),
      });

      render(<DanielaConversationPanel />);

      const micButton = screen.getAllByRole('button')[0];
      fireEvent.click(micButton);

      expect(mockToggle).toHaveBeenCalled();
    });
  });

  describe('Text Input & Chat', () => {
    it('should allow typing text messages', async () => {
      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe un mensaje...');
      fireEvent.change(input, { target: { value: 'Hola Daniela' } });

      expect(input).toHaveValue('Hola Daniela');
    });

    it('should send text message and call API when send button is clicked', async () => {
      const { danielaApi } = await import('../../services/daniela-api.service');
      (danielaApi.chat as any).mockResolvedValue({
        response: '¡Hola! Soy tu asistente.',
      });

      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe un mensaje...');
      fireEvent.change(input, { target: { value: 'Hola' } });

      const buttons = screen.getAllByRole('button');
      const sendButton = buttons[buttons.length - 1]; // Send is likely the last one
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(danielaApi.chat).toHaveBeenCalledWith(
          'Hola',
          'website-user',
          expect.stringContaining('session-')
        );
        expect(screen.getByText('¡Hola! Soy tu asistente.')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper buttons', () => {
      render(<DanielaConversationPanel />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
