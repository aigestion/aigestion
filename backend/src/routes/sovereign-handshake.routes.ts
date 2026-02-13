import { Router } from 'express';
import { container } from '../config/inversify.config';
import { SovereignHandshakeController } from '../controllers/SovereignHandshakeController';
import { SovereignBiometricsController } from '../controllers/SovereignBiometricsController';
import { SentinelController } from '../controllers/SentinelController';
import { TYPES } from '../types';

const router = Router();

// Getters for controllers to avoid top-level container.get issues
const getHandshakeController = () =>
  container.get<SovereignHandshakeController>(TYPES.SovereignHandshakeController);
const getBiometricsController = () =>
  container.get<SovereignBiometricsController>(TYPES.SovereignBiometricsController);
const getSentinelController = () => container.get<SentinelController>(TYPES.SentinelController);

/**
 * 🌌 Quantum-Safe Handshake Routes
 */
router.get('/handshake/init', (req, res, next) => getHandshakeController().initHandshake(req, res));
router.post('/handshake/finalize', (req, res, next) =>
  getHandshakeController().finalizeHandshake(req, res)
);

/**
 * 🎙️ Sovereign Biometrics Routes
 */
router.post('/biometrics/voice-enroll', (req, res, next) =>
  getBiometricsController().enrollVoice(req, res)
);
router.post('/biometrics/voice-verify', (req, res, next) =>
  getBiometricsController().verifyVoice(req, res)
);

/**
 * 🛰️ Sovereign Sentinel Routes (Predictive)
 */
router.get('/sentinel/forecast', (req, res, next) => getSentinelController().getForecast(res));

export default router;
