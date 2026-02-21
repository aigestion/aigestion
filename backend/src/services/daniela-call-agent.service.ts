import { inject, injectable } from 'inversify';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { env } from '../config/env.schema';
import { AIService } from './ai.service';
import { ElevenLabsService } from './elevenlabs.service';
import { ContactRegistryService, SovereignContact } from './contact-registry.service';

// ──────────────────────────────────────────────────────
// 🌌 DANIELA CALL AGENT — Sovereign Voice Call Engine
// She calls AND speaks. From YOUR phone. With HER voice.
// ──────────────────────────────────────────────────────

export interface CallContext {
  callId: string;
  contact: SovereignContact;
  callerName: string;
  instructions: string;
  danielaScript: string;
  audioPath: string | null;
  audioUrl: string | null;
  status: 'preparing' | 'audio_ready' | 'call_initiated' | 'completed' | 'failed';
  createdAt: number;
  conversationHistory: Array<{ role: 'daniela' | 'contact'; text: string }>;
}

@injectable()
export class DanielaCallAgent {
  private callContexts = new Map<string, CallContext>();
  private readonly audioDir: string;
  private readonly audioBaseUrl: string;

  // Auto-cleanup after 30 minutes
  private readonly CONTEXT_TTL = 30 * 60 * 1000;

  constructor(
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.ElevenLabsService) private elevenLabsService: ElevenLabsService,
    @inject(TYPES.ContactRegistryService) private contactRegistry: ContactRegistryService,
  ) {
    this.audioDir = path.join(process.cwd(), 'uploads', 'voice-calls');
    this.audioBaseUrl = `${env.BACKEND_URL || 'https://aigestion.net'}/api/v1/voice-assets`;
    this.ensureAudioDir();
    this.startCleanupTimer();
    logger.info('[DanielaCallAgent] 🌌 Sovereign Voice Call Agent initialized');
  }

  // ──────────────────────────────────────────────────
  // PUBLIC: Initiate a voice call
  // ──────────────────────────────────────────────────

  /**
   * Full pipeline: parse instructions → generate script → TTS → return context for HA push
   */
  async initiateVoiceCall(
    contactName: string,
    instructions: string,
    callerName: string,
  ): Promise<CallContext> {
    // 1. Find contact
    const contact = this.contactRegistry.findByName(contactName);
    if (!contact) {
      throw new Error(`Contact "${contactName}" not found in sovereign registry`);
    }

    // 2. Create call context
    const callId = randomUUID().slice(0, 8);
    const callContext: CallContext = {
      callId,
      contact,
      callerName,
      instructions,
      danielaScript: '',
      audioPath: null,
      audioUrl: null,
      status: 'preparing',
      createdAt: Date.now(),
      conversationHistory: [],
    };

    this.callContexts.set(callId, callContext);

    try {
      // 3. Generate Daniela's natural greeting script
      callContext.danielaScript = await this.buildDanielaScript(contact, instructions, callerName);

      // 4. Generate TTS audio
      const audioPath = path.join(this.audioDir, `${callId}.mp3`);
      await this.elevenLabsService.textToSpeech(
        callContext.danielaScript,
        env.ELEVENLABS_VOICE_ID || 'eleven_monica',
        audioPath,
      );

      callContext.audioPath = audioPath;
      callContext.audioUrl = `${this.audioBaseUrl}/${callId}.mp3`;
      callContext.status = 'audio_ready';

      callContext.conversationHistory.push({
        role: 'daniela',
        text: callContext.danielaScript,
      });

      logger.info(
        {
          callId,
          contact: contact.name,
          audioUrl: callContext.audioUrl,
        },
        '[DanielaCallAgent] 🌌 Voice call audio ready — awaiting Pixel dial',
      );

      return callContext;
    } catch (error) {
      callContext.status = 'failed';
      logger.error(error, `[DanielaCallAgent] Failed to prepare call ${callId}`);
      throw error;
    }
  }

  // ──────────────────────────────────────────────────
  // PUBLIC: Generate follow-up reply (if contact responds)
  // ──────────────────────────────────────────────────

  /**
   * When the contact responds verbally, generate Daniela's AI-powered follow-up
   */
  async generateFollowUpReply(callId: string, contactResponse: string): Promise<{
    replyText: string;
    audioUrl: string;
  }> {
    const ctx = this.callContexts.get(callId);
    if (!ctx) throw new Error(`Call context ${callId} not found`);

    ctx.conversationHistory.push({ role: 'contact', text: contactResponse });

    const conversationSoFar = ctx.conversationHistory
      .map(m => `${m.role === 'daniela' ? 'Daniela' : ctx.contact.name}: ${m.text}`)
      .join('\n');

    const prompt = `
Eres Daniela, la asistente de IA de ${ctx.callerName}. Estás en una llamada telefónica con ${ctx.contact.name} (${ctx.contact.relationship}).

Conversación hasta ahora:
${conversationSoFar}

${ctx.contact.name} acaba de decir: "${contactResponse}"

Genera una respuesta natural, breve y cálida. Recuerda:
- Eres la asistente de ${ctx.callerName}, no ${ctx.callerName} directamente
- Sé concisa (máximo 2-3 frases)
- Mantén un tono cercano pero profesional
- Las instrucciones originales eran: "${ctx.instructions}"
`;

    const replyText = await this.aiService.generateContent(prompt);

    // Generate audio for the reply
    const replyAudioPath = path.join(this.audioDir, `${callId}_reply_${Date.now()}.mp3`);
    await this.elevenLabsService.textToSpeech(
      replyText,
      env.ELEVENLABS_VOICE_ID || 'eleven_monica',
      replyAudioPath,
    );

    const audioFileName = path.basename(replyAudioPath);
    const audioUrl = `${this.audioBaseUrl}/${audioFileName}`;

    ctx.conversationHistory.push({ role: 'daniela', text: replyText });

    logger.info(
      { callId, reply: replyText.substring(0, 80) },
      '[DanielaCallAgent] Follow-up reply generated',
    );

    return { replyText, audioUrl };
  }

  // ──────────────────────────────────────────────────
  // PUBLIC: Get call context
  // ──────────────────────────────────────────────────

  getCallContext(callId: string): CallContext | undefined {
    return this.callContexts.get(callId);
  }

  // ──────────────────────────────────────────────────
  // PRIVATE: Build Daniela's natural greeting script
  // ──────────────────────────────────────────────────

  private async buildDanielaScript(
    contact: SovereignContact,
    instructions: string,
    callerName: string,
  ): Promise<string> {
    const prompt = `
Eres Daniela, la asistente personal de IA de ${callerName}. Vas a realizar una llamada telefónica en nombre de ${callerName} a "${contact.name}" (${contact.relationship}).

El mensaje que ${callerName} quiere transmitir es: "${instructions}"

Genera un guion breve y natural para la llamada. Reglas:
1. Preséntate como Daniela, la asistente de ${callerName}
2. Sé cálida y natural — como una persona real hablando por teléfono
3. Transmite el mensaje de forma clara
4. Ofrece tomar un mensaje si ${contact.name} quiere responder algo
5. Máximo 4-5 frases
6. NO uses emojis ni formato markdown — es texto hablado
7. Adapta el tono según la relación: "${contact.relationship}"

Ejemplo para familiar:
"Hola, soy Daniela, la asistente de Alejandro. Te llamo porque ahora mismo está ocupado pero quería que supieras que te llama en cuanto pueda. ¿Quieres que le deje algún recado?"
`;

    try {
      const script = await this.aiService.generateContent(prompt);
      return script.replace(/[*_#]/g, '').trim(); // Strip any markdown
    } catch (error) {
      logger.error(error, '[DanielaCallAgent] Error generating script, using fallback');
      // Fallback template
      return (
        `Hola, soy Daniela, la asistente de ${callerName}. ` +
        `Te llamo en nombre de ${callerName} para decirte que ${instructions}. ` +
        `Si quieres dejarle algún mensaje, dímelo y se lo haré llegar.`
      );
    }
  }

  // ──────────────────────────────────────────────────
  // PRIVATE: Utilities
  // ──────────────────────────────────────────────────

  private async ensureAudioDir(): Promise<void> {
    try {
      await fs.mkdir(this.audioDir, { recursive: true });
    } catch (error) {
      logger.error(error, '[DanielaCallAgent] Failed to create audio directory');
    }
  }

  private startCleanupTimer(): void {
    setInterval(async () => {
      const now = Date.now();
      for (const [callId, ctx] of this.callContexts.entries()) {
        if (now - ctx.createdAt > this.CONTEXT_TTL) {
          // Clean up audio files
          if (ctx.audioPath) {
            try { await fs.unlink(ctx.audioPath); } catch { /* ignore */ }
          }
          this.callContexts.delete(callId);
          logger.info(`[DanielaCallAgent] Cleaned up expired call context: ${callId}`);
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // ──────────────────────────────────────────────────
  // PUBLIC: Extract instructions from user message
  // ──────────────────────────────────────────────────

  /**
   * Parses "llama a papá y dile que estoy ocupado" →
   *   { contactName: "papá", instructions: "estoy ocupado" }
   */
  static extractCallInstructions(message: string): {
    contactName: string | null;
    instructions: string;
  } {
    // Pattern: "llama a [contact] y dile/dígale/díselo que [instructions]"
    const withInstructionsPatterns = [
      /(?:llama|llamar|marca|telefonea|contacta)\s+(?:a|al|con)\s+(.+?)\s+(?:y\s+)?(?:dile|dígale|díselo|cuéntale|coméntale|avísale|infórmale)\s+(?:que\s+)?(.+)/i,
      /(?:llama|llamar|marca|telefonea|contacta)\s+(?:a|al|con)\s+(.+?)\s+(?:y\s+)?(?:pregúntale|pregunta)\s+(?:si\s+|que\s+)?(.+)/i,
      /(?:llama|llamar|marca|telefonea|contacta)\s+(?:a|al|con)\s+(.+?)\s+(?:para\s+)(?:decirle|avisarle|informarle|contarle)\s+(?:que\s+)?(.+)/i,
      /(?:llama|llamar|marca|telefonea|contacta)\s+(?:a|al|con)\s+(.+?)\s+(?:y\s+)?(?:explícale|háblale)\s+(?:sobre|de|que)\s+(.+)/i,
    ];

    for (const pattern of withInstructionsPatterns) {
      const match = message.match(pattern);
      if (match?.[1] && match?.[2]) {
        return {
          contactName: match[1].replace(/[.,!?;:]$/, '').replace(/\s+por favor$/i, '').trim(),
          instructions: match[2].replace(/[.,!?;:]$/, '').replace(/\s+por favor$/i, '').trim(),
        };
      }
    }

    // No instructions — just a call request
    const simplePatterns = [
      /(?:llama|llamar|marca|telefonea|contacta|ring|call)\s+(?:a|al|con|el número de)?\s*(.+)/i,
    ];

    for (const pattern of simplePatterns) {
      const match = message.match(pattern);
      if (match?.[1]) {
        return {
          contactName: match[1].replace(/[.,!?;:]$/, '').replace(/\s+por favor$/i, '').trim(),
          instructions: '',
        };
      }
    }

    return { contactName: null, instructions: '' };
  }
}
