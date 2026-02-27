import { injectable } from 'inversify';

@injectable()
export class AgentMockService {
  private isMockEnabled = process.env.NODE_ENV === 'development';

  async generateResponse(prompt: string, model: string): Promise<string> {
    if (!this.isMockEnabled) {
      throw new Error('Real AI interaction required - Mock disabled');
    }

    console.log(`[AGENT MOCK] Simulating ${model} response for: ${prompt.substring(0, 50)}...`);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return `SOVEREIGN MOCK RESPONSE: Entendido. Como agente ${model}, he procesado tu solicitud sobre "${prompt.substring(0, 20)}..." y confirmo que el Nexus está operando en parámetros óptimos.`;
  }
}
