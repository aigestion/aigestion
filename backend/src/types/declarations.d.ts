/**
 * Global Type Definitions
 * Unblock compilation for modules with missing or unresolved @types packages
 */

// Stub module declarations with namespace exports for AI/ML services
declare module 'openai' {
  export interface ClientOptions {
    apiKey?: string;
  }
  export interface ChatCompletion {
    choices: Array<{ delta?: { content?: string } }>;
  }
  export interface ChatCompletionCreateParams {
    model: string;
    messages: Array<{ role: string; content: string }>;
    stream?: boolean;
    [key: string]: any;
  }
  export class OpenAI {
    chat: {
      completions: {
        create(params: any): Promise<any>;
      };
    };
    constructor(options?: ClientOptions);
  }
  export default OpenAI;
}

declare module '@anthropic-ai/sdk' {
  export interface ClientOptions {
    apiKey?: string;
  }
  export class Anthropic {
    messages: {
      stream(params: any): Promise<any>;
    };
    constructor(options?: ClientOptions);
  }
  export default Anthropic;
}

declare module '@pinecone-database/pinecone' {
  export interface PineconeClientOptions {
    apiKey?: string;
  }
  export interface PineconeRecord {
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }
  export class Pinecone {
    constructor(options?: PineconeClientOptions);
    index(name: string): any;
  }
}

declare module 'gpt-tokenizer' {
  export function encode(text: string): number[];
  export function decode(tokens: number[]): string;
}

declare module 'simple-peer';

// Google Cloud SDKs
declare module '@google/generative-ai' {
  export interface GenerativeAIOptions {}
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(params: any): any;
  }
}

declare module '@google-cloud/vertexai' {
  export interface VertexAIOptions {
    project?: string;
    location?: string;
  }
  export class VertexAI {
    constructor(options?: VertexAIOptions);
    getGenerativeModel(params: any): any;
  }
  export interface GenerativeModel {
    generateContent(prompt: any): Promise<any>;
  }
}
