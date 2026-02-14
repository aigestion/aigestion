import { injectable } from 'inversify';
import * as mlkem from '@noble/post-quantum/ml-kem';
import * as mldsa from '@noble/post-quantum/ml-dsa';
import { logger } from '../../utils/logger';

/**
 * PRODUCTION-GRADE PQC ENCRYPTION SERVICE
 * Implements FIPS-203 (ML-KEM/Kyber) and FIPS-204 (ML-DSA) using @noble/post-quantum.
 */
@injectable()
export class PQCEncryptionService {
  constructor() {
    logger.info('🔒 Production PQC Active: ML-KEM & ML-DSA Hardening Enforced');
  }

  /**
   * Generates a quantum-resistant keypair (ML-KEM-768).
   */
  generateKeyPair() {
    const seed = crypto.getRandomValues(new Uint8Array(64));
    return mlkem.ml_kem768.keygen(seed);
  }

  /**
   * Encapsulates a shared secret using a public key (ML-KEM).
   */
  async encapsulate(publicKey: Uint8Array) {
    const seed = crypto.getRandomValues(new Uint8Array(32));
    return mlkem.ml_kem768.encapsulate(publicKey, seed);
  }

  /**
   * Signs a payload with ML-DSA (Dilithium replacement).
   */
  async sign(payload: Uint8Array, privateKey: Uint8Array) {
    const seed = crypto.getRandomValues(new Uint8Array(32));
    return mldsa.ml_dsa65.sign(privateKey, payload);
  }

  /**
   * Verifies an ML-DSA signature.
   */
  async verify(payload: Uint8Array, signature: Uint8Array, publicKey: Uint8Array) {
    return mldsa.ml_dsa65.verify(publicKey, payload, signature);
  }
}
