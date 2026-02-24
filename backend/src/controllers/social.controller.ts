import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { buildError } from '../common/response-builder';
import { InstagramService } from '../services/instagram.service';
import { LinkedInService } from '../services/linkedin.service';
import { MetaService } from '../services/meta.service';
import { TikTokService } from '../services/tiktok.service';
import { XService } from '../services/x.service';
import { TYPES } from '../types';

@injectable()
export class SocialController {
  constructor(
    @inject(TYPES.InstagramService) private instagramService: InstagramService,
    @inject(TYPES.LinkedInService) private linkedinService: LinkedInService,
    @inject(TYPES.TikTokService) private tiktokService: TikTokService,
    @inject(TYPES.XService) private xService: XService,
    @inject(TYPES.MetaService) private metaService: MetaService,
  ) {}

  // ─── FACEBOOK ──────────────────────────────────────

  /** Publish to Facebook Page via MetaService */
  async publishPost(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { message, link } = req.body;
      const result = await this.metaService.facebookPublish(message, link);
      res.json({ success: true, postId: result?.id || null });
    } catch (error: any) {
      res
        .status(500)
        .json(buildError('Failed to publish to Facebook', 'SOCIAL_ERROR', 500, (req as any).requestId));
    }
  }

  /** Get Facebook Page stats/insights */
  async getPageStats(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const insights = await this.metaService.facebookInsights();
      if (!insights) {
        // Mock data when not configured
        res.json({ followers: 0, impressions: 0, engagement: 0, mock: true });
        return;
      }
      res.json(insights);
    } catch (error: any) {
      res
        .status(500)
        .json(buildError('Failed to get stats', 'SOCIAL_ERROR', 500, (req as any).requestId));
    }
  }

  // ─── INSTAGRAM (via Meta Graph API) ────────────────

  /** Publish photo to Instagram Business */
  async publishInstagramPhoto(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { imageUrl, caption } = req.body;
      const result = await this.metaService.instagramPublishPhoto(imageUrl, caption);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to publish to Instagram' });
    }
  }

  /** Send Instagram DM (legacy) */
  async sendInstagramDM(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { recipientId, text } = req.body;
      const result = await this.instagramService.sendDM(recipientId, text);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to send Instagram DM' });
    }
  }

  // ─── WHATSAPP ──────────────────────────────────────

  /** Send WhatsApp message via Meta Cloud API */
  async sendWhatsAppMessage(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { to, message } = req.body;
      const result = await this.metaService.whatsappSendMessage(to, message);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
  }

  /** Send WhatsApp template message */
  async sendWhatsAppTemplate(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { to, templateName, languageCode } = req.body;
      const result = await this.metaService.whatsappSendTemplate(to, templateName, languageCode);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to send WhatsApp template' });
    }
  }

  // ─── X (TWITTER) ──────────────────────────────────

  async postTweet(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { text } = req.body as { text?: unknown };
      if (typeof text !== 'string' || text.trim() === '') {
        res.status(400).json({ error: 'Invalid tweet text' });
        return;
      }
      const result = await this.xService.postTweet(text);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to post Tweet to X' });
    }
  }

  // ─── TIKTOK ────────────────────────────────────────

  async publishTikTokVideo(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { videoUrl, title } = (req as any).body || {};
      const result = await this.tiktokService.publishVideo(videoUrl, title);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to publish to TikTok' });
    }
  }

  // ─── LINKEDIN ──────────────────────────────────────

  async publishLinkedInPost(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { text } = (req as any).body || {};
      const result = await this.linkedinService.sharePost(text);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to publish to LinkedIn' });
    }
  }

  // ─── META STATUS ───────────────────────────────────

  /** Get status of all Meta platform connections */
  async getMetaStatus(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const status = await this.metaService.getStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to get Meta status' });
    }
  }

  /** Verify all Meta platform connections */
  async verifyMeta(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const results = await this.metaService.verifyConnections();
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to verify Meta connections' });
    }
  }
}
