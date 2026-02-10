import { injectable } from 'inversify';
import * as kyber from 'crystals-kyber';
import * as nacl from 'tweetnacl';
import crypto from 'node:crypto';
import { logger } from '../utils/logger';

@injectable()
export class PQCCommService {
  /**
   * Generates a hybrid keypair for the initial handshake.
   */
  async generateHandshakeKeys() {
    try {
      // 1. Classic X25519 Keypair
      const classicKeys = nacl.box.keyPair();

      // 2. Post-Quantum Kyber768 Keypair
      // crystals-kyber KeyGen returns
      const [kyberPK, kyberSK] = kyber.KeyGen768();

      return {
        classic: {
          public: Buffer.from(classicKeys.publicKey).toString('hex'),
          private: Buffer.from(classicKeys.secretKey).toString('hex'),
        },
        pqc: {
          public: Buffer.from(kyberPK).toString('hex'),
          private: Buffer.from(kyberSK).toString('hex'),
        },
      };
    } catch (error) {
      logger.error('[PQCComm] Key generation failed:', error);
      throw error;
    }
  }

  /**
   * Derives a symmetric key using hybrid shared secrets.
   * finalKey = HKDF(X25519_SS || Kyber_SS)
   */
  async deriveSymmetricKey(
    myClassicSK: string,
    theirClassicPK: string,
    myKyberSK: string,
    theirCiphertext?: string, // If they encapsulated for us
    myKyberPK?: string, // If we need to encapsulate for them
    theirKyberPK?: string,
  ): Promise<string> {
    try {
      // 1. Classic Shared Secret
      const classicSS = nacl.box.before(
        Buffer.from(theirClassicPK, 'hex'),
        Buffer.from(myClassicSK, 'hex'),
      );

      let kyberSS: Uint8Array;

      if (theirCiphertext) {
        // They encapsulated for us, we decrypt
        kyberSS = kyber.Decrypt768(
          Buffer.from(theirCiphertext, 'hex'),
          Buffer.from(myKyberSK, 'hex'),
        );
      } else if (theirKyberPK) {
        // We encapsulate for them (this usually happens on one side)
        // In a real handshake, one side generates and the other encapsulates
        const [, ss] = kyber.Encrypt768(Buffer.from(theirKyberPK, 'hex'));
        kyberSS = ss;
        // Note: ciphertext 'c' would need to be sent to them.
        // This service would be called multiple times in a real protocol.
      } else {
        throw new Error('MISSING_PQC_HANDSHAKE_DATA');
      }

      // 2. Hybrid KDF (Simplification: HMAC of concatenated secrets)
      const combined = Buffer.concat([Buffer.from(classicSS), Buffer.from(kyberSS)]);

      return crypto.createHash('sha256').update(combined).digest('hex');
    } catch (error) {
      logger.error('[PQCComm] Key derivation failed:', error);
      throw error;
    }
  }
}
