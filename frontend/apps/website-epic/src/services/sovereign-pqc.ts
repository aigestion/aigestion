import * as kyber from 'crystals-kyber';
import * as nacl from 'tweetnacl';
import { api } from './api';

/**
 * 🌌 Sovereign PQC Service
 * Handles the client-side of the Hybrid Post-Quantum Handshake.
 */
class SovereignPQCService {
  private sessionToken: string | null = null;
  private symmetricKey: string | null = null;

  /**
   * Performs the full hybrid handshake with the backend.
   */
  async establishSovereignChannel(): Promise<string> {
    try {
      // 1. Get Server Public Keys
      const initRes = await api.get('/sovereign/handshake/init');
      const { handshakeId, publicKey: serverPK } = initRes.data;

      // 2. Generate Client Classic Keypair (X25519)
      const clientClassicKeys = nacl.box.keyPair();

      // 3. Encapsulate for Server's Kyber Public Key
      const [ciphertext, kyberSS] = kyber.Encrypt768(this.hexToUint8Array(serverPK.pqc));

      // 4. Derive Classic Shared Secret
      const classicSS = nacl.box.before(
        this.hexToUint8Array(serverPK.classic),
        clientClassicKeys.secretKey
      );

      // 5. Finalize Handshake with Server
      const finalizeRes = await api.post('/sovereign/handshake/finalize', {
        handshakeId,
        clientPublicKey: {
          classic: this.uint8ArrayToHex(clientClassicKeys.publicKey)
        },
        clientCiphertext: this.uint8ArrayToHex(ciphertext)
      });

      this.sessionToken = finalizeRes.data.sessionToken;

      // 6. Derive Local Symmetric Key (must match server's derivation)
      this.symmetricKey = await this.deriveLocalKey(classicSS, kyberSS);

      console.log('🌌 Sovereign channel established. Session:', this.sessionToken);
      return this.sessionToken!;
    } catch (error) {
      console.error('Sovereign Handshake failed:', error);
      throw new Error('SOVEREIGN_HANDSHAKE_FAILED');
    }
  }

  getSessionToken() {
    return this.sessionToken;
  }

  getSymmetricKey() {
    return this.symmetricKey;
  }

  private async deriveLocalKey(classicSS: Uint8Array, kyberSS: Uint8Array): Promise<string> {
    // Concatenate secrets
    const combined = new Uint8Array(classicSS.length + kyberSS.length);
    combined.set(classicSS);
    combined.set(kyberSS, classicSS.length);

    // SHA-256 Hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    return this.uint8ArrayToHex(new Uint8Array(hashBuffer));
  }

  private hexToUint8Array(hex: string): Uint8Array {
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return arr;
  }

  private uint8ArrayToHex(arr: Uint8Array): string {
    return Array.from(arr)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export const sovereignPQC = new SovereignPQCService();
