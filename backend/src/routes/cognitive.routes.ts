import { Router } from 'express';
import { container } from '../config/inversify.config';
import { CognitiveController } from '../controllers/cognitive.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Lazy resolution for DI timing
let _ctrl: CognitiveController;
function getCtrl(): CognitiveController {
  if (!_ctrl) _ctrl = container.resolve(CognitiveController);
  return _ctrl;
}

// ─────────────────────────────────────────────────────────────
// VISION AI
// ─────────────────────────────────────────────────────────────
router.post('/vision/analyze', requireAuth, (req, res, next) => getCtrl().analyzeImage(req, res, next));
router.post('/vision/ocr', requireAuth, (req, res, next) => getCtrl().detectOCR(req, res, next));

// ─────────────────────────────────────────────────────────────
// SPEECH
// ─────────────────────────────────────────────────────────────
router.post('/speech/tts', requireAuth, (req, res, next) => getCtrl().textToSpeech(req, res, next));
router.post('/speech/stt', requireAuth, (req, res, next) => getCtrl().speechToText(req, res, next));

export default router;
