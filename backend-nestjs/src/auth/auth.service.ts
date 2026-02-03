import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateUser(credentials: any) {
    // Placeholder for actual validation logic
    return {
      success: true,
      token: 'jwt-token-pilot-v2',
      user: {
        id: '1',
        email: credentials.email || 'admin@aigestion.net',
        role: 'admin',
      }
    };
  }

  refreshToken(token: any) {
    return {
      success: true,
      token: 'new-jwt-token-pilot-v2',
    };
  }
}
