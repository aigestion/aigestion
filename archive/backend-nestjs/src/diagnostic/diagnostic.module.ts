import { Module } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { DiagnosticController } from './diagnostic.controller';

@Module({
  providers: [DiagnosticService],
  controllers: [DiagnosticController],
  exports: [DiagnosticService],
})
export class DiagnosticModule {}
