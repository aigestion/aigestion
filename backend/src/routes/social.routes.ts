import { Router } from 'express';

import { container } from '../config/inversify.config';
import { SocialController } from '../controllers/social.controller';
import { TYPES } from '../types';

const router = Router();
const socialController = container.get<SocialController>(TYPES.SocialController);

// ─── Facebook ────────────────────────────────────────
router.post('/facebook/publish', (req, res, next) => socialController.publishPost(req, res, next));
router.get('/facebook/stats', (req, res, next) => socialController.getPageStats(req, res, next));

// ─── Instagram ───────────────────────────────────────
router.post('/instagram/publish', (req, res, next) =>
  socialController.publishInstagramPhoto(req, res, next),
);
router.post('/instagram/dm', (req, res, next) => socialController.sendInstagramDM(req, res, next));

// ─── WhatsApp ────────────────────────────────────────
router.post('/whatsapp/send', (req, res, next) =>
  socialController.sendWhatsAppMessage(req, res, next),
);
router.post('/whatsapp/template', (req, res, next) =>
  socialController.sendWhatsAppTemplate(req, res, next),
);

// ─── X (Twitter) ─────────────────────────────────────
router.post('/x/tweet', (req, res, next) => socialController.postTweet(req, res, next));

// ─── TikTok ──────────────────────────────────────────
router.post('/tiktok/publish', (req, res, next) =>
  socialController.publishTikTokVideo(req, res, next),
);

// ─── LinkedIn ────────────────────────────────────────
router.post('/linkedin/post', (req, res, next) =>
  socialController.publishLinkedInPost(req, res, next),
);

// ─── Meta Status ─────────────────────────────────────
router.get('/meta/status', (req, res, next) => socialController.getMetaStatus(req, res, next));
router.get('/meta/verify', (req, res, next) => socialController.verifyMeta(req, res, next));

export default router;
