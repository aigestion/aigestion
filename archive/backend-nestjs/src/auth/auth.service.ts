import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(private readonly sessionService: SessionService) {}

  async validateUser(credentials: any) {
    const user = {
      id: '1',
      email: credentials.email || 'admin@aigestion.net',
      role: 'admin',
    };

    const token = `jwt-${Math.random().toString(36).substr(2)}`;

    // Phase 14: Save session in Redis for cross-platform sharing
    await this.sessionService.saveSession(user.id, token, {
      device: 'nexus-client',
      loginTime: Date.now(),
    });

    return {
      success: true,
      token,
      user,
    };
  }

  refreshToken(token: any) {
    return {
      success: true,
      token: 'new-jwt-token-pilot-v2',
    };
  }
}
