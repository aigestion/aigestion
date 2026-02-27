import { injectable } from 'inversify';

@injectable()
export class PromptService {
  private readonly model: string;
  private readonly apiKey: string;

  constructor() {
    this.model = process.env.AI_MODEL || 'gemini-pro';
    this.apiKey = process.env.AI_API_KEY || '';
  }

  async runPrompt(prompt: string, params?: Record<string, any>): Promise<string> {
    // Simple dispatch based on model prefix
    if (this.model.startsWith('gemini')) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      return result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }
    if (this.model.startsWith('gpt')) {
      const { Configuration, OpenAIApi } = await import('openai');
      const configuration = new Configuration({ apiKey: this.apiKey });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createChatCompletion({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        ...params,
      });
      return response.data.choices?.[0]?.message?.content ?? '';
    }
    // Add other providers as needed
    throw new Error(`Unsupported model: ${this.model}`);
  }
}
