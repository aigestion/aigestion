import { Controller, Get, Req } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system/health')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('/')
  getHealth(@Req() req: any) {
    const requestId = req.headers['x-request-id'] || 'unknown';
    return {
      success: true,
      data: this.systemService.getHealth(),
      requestId,
    };
  }

  @Get('/detailed')
  getDetailedHealth() {
    return {
      success: true,
      data: {
        ...this.systemService.getHealth(),
        details: 'Detailed diagnostics coming soon',
      },
    };
  }
}
