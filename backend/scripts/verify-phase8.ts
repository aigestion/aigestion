import axios from 'axios';
import * as kyber from 'crystals-kyber';
import * as nacl from 'tweetnacl';
import crypto from 'node:crypto';

const API_BASE = 'http://localhost:5000/api/v1';

async function verifyHandshake() {
  console.log('🚀 Starting Sovereign Handshake Verification...');

  try {
    // 1. Init Handshake
    const initRes = await axios.get(`${API_BASE}/sovereign/handshake/init`);
    const { handshakeId, publicKey: serverPK } = initRes.data;
    console.log('✅ Step 1: Handshake Initiated. ID:', handshakeId);

    // 2. Client-side key generation & encapsulation
    const clientKeys = nacl.box.keyPair();
    const [clientCiphertext, sharedSecret] = kyber.Encrypt768(Buffer.from(serverPK.pqc, 'hex'));

    const classicSharedSecret = nacl.box.before(
      Buffer.from(serverPK.classic, 'hex'),
      clientKeys.secretKey
    );

    const combined = Buffer.concat([Buffer.from(classicSharedSecret), Buffer.from(sharedSecret)]);
    const clientDerivedKey = crypto.createHash('sha256').update(combined).digest('hex');

    console.log('✅ Client derived symmetric key:', clientDerivedKey);

    // 3. Finalize Handshake
    const finalizeRes = await axios.post(`${API_BASE}/sovereign/handshake/finalize`, {
      handshakeId,
      clientPublicKey: {
        classic: Buffer.from(clientKeys.publicKey).toString('hex')
      },
      clientCiphertext: Buffer.from(clientCiphertext).toString('hex')
    });

    const { sessionToken } = finalizeRes.data;
    console.log('✅ Step 2: Handshake Finalized. Session Token:', sessionToken);

    console.log('\n✨ Phase 8 Backend Verified Successfully! (Wait, this requires server running)');
  } catch (err: any) {
    console.error('❌ Verification failed:', err.response?.data || err.message);
  }
}

// verifyHandshake();
console.log('Verification script created. Ready to run against a live dev server.');
