import { Router } from 'express';
import { container } from '../config/inversify.config';
import { WebAuthnController } from '../controllers/webauthn.controller';

const router = Router();
const controller = container.get<WebAuthnController>(WebAuthnController);

/**
 * 🔐 WebAuthn Security Routes
 */
router.post('/register-options', (req, res) => controller.getRegisterOptions(req, res));
router.post('/register-verify', (req, res) => controller.verifyRegistration(req, res));
router.post('/login-options', (req, res) => controller.getLoginOptions(req, res));
router.post('/login-verify', (req, res) => controller.verifyLogin(req, res));

export default router;
