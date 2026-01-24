import { Router } from 'express';
import {
  processConversation,
  getConversationHistory,
  clearConversation,
} from '../controllers/enhanced-voice.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All enhanced voice routes require authentication
router.use(authenticateToken);

/**
 * @route POST /api/enhanced-voice/process
 * @desc Process conversation with Daniela (text or audio)
 * @access Private
 */
router.post('/process', processConversation);

/**
 * @route GET /api/enhanced-voice/history
 * @desc Get conversation history for a session
 * @access Private
 */
router.get('/history', getConversationHistory);

/**
 * @route POST /api/enhanced-voice/clear
 * @desc Clear conversation session
 * @access Private
 */
router.post('/clear', clearConversation);

export default router;
