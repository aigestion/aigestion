import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { VectorModule } from '../vector/vector.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [VectorModule, BillingModule],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
