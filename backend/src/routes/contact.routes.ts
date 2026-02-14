import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { ContactController } from '../controllers/contact.controller';
import { dynamicRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

/**
 * @route   POST /api/v1/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', dynamicRateLimiter, (req, res) => {
  const controller = container.get<ContactController>(TYPES.ContactController);
  return controller.handleSubmission(req, res);
});

export default router;
