import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  getHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      version: '2.0.0-pilot',
      timestamp: new Date().toISOString(),
    };
  }
}
