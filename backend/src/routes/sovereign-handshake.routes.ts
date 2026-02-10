import { Router } from 'express';
import { container } from '../config/inversify.config';
import { SovereignHandshakeController } from '../controllers/SovereignHandshakeController';
import { SovereignBiometricsController } from '../controllers/SovereignBiometricsController';
import { SentinelController } from '../controllers/SentinelController';
import { TYPES } from '../types';

const router = Router();

const handshakeController = container.get<SovereignHandshakeController>(
  TYPES.SovereignHandshakeController,
);
const biometricsController = container.get<SovereignBiometricsController>(
  TYPES.SovereignBiometricsController,
);
const sentinelController = container.get<SentinelController>(TYPES.SentinelController);

/**
 * 🌌 Quantum-Safe Handshake Routes
 */
router.get('/handshake/init', (req, res) => handshakeController.initHandshake(req, res));
router.post('/handshake/finalize', (req, res) => handshakeController.finalizeHandshake(req, res));

/**
 * 🎙️ Sovereign Biometrics Routes
 */
router.post('/biometrics/voice-enroll', (req, res) => biometricsController.enrollVoice(req, res));
router.post('/biometrics/voice-verify', (req, res) => biometricsController.verifyVoice(req, res));

/**
 * 🛰️ Sovereign Sentinel Routes (Predictive)
 */
router.get('/sentinel/forecast', (req, res) => sentinelController.getForecast(res));

export default router;
