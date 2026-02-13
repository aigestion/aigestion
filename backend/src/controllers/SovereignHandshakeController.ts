import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../types';
import { PQCCommService } from '../services/pqc-comm.service';
import { logger } from '../utils/logger';
import { setCache, getCache } from '../cache/redis';
import crypto from 'node:crypto';

@controller('/auth/sovereign')
export class SovereignHandshakeController {
  constructor(@inject(TYPES.PQCCommService) private pqcService: PQCCommService) {}

  /**
   * 🌌 Step 1: Initiate Handshake
   * Server provides its public hybrid keys.
   */
  @httpGet('/handshake/init')
  public async initHandshake(@request() req: Request, @response() res: Response) {
    try {
      const handshakeId = crypto.randomUUID();
      const keys = await this.pqcService.generateHandshakeKeys();

      // Store private keys in Redis (transient) for the session
      await setCache(`pqc:handshake:${handshakeId}`, JSON.stringify(keys), 300); // 5 min TTL

      return res.json({
        success: true,
        handshakeId,
        publicKey: {
          classic: keys.classic.public,
          pqc: keys.pqc.public,
        },
      });
    } catch (error: any) {
      logger.error('[SovereignHandshake] Init failed:', error);
      return res.status(500).json({ error: 'Handshake initialization failed' });
    }
  }

  /**
   * 🌌 Step 2: Finalize Handshake
   * Receive client keys, derive symmetric secret.
   */
  @httpPost('/handshake/finalize')
  public async finalizeHandshake(@request() req: Request, @response() res: Response) {
    try {
      const { handshakeId, clientPublicKey, clientCiphertext } = req.body;

      const cachedKeysStr = await getCache(`pqc:handshake:${handshakeId}`);
      if (!cachedKeysStr) {
        return res.status(400).json({ error: 'Handshake session expired or invalid' });
      }

      const myKeys = JSON.parse(cachedKeysStr);

      // Derive Symmetric Key
      const symmetricKey = await this.pqcService.deriveSymmetricKey(
        myKeys.classic.private,
        clientPublicKey.classic,
        myKeys.pqc.private,
        clientCiphertext // Client should have encapsulated for us
      );

      // Store the final session secret for this Sovereign Session
      const sessionToken = crypto.randomUUID();
      await setCache(`sovereign:session:${sessionToken}`, symmetricKey, 3600); // 1 hour TTL

      return res.json({
        success: true,
        sessionToken,
        // The client already knows the symmetric key if they encapsulated correctly
        message: 'Sovereign channel established.',
      });
    } catch (error: any) {
      logger.error('[SovereignHandshake] Finalization failed:', error);
      return res.status(500).json({ error: 'Handshake finalization failed' });
    }
  }
}
