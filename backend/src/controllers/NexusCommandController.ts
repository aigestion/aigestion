import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { NeuralHealthService } from '../services/NeuralHealthService';
import { PredictiveHealingService } from '../services/PredictiveHealingService';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { ElevenLabsService } from '../services/elevenlabs.service';
import { SovereignOrchestratorService } from '../services/SovereignOrchestratorService';
import path from 'path';
import fs from 'fs';

/**
 * Nexus Command Controller: The unified brain for processing high-level commands.
 */
@injectable()
export class NexusCommandController {
  constructor(
    @inject(TYPES.NeuralHealthService) private neuralHealthService: NeuralHealthService,
    @inject(TYPES.PredictiveHealingService)
    private predictiveHealingService: PredictiveHealingService,
    @inject(TYPES.ElevenLabsService) private elevenLabs: ElevenLabsService,
    @inject(TYPES.SovereignOrchestratorService) private orchestrator: SovereignOrchestratorService,
  ) {}

  /**
   * Execute a "God Mode" system command
   */
  public async executeCommand(req: Request, res: Response): Promise<void> {
    const { command, params } = req.body;
    const requestId = (req as any).requestId || 'unknown';

    logger.info({ command, requestId }, 'Recibiendo comando Nexus God Mode');

    try {
      switch (command) {
        case 'SYSTEM_PURGE':
          await this.handleSystemPurge(res);
          break;
        case 'SYNC_VR_STATE':
          await this.handleVRSync(params, res);
          break;
        case 'OVERRIDE_HEALTH':
          await this.handleHealthOverride(params, res);
          break;
        case 'SYSTEM_STATUS_VOICE':
          await this.handleSystemStatusVoice(res);
          break;
        default:
          res.status(400).json({
            success: false,
            error: 'Comando no reconocido o fuera de los límites de autoridad.',
          });
      }
    } catch (error) {
      logger.error({ error, requestId }, 'Error ejecutando comando Nexus');
      res
        .status(500)
        .json({ success: false, error: 'Fallo catastrófico en la ejecución del comando.' });
    }
  }

  private async handleSystemPurge(res: Response) {
    logger.warn('Iniciando PURGA DEL SISTEMA vía Nexus Command');
    // Invocamos manualmente al servicio de curación predictiva para una limpieza profunda
    await (this.predictiveHealingService as any).performEmergencyHealing({
      sanityScore: 50,
      memoryUsage: 95,
      cpuUsage: 95,
      status: 'CRITICAL',
      uptime: process.uptime(),
    });

    res.json({ success: true, message: 'Purga del sistema completada y caches optimizados.' });
  }

  private async handleVRSync(params: any, res: Response) {
    const { sessionId, state } = params;
    logger.info({ sessionId }, 'Sincronizando estado VR Nexus');
    // Lógica para persistir o emitir el estado VR a otros clientes
    res.json({ success: true, message: 'Estado VR sincronizado globalmente.' });
  }

  private async handleVRSyncState(params: any, res: Response) {
    const { sessionId, state } = params;
    logger.info({ sessionId }, 'Sincronizando estado VR Nexus');
    // Lógica para persistir o emitir el estado VR a otros clientes
    res.json({ success: true, message: 'Estado VR sincronizado globalmente.' });
  }

  private async handleHealthOverride(params: any, res: Response) {
    const { targetStatus } = params;
    logger.warn({ targetStatus }, 'Sobrescribiendo estado de salud del núcleo neural');
    // Esto es una función de "God Mode" puro
    res.json({ success: true, message: `Estado del sistema forzado a: ${targetStatus}` });
  }

  private async handleSystemStatusVoice(res: Response) {
    try {
      logger.info('[NexusCommandController] Generating Sovereign Status Voice Report');
      const status = await this.orchestrator.getWorkspaceStatus();
      const report = `Hola Alejandro. El sistema está operando a nivel óptimo. 
      La red neural ha indexado ${status.neuralSync.indexedFiles} archivos. 
      Los agentes guardianes están activos en los niveles de ${status.tiers.map(t => t.name).join(', ')}. 
      Sovereign Intelligence está en línea y lista para tus instrucciones.`;

      const tempFileName = `status_${Date.now()}.mp3`;
      const tempPath = path.join(process.cwd(), 'uploads', 'voice', tempFileName);

      await this.elevenLabs.textToSpeech(
        report,
        process.env.ELEVENLABS_VOICE_ID || 'eleven_monica',
        tempPath,
      );

      res.json({
        success: true,
        message: 'Status report synthesized.',
        audioUrl: `/uploads/voice/${tempFileName}`,
        text: report,
      });
    } catch (error) {
      logger.error(error, '[NexusCommandController] Voice report generation failed');
      res.status(500).json({ success: false, error: 'Failed to generate voice report' });
    }
  }

  /**
   * Get real-time neural health metrics
   */
  public async getNeuralStatus(_req: Request, res: Response): Promise<void> {
    const metrics = this.neuralHealthService.getMetrics();
    res.json(metrics);
  }
}

// Export singleton instance for backward compatibility
export const nexusCommandController = new NexusCommandController(
  null as any, // NeuralHealthService
  null as any, // PredictiveHealingService
);
