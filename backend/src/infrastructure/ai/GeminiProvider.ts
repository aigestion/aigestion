import { VertexAI, GenerativeModel } from "@google-cloud/vertexai";
import { Readable } from "node:stream";
import { AIProvider, AIStreamParams } from "../../interfaces/ai-provider.interface";
import { env } from "../../config/env.schema";
import { logger } from "../../utils/logger";
import { injectable } from "inversify";

@injectable()
export class GeminiProvider implements AIProvider {
  private vertexAI: VertexAI;
  private modelMap: Map<string, GenerativeModel> = new Map();

  constructor() {
    this.vertexAI = new VertexAI({
      project: env.GOOGLE_PROJECT_ID || "aigestion-sovereign-2026",
      location: env.GOOGLE_LOCATION || "us-central1",
    });
  }

  private getModel(modelId: string): GenerativeModel {
    if (!this.modelMap.has(modelId)) {
      const safetySettings: any[] = [
        { category: "HARM_CATEGORY_HARASSMENT" as any, threshold: "BLOCK_MEDIUM_AND_ABOVE" as any },
        {
          category: "HARM_CATEGORY_HATE_SPEECH" as any,
          threshold: "BLOCK_MEDIUM_AND_ABOVE" as any,
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any,
          threshold: "BLOCK_MEDIUM_AND_ABOVE" as any,
        },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any, threshold: "BLOCK_ONLY_HIGH" as any },
      ];

      const model = this.vertexAI.getGenerativeModel({
        model: modelId,
        safetySettings,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });
      this.modelMap.set(modelId, model);
    }
    return this.modelMap.get(modelId)!;
  }

  async generateContent(prompt: string, options: { modelId: string }): Promise<string> {
    const model = this.getModel(options.modelId);
    const result = await model.generateContent(prompt);
    return (result.response as any).candidates[0]?.content?.parts[0]?.text || "";
  }

  async streamChat(
    params: AIStreamParams,
    options: { modelId: string; tools?: any[] },
  ): Promise<Readable> {
    const model = this.getModel(options.modelId);
    const history = (params.history || []).map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = (model as any).startChat({
      history,
      systemInstruction: params.systemInstruction
        ? ({ role: "system", parts: [{ text: params.systemInstruction }] } as any)
        : undefined,
      tools: options.tools ? [{ functionDeclarations: options.tools }] : undefined,
    });

    const result = await chat.sendMessageStream(params.prompt);
    const stream = new Readable({ read() {} });

    (async () => {
      try {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          const functionCalls = chunk.functionCalls ? chunk.functionCalls() : [];

          if (chunkText || (functionCalls && functionCalls.length > 0)) {
            stream.push(JSON.stringify({ text: chunkText, functionCalls }));
          }
        }
        stream.push(null);
      } catch (err) {
        stream.emit("error", err);
        stream.push(null);
      }
    })();

    return stream;
  }

  async getEmbeddings(text: string): Promise<number[]> {
    try {
      const model = this.vertexAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent({ content: { parts: [{ text }] } });
      return (result as any).predictions[0].embeddings.values;
    } catch (error) {
      logger.error("[GeminiProvider] Embedding failed", error);
      return [];
    }
  }
}
