import { Router } from 'express';
import { container } from '../config/inversify.config';
import { GeminiController } from '../controllers/gemini.controller';
import { requireAuth } from '../middleware/auth.middleware';

const geminiRouter = Router();

// Lazy resolve — container may not yet have all bindings at import time
let _ctrl: GeminiController;
function getCtrl(): GeminiController {
  if (!_ctrl) _ctrl = container.resolve(GeminiController);
  return _ctrl;
}

// ─────────────────────────────────────────────────────────────
// SOVEREIGN INTELLIGENCE
// ─────────────────────────────────────────────────────────────
geminiRouter.post('/sovereign', requireAuth, (req, res, next) =>
  getCtrl().sovereign(req, res, next),
);
geminiRouter.post('/multimodal', requireAuth, (req, res, next) =>
  getCtrl().multimodal(req, res, next),
);
geminiRouter.post('/count-tokens', requireAuth, (req, res, next) =>
  getCtrl().countTokens(req, res, next),
);
geminiRouter.get('/models', requireAuth, (req, res, next) => getCtrl().listModels(req, res, next));

// ─────────────────────────────────────────────────────────────
// LIVE VOICE
// ─────────────────────────────────────────────────────────────
geminiRouter.post('/live/session', requireAuth, (req, res, next) =>
  getCtrl().createLiveSession(req, res, next),
);
geminiRouter.delete('/live/session/:id', requireAuth, (req, res, next) =>
  getCtrl().terminateLiveSession(req, res, next),
);
geminiRouter.get('/live/sessions', requireAuth, (req, res, next) =>
  getCtrl().listLiveSessions(req, res, next),
);
geminiRouter.post('/live/speak', requireAuth, (req, res, next) =>
  getCtrl().proactiveSpeech(req, res, next),
);
geminiRouter.get('/live/voices', requireAuth, (req, res, next) =>
  getCtrl().listVoices(req, res, next),
);
geminiRouter.get('/live/health', requireAuth, (req, res, next) =>
  getCtrl().liveHealth(req, res, next),
);

export default geminiRouter;
