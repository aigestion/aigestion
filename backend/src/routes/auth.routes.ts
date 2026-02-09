import { Router } from 'express';

import {
  getMe,
  login,
  register,
  enable2FA,
  verify2FA,
  verifyLogin2FA,
  refresh,
  logout,
  verifyEmail,
  updateUserRole,
  updateSubscription,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
import { schemas, validateBody } from '../middleware/validation.middleware';

const router = Router();
// Rutas públicas con rate limiting estricto + validación Zod
router.post('/register', authLimiter, validateBody(schemas.auth.register), register);
router.post('/login', authLimiter, validateBody(schemas.auth.login), login);
router.post('/verify-email', authLimiter, verifyEmail); // New
router.post('/2fa/enable', authLimiter, enable2FA);
router.post('/2fa/verify', authLimiter, verify2FA);
router.post('/login/2fa', authLimiter, validateBody(schemas.auth.verify2FA), verifyLogin2FA);

// Onboarding Routes (Protected)
router.put('/role', protect, updateUserRole); // New
router.put('/plan', protect, updateSubscription); // New

// Refresh Token (uses Cookie)
router.get('/refresh', authLimiter, refresh);

router.post('/logout', logout);

// Ruta protegida - Requiere autenticación
router.get('/me', protect, getMe);

export default router;
