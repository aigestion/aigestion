import { Module } from '@nestjs/common';
import { AudioGateway } from './audio.gateway';
import { AgentModule } from '../agent/agent.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AgentModule, ConfigModule],
  providers: [AudioGateway],
})
export class AudioModule {}
