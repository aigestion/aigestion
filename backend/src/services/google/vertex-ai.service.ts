import { injectable } from 'inversify';
// Importing as any to avoid TS2709 errors
import { VertexAI } from '@google-cloud/vertexai';

import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../cache/redis';
import { env } from '../../config/env.schema';
import * as crypto from 'node:crypto';

@injectable()
export class VertexAIService {
  private vertexAI: any = null;
  private model: any = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const projectId = env.GOOGLE_CLOUD_PROJECT_ID;
      const location = env.GOOGLE_CLOUD_LOCATION || 'us-central1';

      if (!projectId) {
        logger.warn('GOOGLE_CLOUD_PROJECT_ID not set. Vertex AI service will be disabled.');
        return;
      }

      this.vertexAI = new VertexAI({ project: projectId, location });
      this.model = this.vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Or configurable model
      this.isInitialized = true;
      logger.info('Vertex AI service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Vertex AI service', error);
    }
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.isInitialized || !this.model) {
      logger.warn('Vertex AI not initialized, returning mock response');
      return 'Vertex AI not configurated. Mock response.';
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || '';
    } catch (error) {
      logger.error('Error generating text with Vertex AI', error);
      throw error;
    }
  }

  async chat(history: any[], message: string): Promise<string> {
    if (!this.isInitialized || !this.model) {
      logger.warn('Vertex AI not initialized, returning mock response');
      return 'Vertex AI not configurated. Mock response.';
    }

    try {
      // Map simple history format to Vertex AI Content format if needed
      // This implementation assumes 'history' is already compatible or simple enough
      // real implementation might need mapping. For now, starting a fresh chat for simplicity of this task
      // or implementing a basic chat session.

      const chat = this.model.startChat({
        history: history as any, // Expecting correct format or empty
      });

      const result = await chat.sendMessage(message);
      const response = result.response;
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || '';
    } catch (error) {
      logger.error('Error comparing chat with Vertex AI', error);
      throw error;
    }
  }

  /**
   * Generates embeddings for a given text using Vertex AI
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      // Path A: Check Redis Cache First
      const textHash = this.hashText(text);
      const cacheKey = `embedding_cache:${textHash}`;
      const cachedEmbedding = await getCache(cacheKey);

      if (cachedEmbedding) {
        logger.debug({ textHash }, '[VertexAI] L2 Cache Hit: Returning cached embedding');
        return cachedEmbedding;
      }

      // Priority: Use Gemini API Key (Simplest, requires no GCP Service Account)
      // This is the Sovereign/God Mode path for easy deployment
      const geminiApiKey = env.GEMINI_API_KEY;
      const isRedacted =
        geminiApiKey && (geminiApiKey.includes('REDACTED') || geminiApiKey.includes('MIGRATED'));

      let embeddingValues: number[] = [];

      if (geminiApiKey && !isRedacted) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

        const result = await model.embedContent(text);
        embeddingValues = result.embedding.values;
      } else {
        // Legacy Vertex AI path (Service Account required)
        if (!this.isInitialized || !this.vertexAI) {
          logger.warn(
            'Vertex AI not initialized and GEMINI_API_KEY missing. Returning empty embedding.',
          );
          return new Array(768).fill(0);
        }

        const modelName = 'gemini-embedding-001';
        const result = await this.vertexAI.getGenerativeModel({ model: modelName }).embedContent({
          content: { role: 'user', parts: [{ text }] },
        });

        const embedding = result.embedding;
        embeddingValues = embedding.values || [];
      }

      // Store in Cache (L2) for 30 days (Sovereign Retention)
      if (embeddingValues.length > 0) {
        await setCache(cacheKey, embeddingValues, 3600 * 24 * 30);
      }

      return embeddingValues;
    } catch (error: any) {
      logger.error(
        {
          error: error.message,
          stack: error.stack,
          textSnippet: text.substring(0, 50),
        },
        'Error generating embeddings with Vertex/Gemini',
      );
      return [];
    }
  }

  /**
   * Generates embeddings for a batch of multiple texts.
   * Optimizes performance by using parallel processing and batch endpoints when available.
   */
  async generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    try {
      const geminiApiKey = env.GEMINI_API_KEY;
      const isRedacted =
        geminiApiKey && (geminiApiKey.includes('REDACTED') || geminiApiKey.includes('MIGRATED'));

      // 1. Identify which texts are cached
      const hashes = texts.map(t => this.hashText(t));
      const cacheKeys = hashes.map(h => `embedding_cache:${h}`);
      const cachedEmbeddings = await Promise.all(cacheKeys.map(k => getCache(k)));

      const results: number[][] = new Array(texts.length).fill(null);
      const missingIndices: number[] = [];

      cachedEmbeddings.forEach((emb, idx) => {
        if (emb) {
          results[idx] = emb;
        } else {
          missingIndices.push(idx);
        }
      });

      if (missingIndices.length === 0) {
        logger.debug(
          { count: texts.length },
          '[VertexAI] Batch L2 Hit: All embeddings found in cache',
        );
        return results;
      }

      const remainingTexts = missingIndices.map(idx => texts[idx]);
      let fetchedEmbeddings: number[][] = [];

      // Path A: Gemini API Batching
      if (geminiApiKey && !isRedacted) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

        // Gemini SDK supports batch embed natively
        const batchResult = await model.batchEmbedContents({
          requests: remainingTexts.map(text => ({
            content: { role: 'user', parts: [{ text }] },
          })),
        });

        fetchedEmbeddings = batchResult.embeddings.map((e: any) => e.values);
      } else {
        // Path B: Vertex AI / Legacy Fallback
        // Process in smaller batches of 10 to avoid payload limits/timeouts
        const batchSize = 10;
        for (let i = 0; i < remainingTexts.length; i += batchSize) {
          const chunk = remainingTexts.slice(i, i + batchSize);
          const chunkResults = await Promise.all(chunk.map(text => this.generateEmbeddings(text)));
          fetchedEmbeddings.push(...chunkResults);
        }
      }

      // Map back and cache missing
      for (let i = 0; i < missingIndices.length; i++) {
        const originalIdx = missingIndices[i];
        const embedding = fetchedEmbeddings[i];
        results[originalIdx] = embedding;

        // Async cache store
        if (embedding && embedding.length > 0) {
          setCache(`embedding_cache:${hashes[originalIdx]}`, embedding, 3600 * 24 * 30).catch(err =>
            logger.warn(err, '[VertexAI] Cache store error'),
          );
        }
      }

      return results;
    } catch (error: any) {
      logger.error(
        { error: error.message, stack: error.stack },
        'Error in generateEmbeddingsBatch',
      );
      throw error;
    }
  }

  /**
   * Generates a deterministic hash for a given text.
   */
  private hashText(text: string): string {
    return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
  }
}

export const vertexAIService = new VertexAIService();
