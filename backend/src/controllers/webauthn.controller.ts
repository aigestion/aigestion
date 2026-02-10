import { Request, Response } from 'express';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { TYPES } from '../types';
import { IUserRepository } from '../infrastructure/repository/UserRepository';
import { logger } from '../utils/logger';
import { config } from '../config';
import { setCache, getCache } from '../cache/redis';

const sovereignConfig = config as any; // Cast to bypass lint/sync issues with new properties

@controller('/auth/webauthn')
export class WebAuthnController {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  @httpGet('/register-options')
  async getRegisterOptions(@request() req: Request, @response() res: Response) {
    try {
      const user = await this.userRepository.findById(req.user?.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const options = await generateRegistrationOptions({
        rpName: 'AIGestion Sovereign Registry',
        rpID: sovereignConfig.webauthn.rpID,
        userID: Buffer.from(user.id),
        userName: user.email,
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
      });

      // Save challenge to Redis instead of session
      const challengeKey = `webauthn:challenge:${user.id}`;
      await setCache(challengeKey, options.challenge, 300); // 5 minutes

      return res.json(options);
    } catch (error) {
      logger.error('[WebAuthn] Failed to generate reg options:', error);
      return res.status(500).json({ error: 'System error' });
    }
  }

  @httpPost('/register-verify')
  async verifyRegistration(@request() req: Request, @response() res: Response) {
    try {
      const { body } = req;
      const user = await this.userRepository.findById(req.user?.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const challengeKey = `webauthn:challenge:${user.id}`;
      const expectedChallenge = await getCache(challengeKey);

      if (!expectedChallenge) {
        return res.status(400).json({ error: 'Challenge expired or not found' });
      }

      const verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: sovereignConfig.webauthn.origin,
        expectedRPID: sovereignConfig.webauthn.rpID,
      });

      if (verification.verified && verification.registrationInfo) {
        const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

        const newAuthenticator = {
          credentialID: Buffer.from(credentialID),
          credentialPublicKey: Buffer.from(credentialPublicKey),
          counter,
          credentialDeviceType: verification.registrationInfo.credentialDeviceType,
          credentialBackedUp: verification.registrationInfo.credentialBackedUp,
        };

        user!.authenticators.push(newAuthenticator);
        await this.userRepository.update(user!.id, { authenticators: user!.authenticators });

        return res.json({ verified: true });
      }

      return res.status(400).json({ verified: false });
    } catch (error) {
      logger.error('[WebAuthn] Verification failed:', error);
      return res.status(500).json({ error: 'Verification failed' });
    }
  }

  @httpGet('/login-options')
  async getLoginOptions(@request() req: Request, @response() res: Response) {
    try {
      const user = await this.userRepository.findById(req.user?.id);

      const options = await generateAuthenticationOptions({
        rpID: sovereignConfig.webauthn.rpID,
        allowCredentials: user?.authenticators.map(auth => ({
          id: auth.credentialID,
          type: 'public-key',
          transports: auth.transports as any,
        })),
        userVerification: 'preferred',
      });

      if (user) {
        const challengeKey = `webauthn:challenge:${user.id}`;
        await setCache(challengeKey, options.challenge, 300);
      }

      return res.json(options);
    } catch (error) {
      logger.error('[WebAuthn] Failed to generate login options:', error);
      return res.status(500).json({ error: 'System error' });
    }
  }

  @httpPost('/login-verify')
  async verifyLogin(@request() req: Request, @response() res: Response) {
    try {
      const { body, user: sessionUser } = req;
      const user = await this.userRepository.findById(sessionUser?.id || body.userId);

      if (!user || !user.authenticators || user.authenticators.length === 0) {
        return res.status(404).json({ error: 'User or authenticators not found' });
      }

      const challengeKey = `webauthn:challenge:${user.id}`;
      const expectedChallenge = await getCache(challengeKey);

      if (!expectedChallenge) {
        return res.status(400).json({ error: 'Challenge expired or not found' });
      }

      // Find the authenticator used
      const authenticator = user.authenticators.find(
        auth => Buffer.from(auth.credentialID).toString('base64url') === body.id,
      );

      if (!authenticator) {
        return res.status(400).json({ error: 'Authenticator not found for this user' });
      }

      const verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: sovereignConfig.webauthn.origin,
        expectedRPID: sovereignConfig.webauthn.rpID,
        authenticator: {
          credentialID: authenticator.credentialID,
          credentialPublicKey: authenticator.credentialPublicKey,
          counter: authenticator.counter,
          transports: authenticator.transports as any,
        },
      });

      if (verification.verified) {
        // Update counter
        authenticator.counter = verification.authenticationInfo.newCounter;
        await this.userRepository.update(user.id, { authenticators: user.authenticators });

        // Logic for "Sovereign" session elevation
        // In a real scenario, we might issue a special JWT or set a session flag
        return res.json({
          verified: true,
          sovereignToken: 'SOVEREIGN_' + Buffer.from(crypto.randomUUID()).toString('base64'),
        });
      }

      return res.status(400).json({ verified: false });
    } catch (error) {
      logger.error('[WebAuthn] Login verification failed:', error);
      return res.status(500).json({ error: 'Login verification failed' });
    }
  }
}
