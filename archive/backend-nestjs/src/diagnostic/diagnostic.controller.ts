import { Controller, Get } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';

@Controller('diagnostic')
export class DiagnosticController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  @Get('status')
  async getStatus() {
    return this.diagnosticService.getSystemStatus();
  }

  @Get('ai')
  async getAIStatus() {
    return this.diagnosticService.checkAIConnectivity();
  }
}
