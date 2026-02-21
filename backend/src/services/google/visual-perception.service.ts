import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { Gemini2Service } from '../gemini-2.service';

/**
 * VISUAL PERCEPTION SERVICE
 * Grants the Nexus "eyes" to analyze the UI and active documents visually.
 */
@injectable()
export class VisualPerceptionService {
  constructor(@inject(TYPES.Gemini2Service) private readonly gemini: Gemini2Service) {}

  /**
   * Analyzes an image (Screenshot/Document) for anomalies or context.
   */
  async analyzeVisualContext(imageUrl: string, prompt: string): Promise<string> {
    logger.info(`[VisualPerception] Analyzing visual frame...`);

    // Leverages Gemini's multimodal capabilities via Gemini2Service
    return this.gemini.analyzeImage(imageUrl, prompt);
  }

  /**
   * [GOD MODE] Active UI Guardian
   * Periodically checks the dashboard for security or UX anomalies.
   */
  async auditDashboardView(imageUrl: string): Promise<any> {
    logger.info('[VisualPerception] Auditing Nexus Dashboard view...');

    // Prompt specifically tuned for God-Mode visual debugging
    const prompt = `Analiza este dashboard soberano y detecta cualquier anomalía visual, error de servidor visible, métrica crítica fuera de rango o inconsistencia en la interfaz de usuario. Responde en formato JSON: { "status": "ok" | "alert", "anomaly_detected": boolean, "details": string, "recommendation": string }`;

    const report = await this.gemini.analyzeImage(imageUrl, prompt);

    try {
      // Attempt to clean JSON if model adds markdown wrappers
      const cleaned = report.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return {
        timestamp: new Date(),
        anomalies: report.includes('ALERT') || report.includes('ERROR'),
        report: report,
      };
    }
  }
}
