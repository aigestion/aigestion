import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Gemini2Service } from './gemini-2.service';
import { logger } from '../utils/logger';

@injectable()
export class VisionService {
  constructor(
    @inject(TYPES.Gemini2Service) private geminiService: Gemini2Service
  ) {}

  /**
   * Analyze an image for architecture or security insights
   */
  async analyzeArchitecture(imageUrl: string, focus: string = 'technical architecture'): Promise<string> {
    const prompt = `Analiza esta imagen con un enfoque en ${focus}. 
    Identifica componentes clave, posibles cuellos de botella y riesgos de seguridad.
    Responde en español con un tono profesional y técnico.`;
    
    logger.info(`[VisionService] Analyzing architecture for image: ${imageUrl.substring(0, 50)}...`);
    return this.geminiService.analyzeImage(imageUrl, prompt);
  }

  /**
   * Perform multimodal analysis on multiple inputs
   */
  async auditSecurity(inputs: { imageUrl?: string; text?: string }): Promise<string> {
    const prompt = `Actúa como un Auditor de Seguridad Soberano. 
    Analiza los inputs proporcionados para detectar vulnerabilidades en la infraestructura, 
    patrones de ataque o debilidades en la postura de seguridad.
    Inputs: ${inputs.text || 'N/A'}`;

    return this.geminiService.multimodalAnalysis({
      text: prompt,
      imageUrl: inputs.imageUrl
    });
  }
}
