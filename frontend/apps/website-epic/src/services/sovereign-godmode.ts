/**
 * Sovereign GodMode Service - AIGestion.net
 * Interface para orquestación de Swarm, Knowledge Graph y misiones autónomas.
 */

import { api } from './api';
import * as kyber from 'crystals-kyber';
import * as nacl from 'tweetnacl';

const SOVEREIGN_SESSION_KEY = 'aig_sovereign_session_token';

export interface SwarmMission {
  id: string;
  objective: string;
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
  results?: string;
  isEncrypted?: boolean;
  vaultIV?: string;
  vaultTag?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface KGNode {
  id: string;
  type: 'concept' | 'mission' | 'finding';
  label: string;
}

export interface KGEdge {
  source: string;
  target: string;
  relation: string;
}

class SovereignGodModeService {
  async launchMission(objective: string): Promise<SwarmMission> {
    try {
      const response = await api.post('/swarm/mission', { objective });
      return response.data;
    } catch (error) {
      console.error('Error launching swarm mission:', error);
      throw error;
    }
  }

  async getKnowledgeGraph(): Promise<{ nodes: KGNode[]; edges: KGEdge[] }> {
    try {
      const response = await api.get('/knowledge-graph/full');
      return response.data;
    } catch (error) {
      console.error('Error fetching knowledge graph:', error);
      // Mock for UI work if API not ready
      return {
        nodes: [
          { id: 'mission_1', type: 'mission', label: 'Market Research 2026' },
          { id: 'finding_1', type: 'finding', label: 'AI Trends: Agentic AI' },
          { id: 'concept_1', type: 'concept', label: 'Sovereign Intelligence' },
        ],
        edges: [
          { source: 'mission_1', target: 'finding_1', relation: 'created' },
          { source: 'finding_1', target: 'concept_1', relation: 'relates_to' },
        ],
      };
    }
  }

  async getRecentMissions(): Promise<SwarmMission[]> {
    try {
      const response = await api.get('/swarm/missions/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent missions:', error);
      return [];
    }
  }

  // WebAuthn / Sovereign Hardware Key Enrollment
  async generateRegistrationOptions() {
    return (await api.get('/auth/webauthn/register-options')).data;
  }

  async verifyRegistration(credential: any) {
    return (await api.post('/auth/webauthn/register-verify', credential)).data;
  }

  // WebAuthn / Sovereign Unlock
  async generateAuthenticationOptions() {
    return (await api.get('/auth/webauthn/login-options')).data;
  }

  async verifyAuthentication(credential: any) {
    return (await api.post('/auth/webauthn/login-verify', credential)).data;
  }

  // 🌌 Sovereign Handshake (PQC)
  async initiateSovereignHandshake(): Promise<{ sessionToken: string }> {
    try {
      // Step 1: Get Server Public Keys
      const initResponse = await api.get('/sovereign/handshake/init');
      const { handshakeId, publicKey: serverPK } = initResponse.data;

      // Step 2: Generate Client Keys
      const clientClassicKeys = nacl.box.keyPair();

      // Encapsulate for Kyber
      const [ciphertext, sharedSecret] = kyber.Encrypt768(this.hexToUint8Array(serverPK.pqc));

      // Derive Client Shared Secret (Hybrid)
      const classicSS = nacl.box.before(
        this.hexToUint8Array(serverPK.classic),
        clientClassicKeys.secretKey
      );

      // Step 3: Finalize Handshake
      const finalizeResponse = await api.post('/sovereign/handshake/finalize', {
        handshakeId,
        clientPublicKey: {
          classic: this.uint8ArrayToHex(clientClassicKeys.publicKey),
        },
        clientCiphertext: this.uint8ArrayToHex(ciphertext),
      });

      const { sessionToken } = finalizeResponse.data;
      localStorage.setItem(SOVEREIGN_SESSION_KEY, sessionToken);

      // Local storage of the derived key
      const combinedSS = new Uint8Array(classicSS.length + sharedSecret.length);
      combinedSS.set(classicSS);
      combinedSS.set(sharedSecret, classicSS.length);

      localStorage.setItem('aig_sovereign_secret', this.uint8ArrayToHex(combinedSS));

      return { sessionToken };
    } catch (error) {
      console.error('Sovereign Handshake failed:', error);
      throw error;
    }
  }

  getSovereignToken(): string | null {
    return localStorage.getItem(SOVEREIGN_SESSION_KEY);
  }

  isUnlocked(): boolean {
    return !!this.getSovereignToken();
  }

  logout() {
    localStorage.removeItem(SOVEREIGN_SESSION_KEY);
    localStorage.removeItem('aig_sovereign_secret');
  }

  // 🔐 E2EE Decryption using derived key
  async decryptFinding(encrypted: {
    iv: string;
    ciphertext: string;
    tag: string;
  }): Promise<string> {
    const secretHex = localStorage.getItem('aig_sovereign_secret');
    if (!secretHex) throw new Error('VAULT_LOCKED');

    try {
      const keyBuffer = this.hexToBuffer(secretHex);
      const ivBuffer = this.hexToBuffer(encrypted.iv);
      const cipherBuffer = this.hexToBuffer(encrypted.ciphertext);
      const tagBuffer = this.hexToBuffer(encrypted.tag);

      // Web Crypto requires the tag to be at the end of the ciphertext
      const combinedData = new Uint8Array(cipherBuffer.byteLength + tagBuffer.byteLength);
      combinedData.set(new Uint8Array(cipherBuffer));
      combinedData.set(new Uint8Array(tagBuffer), cipherBuffer.byteLength);

      const cryptoKey = await window.crypto.subtle.importKey('raw', keyBuffer, 'AES-GCM', false, [
        'decrypt',
      ]);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer,
          tagLength: 128,
        },
        cryptoKey,
        combinedData
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('DECRYPTION_FAILED');
    }
  }

  // 🎙️ Voice Biometrics
  async enrollVoice(audioBase64: string): Promise<any> {
    return (await api.post('/sovereign/biometrics/voice-enroll', { audio: audioBase64 })).data;
  }

  async verifyVoice(audioBase64: string): Promise<any> {
    return (await api.post('/sovereign/biometrics/voice-verify', { audio: audioBase64 })).data;
  }

  // 🛰️ Sovereign Sentinel
  async getResourceForecast(): Promise<any> {
    return (await api.get('/sovereign/sentinel/forecast')).data;
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

  private hexToBuffer(hex: string): ArrayBuffer {
    return this.hexToUint8Array(hex).buffer as ArrayBuffer;
  }
}

export const sovereignGodMode = new SovereignGodModeService();
