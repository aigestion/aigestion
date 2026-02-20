import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { MCPController } from '../controllers/MCPController';

const router = Router();

const getController = () => container.get<MCPController>(TYPES.MCPController);

router.get('/directory', (req, res, next) => getController().getDirectory(req, res, next));
router.post('/register', (req, res, next) => getController().registerLocal(req, res, next));
router.post('/activate/:id', (req, res, next) => getController().activateServer(req, res, next));
router.post('/revoke/:id', (req, res, next) => getController().revokeServer(req, res, next));
router.get('/health/:id', (req, res, next) => getController().checkHealth(req, res, next));
router.post('/sync/:id', (req, res, next) => getController().sync(req, res, next));

export default router;
