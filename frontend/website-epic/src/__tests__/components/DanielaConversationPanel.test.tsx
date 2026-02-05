import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DanielaConversationPanel } from '../../../components/DanielaConversationPanel';

// Mock the enhanced voice assistant hook
jest.mock('../../../hooks/useEnhancedVoiceAssistant', () => ({
  useEnhancedVoiceAssistant: () => ({
    status: 'idle',
    messages: [],
    emotionalAnalysis: null,
    suggestedActions: [],
    isRecording: false,
    isProcessing: false,
    error: null,
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    sendTextMessage: jest.fn(),
    clearConversation: jest.fn(),
    playAudioResponse: jest.fn(),
    isConnected: false,
    canRecord: true,
    canSend: true,
  }),
}));

describe('DanielaConversationPanel', () => {
  const mockMessages = [
    {
      id: '1',
      text: 'Hola Daniela',
      speaker: 'client' as const,
      timestamp: new Date('2026-01-24T15:30:00Z'),
      emotion: 'neutral' as const,
    },
    {
      id: '2',
      text: '¡Hola! ¿En qué puedo ayudarte?',
      speaker: 'daniela' as const,
      timestamp: new Date('2026-01-24T15:30:02Z'),
      emotion: 'professional' as const,
    },
  ];

  const mockEmotionalAnalysis = {
    emotion: 'happy',
    confidence: 0.85,
    sentiment: 'positive' as const,
    suggestions: ['continue_positive_tone'],
  };

  const mockSuggestedActions = [
    {
      id: 'action_1',
      text: 'Mostrar dashboard',
      type: 'action' as const,
      priority: 'high' as const,
      context: 'navigation',
    },
    {
      id: 'action_2',
      text: 'Analizar métricas',
      type: 'response' as const,
      priority: 'medium' as const,
      context: 'analytics',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the conversation panel correctly', () => {
      render(<DanielaConversationPanel />);

      expect(screen.getByText('DANIELA')).toBeInTheDocument();
      expect(screen.getByText('Asistente IA Futurista')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Escribe o habla con Daniela...')).toBeInTheDocument();
    });

    it('should display the voice recording button', () => {
      render(<DanielaConversationPanel />);

      const micButton = screen.getByRole('button');
      expect(micButton).toBeInTheDocument();
      expect(micButton.querySelector('svg')).toBeInTheDocument();
    });

    it('should display the send button', () => {
      render(<DanielaConversationPanel />);

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeInTheDocument();
    });

    it('should show status indicators when provided', () => {
      render(<DanielaConversationPanel />);

      // Should show connection status
      expect(screen.getByText(/status/i)).toBeInTheDocument();
    });
  });

  describe('Message Display', () => {
    it('should display messages correctly', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: mockEmotionalAnalysis,
        suggestedActions: mockSuggestedActions,
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        expect(screen.getByText('Hola Daniela')).toBeInTheDocument();
        expect(screen.getByText('¡Hola! ¿En qué puedo ayudarte?')).toBeInTheDocument();
      });
    });

    it('should differentiate between client and daniela messages', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        const clientMessage = screen.getByText('Hola Daniela');
        const danielaMessage = screen.getByText('¡Hola! ¿En qué puedo ayudarte?');

        expect(clientMessage).toBeInTheDocument();
        expect(danielaMessage).toBeInTheDocument();

        // Check that they have different styling (client messages should be on the right)
        expect(clientMessage.closest('div')).toHaveClass('justify-end');
        expect(danielaMessage.closest('div')).toHaveClass('justify-start');
      });
    });

    it('should show message timestamps', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        // Check for timestamps (they should be in the format HH:MM:SS)
        const timestamps = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
        expect(timestamps.length).toBeGreaterThan(0);
      });
    });

    it('should allow editing client messages', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockSendTextMessage = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: mockSendTextMessage,
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        // Find edit button for client message
        const editButtons = screen.getAllByRole('button');
        const editButton = editButtons.find(btn =>
          btn.querySelector('svg')?.getAttribute('data-lucide') === 'edit-3'
        );

        expect(editButton).toBeInTheDocument();

        // Click edit button
        if (editButton) {
          fireEvent.click(editButton);

          // Should show input field
          const input = screen.getByDisplayValue('Hola Daniela');
          expect(input).toBeInTheDocument();
        }
      });
    });
  });

  describe('Voice Recording', () => {
    it('should show recording state when active', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockStartRecording = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: true,
        isProcessing: false,
        error: null,
        startRecording: mockStartRecording,
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: false,
        canSend: false,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        expect(screen.getByText('ESCUCHANDO...')).toBeInTheDocument();
        expect(screen.getByText(/daniela_listening/i)).toBeInTheDocument();
      });
    });

    it('should call startRecording when mic button is clicked', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockStartRecording = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'idle',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: mockStartRecording,
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: false,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      const micButton = screen.getByRole('button');
      await userEvent.click(micButton);

      expect(mockStartRecording).toHaveBeenCalled();
    });

    it('should show voice waveform when recording', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: true,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: false,
        canSend: false,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        // Should show waveform visualization
        const waveform = screen.getByTestId('voice-waveform');
        expect(waveform).toBeInTheDocument();
      });
    });
  });

  describe('Text Input', () => {
    it('should allow typing text messages', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockSendTextMessage = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'idle',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: mockSendTextMessage,
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: false,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe o habla con Daniela...');
      await userEvent.type(input, 'Hola Daniela');

      expect(input).toHaveValue('Hola Daniela');
    });

    it('should send text message when send button is clicked', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockSendTextMessage = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'idle',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: mockSendTextMessage,
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: false,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe o habla con Daniela...');
      await userEvent.type(input, 'Hola Daniela');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);

      expect(mockSendTextMessage).toHaveBeenCalledWith('Hola Daniela');
    });

    it('should send text message when Enter key is pressed', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockSendTextMessage = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'idle',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: mockSendTextMessage,
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: false,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe o habla con Daniela...');
      await userEvent.type(input, 'Hola Daniela');
      await userEvent.keyboard('{Enter}');

      expect(mockSendTextMessage).toHaveBeenCalledWith('Hola Daniela');
    });

    it('should clear input after sending message', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockSendTextMessage = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'idle',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: mockSendTextMessage,
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: false,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe o habla con Daniela...');
      await userEvent.type(input, 'Hola Daniela');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  });

  describe('Suggested Actions', () => {
    it('should display suggested actions when available', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: mockEmotionalAnalysis,
        suggestedActions: mockSuggestedActions,
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        expect(screen.getByText('SUGERENCIAS RÁPIDAS:')).toBeInTheDocument();
        expect(screen.getByText('Mostrar dashboard')).toBeInTheDocument();
        expect(screen.getByText('Analizar métricas')).toBeInTheDocument();
      });
    });

    it('should send suggested action text when clicked', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');
      const mockSendTextMessage = jest.fn();

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: mockEmotionalAnalysis,
        suggestedActions: mockSuggestedActions,
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: mockSendTextMessage,
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        const actionButton = screen.getByText('Mostrar dashboard');
        userEvent.click(actionButton);
      });

      expect(mockSendTextMessage).toHaveBeenCalledWith('Mostrar dashboard');
    });
  });

  describe('Emotional Analysis', () => {
    it('should display emotional analysis when available', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: mockEmotionalAnalysis,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        expect(screen.getByText('ANÁLISIS EMOCIONAL')).toBeInTheDocument();
        expect(screen.getByText('HAPPY')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText('POSITIVE')).toBeInTheDocument();
      });
    });

    it('should not display emotional analysis when not available', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: mockMessages,
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        expect(screen.queryByText('ANÁLISIS EMOCIONAL')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error messages when available', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'error',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: 'Connection error',
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: false,
        canRecord: false,
        canSend: false,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        expect(screen.getByText('Connection error')).toBeInTheDocument();
      });
    });

    it('should disable controls when error occurs', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'error',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: 'Connection error',
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: false,
        canRecord: false,
        canSend: false,
      });

      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe o habla con Daniela...');
      expect(input).toBeDisabled();

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeDisabled();
    });
  });

  describe('Processing State', () => {
    it('should show loading state when processing', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: true,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: false,
        canSend: false,
      });

      render(<DanielaConversationPanel />);

      await waitFor(() => {
        expect(screen.getByText(/procesando/i)).toBeInTheDocument();
      });
    });

    it('should disable controls when processing', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: [],
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: true,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: false,
        canSend: false,
      });

      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe o habla con Daniela...');
      expect(input).toBeDisabled();

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<DanielaConversationPanel />);

      // Check for proper ARIA labels on buttons
      const micButton = screen.getByRole('button');
      expect(micButton).toHaveAttribute('aria-label');

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toHaveAttribute('aria-label');
    });

    it('should be keyboard navigable', async () => {
      render(<DanielaConversationPanel />);

      const input = screen.getByPlaceholderText('Escribe o habla con Daniela...');
      input.focus();

      // Tab navigation should work
      await userEvent.tab();

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toHaveFocus();
    });

    it('should have proper semantic structure', () => {
      render(<DanielaConversationPanel />);

      // Check for proper heading structure
      expect(screen.getByRole('heading', { name: /daniela/i })).toBeInTheDocument();

      // Check for proper form structure
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to different screen sizes', async () => {
      // Mock different screen sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile
      });

      const { container } = render(<DanielaConversationPanel />);

      // Should render on mobile
      expect(container.firstChild).toBeInTheDocument();

      // Change to desktop size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024, // Desktop
      });

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly with many messages', async () => {
      const { useEnhancedVoiceAssistant } = require('../../../hooks/useEnhancedVoiceAssistant');

      // Create many messages
      const manyMessages = Array.from({ length: 100 }, (_, i) => ({
        id: `msg_${i}`,
        text: `Message ${i}`,
        speaker: i % 2 === 0 ? 'client' as const : 'daniela' as const,
        timestamp: new Date(),
        emotion: 'neutral' as const,
      }));

      useEnhancedVoiceAssistant.mockReturnValue({
        status: 'active',
        messages: manyMessages,
        emotionalAnalysis: null,
        suggestedActions: [],
        isRecording: false,
        isProcessing: false,
        error: null,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        sendTextMessage: jest.fn(),
        clearConversation: jest.fn(),
        playAudioResponse: jest.fn(),
        isConnected: true,
        canRecord: true,
        canSend: true,
      });

      const startTime = performance.now();
      render(<DanielaConversationPanel />);
      const endTime = performance.now();

      // Should render within 100ms even with many messages
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
