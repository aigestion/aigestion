/**
 * ElevenLabs Voice API Service
 * Provides text-to-speech and voice synthesis capabilities
 */

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'middle' | 'old';
  languages: string[];
  accent?: string;
  use_case: string;
}

export interface ElevenLabsTTSRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  pronunciation_dictionary_locators?: Array<{
    pronunciation_dictionary_id: string;
    version_id: string;
  }>;
}

export interface ElevenLabsTTSResponse {
  audio: ArrayBuffer;
  content_type: string;
  duration_ms?: number;
}

export interface ElevenLabsHistoryItem {
  history_item_id: string;
  voice_id: string;
  voice_name: string;
  text: string;
  date: string;
  character_count_change_from: number;
  character_count_change_to: number;
  state: 'partial' | 'complete';
  settings: ElevenLabsTTSRequest['voice_settings'];
}

class ElevenLabsService {
  private apiKey: string;
  private baseURL = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found in environment variables');
    }
  }

  /**
   * Get all available voices
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.baseURL}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      throw error;
    }
  }

  /**
   * Get voice by ID
   */
  async getVoice(voiceId: string): Promise<ElevenLabsVoice> {
    try {
      const response = await fetch(`${this.baseURL}/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching voice ${voiceId}:`, error);
      throw error;
    }
  }

  /**
   * Convert text to speech
   */
  async textToSpeech(request: ElevenLabsTTSRequest): Promise<ElevenLabsTTSResponse> {
    const {
      text,
      voice_id = '21m00Tcm4TlvDq8ikWAM', // Default: Rachel
      model_id = 'eleven_monolingual_v1',
      voice_settings = {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true,
      },
    } = request;

    try {
      const response = await fetch(`${this.baseURL}/text-to-speech/${voice_id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings,
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.status} ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();

      return {
        audio: audioBuffer,
        content_type: response.headers.get('content-type') || 'audio/mpeg',
      };
    } catch (error) {
      console.error('Error in text-to-speech conversion:', error);
      throw error;
    }
  }

  /**
   * Stream text to speech (for real-time applications)
   */
  async streamTextToSpeech(
    request: ElevenLabsTTSRequest,
    onChunk: (chunk: ArrayBuffer) => void
  ): Promise<void> {
    const {
      text,
      voice_id = '21m00Tcm4TlvDq8ikWAM',
      model_id = 'eleven_monolingual_v1',
      voice_settings = {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true,
      },
    } = request;

    try {
      const response = await fetch(`${this.baseURL}/text-to-speech/${voice_id}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings,
          output_format: 'mp3_22050_32',
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs streaming error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(value.buffer);
      }
    } catch (error) {
      console.error('Error in streaming text-to-speech:', error);
      throw error;
    }
  }

  /**
   * Get user history (requires subscription)
   */
  async getHistory(): Promise<ElevenLabsHistoryItem[]> {
    try {
      const response = await fetch(`${this.baseURL}/history`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs history error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.history;
    } catch (error) {
      console.error('Error fetching ElevenLabs history:', error);
      throw error;
    }
  }

  /**
   * Delete history item
   */
  async deleteHistoryItem(historyItemId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/history/${historyItemId}`, {
        method: 'DELETE',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `ElevenLabs delete history error: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(`Error deleting history item ${historyItemId}:`, error);
      throw error;
    }
  }

  /**
   * Get user info and subscription status
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/user`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs user info error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  /**
   * Play audio buffer in browser
   */
  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBufferSource = audioContext.createBufferSource();

      const decodedBuffer = await audioContext.decodeAudioData(audioBuffer);
      audioBufferSource.buffer = decodedBuffer;
      audioBufferSource.connect(audioContext.destination);
      audioBufferSource.start();
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  /**
   * Convert audio buffer to blob for download
   */
  audioBufferToBlob(audioBuffer: ArrayBuffer, mimeType: string = 'audio/mpeg'): Blob {
    return new Blob([audioBuffer], { type: mimeType });
  }

  /**
   * Download audio file
   */
  downloadAudio(audioBuffer: ArrayBuffer, filename: string = 'speech.mp3'): void {
    const blob = this.audioBufferToBlob(audioBuffer);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types for external use
export type { ElevenLabsService };
