import { Router } from 'express';
import type { Request, Response } from 'express';
import fetch from 'node-fetch';

import { env } from '../config/env.schema';
import { rateLimiter } from '../middleware/rate-limiter.instance';

const mcpRouter = Router();

// Sovereign Bridge Middleware
mcpRouter.use(rateLimiter.attempt('MCP'));

mcpRouter.use((req, res, next) => {
  const token = req.headers['x-sovereign-token'];
  if (!token || token !== env.IA_ENGINE_API_KEY) { // Using IA_ENGINE_API_KEY as the sovereign secret
    return (res as any).status(401).json({ 
      error: 'Token Soberano Requerido',
      message: 'Se requiere un token válido para acceder al puente del Nexo AIGestion.' 
    });
  }
  next();
});

/**
 * @openapi
 * /mcp/health:
 *   get:
 *     summary: Check MCP server health
 *     tags: [MCP]
 *     responses:
 *       200:
 *         description: MCP server is reachable
 *       502:
 *         description: Unable to reach MCP server
 */
mcpRouter.get('/health', async (_req: Request, res: Response) => {
  const baseUrl = env.MCP_SERVER_URL;
  if (!baseUrl) {
    return (res as any).status(500).json({ error: 'MCP_SERVER_URL not configured' });
  }
  try {
    const response = await fetch(`${baseUrl}/health`);
    if (!response.ok) {
      return (res as any)
        .status(502)
        .json({ error: 'MCP server responded with error', status: response.status });
    }
    const data = await response.json();
    return (res as any).status(200).json({ status: 'ok', mcp: data });
  } catch (err) {
    return (res as any).status(502).json({
      error: 'Error de Conexión con el Servidor MCP',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

export default mcpRouter;
