import { Injectable, Logger } from '@nestjs/common';
import { VectorService } from '../vector/vector.service';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private vectorService: VectorService,
    private billingService: BillingService
  ) {}

  /**
   * Core "Thinking" Loop:
   * 1. Check Credits (Billing)
   * 2. Recall Context (Vector Memory)
   * 3. Process (Simulated AI)
   * 4. Deduct Credits
   */
  async processQuery(userId: string, query: string, context?: any): Promise<string> {
    this.logger.log(`Agent processing query for ${userId}: "${query}"`);

    // 1. Economic Check
    const hasCredits = await this.billingService.checkCredits(userId);
    if (!hasCredits) {
      this.logger.warn(`User ${userId} has insufficient credits.`);
      return "I apologize, but you have insufficient credits to process this request. Please top up your subscription.";
    }

    // 2. Memory Retrieval
    const memory = await this.vectorService.search(query);
    const relevantContext = memory.map(m => m.text).join('\n');
    this.logger.debug(`Retrieved memory context: ${relevantContext.substring(0, 50)}...`);

    // 3. AI Processing (Simulated)
    // In production, this call would go to OpenAI/Anthropic via a SemanticRouter
    const response = `[Agent] Based on your history, I recall: ${relevantContext}. Proceeding with: ${query}`;

    // 4. Economic Deduction
    // We deduct 1 credit for a standard query
    await this.billingService.reportUsage(userId, 'sub_item_placeholder', 1);

    return response;
  }
}
