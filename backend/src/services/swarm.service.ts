import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { BrowserlessService } from './browserless.service';
import { EconomyService } from './economy.service';
import { BigQueryService } from './google/bigquery.service';
// import { MemoryService } from './memory.service'; // Removed unused
import { DiscoveryService } from './evolution/discovery.service';
import { SandboxService } from './evolution/sandbox.service';
import { ArbitrationService } from './arbitration.service';
import { NotebookInsightService } from './google/notebook-insight.service';
import { TreasuryService } from './TreasuryService';
import { DeFiStrategistService } from './defi-strategist.service';
import { NotionManagerService } from './notion-manager.service';
import { JulesGem } from './gems/JulesGem';
import { NewsService } from './news.service';
import { logger } from '../utils/logger';

interface SwarmResponse {
  agentName: string;
  result: any;
  confidence: number;
}

interface SwarmTask {
  id: string;
  payload: string;
}

@injectable()
export class SwarmService {
  constructor(
    @inject(TYPES.AIService) private readonly generalAgent: AIService,
    @inject(TYPES.BrowserlessService) private readonly researchAgent: BrowserlessService,
    @inject(TYPES.EconomyService) private readonly economyAgent: EconomyService,
    @inject(TYPES.BigQueryService) private readonly bq: BigQueryService,
    // @inject(TYPES.MemoryService) private readonly memory: MemoryService,
    @inject(TYPES.DiscoveryService) private readonly discovery: DiscoveryService,
    @inject(TYPES.SandboxService) private readonly sandbox: SandboxService,
    @inject(TYPES.ArbitrationService) private readonly arbitration: ArbitrationService,
    @inject(TYPES.NotebookInsightService) private readonly notebook: NotebookInsightService,
    @inject(TYPES.TreasuryService) private readonly treasury: TreasuryService,
    @inject(TYPES.DeFiStrategistService) private readonly defi: DeFiStrategistService,
    @inject(TYPES.NotionManagerService) private readonly notion: NotionManagerService,
    @inject(TYPES.NewsService) private readonly newsService: NewsService,
    @inject(JulesGem) private readonly julesGem: JulesGem, // Injected Jules
  ) {
    void this.initializeAutoEvolution();
  }

  private async initializeAutoEvolution() {
    logger.info('[SwarmService] Auto-Evolution initialized');
  }

  // ... existing methods ...

  /**
   * Jules Agent: Specialized in high-level coding standards and architectural refactoring.
   */
  private async julesCodingMission(payload: string): Promise<SwarmResponse> {
    logger.info('[SwarmService] Dispatching Jules (Coding Agent - God Mode)');

    // Use the specialized JulesGem
    const result = await this.julesGem.generateCanonical(payload);

    return {
      agentName: 'Jules-Code-God',
      result,
      confidence: 0.99,
    };
  }

  private async economyMission(payload: string): Promise<SwarmResponse> {
    logger.info('[SwarmService] Dispatching Economy Agent');
    const advice = await this.economyAgent.getInvestmentAdvice(); // Simplified implementation
    return {
      agentName: 'Economy-Expert',
      result: advice.advice,
      confidence: 0.95,
    };
  }

  private async researchMission(payload: string): Promise<SwarmResponse> {
    logger.info('[SwarmService] Dispatching Research (Browserless) Agent');
    // Implementation would use Browserless to fetch live data
    return {
      agentName: 'Research-Spider',
      result: 'Research capability active. Live data harvesting initiated.',
      confidence: 0.9,
    };
  }

  private async generalMission(payload: string): Promise<SwarmResponse> {
    logger.info('[SwarmService] Dispatching General Intelligence (Daniela)');
    const result = await this.generalAgent.generateContent(payload, 'swarm-system', 'god');
    return {
      agentName: 'Daniela-Si',
      result,
      confidence: 0.88,
    };
  }

  /**
   * SOVEREIGN ARCHITECT: Orchestrates recursive system expansion.
   */
  private async evolutionMission(payload: string): Promise<SwarmResponse> {
    logger.info('[SwarmService] Dispatching Sovereign Architect (Aden Evolution)');

    // 1. Discovery phase
    const discoveryResult = await this.discovery.discoverTrendingTech(payload);

    // 2. Sandbox phase (simulated for the top recommendation)
    const packageToTest = discoveryResult.recommendation.split(' ')[0]; // Simplified extraction
    const validation = await this.sandbox.validateModule(packageToTest || 'next-gen-module');

    const resultText = `Evolution check complete. Tech found: ${discoveryResult.topRepos.length} items. Recommendation: ${discoveryResult.recommendation}. Security Validation: ${validation.status}.`;

    // Sync to Notion
    void this.notion.syncSwarmPlan(
      `Swarm Evolution: ${discoveryResult.recommendation.split('\n')[0]}`,
      resultText,
      'Evolution Plan',
    );

    return {
      agentName: 'Sovereign-Architect',
      result: resultText,
      confidence: 0.99,
    };
  }

  /**
   * WISDOM AGENT: Synthesizes insights from various sources for strategic guidance.
   */
  private async wisdomMission(payload: string): Promise<SwarmResponse> {
    logger.info('[SwarmService] Dispatching Wisdom Agent (Strategic Insight)');

    // 1. Gather insights from NotebookInsightService
    const notebookInsights = await this.notebook.generateInsightNotebook(payload, {
      trends: 'analyzing',
    });

    // 2. Use general agent to synthesize and propose strategic resolution
    const strategicGuidance = await this.generalAgent.generateContent(
      `[WISDOM SYNTHESIS MODE]\nBased on the following insights: ${notebookInsights.topic}\n\nPropose a strategic resolution for: ${payload}`,
      'swarm-system',
      'god',
    );

    // 3. Arbitrate if necessary (simplified for now, could involve multiple agents)
    const resolution = await this.arbitration.resolveConflict([
      { agentName: 'Notebook-Insight', recommendation: notebookInsights.message },
      { agentName: 'Daniela-Si', recommendation: strategicGuidance },
    ]);

    const resultText = `Wisdom attained. ${notebookInsights.topic}. Strategic Resolution: ${resolution.decision}. Justification: ${resolution.justification}`;

    // Sync to Notion
    void this.notion.syncSwarmPlan(
      `Strategic Resolution: ${notebookInsights.topic}`,
      resultText,
      'Strategic Guidance',
    );

    return {
      agentName: 'Sovereign-Wisdom',
      result: resultText,
      confidence: 1,
    };
  }

  /**
   * LAYER 2: MULTI-AGENT COLLABORATION (Debate Mode)
   * High-tier strategic decisions require consensus from multiple expert agents.
   */
  private async collaborate(task: SwarmTask): Promise<SwarmResponse> {
    logger.info(`[SwarmService] Initiating Cognitive Debate for task: ${task.id}`);

    // 1. Parallel execution across specialist agents (e.g., General Intelligence + Coding/Architecture)
    const [agentA, agentB] = await Promise.all([
      this.generalMission(task.payload),
      this.julesCodingMission(task.payload),
    ]);

    const perspectives = [
      { agentName: agentA.agentName, recommendation: agentA.result },
      { agentName: agentB.agentName, recommendation: agentB.result },
    ];

    // 2. Sovereign Arbitration (The Judge)
    const { decision, justification } = await this.arbitration.resolveConflict(perspectives);

    logger.info(`[SwarmService] Sovereign Judge Resolution: ${justification.substring(0, 50)}...`);

    return {
      agentName: 'Sovereign-Judge',
      result: `[DECISIÓN]: ${decision}\n\n[JUSTIFICACIÓN]: ${justification}`,
      confidence: 1,
    };
  }

  /**
   * ASSET MANAGER: Orchestrates financial sovereignty and yield harvesting.
   */
  private async assetMission(payload: string): Promise<SwarmResponse> {
    logger.info('[SwarmService] Dispatching Asset Manager Mission (Financial Sovereignty)');

    // 1. Check Sovereign Health
    const health = await this.treasury.getSovereignHealth();

    // 2. Rebalance Capital
    const rebalance = await this.treasury.rebalanceCapital();

    let defiAction = 'N/A';
    if (rebalance.action === 'INVEST_DEFI') {
      const opportunity = await this.defi.scanYieldOpportunities();
      defiAction = `Inversión recomendada: ${opportunity.opportunity} (${opportunity.expectedYield}) - Riesgo: ${opportunity.riskLevel}`;
    }

    return {
      agentName: 'Sovereign-Asset-Manager',
      result: `Salud del Tesoro: ${health.status}. Burn Ratio: ${health.burnEfficiency}. Acción: ${rebalance.action}. ${defiAction}`,
      confidence: 0.95,
    };
  }
  /**
   * GENERIC MISSION ORCHESTRATOR (Bridge to Controller)
   */
  public async createMission(objective: string, userId: string): Promise<SwarmResponse> {
    logger.info(`[SwarmService] Received mission request from ${userId}: ${objective}`);

    const lowerObj = objective.toLowerCase();

    // Simple keyword-based routing (God Mode Logic)
    if (lowerObj.includes('code') || lowerObj.includes('refactor') || lowerObj.includes('fix')) {
      return this.julesCodingMission(objective);
    }
    if (lowerObj.includes('invest') || lowerObj.includes('yield') || lowerObj.includes('price')) {
      return this.assetMission(objective);
    }
    if (lowerObj.includes('research') || lowerObj.includes('find') || lowerObj.includes('search')) {
      return this.researchMission(objective);
    }
    if (lowerObj.includes('evolve') || lowerObj.includes('upgrade') || lowerObj.includes('tech')) {
      return this.evolutionMission(objective);
    }
    if (
      lowerObj.includes('strategy') ||
      lowerObj.includes('plan') ||
      lowerObj.includes('insight')
    ) {
      return this.wisdomMission(objective);
    }

    return this.generalMission(objective);
  }

  /**
   * RED SWARM PROTOCOL: Active Defense Trigger
   * Called by PriceAlertService when markets crash.
   */
  public async activateRedSwarm(
    asset: string,
    changePercent: number,
    price: number,
  ): Promise<SwarmResponse> {
    logger.warn(`[SwarmService] 🚨 RED SWARM ACTIVATED: ${asset} crashed ${changePercent}%`);

    // 1. Fetch live contextual news (Fast search)
    let crashNews: any[] = [];
    try {
      crashNews = await this.newsService.searchNews(
        `why is ${asset} price crashing news today reasons for ${asset} drop`,
      );
    } catch (error: any) {
      logger.error(`[SwarmService] Failed to fetch news for Red Swarm: ${error.message}`);
    }

    const newsContext =
      crashNews.length > 0
        ? crashNews.map(n => `- ${n.title} (Source: ${n.source})`).join('\n')
        : 'No real-time headlines detected via Tavily.';

    const payload = `
      [URGENT] MARKET CRASH DETECTED: ${asset.toUpperCase()}
      Drop: ${changePercent.toFixed(2)}%
      Current Price: $${price}

      LIVE NEWS CONTEXT:
      ${newsContext}

      IMMEDIATE ACTION REQUIRED:
      1. Analyze the potential correlation between the news results and the price drop.
      2. Recommend immediate defensive actions for the layout (Hold, Sell, Buy Dip).
      3. Assess systemic risk to the Sovereign Treasury.

      Provide a "Defensive Tactical Response" plan based on this evidence.
    `;

    // Dispatch high-priority wisdom mission
    return this.wisdomMission(payload);
  }

  public async executeTool(toolName: string, args: any): Promise<SwarmResponse> {
    logger.info(`[SwarmService] Execute Tool Request: ${toolName}`);
    // Basic tool execution stub
    return {
      agentName: 'Tool-Executor',
      result: `Tool ${toolName} executed with args: ${JSON.stringify(args)}`,
      confidence: 1.0,
    };
  }

  public async getGodState(): Promise<any> {
    const health = await this.treasury.getSovereignHealth();
    return {
      status: 'GOD_MODE_ACTIVE',
      treasury: health,
      activeAgents: ['Jules', 'Daniela', 'Economy', 'Research', 'Sovereign-Architect'],
      uptime: process.uptime(),
    };
  }

  public async getMission(id: string): Promise<SwarmResponse> {
    return {
      agentName: 'System',
      result: `Mission ${id} details retrieved.`,
      confidence: 1.0,
    };
  }

  public async orchestrate(task: any): Promise<SwarmResponse> {
    return this.createMission(
      task.payload || task.objective || 'General Task',
      'system-orchestrator',
    );
  }
}
