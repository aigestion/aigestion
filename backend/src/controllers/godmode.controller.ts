import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { SupabaseService } from '../services/supabase.service';
import { GodNotificationService } from '../services/god-notification.service';
import { logger } from '../utils/logger';

/**
 * 🌌 [GOD MODE] Controller
 * Sovereign management of AI assets: Projects, Documents, Prompts and Notifications.
 */
@injectable()
export class GodModeController {
  constructor(
    @inject(TYPES.GodNotificationService) private notificationService: GodNotificationService
  ) {}

  // PROJECTS
  public async listProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const client = SupabaseService.getInstance().getClient();
      const { data, error } = await client
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  public async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const client = SupabaseService.getInstance().getClient();
      const { data, error } = await client
        .from('projects')
        .insert({ name, description })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  // DOCUMENTS / RAG
  public async hybridSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const query = typeof req.body.query === 'string' ? req.body.query : '';
      const { projectId, embedding, threshold, limit } = req.body;

      if (!query || !embedding) {
        return res.status(400).json({ error: 'Query and embedding are required' });
      }

      const results = await SupabaseService.getInstance().hybridSearch(
        projectId,
        query,
        embedding,
        threshold || 0.5,
        limit || 5
      );

      res.json({ success: true, data: results });
    } catch (error: any) {
      next(error);
    }
  }

  // PROMPTS
  public async getPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.params.name as string;
      const template = await SupabaseService.getInstance().getPromptTemplate(name);

      if (!template) {
        return res.status(404).json({ error: `Prompt template [${name}] not found` });
      }

      res.json({ success: true, data: template });
    } catch (error: any) {
      next(error);
    }
  }

  public async listPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const client = SupabaseService.getInstance().getClient();
      const { data, error } = await client
        .from('prompt_templates')
        .select('name, description, version, is_active')
        .order('name');

      if (error) throw error;
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  // AUDIT
  public async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const client = SupabaseService.getInstance().getClient();
      const { data, error } = await client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      res.json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  }

  // NOTIFICATIONS
  public async testNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, message, urgency } = req.body;

      await this.notificationService.broadcastGodAlert(
        title || 'Prueba de Sistema Soberano',
        message || 'Este es un mensaje de prueba verificado por Daniela.',
        urgency || 'medium'
      );

      res.json({ success: true, message: 'Broadcast successful' });
    } catch (error: any) {
      next(error);
    }
  }
}
