import { injectable, inject } from 'inversify';
import { DanielaAIService } from './daniela-ai.service';

/**
 * Gemini 2.0 Service
 * Integración con el último modelo Gemini 2.0 Pro
 */
@injectable()
export class Gemini2Service {
  private client: any;

  constructor(
    @inject(DanielaAIService) private daniela: DanielaAIService
  ) {}

  async initialize() {
    try {
      // Nota: Requiere @google-cloud/vertexai
      const { VertexAI } = require('@google-cloud/vertexai');

      this.client = new VertexAI({
        project: process.env.GOOGLE_CLOUD_PROJECT_ID,
        location: process.env.VERTEX_AI_LOCATION
      });

      console.log('✅ Gemini 2.0 Service initialized');
    } catch (error) {
      console.error('Error initializing Gemini 2.0:', error);
      throw error;
    }
  }

  async generateText(prompt: string, options: any = {}) {
    try {
      const model = this.client.getGenerativeModel({
        model: process.env.GEMINI_2_MODEL || 'gemini-2.0-pro'
      });

      const request = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 4096,
          topP: 0.95,
          topK: 40
        }
      };

      const response = await model.generateContent(request);
      return response.response.text();
    } catch (error) {
      console.error('Error generating text with Gemini 2.0:', error);
      throw error;
    }
  }

  async analyzeImage(imageUrl: string, prompt: string) {
    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-2.0-pro-vision'
      });

      const imageData = await this.urlToBase64(imageUrl);

      const response = await model.generateContent([
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData
          }
        },
        { text: prompt }
      ]);

      return response.response.text();
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async multimodalAnalysis(inputs: {
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
  }) {
    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-2.0-pro-multimodal'
      });

      const content = [];

      if (inputs.text) {
        content.push({ text: inputs.text });
      }

      if (inputs.imageUrl) {
        const imageData = await this.urlToBase64(inputs.imageUrl);
        content.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData
          }
        });
      }

      const response = await model.generateContent(content);
      return response.response.text();
    } catch (error) {
      console.error('Error in multimodal analysis:', error);
      throw error;
    }
  }

  async streamResponse(prompt: string) {
    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-2.0-flash'
      });

      const response = await model.generateContentStream({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
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
    }>
  ) {
    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-2.0-pro'
      });

      const tools = {
        functionDeclarations: functions
      };

      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        tools: [tools]
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
        short: '1-2 sentences',
        medium: '3-5 sentences',
        long: '1 paragraph'
      };

      const prompt = `Summarize the following text in ${lengthMap[length]}:\n\n${text}`;

      return await this.generateText(prompt, {
        maxTokens: length === 'short' ? 100 : length === 'medium' ? 200 : 500
      });
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw error;
    }
  }

  async translateText(text: string, targetLanguage: string) {
    try {
      const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }

  async classifyContent(text: string, categories: string[]) {
    try {
      const prompt = `Classify the following text into one of these categories: ${categories.join(', ')}\n\nText: ${text}`;

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
