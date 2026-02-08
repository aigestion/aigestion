import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { DanielaAIService } from '../services/daniela-ai.service';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

import { TYPES } from '../types';

/**
 * 💜 Daniela Controller
 * Provides REST endpoints for Daniela AI interactions.
 */
@injectable()
export class DanielaController {
  constructor(@inject(TYPES.DanielaAIService) private danielaService: DanielaAIService) {
    // Bind methods for use as route handlers
    this.chat = this.chat.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.getInsights = this.getInsights.bind(this);
    this.getSystemStatus = this.getSystemStatus.bind(this);
  }

  /**
   * Chat with Daniela
   */
  public async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, sessionId } = req.body;
      const userId = (req as any).user?.id || 'anonymous';
      const userName = (req as any).user?.name || 'User';
      const userRole = (req as any).user?.role || 'user';

      // We use the sessionId (from frontend) as the chatId for the service
      const chatId = parseInt(sessionId, 10) || 0;

      const response = await this.danielaService.processMessage(
        chatId,
        message,
        userName,
        userId,
        userRole,
      );

      res.json(buildResponse({ response }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('Error in DanielaController.chat:', error);
      next(error);
    }
  }

  /**
   * Get Daniela's Status and Info
   */
  public async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const info = this.danielaService.getDanielaInfo();
      res.json(
        buildResponse(
          {
            status: 'operational',
            info,
            version: '1.0.0-PRO',
          },
          200,
          (req as any).requestId,
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Strategic Insights for Daniela Dashboards
   */
  public async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const insights = await this.danielaService.getInsights(userId);
      res.json(buildResponse({ insights }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('Error in DanielaController.getInsights:', error);
      next(error);
    }
  }

  /**
   * Get System Status for Daniela Dashboards
   */
  public async getSystemStatus(req: Request, res: Response, next: NextFunction) {
    try {
      // For now, return the simulated/real metrics info
      res.json(
        buildResponse(
          {
            status: 'operational',
            version: 'v2.4.0',
            statistics: {
              totalUsers: 12450,
              activeConversations: 45,
              messagesProcessed: 1500000,
            },
          },
          200,
          (req as any).requestId,
        ),
      );
    } catch (error) {
      next(error);
    }
  }
}
