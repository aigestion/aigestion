import { Container } from 'inversify';
import 'reflect-metadata';

// Types
import { TYPES } from '../types';
import { PromptService } from '../services/prompt.service';

// Use Cases
import { Enable2FAUseCase } from '../application/usecases/Enable2FAUseCase';
import { LoginUserUseCase } from '../application/usecases/LoginUserUseCase';
import { RegisterUserUseCase } from '../application/usecases/RegisterUserUseCase';
import { UpdateSubscriptionUseCase } from '../application/usecases/UpdateSubscriptionUseCase';
import { UpdateUserRoleUseCase } from '../application/usecases/UpdateUserRoleUseCase';
import { Verify2FALoginUseCase } from '../application/usecases/Verify2FALoginUseCase';
import { Verify2FAUseCase } from '../application/usecases/Verify2FAUseCase';
import { VerifyEmailUseCase } from '../application/usecases/VerifyEmailUseCase';
import { CreatePersonaUseCase } from '../application/usecases/persona/CreatePersonaUseCase';
import { GetMarketplacePersonasUseCase } from '../application/usecases/persona/GetMarketplacePersonasUseCase';

// Controllers
import { DevicePostureController } from '../controllers/DevicePostureController';
import { FinanceController } from '../controllers/FinanceController';
import { ForgeController } from '../controllers/ForgeController';
import { GovernanceController } from '../controllers/GovernanceController';
import { MCPController } from '../controllers/MCPController';
import { NeuralHealthController } from '../controllers/NeuralHealthController';
import { NexusCommandController } from '../controllers/NexusCommandController';
import { PersonaController } from '../controllers/PersonaController';
import { PredictiveBIController } from '../controllers/PredictiveBIController';
import { SentinelController } from '../controllers/SentinelController';
import { SovereignBiometricsController } from '../controllers/SovereignBiometricsController';
import { SovereignHandshakeController } from '../controllers/SovereignHandshakeController';
import { AnalyticsController } from '../controllers/analytics.controller';
import { BillingController } from '../controllers/billing.controller';
import { CognitiveController } from '../controllers/cognitive.controller';
import { ContactController } from '../controllers/contact.controller';
import { DanielaController } from '../controllers/daniela.controller';
import { DockerController } from '../controllers/docker.controller';
import { EconomyController } from '../controllers/economy.controller';
import { GodModeController } from '../controllers/godmode.controller';
import { IoTController } from '../controllers/iot.controller';
import { PerceptionController } from '../controllers/perception.controller';
import { SocialController } from '../controllers/social.controller';
import { StripeWebhookController } from '../controllers/stripe.webhook.controller';
import { SwarmController } from '../controllers/swarm.controller';
import { SystemController } from '../controllers/system.controller';
import { UsageController } from '../controllers/usage.controller';
import { VisionController } from '../controllers/vision.controller';
import { WebAuthnController } from '../controllers/webauthn.controller';
import { PromptController } from '../controllers/PromptController';
import { WisdomController } from '../controllers/wisdom.controller';

// Services
import { LandingController } from '../controllers/LandingController';
import { DeFiYieldHarvesterService } from '../services/DeFiYieldHarvesterService';
import { LandingPersonalizationService } from '../services/LandingPersonalizationService';
import { LogMonitoringService } from '../services/LogMonitoringService';
import { MistralService } from '../services/MistralService';
import { GeminiProvider } from '../infrastructure/ai/GeminiProvider';
import { MistralProvider } from '../infrastructure/ai/MistralProvider';
import { AIProviderFactory } from '../infrastructure/ai/AIProviderFactory';
import { AIToolExecutor } from '../infrastructure/ai/AIToolExecutor';
import { AIProvider } from '../interfaces/ai-provider.interface';
import { VertexAI } from '@google-cloud/vertexai';
import { NeuralHealthService } from '../services/NeuralHealthService';
import { SovereignHealingService } from '../services/SovereignHealingService';
import { SovereignSentinelService } from '../services/SovereignSentinelService';
import { SovereignVaultService } from '../services/SovereignVaultService';
import { VoiceBiometricsService } from '../services/VoiceBiometricsService';
import { AgentService } from '../services/agent.service';
import { SemanticRouterService } from '../services/ai-router.service';
import { AIService } from '../services/ai.service';
import { AlertingService } from '../services/alerting.service';
import { AnalyticsService } from '../services/analytics.service';
import { AnomalyDetectionService } from '../services/anomaly-detection.service';
import { AuthService } from '../services/auth.service';
import { AutoDocumentationService } from '../services/auto-documentation.service';
import { BackupRestoreService } from '../services/backup-restore.service';
import { BackupSchedulerService } from '../services/backup-scheduler.service';
import { BackupService } from '../services/backup.service';
import {
  CENTRAL_LOGGING_SERVICE_NAME,
  CentralizedLoggingService,
} from '../services/centralized-logging.service';
import { CloudFailoverService } from '../services/cloud-failover.service';
import { CredentialManagerService } from '../services/credential-manager.service';
import { DanielaAIService } from '../services/daniela-ai.service';
import { DeFiStrategistService } from '../services/defi-strategist.service';
import { DevicePostureService } from '../services/device-posture.service';
import { DoraMetricsService } from '../services/dora-metrics.service';
import { EconomyChartService } from '../services/economy-chart.service';
import { EconomyService } from '../services/economy.service';
import { ElevenLabsService } from '../services/elevenlabs.service';
import { EmailService } from '../services/email.service';
import { EnhancedVoiceService } from '../services/enhanced-voice.service';
import { FacebookService } from '../services/facebook.service';
import { FeatureFlagService } from '../services/feature-flag.service';
import { Gemini2Service } from '../services/gemini-2.service';
import { GodNotificationService } from '../services/god-notification.service';
import { DocumentProcessorService } from '../services/google/document-processor.service';
import { ErrorReportingService } from '../services/google/error-reporting.service';
import { GoogleDriveService } from '../services/google/google-drive.service';
import { GoogleSecretManagerService } from '../services/google/secret-manager.service';
import { VertexAIService } from '../services/google/vertex-ai.service';
import { YouTubeChannelService } from '../services/google/youtube-channel.service';
import { HealthService } from '../services/health.service';
import { HistoryService } from '../services/history.service';
import { InfraOptimizerService } from '../services/infra-optimizer.service';
import { InstagramService } from '../services/instagram.service';
import { KnowledgeGraphService } from '../services/knowledge-graph.service';
import { LinkedInService } from '../services/linkedin.service';
import { MalwareScannerService } from '../services/malware-scanner.service';
import { MetaService } from '../services/meta.service';
import { MetaverseService } from '../services/metaverse.service';
import { MonitoringService } from '../services/monitoring.service';
import { NotificationService } from '../services/notification.service';
import { PayPalService } from '../services/paypal.service';
import { PQCCommService } from '../services/pqc-comm.service';
import { QwenTTSService } from '../services/qwen-tts.service';
import { RagService } from '../services/rag.service';
import { RateLimitService } from '../services/rate-limit.service';
import { RunwayService } from '../services/runway.service';
import { SearchService } from '../services/search.service';
import { SemanticCacheService } from '../services/semantic-cache.service';
import { ServiceMeshService } from '../services/service-mesh.service';
import { SocketService } from '../services/socket.service';
import { StripeService } from '../services/stripe.service';
import { SupabaseService } from '../services/SupabaseService';
import { SwarmInternalClient } from '../services/swarm-internal.client';
import { SwarmService } from '../services/swarm.service';
import { SystemMetricsService } from '../services/system-metrics.service';
import { TelegramBotHandlerGodMode } from '../services/telegram-bot-godmode';
import { TelegramBotHandler } from '../services/telegram-bot.handler';
import { TelegramService } from '../services/telegram.service';
import { ThreatIntelligenceService } from '../services/threat-intelligence.service';
import { TikTokService } from '../services/tiktok.service';
import { TwoFactorService } from '../services/two-factor.service';
import { UsageService } from '../services/usage.service';
import { UserBehaviorService } from '../services/user-behavior.service';
import { UserService } from '../services/user.service';
import { VaultService } from '../services/vault.service';
import { VectorService } from '../services/vector.service';
import { VisionService } from '../services/vision.service';
import { VoiceService } from '../services/voice.service';
import { WAFService } from '../services/waf.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { XService } from '../services/x.service';
import { ZeroTrustService } from '../services/zero-trust.service';
import { YoutubeWatcherService } from '../utils/youtube-watcher.service';
// MemoryService: removed (llamaindex not installed)
import { AstraeaController } from '../controllers/AstraeaController';
import { ProductivityController } from '../controllers/productivity.controller';
import { AstraeaService } from '../services/AstraeaService';
import { DanielaProactiveService } from '../services/DanielaProactiveService';
import { EnterpriseAuditService } from '../services/EnterpriseAuditService';
import { MCPDiscoveryService } from '../services/MCPDiscoveryService';
import { PersonaMarketplaceService } from '../services/PersonaMarketplaceService';
import { PredictiveBIService } from '../services/PredictiveBIService';
import { PredictiveHealingService } from '../services/PredictiveHealingService';
import { SovereignNotionSync } from '../services/SovereignNotionSync';
import { SovereignOrchestratorService } from '../services/SovereignOrchestratorService';
import { SovereignRegistryService } from '../services/SovereignRegistryService';
import { TreasuryService } from '../services/TreasuryService';
import { VapiService } from '../services/VapiService';
import { ArbitrationService } from '../services/arbitration.service';
import { AuditService } from '../services/audit.service';
import { BrowserlessService } from '../services/browserless.service';
import { CoinGeckoService } from '../services/coingecko.service';
import { ContactRegistryService } from '../services/contact-registry.service';
import { DanielaCallAgent } from '../services/daniela-call-agent.service';
import { DanielaEnhancedService } from '../services/daniela-enhanced.service';
import { DeviceStateStore } from '../services/device-state.store';
import { DiscoveryService } from '../services/evolution/discovery.service';
import { EvolutionMetricsService } from '../services/evolution/evolution-metrics.service';
import { SanctuaryService } from '../services/evolution/sanctuary.service';
import { SandboxService } from '../services/evolution/sandbox.service';
import { PriceAlertService } from '../services/finance/price-alert.service';
import { WalletWatchtowerService } from '../services/finance/wallet-watchtower.service';
import { AutoHealingGem } from '../services/gems/AutoHealingGem';
import { ForgeGem } from '../services/gems/ForgeGem';
import { JulesGem } from '../services/gems/JulesGem';
import { NavigatorGem } from '../services/gems/NavigatorGem';
import { NexusStitchGem } from '../services/gems/NexusStitchGem';
import { NexusSwarmOrchestrator } from '../services/gems/swarm-orchestrator.service';
import { AiStudioService } from '../services/google/ai-studio.service';
import { BigQueryService } from '../services/google/bigquery.service';
import { CloudTasksService } from '../services/google/cloud-tasks.service';
import { ColabService } from '../services/google/colab.service';
import { FirebaseService } from '../services/google/firebase.service';
import { GeminiLiveService } from '../services/google/gemini-live.service';
import { GmailService } from '../services/google/gmail.service';
import { GodModeWorkspaceOrchestrator } from '../services/google/god-mode-orchestrator.service';
import { GoogleCalendarService } from '../services/google/google-calendar.service';
import { GoogleContactsService } from '../services/google/google-contacts.service';
import { GoogleSheetsService } from '../services/google/google-sheets.service';
import { GoogleSpeechService } from '../services/google/google-speech.service';
import { GoogleVisionService } from '../services/google/google-vision.service';
import { KeplerService } from '../services/google/kepler.service';
import { MapsService } from '../services/google/maps.service';
import { McpBridgeService } from '../services/google/mcp-bridge.service';
import { AutonomousMissionService } from '../services/google/mission-control.service';
import { NeuralHomeBridge } from '../services/google/neural-home.service';
import { NexusRadioService } from '../services/google/nexus-radio.service';
import { NotebookInsightService } from '../services/google/notebook-insight.service';
import { SovereignKnowledgeService } from '../services/google/sovereign-knowledge.service';
import { SovereignStitchService } from '../services/google/stitch.service';
import { VideoIntelligenceService } from '../services/google/video-intelligence.service';
import { VisualPerceptionService } from '../services/google/visual-perception.service';
import { WorkspaceAdminService } from '../services/google/workspace-admin.service';
import { InfrastructureService } from '../services/infrastructure.service';
import { MastraService } from '../services/mastra.service';
import { MemoryService } from '../services/memory.service';
import { NewsService } from '../services/news.service';
import { NexusPushService } from '../services/nexus-push.service';
import { NotionManagerService } from '../services/notion-manager.service';
import { PineconeService } from '../services/pinecone.service';
import { QuantumSecurityService } from '../services/security/quantum-security.service';
import { SelfHealingService } from '../services/self-healing.service';
import { SovereignKnowledgeEngine } from '../services/sovereign-knowledge-engine';
import { WeatherService } from '../services/weather.service';
import { WhatsAppCommandService } from '../services/whatsapp-command.service';
import { ComplianceService } from '../services/compliance.service';
import { MissionWatcherService } from '../services/mission-watcher.service';
import { config } from './config';

import { TreasuryController } from '../controllers/treasury.controller';
import { TwilioWebhookController } from '../controllers/twilio-webhook.controller';

// Infrastructure
import { DockerService } from '../infrastructure/docker/DockerService';
import { EventBus } from '../infrastructure/eventbus/EventBus';
import { JobQueue } from '../infrastructure/jobs/JobQueue';
import {
  IMissionRepository,
  MissionRepository,
} from '../infrastructure/repository/MissionRepository';
import {
  INotificationRepository,
  NotificationRepository,
} from '../infrastructure/repository/NotificationRepository';
import {
  IPersonaRepository,
  PersonaRepository,
} from '../infrastructure/repository/PersonaRepository';
import { IUserRepository, UserRepository } from '../infrastructure/repository/UserRepository';
import { CommandBus } from '../shared/cqrs/CommandBus';
import { QueryBus } from '../shared/cqrs/QueryBus';

// Queues & Utils
import { YoutubeTranscriptionQueue } from '../queue/youtube-transcription.queue';
import { YoutubeTranscriptionService } from '../utils/youtube-transcription.service';

const container = new Container();

const bind = <T>(id: any, target: any) => {
  if (!container.isBound(id)) {
    container.bind<T>(id).to(target).inSingletonScope();
  }
};

// ========================================
// CORE SERVICES
// ========================================
bind<HistoryService>(TYPES.HistoryService, HistoryService);
bind<TelegramService>(TYPES.TelegramService, TelegramService);
if (!container.isBound(TelegramBotHandler))
  container.bind<TelegramBotHandler>(TelegramBotHandler).toSelf().inSingletonScope();
if (!container.isBound(TelegramBotHandlerGodMode))
  container.bind<TelegramBotHandlerGodMode>(TelegramBotHandlerGodMode).toSelf().inSingletonScope();
bind<DeFiStrategistService>(TYPES.DeFiStrategistService, DeFiStrategistService);
bind<DanielaAIService>(TYPES.DanielaAIService, DanielaAIService);
if (!container.isBound(EconomyController))
  container.bind<EconomyController>(EconomyController).toSelf().inSingletonScope();
bind<SystemMetricsService>(TYPES.SystemMetricsService, SystemMetricsService);
bind<PromptService>(TYPES.PromptService, PromptService);
bind<AlertingService>(TYPES.AlertingService, AlertingService);
if (!container.isBound(TYPES.Config)) {
  container.bind<any>(TYPES.Config).toConstantValue(config);
}
bind<SovereignRegistryService>(TYPES.SovereignRegistryService, SovereignRegistryService);
bind<GoogleSecretManagerService>(TYPES.GoogleSecretManagerService, GoogleSecretManagerService);
bind<CredentialManagerService>(TYPES.CredentialManagerService, CredentialManagerService);
bind<SwarmInternalClient>(TYPES.SwarmInternalClient, SwarmInternalClient);
container
  .bind<LogMonitoringService>(TYPES.LogMonitoringService)
  .to(LogMonitoringService)
  .inSingletonScope();
container
  .bind<LandingPersonalizationService>(TYPES.LandingPersonalizationService)
  .to(LandingPersonalizationService)
  .inSingletonScope();
container.bind<LandingController>(LandingController).toSelf().inSingletonScope();
if (!container.isBound('Container')) container.bind('Container').toConstantValue(container);

// ========================================
// APPLICATION USE CASES
// ========================================
bind<Enable2FAUseCase>(TYPES.Enable2FAUseCase, Enable2FAUseCase);
bind<Verify2FAUseCase>(TYPES.Verify2FAUseCase, Verify2FAUseCase);
bind<Verify2FALoginUseCase>(TYPES.Verify2FALoginUseCase, Verify2FALoginUseCase);
bind<VerifyEmailUseCase>(TYPES.VerifyEmailUseCase, VerifyEmailUseCase);
bind<UpdateUserRoleUseCase>(TYPES.UpdateUserRoleUseCase, UpdateUserRoleUseCase);
bind<UpdateSubscriptionUseCase>(TYPES.UpdateSubscriptionUseCase, UpdateSubscriptionUseCase);
bind<RegisterUserUseCase>(TYPES.RegisterUserUseCase, RegisterUserUseCase);
bind<LoginUserUseCase>(TYPES.LoginUserUseCase, LoginUserUseCase);
bind<CreatePersonaUseCase>(TYPES.CreatePersonaUseCase, CreatePersonaUseCase);
bind<GetMarketplacePersonasUseCase>(
  TYPES.GetMarketplacePersonasUseCase,
  GetMarketplacePersonasUseCase,
);

// ========================================
// INFRASTRUCTURE & REPOSITORIES
// ========================================
bind<CommandBus>(TYPES.CommandBus, CommandBus);
bind<QueryBus>(TYPES.QueryBus, QueryBus);
bind<EventBus>(TYPES.EventBus, EventBus);
bind<JobQueue>(TYPES.JobQueue, JobQueue);

bind<IUserRepository>(TYPES.UserRepository, UserRepository);
bind<IPersonaRepository>(TYPES.PersonaRepository, PersonaRepository);
bind<IMissionRepository>(TYPES.MissionRepository, MissionRepository);
bind<INotificationRepository>(TYPES.NotificationRepository, NotificationRepository);

// ========================================
// BUSINESS SERVICES
// ========================================
bind<DanielaEnhancedService>(TYPES.DanielaEnhancedService, DanielaEnhancedService);
bind<DanielaProactiveService>(TYPES.DanielaProactiveService, DanielaProactiveService);

bind<MetaverseService>(TYPES.MetaverseService, MetaverseService);
bind<PineconeService>(TYPES.PineconeService, PineconeService);
bind<RateLimitService>(TYPES.RateLimitService, RateLimitService);
bind<DeFiStrategistService>(TYPES.DeFiStrategistService, DeFiStrategistService);
bind<InfraOptimizerService>(TYPES.InfraOptimizerService, InfraOptimizerService);
bind<SocketService>(TYPES.SocketService, SocketService);
bind<GodNotificationService>(TYPES.GodNotificationService, GodNotificationService);
bind<NotificationService>(TYPES.NotificationService, NotificationService);

if (!container.isBound(TYPES.DetailedHealthService)) {
  container.bind<HealthService>(TYPES.DetailedHealthService).to(HealthService).inSingletonScope();
}

bind<MistralService>(TYPES.MistralService, MistralService);
bind<GeminiProvider>(TYPES.GeminiProvider, GeminiProvider);
bind<MistralProvider>(TYPES.MistralProvider, MistralProvider);
bind<AIProviderFactory>(TYPES.AIProviderFactory, AIProviderFactory);
bind<AIToolExecutor>(TYPES.AIToolExecutor, AIToolExecutor);

bind<SwarmService>(TYPES.SwarmService, SwarmService);
bind<TwoFactorService>(TYPES.TwoFactorService, TwoFactorService);
bind<EnhancedVoiceService>(TYPES.EnhancedVoiceService, EnhancedVoiceService);
bind<AnalyticsService>(TYPES.AnalyticsService, AnalyticsService);
bind<AuthService>(TYPES.AuthService, AuthService);
bind<DockerService>(TYPES.DockerService, DockerService);
bind<InstagramService>(TYPES.InstagramService, InstagramService);
bind<LinkedInService>(TYPES.LinkedInService, LinkedInService);
bind<RagService>(TYPES.RagService, RagService);
bind<StripeService>(TYPES.StripeService, StripeService);
bind<TikTokService>(TYPES.TikTokService, TikTokService);
bind<XService>(TYPES.XService, XService);
bind<SearchService>(TYPES.SearchService, SearchService);
bind<UsageService>(TYPES.UsageService, UsageService);
bind<UserService>(TYPES.UserService, UserService);
bind<EmailService>(TYPES.EmailService, EmailService);
bind<BackupService>(TYPES.BackupService, BackupService);
bind<BackupSchedulerService>(TYPES.BackupSchedulerService, BackupSchedulerService);
bind<MemoryService>(TYPES.MemoryService, MemoryService);
bind<AuditService>(TYPES.AuditService, AuditService);
bind<SupabaseService>(TYPES.SupabaseService, SupabaseService);
bind<VertexAIService>(TYPES.VertexAIService, VertexAIService);
bind<NotionManagerService>(TYPES.NotionManagerService, NotionManagerService);
bind<WhatsAppCommandService>(TYPES.WhatsAppCommandService, WhatsAppCommandService);
bind<SovereignKnowledgeEngine>(TYPES.SovereignKnowledgeEngine, SovereignKnowledgeEngine);
bind<CoinGeckoService>(TYPES.CoinGeckoService, CoinGeckoService);
bind<WalletWatchtowerService>(TYPES.WalletWatchtowerService, WalletWatchtowerService);
bind<PriceAlertService>(TYPES.PriceAlertService, PriceAlertService);
bind<PersonaMarketplaceService>(TYPES.PersonaMarketplaceService, PersonaMarketplaceService);

// ========================================
// EXTERNAL INTEGRATIONS
// ========================================
bind<GoogleDriveService>(TYPES.GoogleDriveService, GoogleDriveService);
bind<GmailService>(TYPES.GmailService, GmailService);
bind<GoogleSheetsService>(TYPES.GoogleSheetsService, GoogleSheetsService);
// bind<MapsService>(TYPES.MapsService, MapsService); // Bound in Perception section
// bind<JulesGem>(TYPES.JulesGem, JulesGem); // Bound in Gems section
bind<AIService>(TYPES.AIService, AIService);
bind<RunwayService>(TYPES.RunwayService, RunwayService);
bind<PayPalService>(TYPES.PaypalService, PayPalService);
bind<FacebookService>(TYPES.FacebookService, FacebookService);
bind<MetaService>(TYPES.MetaService, MetaService);
bind<ColabService>(TYPES.ColabService, ColabService);
bind<BigQueryService>(TYPES.BigQueryService, BigQueryService);
if (!container.isBound(NotebookInsightService))
  container.bind<NotebookInsightService>(NotebookInsightService).toSelf().inSingletonScope();
if (!container.isBound(CloudTasksService))
  container.bind<CloudTasksService>(CloudTasksService).toSelf().inSingletonScope();
bind<VideoIntelligenceService>(TYPES.VideoIntelligenceService, VideoIntelligenceService);
if (!container.isBound(NexusRadioService))
  container.bind<NexusRadioService>(NexusRadioService).toSelf().inSingletonScope();
bind<QuantumSecurityService>(TYPES.QuantumSecurityService, QuantumSecurityService);
bind<MastraService>(TYPES.MastraService, MastraService);
if (!container.isBound(KeplerService))
  container.bind<KeplerService>(KeplerService).toSelf().inSingletonScope();
bind<SelfHealingService>(TYPES.SelfHealingService, SelfHealingService);
bind<DiscoveryService>(TYPES.DiscoveryService, DiscoveryService);
bind<SandboxService>(TYPES.SandboxService, SandboxService);
bind<SanctuaryService>(TYPES.SanctuaryService, SanctuaryService);
bind<EvolutionMetricsService>(TYPES.EvolutionMetricsService, EvolutionMetricsService);

bind<BrowserlessService>(TYPES.BrowserlessService, BrowserlessService);
bind<NewsService>(TYPES.NewsService, NewsService);
bind<JulesGem>(TYPES.JulesGem, JulesGem);
bind<MistralService>(TYPES.MistralService, MistralService);
bind<Gemini2Service>(TYPES.Gemini2Service, Gemini2Service);

// ========================================
// SPECIALIZED SERVICES
// ========================================
bind<MalwareScannerService>(TYPES.MalwareScannerService, MalwareScannerService);
bind<DocumentProcessorService>(TYPES.DocumentProcessorService, DocumentProcessorService);
bind<ErrorReportingService>(TYPES.ErrorReportingService, ErrorReportingService);
bind<WAFService>(TYPES.WAFService, WAFService);
bind<ThreatIntelligenceService>(TYPES.ThreatIntelligenceService, ThreatIntelligenceService);
bind<MonitoringService>(TYPES.MonitoringService, MonitoringService);
bind<InfrastructureService>(TYPES.InfrastructureService, InfrastructureService);
bind<BackupRestoreService>(TYPES.BackupRestoreService, BackupRestoreService);
if (!container.isBound(CENTRAL_LOGGING_SERVICE_NAME))
  container
    .bind<CentralizedLoggingService>(CENTRAL_LOGGING_SERVICE_NAME)
    .to(CentralizedLoggingService)
    .inSingletonScope();
if (!container.isBound(UserBehaviorService))
  container.bind<UserBehaviorService>(UserBehaviorService).toSelf().inSingletonScope();

bind<DevicePostureService>(TYPES.DevicePostureService, DevicePostureService);
bind<SovereignHealingService>(TYPES.SovereignHealingService, SovereignHealingService);
bind<VoiceBiometricsService>(TYPES.VoiceBiometricsService, VoiceBiometricsService);
bind<SovereignSentinelService>(TYPES.SovereignSentinelService, SovereignSentinelService);
bind<SovereignVaultService>(TYPES.SovereignVaultService, SovereignVaultService);
bind<VaultService>(TYPES.VaultService, VaultService);
bind<PQCCommService>(TYPES.PQCCommService, PQCCommService);
bind<SemanticCacheService>(TYPES.SemanticCacheService, SemanticCacheService);
bind<KnowledgeGraphService>(TYPES.KnowledgeGraphService, KnowledgeGraphService);
bind<CloudFailoverService>(TYPES.CloudFailoverService, CloudFailoverService);
bind<ServiceMeshService>(TYPES.ServiceMeshService, ServiceMeshService);
bind<ZeroTrustService>(TYPES.ZeroTrustService, ZeroTrustService);
bind<AnomalyDetectionService>(TYPES.AnomalyDetectionService, AnomalyDetectionService);
bind<AutoDocumentationService>(TYPES.AutoDocumentationService, AutoDocumentationService);
bind<FeatureFlagService>(TYPES.FeatureFlagService, FeatureFlagService);
bind<DoraMetricsService>(TYPES.DoraMetricsService, DoraMetricsService);
bind<QwenTTSService>(TYPES.QwenTTSService, QwenTTSService);
bind<WhatsAppService>(TYPES.WhatsAppService, WhatsAppService);
bind<EconomyService>(TYPES.EconomyService, EconomyService);
bind<EconomyChartService>(TYPES.EconomyChartService, EconomyChartService);
bind<SemanticRouterService>(TYPES.SemanticRouterService, SemanticRouterService);
bind<YouTubeChannelService>(TYPES.YoutubeChannelService, YouTubeChannelService);
bind<YoutubeWatcherService>(TYPES.YoutubeWatcherService, YoutubeWatcherService);
bind<AgentService>(TYPES.AgentService, AgentService);
bind<VectorService>(TYPES.VectorService, VectorService);
bind<VoiceService>(TYPES.VoiceService, VoiceService);
bind<ElevenLabsService>(TYPES.ElevenLabsService, ElevenLabsService);
bind<YoutubeTranscriptionQueue>(TYPES.YoutubeTranscriptionQueue, YoutubeTranscriptionQueue);
bind<YoutubeTranscriptionService>(TYPES.YoutubeTranscriptionService, YoutubeTranscriptionService);
bind<ArbitrationService>(TYPES.ArbitrationService, ArbitrationService);
bind<NeuralHealthService>(TYPES.NeuralHealthService, NeuralHealthService);
bind<PredictiveHealingService>(TYPES.PredictiveHealingService, PredictiveHealingService);
bind<SovereignOrchestratorService>(
  TYPES.SovereignOrchestratorService,
  SovereignOrchestratorService,
);
bind<EnterpriseAuditService>(TYPES.EnterpriseAuditService, EnterpriseAuditService);
bind<DeFiStrategistService>(TYPES.DeFiStrategistService, DeFiStrategistService);
bind<TreasuryService>(TYPES.TreasuryService, TreasuryService);
bind<NotebookInsightService>(TYPES.NotebookInsightService, NotebookInsightService);
bind<VisionService>(TYPES.VisionService, VisionService);
bind<PredictiveBIService>(TYPES.PredictiveBIService, PredictiveBIService);
bind<MCPDiscoveryService>(TYPES.MCPDiscoveryService, MCPDiscoveryService);
bind<SovereignKnowledgeService>(TYPES.SovereignKnowledgeService, SovereignKnowledgeService);
bind<AiStudioService>(TYPES.AiStudioService, AiStudioService);
bind<FirebaseService>(TYPES.FirebaseService, FirebaseService);
bind<SovereignStitchService>(TYPES.SovereignStitchService, SovereignStitchService);
bind<NexusSwarmOrchestrator>(TYPES.NexusSwarmOrchestrator, NexusSwarmOrchestrator);
bind<AutonomousMissionService>(TYPES.AutonomousMissionService, AutonomousMissionService);
bind<GeminiLiveService>(TYPES.GeminiLiveService, GeminiLiveService);
bind<VisualPerceptionService>(TYPES.VisualPerceptionService, VisualPerceptionService);
bind<McpBridgeService>(TYPES.McpBridgeService, McpBridgeService);
bind<NeuralHomeBridge>(TYPES.NeuralHomeBridge, NeuralHomeBridge);
bind<DeviceStateStore>(TYPES.DeviceStateStore, DeviceStateStore);
bind<NavigatorGem>(TYPES.NavigatorGem, NavigatorGem);
bind<AutoHealingGem>(TYPES.AutoHealingGem, AutoHealingGem);
bind<VapiService>(TYPES.VapiService, VapiService);
bind<AstraeaService>(TYPES.AstraeaService, AstraeaService);
bind<SovereignNotionSync>(TYPES.SovereignNotionSync, SovereignNotionSync);
bind<ComplianceService>(TYPES.ComplianceService, ComplianceService);
bind<MissionWatcherService>(TYPES.MissionWatcherService, MissionWatcherService);

// ========================================
// CONTROLLERS
// ========================================
bind<SwarmController>(TYPES.SwarmController, SwarmController);
bind<PromptController>(TYPES.PromptController, PromptController);
bind<GodModeController>(TYPES.GodModeController, GodModeController);
bind<DanielaController>(TYPES.DanielaController, DanielaController);
bind<SocialController>(TYPES.SocialController, SocialController);
bind<DockerController>(TYPES.DockerController, DockerController);
bind<AnalyticsController>(TYPES.AnalyticsController, AnalyticsController);
bind<BillingController>(TYPES.BillingController, BillingController);
bind<UsageController>(TYPES.UsageController, UsageController);
bind<DevicePostureController>(TYPES.DevicePostureController, DevicePostureController);
if (!container.isBound(WebAuthnController))
  container.bind<WebAuthnController>(WebAuthnController).toSelf().inSingletonScope();
bind<SovereignHandshakeController>(
  TYPES.SovereignHandshakeController,
  SovereignHandshakeController,
);
bind<SovereignBiometricsController>(
  TYPES.SovereignBiometricsController,
  SovereignBiometricsController,
);
bind<SentinelController>(TYPES.SentinelController, SentinelController);
bind<SystemController>(TYPES.SystemController, SystemController);
bind<StripeWebhookController>(TYPES.StripeWebhookController, StripeWebhookController);
bind<ContactController>(TYPES.ContactController, ContactController);
bind<WisdomController>(TYPES.WisdomController, WisdomController);
bind<TreasuryController>(TYPES.TreasuryController, TreasuryController);
bind<VisionController>(TYPES.VisionController, VisionController);
bind<NexusCommandController>(TYPES.NexusCommandController, NexusCommandController);
bind<PredictiveBIController>(TYPES.PredictiveBIController, PredictiveBIController);
bind<GovernanceController>(TYPES.GovernanceController, GovernanceController);
bind<NeuralHealthController>(TYPES.NeuralHealthController, NeuralHealthController);
bind<MCPController>(TYPES.MCPController, MCPController);
bind<PersonaController>(TYPES.PersonaController, PersonaController);
bind<FinanceController>(TYPES.FinanceController, FinanceController);
bind<IoTController>(TYPES.IoTController, IoTController);
bind<DeFiYieldHarvesterService>(TYPES.DeFiYieldHarvesterService, DeFiYieldHarvesterService);
bind<ContactRegistryService>(TYPES.ContactRegistryService, ContactRegistryService);
bind<AstraeaController>(TYPES.AstraeaController, AstraeaController);
bind<DanielaCallAgent>(TYPES.DanielaCallAgent, DanielaCallAgent);
bind<NexusPushService>(TYPES.NexusPushService, NexusPushService);
bind<NexusStitchGem>(TYPES.NexusStitchGem, NexusStitchGem);
bind<ForgeGem>(TYPES.ForgeGem, ForgeGem);
bind<ForgeController>(TYPES.ForgeController, ForgeController);
bind<TwilioWebhookController>(TYPES.TwilioWebhookController, TwilioWebhookController);

// GOOGLE PRODUCTIVITY SUITE
// ========================================
bind<GoogleCalendarService>(TYPES.GoogleCalendarService, GoogleCalendarService);
bind<ProductivityController>(TYPES.ProductivityController, ProductivityController);
bind<CognitiveController>(TYPES.CognitiveController, CognitiveController);

// GOOGLE COGNITIVE & PEOPLE
bind<GoogleVisionService>(TYPES.GoogleVisionService, GoogleVisionService);
bind<GoogleSpeechService>(TYPES.GoogleSpeechService, GoogleSpeechService);
bind<GoogleContactsService>(TYPES.GoogleContactsService, GoogleContactsService);

// WORKSPACE GOD LEVEL
bind<WorkspaceAdminService>(TYPES.WorkspaceAdminService, WorkspaceAdminService);
bind<GodModeWorkspaceOrchestrator>(
  TYPES.GodModeWorkspaceOrchestrator,
  GodModeWorkspaceOrchestrator,
);

// PERCEPTION & NAVIGATION
bind<WeatherService>(TYPES.WeatherService, WeatherService);
bind<MapsService>(TYPES.MapsService, MapsService);
bind<BrowserlessService>(TYPES.BrowserlessService, BrowserlessService);
bind<PerceptionController>(TYPES.PerceptionController, PerceptionController);

export { TYPES, container, container as inversifyConfig };
