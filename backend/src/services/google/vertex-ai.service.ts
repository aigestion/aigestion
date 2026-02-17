import { injectable } from 'inversify';
// Importing as any to avoid TS2709 errors
import { VertexAI } from '@google-cloud/vertexai';

import { logger } from '../../utils/logger';

type VertexAIType = any;
type GenerativeModelType = any;

@injectable()
export class VertexAIService {
  private vertexAI: VertexAIType | null = null;
  private model: GenerativeModelType | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
      const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

      if (!projectId) {
        logger.warn('GOOGLE_CLOUD_PROJECT_ID not set. Vertex AI service will be disabled.');
        return;
      }

      this.vertexAI = new VertexAI({ project: projectId, location });
      this.model = this.vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Or configurable model
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
      // Priority: Use Gemini API Key (Simplest, requires no GCP Service Account)
      // This is the Sovereign/God Mode path for easy deployment
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const isRedacted =
        geminiApiKey && (geminiApiKey.includes('REDACTED') || geminiApiKey.includes('MIGRATED'));

      if (geminiApiKey && !isRedacted) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

        const result = await model.embedContent(text);
        return result.embedding.values;
      }

      // Legacy Vertex AI path (Service Account required)
      if (!this.isInitialized || !this.vertexAI) {
        logger.warn(
          'Vertex AI not initialized and GEMINI_API_KEY missing. Returning empty embedding.',
        );
        return new Array(768).fill(0);
      }

      const model = 'text-embedding-004';
      const result = await this.vertexAI.getGenerativeModel({ model }).embedContent({
        content: { role: 'user', parts: [{ text }] },
      });

      const embedding = result.embedding;
      return embedding.values || [];
    } catch (error) {
      logger.error('Error generating embeddings with Vertex/Gemini', error);
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
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const isRedacted =
        geminiApiKey && (geminiApiKey.includes('REDACTED') || geminiApiKey.includes('MIGRATED'));

      // Path A: Gemini API Batching
      if (geminiApiKey && !isRedacted) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

        // Gemini SDK supports batch embed natively
        const result = await model.batchEmbedContents({
          requests: texts.map(text => ({
            content: { role: 'user', parts: [{ text }] },
          })),
        });

        return result.embeddings.map((e: any) => e.values);
      }

      // Path B: Vertex AI / Legacy Fallback
      // Process in smaller batches of 10 to avoid payload limits/timeouts
      const results: number[][] = [];
      const batchSize = 10;

      for (let i = 0; i < texts.length; i += batchSize) {
        const chunk = texts.slice(i, i + batchSize);
        const chunkResults = await Promise.all(chunk.map(text => this.generateEmbeddings(text)));
        results.push(...chunkResults);
      }

      return results;
    } catch (error) {
      logger.error('Error in generateEmbeddingsBatch', error);
      // Return empty embeddings as fallback to prevent total failure
      return texts.map(() => []);
    }
  }
}

export const vertexAIService = new VertexAIService();
