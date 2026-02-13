import { injectable } from 'inversify';
import crypto from 'node:crypto';
import { logger } from '../utils/logger';

@injectable()
export class VaultService {
  private readonly algorithm = 'aes-256-gcm';

  /**
   * Encrypts sensitive findings using AES-256-GCM.
   */
  async encrypt(
    data: string,
    secret: string
  ): Promise<{ iv: string; ciphertext: string; tag: string }> {
    try {
      // Derive a 32-byte key from the secret (e.g., user hardware key or system secret)
      const key = crypto.createHash('sha256').update(secret).digest();
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      let ciphertext = cipher.update(data, 'utf8', 'hex');
      ciphertext += cipher.final('hex');
      const tag = cipher.getAuthTag().toString('hex');

      return {
        iv: iv.toString('hex'),
        ciphertext,
        tag,
      };
    } catch (error) {
      logger.error('[VaultService] Encryption failed:', error);
      throw new Error('FAILED_ENCRYPTION');
    }
  }

  /**
   * Decrypts vault data.
   */
  async decrypt(
    ivHex: string,
    ciphertext: string,
    tagHex: string,
    secret: string
  ): Promise<string> {
    try {
      const key = crypto.createHash('sha256').update(secret).digest();
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);

      decipher.setAuthTag(tag);

      let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('[VaultService] Decryption failed:', error);
      throw new Error('INVALID_DECRYPTION_SECRET');
    }
  }

  /**
   * 🌌 Sovereign Decryption
   * Uses a session-bound symmetric key derived from the PQC handshake.
   */
  async decryptWithSovereignKey(
    ivHex: string,
    ciphertext: string,
    tagHex: string,
    sovereignSessionToken: string
  ): Promise<string> {
    const { getCache } = require('../cache/redis');
    const secret = await getCache(`sovereign:session:${sovereignSessionToken}`);

    if (!secret) {
      throw new Error('SOVEREIGN_SESSION_EXPIRED');
    }

    return this.decrypt(ivHex, ciphertext, tagHex, secret);
  }
}
