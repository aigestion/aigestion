import { Readable } from 'node:stream';

export interface AIHistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIStreamParams {
  prompt: string;
  history?: AIHistoryMessage[];
  userId: string;
  userRole?: string;
  personaId?: string;
  systemInstruction?: string;
}

export interface AIProvider {
  generateContent(prompt: string, options?: any): Promise<string>;
  streamChat(params: AIStreamParams, options?: any): Promise<Readable>;
  getEmbeddings(text: string): Promise<number[]>;
}
