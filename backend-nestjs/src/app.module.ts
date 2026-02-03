import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SystemModule } from './system/system.module';
import { AuthModule } from './auth/auth.module';
import { AudioModule } from './audio/audio.module';
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import { VectorModule } from './vector/vector.module';
import { BillingModule } from './billing/billing.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SystemModule, 
    AuthModule, 
    AudioModule, 
    DiagnosticModule,
    VectorModule,
    BillingModule,
    AgentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
