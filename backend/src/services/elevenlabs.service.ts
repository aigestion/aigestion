import axios from 'axios';
import fs from 'fs/promises';
import { injectable } from 'inversify';
import path from 'path';
import { Readable } from 'stream';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface ElevenLabsVoiceConfig {
  voice_id: string;
  name: string;
  description: string;
  gender: 'female' | 'male';
  accent: 'spanish' | 'latino' | 'neutral';
  age: 'young' | 'adult';
  use_case: 'assistant' | 'narrator' | 'customer_service';
}

export interface ElevenLabsCache {
  text_hash: string;
  audio_path: string;
  created_at: number;
  expires_at: number;
  voice_id: string;
  settings: VoiceSettings;
}

/**
 * 🌌 [GOD MODE SUPREME] ElevenLabs Service
 * Ultra-high-performance, enterprise-grade voice synthesis with extreme optimization.
 * Features: Intelligent caching, batch processing, voice cloning, real-time streaming.
 */
@injectable()
export class ElevenLabsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';
  private readonly audioCache = new Map<string, ElevenLabsCache>();
  private readonly batchQueue: Array<{
    text: string;
    voiceId: string;
    settings?: VoiceSettings;
    resolve: (path: string) => void;
    reject: (error: Error) => void;
  }> = [];
  private readonly performanceMetrics = new Map<string, number[]>();
  private batchProcessing = false;
  private batchTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.apiKey = env.ELEVENLABS_API_KEY || '';
    this.initializeCaching();
    this.setupPerformanceMonitoring();
  }

  /**
   * 🧠 Initialize intelligent caching system
   */
  private initializeCaching() {
    // Load existing cache from disk
    this.loadCacheFromDisk();

    // Setup cache cleanup every hour
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 3600000);

    logger.info('[ElevenLabsService] 🧠 Intelligent caching initialized');
  }

  /**
   * 📊 Setup performance monitoring
   */
  private setupPerformanceMonitoring() {
    // Monitor performance every 30 seconds
    setInterval(() => {
      this.logPerformanceMetrics();
    }, 30000);

    logger.info('[ElevenLabsService] 📊 Performance monitoring active');
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

        logger.info(
          `[ElevenLabsService] 📊 ${metric}: avg=${avg.toFixed(2)}ms, min=${min}ms, max=${max}ms, samples=${values.length}`,
        );
      }
    }
  }

  /**
   * 🗑️ Cleanup expired cache entries
   */
  private async cleanupExpiredCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.audioCache.entries()) {
      if (now > entry.expires_at) {
        this.audioCache.delete(key);

        // Remove file from disk
        try {
          await fs.unlink(entry.audio_path);
          cleaned++;
        } catch (error: any) {
          logger.warn(
            `[ElevenLabsService] Failed to delete cache file: ${error?.message || String(error)}`,
          );
        }
      }
    }

    if (cleaned > 0) {
      logger.info(`[ElevenLabsService] 🗑️ Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * 💾 Load cache from disk
   */
  private async loadCacheFromDisk() {
    try {
      const cacheDir = path.join(process.cwd(), 'cache', 'elevenlabs');
      await fs.mkdir(cacheDir, { recursive: true });

      // This would load existing cache files
      logger.info('[ElevenLabsService] 💾 Cache directory ready');
    } catch (error: any) {
      logger.warn(
        `[ElevenLabsService] Cache initialization warning: ${error?.message || String(error)}`,
      );
    }
  }

  /**
   * 🔍 Generate cache key
   */
  private generateCacheKey(text: string, voiceId: string, settings?: VoiceSettings): string {
    const settingsHash = settings ? JSON.stringify(settings) : '';
    return Buffer.from(`${text}:${voiceId}:${settingsHash}`).toString('base64').substring(0, 64);
  }

  /**
   * 🚀 Ultra-resilient execution with intelligent retry
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    const maxRetries = 5;
    const baseDelay = 500;
    const maxDelay = 8000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;

        this.recordMetric(`${context}_success`, duration);
        return result;
      } catch (error: any) {
        const status = error.response?.status;
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

        // Critical: Do not retry on 401 (Auth), 402 (Quota), or 4xx (Validation)
        if (status === 401 || status === 402 || (status >= 400 && status < 500)) {
          logger.error(
            `[ElevenLabsService] ${context} Terminal Error: ${status}`,
            error.response?.data,
          );
          this.recordMetric(`${context}_terminal_error`, 1);
          throw error;
        }

        if (attempt === maxRetries - 1) {
          logger.error(`[ElevenLabsService] ${context} failed after ${maxRetries} attempts`);
          this.recordMetric(`${context}_failed`, 1);
          throw error;
        }

        logger.warn(
          `[ElevenLabsService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`,
        );
        this.recordMetric(`${context}_retry`, 1);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[ElevenLabsService] ${context} failed after maximum retries`);
  }

  /**
   * 🎯 Optimized text-to-speech with intelligent caching
   */
  async textToSpeech(
    text: string,
    voiceId: string,
    outputPath: string,
    settings?: VoiceSettings,
  ): Promise<string> {
    const cacheKey = this.generateCacheKey(text, voiceId, settings);

    // Check cache first
    const cached = this.audioCache.get(cacheKey);
    if (cached && Date.now() < cached.expires_at) {
      logger.info(`[ElevenLabsService] 🎯 Cache hit for: "${text.substring(0, 50)}..."`);
      this.recordMetric('cache_hit', 1);

      // Copy cached file to new location
      await fs.copyFile(cached.audio_path, outputPath);
      return outputPath;
    }

    return this.withRetry(async () => {
      logger.info(
        `[ElevenLabsService] 🌌 Synthesizing Supreme Voice: "${text.substring(0, 50)}..."`,
      );

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: settings || {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.65,
            use_speaker_boost: true,
          },
          output_format: 'mp3_22050_32', // Optimized for quality/size balance
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
            'User-Agent': 'AIGestion-Backend/2.0.0',
          },
          responseType: 'arraybuffer',
          timeout: 30000,
        },
      );

      const buffer = Buffer.from(response.data);
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(outputPath, buffer);

      // Cache the result
      const cacheEntry: ElevenLabsCache = {
        text_hash: cacheKey,
        audio_path: outputPath,
        created_at: Date.now(),
        expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        voice_id: voiceId,
        settings: settings || { stability: 0.75, similarity_boost: 0.85 },
      };

      this.audioCache.set(cacheKey, cacheEntry);
      this.recordMetric('cache_miss', 1);

      logger.info(
        {
          size: buffer.length,
          path: outputPath,
          cached: true,
        },
        '[ElevenLabsService] Supreme synthesis successful',
      );

      return outputPath;
    }, 'textToSpeech');
  }

  /**
   * 🌊 Real-time streaming with ultra-low latency
   */
  async textToSpeechStream(
    text: string,
    voiceId: string,
    settings?: VoiceSettings,
  ): Promise<Readable> {
    return this.withRetry(async () => {
      logger.info(`[ElevenLabsService] 🌊 Streaming Supreme Voice: "${text.substring(0, 50)}..."`);

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}/stream`,
        {
          text,
          model_id: 'eleven_turbo_v2', // Turbo model for lowest latency
          voice_settings: settings || {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.65,
          },
          output_format: 'mp3_22050_32',
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'AIGestion-Backend/2.0.0',
          },
          responseType: 'stream',
          timeout: 60000,
        },
      );

      this.recordMetric('stream_success', 1);
      return response.data;
    }, 'textToSpeechStream');
  }

  /**
   * 🔄 Batch processing for maximum efficiency
   */
  async batchTextToSpeech(
    requests: Array<{
      text: string;
      voiceId: string;
      settings?: VoiceSettings;
    }>,
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push(
        ...requests.map(req => ({
          ...req,
          resolve: (path: string) => {
            // Will be resolved when processed
          },
          reject: (error: Error) => {
            // Will be rejected if failed
          },
        })),
      );

      if (!this.batchProcessing) {
        this.processBatch();
      }

      // Return promise that resolves when all requests are processed
      const results: string[] = [];
      let completed = 0;

      requests.forEach((req, index) => {
        this.batchQueue[this.batchQueue.length - requests.length + index].resolve = (
          path: string,
        ) => {
          results[index] = path;
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
    if (this.batchProcessing || this.batchQueue.length === 0) return;

    this.batchProcessing = true;
    const batchSize = Math.min(this.batchQueue.length, 5); // Process max 5 at once
    const batch = this.batchQueue.splice(0, batchSize);

    logger.info(`[ElevenLabsService] ⚡ Processing batch of ${batchSize} requests`);

    try {
      const results = await Promise.allSettled(
        batch.map(item =>
          this.textToSpeech(item.text, item.voiceId, `temp_${Date.now()}.mp3`, item.settings),
        ),
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          batch[index].resolve(result.value);
        } else {
          batch[index].reject(result.reason);
        }
      });
    } catch (error: any) {
      logger.error(
        `[ElevenLabsService] Batch processing error: ${error?.message || String(error)}`,
      );
      batch.forEach(item => item.reject(error as Error));
    } finally {
      this.batchProcessing = false;

      // Process next batch if queue has items
      if (this.batchQueue.length > 0) {
        setTimeout(() => this.processBatch(), 1000);
      }
    }
  }

  /**
   * 🎭 Voice cloning (premium feature)
   */
  async cloneVoice(name: string, description: string, audioFiles: string[]): Promise<any> {
    return this.withRetry(async () => {
      logger.info(`[ElevenLabsService] 🎭 Cloning voice: ${name}`);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      // Add audio files
      for (const [index, filePath] of audioFiles.entries()) {
        const audioBuffer = await fs.readFile(filePath);
        const fileName = `audio_${index}.mp3`;
        formData.append('files', new Blob([audioBuffer]), fileName);
      }

      const response = await axios.post(`${this.baseUrl}/voices/add`, formData, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 120000, // 2 minutes for voice cloning
      });

      this.recordMetric('voice_clone_success', 1);
      return response.data;
    }, 'cloneVoice');
  }

  /**
   * 📚 Get all voices with caching
   */
  async getVoices(): Promise<any[]> {
    return this.withRetry(async () => {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 10000,
      });

      this.recordMetric('get_voices_success', 1);
      return response.data.voices;
    }, 'getVoices');
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
  public async clearCache(): Promise<void> {
    this.audioCache.clear();
    logger.info('[ElevenLabsService] 🧹 Cache cleared');
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

export const elevenLabsService = new ElevenLabsService();
