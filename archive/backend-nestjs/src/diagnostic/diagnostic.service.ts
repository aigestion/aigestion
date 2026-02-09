import { Injectable, Logger } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class DiagnosticService {
  private readonly logger = new Logger(DiagnosticService.name);

  async getSystemStatus() {
    const status = {
      uptime: os.uptime(),
      load: os.loadavg(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: 1 - os.freemem() / os.totalmem(),
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: Date.now(),
    };

    this.logger.debug('System diagnostic captured');
    return status;
  }

  async checkAIConnectivity() {
    // Placeholder for actual AI service ping logic
    return {
      openai: 'online',
      anthropic: 'offline',
      latency: 45,
    };
  }
}
