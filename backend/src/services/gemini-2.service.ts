import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectable, inject } from 'inversify';
import { logger } from '../utils/logger';
import { DanielaAIService } from './daniela-ai.service'; // Assuming this exists or will be mocked
import { TYPES } from '../types';

/**
 * GEMINI PRO & AI STUDIO SERVICE (God Level)
 * Sovereign integration with Google's most advanced GenAI models.
 * Supports dual-auth: Vertex AI (Enterprise) + AI Studio (High-speed Labs).
 */
@injectable()
export class Gemini2Service {
  private vertexClient: any;
  private aiStudioClient: GoogleGenerativeAI;

  constructor(@inject(DanielaAIService) private daniela: DanielaAIService) {}

  async initialize() {
    try {
      // 1. Initialize Vertex AI (Enterprise Layer) - Optional
      try {
        const { VertexAI } = require('@google-cloud/vertexai');
        this.vertexClient = new VertexAI({
          project: process.env.GOOGLE_CLOUD_PROJECT_ID,
          location: process.env.VERTEX_AI_LOCATION || 'us-central1',
        });
        logger.info('✅ Vertex AI (Gemini Core) initialized');
      } catch (vertexError) {
        logger.warn('⚠️ Vertex AI initialization failed (using fallback if available):', vertexError);
      }

      // 2. Initialize AI Studio (Labs Layer)
      const studioKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
      if (studioKey) {
        this.aiStudioClient = new GoogleGenerativeAI(studioKey);
        logger.info('✅ Google AI Studio (Gemini Pro) initialized');
      }

      if (!this.vertexClient && !this.aiStudioClient) {
          throw new Error('Neither Vertex AI nor AI Studio could be initialized. Please check credentials.');
      }

    } catch (error) {
      logger.error('[Gemini2Service] Initialization fault', error);
      throw error;
    }
  }

  // God Mode Configuration
  private readonly safetySettings = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  ];

  private readonly godGenerationConfig = {
    temperature: 0.7,
    maxOutputTokens: 8192,
    topP: 0.95,
    topK: 40,
  };

  /**
   * Generates text using the best available model (Priority: AI Studio Pro).
   */
  async generateText(prompt: string, options: any = {}) {
    const modelName = options.model || process.env.GEMINI_2_MODEL || 'gemini-2.0-flash-exp';

    try {
      const generationConfig = {
        ...this.godGenerationConfig,
        temperature: options.temperature || this.godGenerationConfig.temperature,
        maxOutputTokens: options.maxTokens || this.godGenerationConfig.maxOutputTokens,
      };

      // Prefer AI Studio for faster Pro access if available
      if (this.aiStudioClient && !options.useVertex) {
        const model = this.aiStudioClient.getGenerativeModel({ 
          model: modelName,
          systemInstruction: options.systemInstruction,
          safetySettings: this.safetySettings as any 
        });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig,
        });
        return result.response.text();
      }

      // Fallback to Vertex AI
      const model = this.vertexClient.getGenerativeModel({ 
        model: modelName,
        systemInstruction: options.systemInstruction,
        safetySettings: this.safetySettings as any
      });
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });
      return response.response.text();
    } catch (error) {
      logger.error(`[Gemini2Service] Content generation failed for ${modelName}`, error);
      throw error;
    }
  }

  // Helper to get client (Vertex or AI Studio)
  private getClient(useVertex: boolean = false) {
      if (this.aiStudioClient && !useVertex) {
          return this.aiStudioClient;
      }
      return this.vertexClient;
  }

  async analyzeImage(imageUrl: string, prompt: string) {
    try {
      const model = this.getClient().getGenerativeModel({
        model: 'gemini-2.0-flash-exp', // Configured to Flash for speed + multimodal
        safetySettings: this.safetySettings as any,
      });

      const imageData = await this.urlToBase64(imageUrl);

      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: imageData } },
                { text: prompt }
            ]
          }
        ],
        generationConfig: this.godGenerationConfig,
      });

      return response.response.text();
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async multimodalAnalysis(inputs: { text?: string; imageUrl?: string; audioUrl?: string }) {
    try {
      const model = this.getClient().getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        safetySettings: this.safetySettings as any,
      });

      const content: any[] = [];

      if (inputs.text) {
        content.push({ text: inputs.text });
      }

      if (inputs.imageUrl) {
        const imageData = await this.urlToBase64(inputs.imageUrl);
        content.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData,
          },
        } as any);
      }

      const response = await model.generateContent({
          contents: [{ role: 'user', parts: content }],
          generationConfig: this.godGenerationConfig,
      });
      return response.response.text();
    } catch (error) {
      console.error('Error in multimodal analysis:', error);
      throw error;
    }
  }

  async streamResponse(prompt: string) {
    try {
      const model = this.getClient().getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        safetySettings: this.safetySettings as any,
      });

      const response = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: this.godGenerationConfig,
      });

      return response;
    } catch (error) {
      console.error('Error streaming response:', error);
      throw error;
    }
  }

  async functionCalling(
    prompt: string,
    functions: Array<{
      name: string;
      description: string;
      parameters: any;
    }>,
  ) {
    try {
      const model = this.getClient().getGenerativeModel({
        model: 'gemini-2.0-flash-exp', // Flash supports function calling
        safetySettings: this.safetySettings as any,
      });

      const tools = {
        functionDeclarations: functions,
      };

      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        tools: [tools],
        generationConfig: this.godGenerationConfig,
      });

      return response;
    } catch (error) {
      console.error('Error in function calling:', error);
      throw error;
    }
  }

  async summarizeText(text: string, length: 'short' | 'medium' | 'long' = 'medium') {
    try {
      const lengthMap = {
        short: '1-2 frases',
        medium: '3-5 frases',
        long: '1 párrafo',
      };

      const prompt = `Resume el siguiente texto en ${lengthMap[length]}:\n\n${text}`;

      return await this.generateText(prompt, {
        maxTokens: length === 'short' ? 100 : length === 'medium' ? 200 : 500,
      });
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw error;
    }
  }

  async translateText(text: string, targetLanguage: string) {
    try {
      const prompt = `Traduce el siguiente texto a ${targetLanguage}:\n\n${text}`;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }

  async classifyContent(text: string, categories: string[]) {
    try {
      const prompt = `Clasifica el siguiente texto en una de estas categorías: ${categories.join(
        ', ',
      )}\n\nTexto: ${text}`;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error classifying content:', error);
      throw error;
    }
  }

  private async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer).toString('base64');
    } catch (error) {
      console.error('Error converting URL to base64:', error);
      throw error;
    }
  }
}
