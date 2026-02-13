import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { AnalyticsService } from './analytics.service';
import { MetaverseService } from './metaverse.service';
import { logger } from '../utils/logger';
import { env } from '../config/env.schema';
import { DANIELA_SYSTEM_PROMPT } from '../config/prompts/daniela.persona';

@injectable()
export class VoiceService {
  constructor(
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.AnalyticsService) private analyticsService: AnalyticsService,
    @inject(TYPES.MetaverseService) private metaverseService: MetaverseService
  ) {}

  /**
   * Processes a message from Vapi and returns the response for the voice assistant
   */
  async processVapiMessage(payload: any): Promise<any> {
    const messageType = payload.message?.type;

    if (messageType === 'assistant-request') {
      // Return the initial assistant configuration
      return {
        assistant: {
          name: 'Daniela',
          model: {
            provider: 'openai',
            model: 'gpt-4o',
            systemPrompt: `${DANIELA_SYSTEM_PROMPT}\n\n[CONTEXTO ACTUAL]\nFecha: ${new Date().toLocaleDateString()}\nHora: ${new Date().toLocaleTimeString()}\nEntorno: ${
              env.NODE_ENV
            }`,
          },
          voice: {
            provider: 'eleven_labs',
            voiceId: env.ELEVENLABS_VOICE_ID || 'eleven_monica',
          },
          tools: [
            {
              type: 'function',
              function: {
                name: 'get_business_summary',
                description: 'Get a summary of business health, revenue, and growth.',
                parameters: { type: 'object', properties: {} },
              },
            },
            {
              type: 'function',
              function: {
                name: 'get_metaverse_office_status',
                description:
                  'Get the coordinates and status of our Decentraland virtual headquarters.',
                parameters: { type: 'object', properties: {} },
              },
            },
          ],
        },
      };
    }

    if (messageType === 'function-call') {
      const functionCall = payload.message.functionCall;
      return await this.handleFunctionCall(functionCall);
    }

    return { status: 'ignored', type: messageType };
  }

  private async handleFunctionCall(call: any): Promise<any> {
    const { name, parameters } = call;
    logger.info(`[VoiceService] Voice Tool Call: ${name}`, parameters);

    try {
      if (name === 'get_business_summary') {
        const data = await this.analyticsService.getDashboardData();
        return {
          result: `The current monthly revenue is $${data.revenue.reduce(
            (acc: number, curr: any) => acc + curr.value,
            0
          )}. User growth is steady with ${data.users.length} new signups recently.`,
        };
      }

      if (name === 'get_metaverse_office_status') {
        const status = await this.metaverseService.getStatus();
        return {
          result: `Our virtual headquarters is located at coordinates ${
            status.coordinates
          } in Decentraland. ${
            status.activeEvents.length > 0
              ? `We have an active event: ${status.activeEvents[0].title}.`
              : 'No events are currently scheduled.'
          } You can visit it at ${status.visitUrl}`,
        };
      }

      return { error: 'Unknown function' };
    } catch (error) {
      logger.error(error, `[VoiceService] Error handling voice tool: ${name}`);
      return { error: 'Internal service error' };
    }
  }
}
