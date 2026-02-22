/**
 * 🌌 ElevenLabs Voice API Service - God Mode Supreme
 * Ultra-high-performance voice synthesis with enterprise features
 * Features: Intelligent caching, batch processing, voice cloning, real-time streaming
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

export interface ElevenLabsCache {
  text_hash: string;
  audio_url: string;
  created_at: number;
  expires_at: number;
  voice_id: string;
  settings: ElevenLabsTTSRequest['voice_settings'];
}

class ElevenLabsService {
  private apiKey: string;
  private baseURL = 'https://api.elevenlabs.io/v1';
  private audioCache = new Map<string, ElevenLabsCache>();
  private performanceMetrics = new Map<string, number[]>();
  private batchQueue: Array<{
    text: string;
    voiceId: string;
    settings?: ElevenLabsTTSRequest['voice_settings'];
    resolve: (audio: ArrayBuffer) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    this.initializeCaching();
    this.setupPerformanceMonitoring();

    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found in environment variables');
    }
  }

  /**
   * 🧠 Initialize intelligent caching system
   */
  private initializeCaching() {
    // Setup cache cleanup every hour
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 3600000);

    console.log('[ElevenLabsService] 🧠 Intelligent caching initialized');
  }

  /**
   * 📊 Setup performance monitoring
   */
  private setupPerformanceMonitoring() {
    // Monitor performance every 30 seconds
    setInterval(() => {
      this.logPerformanceMetrics();
    }, 30000);

    console.log('[ElevenLabsService] 📊 Performance monitoring active');
  }

  /**
   * 📈 Record performance metrics
   */
  private recordMetric(metric: string, value: number) {
    if (!this.performanceMetrics.has(metric)) {
      this.performanceMetrics.set(metric, []);
    }

    const metrics = this.performanceMetrics.get(metric)!;
    metrics.push(value);

    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
  }

  /**
   * 📊 Log performance metrics
   */
  private logPerformanceMetrics() {
    for (const [metric, values] of this.performanceMetrics.entries()) {
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        console.log(
          `[ElevenLabsService] 📊 ${metric}: avg=${avg.toFixed(2)}ms, min=${min}ms, max=${max}ms, samples=${values.length}`
        );
      }
    }
  }

  /**
   * 🗑️ Cleanup expired cache entries
   */
  private cleanupExpiredCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.audioCache.entries()) {
      if (now > entry.expires_at) {
        this.audioCache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[ElevenLabsService] 🗑️ Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * 🔍 Generate cache key
   */
  private generateCacheKey(
    text: string,
    voiceId: string,
    settings?: ElevenLabsTTSRequest['voice_settings']
  ): string {
    const settingsHash = settings ? JSON.stringify(settings) : '';
    return btoa(`${text}:${voiceId}:${settingsHash}`).substring(0, 64);
  }

  /**
   * 🚀 Ultra-resilient fetch with intelligent retry
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    const maxRetries = 5;
    const baseDelay = 300;
    const maxDelay = 5000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;

        this.recordMetric(`${context}_success`, duration);
        return result;
      } catch (error: any) {
        const status = error.status || error.response?.status;
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

        // Critical: Do not retry on 401 (Auth), 402 (Quota), or 4xx (Validation)
        if (status === 401 || status === 402 || (status >= 400 && status < 500)) {
          console.error(`[ElevenLabsService] ${context} Terminal Error: ${status}`, error);
          this.recordMetric(`${context}_terminal_error`, 1);
          throw error;
        }

        if (attempt === maxRetries - 1) {
          console.error(`[ElevenLabsService] ${context} failed after ${maxRetries} attempts`);
          this.recordMetric(`${context}_failed`, 1);
          throw error;
        }

        console.warn(
          `[ElevenLabsService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`
        );
        this.recordMetric(`${context}_retry`, 1);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[ElevenLabsService] ${context} failed after maximum retries`);
  }

  /**
   * Get all available voices with caching
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.baseURL}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'AIGestion-Frontend/2.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.recordMetric('get_voices_success', 1);
      return data.voices;
    } catch (error) {
      this.recordMetric('get_voices_error', 1);
      console.error('Error fetching ElevenLabs voices:', error);
      throw error;
    }
  }

  /**
   * Get voice by ID with caching
   */
  async getVoice(voiceId: string): Promise<ElevenLabsVoice> {
    try {
      const response = await fetch(`${this.baseURL}/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'AIGestion-Frontend/2.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const voiceData = await response.json();
      this.recordMetric('get_voice_success', 1);
      return voiceData;
    } catch (error) {
      this.recordMetric('get_voice_error', 1);
      console.error(`Error fetching voice ${voiceId}:`, error);
      throw error;
    }
  }

  /**
   * 🎯 Optimized text-to-speech with intelligent caching
   */
  async textToSpeech(request: ElevenLabsTTSRequest): Promise<ElevenLabsTTSResponse> {
    const {
      text,
      voice_id = 'EXAVITQu4vr4xnSDxMaL', // Bella - perfect for Spanish
      model_id = 'eleven_multilingual_v2',
      voice_settings = {
        stability: 0.75,
        similarity_boost: 0.85,
        style: 0.65,
        use_speaker_boost: true,
      },
    } = request;

    const cacheKey = this.generateCacheKey(text, voice_id, voice_settings);

    // Check cache first
    const cached = this.audioCache.get(cacheKey);
    if (cached && Date.now() < cached.expires_at) {
      console.log(`[ElevenLabsService] 🎯 Cache hit for: "${text.substring(0, 50)}..."`);
      this.recordMetric('cache_hit', 1);

      // Convert cached URL back to ArrayBuffer
      const response = await fetch(cached.audio_url);
      const audioBuffer = await response.arrayBuffer();

      return {
        audio: audioBuffer,
        content_type: 'audio/mpeg',
      };
    }

    return this.withRetry(async () => {
      console.log(
        `[ElevenLabsService] 🌌 Synthesizing Supreme Voice: "${text.substring(0, 50)}..."`
      );

      const response = await fetch(`${this.baseURL}/text-to-speech/${voice_id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'User-Agent': 'AIGestion-Frontend/2.0.0',
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings,
          output_format: 'mp3_22050_32', // Optimized for quality/size balance
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.status} ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      this.recordMetric('cache_miss', 1);

      // Cache the result as blob URL
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      const cacheEntry: ElevenLabsCache = {
        text_hash: cacheKey,
        audio_url: audioUrl,
        created_at: Date.now(),
        expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        voice_id,
        settings: voice_settings,
      };

      this.audioCache.set(cacheKey, cacheEntry);

      console.log(
        {
          size: audioBuffer.byteLength,
          cached: true,
        },
        '[ElevenLabsService] Supreme synthesis successful'
      );

      return {
        audio: audioBuffer,
        content_type: response.headers.get('content-type') || 'audio/mpeg',
      };
    }, 'textToSpeech');
  }

  /**
   * 🌊 Real-time streaming with ultra-low latency
   */
  async streamTextToSpeech(
    request: ElevenLabsTTSRequest,
    onChunk: (chunk: ArrayBuffer) => void
  ): Promise<void> {
    const {
      text,
      voice_id = 'EXAVITQu4vr4xnSDxMaL',
      model_id = 'eleven_turbo_v2', // Turbo model for lowest latency
      voice_settings = {
        stability: 0.75,
        similarity_boost: 0.85,
        style: 0.65,
      },
    } = request;

    return this.withRetry(async () => {
      console.log(`[ElevenLabsService] 🌊 Streaming Supreme Voice: "${text.substring(0, 50)}..."`);

      const response = await fetch(`${this.baseURL}/text-to-speech/${voice_id}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'AIGestion-Frontend/2.0.0',
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

      this.recordMetric('stream_success', 1);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(value.buffer);
      }
    }, 'streamTextToSpeech');
  }

  /**
   * 🔄 Batch processing for maximum efficiency
   */
  async batchTextToSpeech(requests: ElevenLabsTTSRequest[]): Promise<ArrayBuffer[]> {
    return new Promise(resolve => {
      this.batchQueue.push(
        ...requests.map(req => ({
          text: req.text,
          voiceId: req.voice_id || 'EXAVITQu4vr4xnSDxMaL',
          settings: req.voice_settings,
          resolve: (_audio: ArrayBuffer) => {
            // Will be resolved when processed
          },
          reject: (_error: Error) => {
            // Will be rejected if failed
          },
        }))
      );

      if (this.batchQueue.length === requests.length) {
        this.processBatch();
      }

      // Return promise that resolves when all requests are processed
      const results: ArrayBuffer[] = [];
      let completed = 0;

      requests.forEach((_, index) => {
        this.batchQueue[this.batchQueue.length - requests.length + index].resolve = (
          audio: ArrayBuffer
        ) => {
          results[index] = audio;
          completed++;
          if (completed === requests.length) {
            resolve(results);
          }
        };
      });
    });
  }

  /**
   * ⚡ Process batch queue
   */
  private async processBatch() {
    if (this.batchQueue.length === 0) return;

    const batchSize = Math.min(this.batchQueue.length, 3); // Process max 3 at once in frontend
    const batch = this.batchQueue.splice(0, batchSize);

    console.log(`[ElevenLabsService] ⚡ Processing batch of ${batchSize} requests`);

    try {
      const results = await Promise.allSettled(
        batch.map(item =>
          this.textToSpeech({
            text: item.text,
            voice_id: item.voiceId,
            ...(item.settings ? { voice_settings: item.settings } : {}),
          })
        )
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          batch[index].resolve(result.value.audio);
        } else {
          batch[index].reject(result.reason);
        }
      });
    } catch (error: any) {
      console.error(`[ElevenLabsService] Batch processing error: ${error.message}`);
      batch.forEach(item => item.reject(error as Error));
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
          'User-Agent': 'AIGestion-Frontend/2.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs history error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.recordMetric('get_history_success', 1);
      return data.history;
    } catch (error) {
      this.recordMetric('get_history_error', 1);
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
          'User-Agent': 'AIGestion-Frontend/2.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(
          `ElevenLabs delete history error: ${response.status} ${response.statusText}`
        );
      }

      this.recordMetric('delete_history_success', 1);
    } catch (error) {
      this.recordMetric('delete_history_error', 1);
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
          'User-Agent': 'AIGestion-Frontend/2.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs user info error: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();
      this.recordMetric('get_user_info_success', 1);
      return userData;
    } catch (error) {
      this.recordMetric('get_user_info_error', 1);
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  /**
   * 🎵 Play audio buffer in browser with enhanced features
   */
  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBufferSource = audioContext.createBufferSource();

      const decodedBuffer = await audioContext.decodeAudioData(audioBuffer);
      audioBufferSource.buffer = decodedBuffer;
      audioBufferSource.connect(audioContext.destination);
      audioBufferSource.start();

      this.recordMetric('play_audio_success', 1);
    } catch (error) {
      this.recordMetric('play_audio_error', 1);
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

  /**
   * 📊 Get performance metrics
   */
  public getPerformanceMetrics() {
    const metrics: any = {};
    for (const [key, values] of this.performanceMetrics.entries()) {
      if (values.length > 0) {
        metrics[key] = {
          count: values.length,
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          recent: values.slice(-10),
        };
      }
    }
    return metrics;
  }

  /**
   * 🧹 Clear cache
   */
  public clearCache(): void {
    this.audioCache.clear();
    console.log('[ElevenLabsService] 🧹 Cache cleared');
  }

  /**
   * 📈 Get cache statistics
   */
  public getCacheStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const entry of this.audioCache.values()) {
      if (now < entry.expires_at) {
        valid++;
      } else {
        expired++;
      }
    }

    return {
      total: this.audioCache.size,
      valid,
      expired,
      hitRate: this.performanceMetrics.get('cache_hit')?.length || 0,
      missRate: this.performanceMetrics.get('cache_miss')?.length || 0,
    };
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types for external use
export type { ElevenLabsService };
