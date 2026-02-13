import { Router } from 'express';

import { container } from '../config/inversify.config';
import { SocialController } from '../controllers/social.controller';
import { TYPES } from '../types';

const router = Router();
const socialController = container.get<SocialController>(TYPES.SocialController);

// Facebook Routes
router.post('/facebook/publish', (req, res, next) => socialController.publishPost(req, res, next));
router.get('/facebook/stats', (req, res, next) => socialController.getPageStats(req, res, next));

// Instagram Routes
router.post('/instagram/dm', (req, res, next) => socialController.sendInstagramDM(req, res, next));

// X (Twitter) Routes
router.post('/x/tweet', (req, res, next) => socialController.postTweet(req, res, next));

// TikTok Routes
router.post('/tiktok/publish', (req, res, next) =>
  socialController.publishTikTokVideo(req, res, next)
);

// LinkedIn Routes
router.post('/linkedin/post', (req, res, next) =>
  socialController.publishLinkedInPost(req, res, next)
);

export default router;
