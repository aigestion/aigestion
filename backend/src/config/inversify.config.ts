import 'reflect-metadata';

import { Container } from 'inversify';

import { LoginUserUseCase } from '../application/usecases/LoginUserUseCase';
import { RegisterUserUseCase } from '../application/usecases/RegisterUserUseCase';
import { CreatePersonaUseCase } from '../application/usecases/persona/CreatePersonaUseCase';
import { GetMarketplacePersonasUseCase } from '../application/usecases/persona/GetMarketplacePersonasUseCase';
import { SwarmController } from '../controllers/swarm.controller';
import { GodModeController } from '../controllers/godmode.controller';
import { DanielaController } from '../controllers/daniela.controller';
import { DockerService } from '../infrastructure/docker/DockerService';
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
import { AIService } from '../services/ai.service';
import { AlertingService } from '../services/alerting.service';
import { AnalyticsService } from '../services/analytics.service';
import { AnomalyDetectionService } from '../services/anomaly-detection.service';
import { AuthService } from '../services/auth.service';
import { AutoDocumentationService } from '../services/auto-documentation.service';
import { BackupSchedulerService } from '../services/backup-scheduler.service';
import { BackupService } from '../services/backup.service';
import { CloudFailoverService } from '../services/cloud-failover.service';
import { CredentialManagerService } from '../services/credential-manager.service';
import { DanielaAIService } from '../services/daniela-ai.service';
import { DeFiStrategistService } from '../services/defi-strategist.service';
import { DoraMetricsService } from '../services/dora-metrics.service';
import { EmailService } from '../services/email.service';
import { GodNotificationService } from '../services/god-notification.service';
import { EnhancedVoiceService } from '../services/enhanced-voice.service';
import { FeatureFlagService } from '../services/feature-flag.service';
import { ErrorReportingService } from '../services/google/error-reporting.service';
import { GoogleDriveService } from '../services/google/google-drive.service';
import { GoogleSecretManagerService } from '../services/google/secret-manager.service';
import { HealthService } from '../services/health.service';
import { HistoryService } from '../services/history.service';
import { InfraOptimizerService } from '../services/infra-optimizer.service';
import { InstagramService } from '../services/instagram.service';
import { KnowledgeGraphService } from '../services/knowledge-graph.service';
import { LinkedInService } from '../services/linkedin.service';
import { MetaverseService } from '../services/metaverse.service';
import { NotificationService } from '../services/notification.service';
import { QwenTTSService } from '../services/qwen-tts.service';
import { RagService } from '../services/rag.service';
import { RateLimitService } from '../services/rate-limit.service';
import { SearchService } from '../services/search.service';
import { SemanticCacheService } from '../services/semantic-cache.service';
import { ServiceMeshService } from '../services/service-mesh.service';
import { SocketService } from '../services/socket.service';
import { StripeService } from '../services/stripe.service';
import { SwarmService } from '../services/swarm.service';
import { SystemMetricsService } from '../services/system-metrics.service';
import { TelegramBotHandlerGodMode } from '../services/telegram-bot-godmode';
import { TelegramBotHandler } from '../services/telegram-bot.handler';
import { TelegramService } from '../services/telegram.service';
import { TikTokService } from '../services/tiktok.service';
import { TwoFactorService } from '../services/two-factor.service';
import { UsageService } from '../services/usage.service';
import { UserService } from '../services/user.service';
import { XService } from '../services/x.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { ZeroTrustService } from '../services/zero-trust.service';
import { TYPES } from '../types';

const container = new Container();

container.bind<HistoryService>(TYPES.HistoryService).to(HistoryService).inSingletonScope();
container.bind<TelegramService>(TYPES.TelegramService).to(TelegramService).inSingletonScope();
container.bind<TelegramBotHandler>(TelegramBotHandler).toSelf().inSingletonScope();
container.bind<TelegramBotHandlerGodMode>(TelegramBotHandlerGodMode).toSelf().inSingletonScope();
container.bind<DanielaAIService>(TYPES.DanielaAIService).to(DanielaAIService).inSingletonScope();
container
  .bind<SystemMetricsService>(TYPES.SystemMetricsService)
  .to(SystemMetricsService)
  .inSingletonScope();
container.bind<AlertingService>(TYPES.AlertingService).to(AlertingService).inSingletonScope();
container
  .bind<GoogleSecretManagerService>(TYPES.GoogleSecretManagerService)
  .to(GoogleSecretManagerService)
  .inSingletonScope();
container
  .bind<CredentialManagerService>(TYPES.CredentialManagerService)
  .to(CredentialManagerService)
  .inSingletonScope();
container.bind('Container').toConstantValue(container);

import { Enable2FAUseCase } from '../application/usecases/Enable2FAUseCase';
import { Verify2FALoginUseCase } from '../application/usecases/Verify2FALoginUseCase';
import { Verify2FAUseCase } from '../application/usecases/Verify2FAUseCase';
import { EventBus } from '../infrastructure/eventbus/EventBus';
import { CommandBus } from '../shared/cqrs/CommandBus';
import { QueryBus } from '../shared/cqrs/QueryBus';

container.bind<MetaverseService>(TYPES.MetaverseService).to(MetaverseService).inSingletonScope();
container.bind<RateLimitService>(TYPES.RateLimitService).to(RateLimitService).inSingletonScope();
container.bind<DeFiStrategistService>(TYPES.DeFiStrategistService).to(DeFiStrategistService).inSingletonScope();
container.bind<InfraOptimizerService>(TYPES.InfraOptimizerService).to(InfraOptimizerService).inSingletonScope();
container.bind<SocketService>(TYPES.SocketService).to(SocketService).inSingletonScope();
container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository).inSingletonScope();
container
  .bind<GodNotificationService>(TYPES.GodNotificationService)
  .to(GodNotificationService)
  .inSingletonScope();
container.bind<GodModeController>(TYPES.GodModeController).to(GodModeController).inSingletonScope();
container.bind<DanielaController>(TYPES.DanielaController).to(DanielaController).inSingletonScope();
container.bind<SwarmService>(TYPES.SwarmService).to(SwarmService).inSingletonScope();
container.bind<TwoFactorService>(TYPES.TwoFactorService).to(TwoFactorService).inSingletonScope();
container.bind<Enable2FAUseCase>(TYPES.Enable2FAUseCase).to(Enable2FAUseCase).inSingletonScope();
container.bind<Verify2FAUseCase>(TYPES.Verify2FAUseCase).to(Verify2FAUseCase).inSingletonScope();
container.bind<Verify2FALoginUseCase>(TYPES.Verify2FALoginUseCase).to(Verify2FALoginUseCase).inSingletonScope();

container.bind<CommandBus>(TYPES.CommandBus).to(CommandBus).inSingletonScope();
container.bind<QueryBus>(TYPES.QueryBus).to(QueryBus).inSingletonScope();
container.bind<EventBus>(TYPES.EventBus).to(EventBus).inSingletonScope();
container.bind<AIService>(TYPES.AIService).to(AIService).inSingletonScope();
container.bind<EnhancedVoiceService>(TYPES.EnhancedVoiceService).to(EnhancedVoiceService).inSingletonScope();
container.bind<AnalyticsService>(TYPES.AnalyticsService).to(AnalyticsService).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<DockerService>(TYPES.DockerService).to(DockerService).inSingletonScope();
container.bind<EmailService>(TYPES.EmailService).to(EmailService).inSingletonScope();
container.bind<InstagramService>(TYPES.InstagramService).to(InstagramService).inSingletonScope();
container.bind<LinkedInService>(TYPES.LinkedInService).to(LinkedInService).inSingletonScope();
container.bind<RagService>(TYPES.RagService).to(RagService).inSingletonScope();
container.bind<StripeService>(TYPES.StripeService).to(StripeService).inSingletonScope();
container.bind<TikTokService>(TYPES.TikTokService).to(TikTokService).inSingletonScope();
container.bind<XService>(TYPES.XService).to(XService).inSingletonScope();
container.bind<SearchService>(TYPES.SearchService).to(SearchService).inSingletonScope();
container.bind<UsageService>(TYPES.UsageService).to(UsageService).inSingletonScope();
container.bind<GoogleDriveService>(GoogleDriveService).toSelf().inSingletonScope();
container.bind<BackupService>(TYPES.BackupService).to(BackupService).inSingletonScope();
container
  .bind<BackupSchedulerService>(TYPES.BackupSchedulerService)
  .to(BackupSchedulerService)
  .inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container
  .bind<RegisterUserUseCase>(TYPES.RegisterUserUseCase)
  .to(RegisterUserUseCase)
  .inSingletonScope();
container.bind<LoginUserUseCase>(TYPES.LoginUserUseCase).to(LoginUserUseCase).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();

container.bind<IPersonaRepository>(TYPES.PersonaRepository).to(PersonaRepository).inSingletonScope();
container.bind<CreatePersonaUseCase>(TYPES.CreatePersonaUseCase).to(CreatePersonaUseCase).inSingletonScope();
container.bind<GetMarketplacePersonasUseCase>(TYPES.GetMarketplacePersonasUseCase).to(GetMarketplacePersonasUseCase).inSingletonScope();
container.bind<SwarmController>(TYPES.SwarmController).to(SwarmController).inSingletonScope();
container.bind<IMissionRepository>(TYPES.MissionRepository).to(MissionRepository).inSingletonScope();

import { JobQueue } from '../infrastructure/jobs/JobQueue';
import { BackupRestoreService } from '../services/backup-restore.service';
import {
    CENTRAL_LOGGING_SERVICE_NAME,
    CentralizedLoggingService,
} from '../services/centralized-logging.service';
import { DocumentProcessorService } from '../services/google/document-processor.service';
import { MalwareScannerService } from '../services/malware-scanner.service';
import { MonitoringService } from '../services/monitoring.service';
import { ThreatIntelligenceService } from '../services/threat-intelligence.service';
import { UserBehaviorService } from '../services/user-behavior.service';
import { WAFService } from '../services/waf.service';

container.bind<JobQueue>(TYPES.JobQueue).to(JobQueue).inSingletonScope();
container.bind<MalwareScannerService>(TYPES.MalwareScannerService).to(MalwareScannerService).inSingletonScope();
container.bind<DocumentProcessorService>(TYPES.DocumentProcessorService).to(DocumentProcessorService).inSingletonScope();
container.bind<ErrorReportingService>(TYPES.ErrorReportingService).to(ErrorReportingService).inSingletonScope();
container.bind<HealthService>(TYPES.DetailedHealthService).to(HealthService).inSingletonScope();
container.bind<WAFService>(TYPES.WAFService).to(WAFService).inSingletonScope();
container.bind<ThreatIntelligenceService>(TYPES.ThreatIntelligenceService).to(ThreatIntelligenceService).inSingletonScope();
container.bind<MonitoringService>(TYPES.MonitoringService).to(MonitoringService).inSingletonScope();
container.bind<BackupRestoreService>(TYPES.BackupRestoreService).to(BackupRestoreService).inSingletonScope();
container.bind<CentralizedLoggingService>(CENTRAL_LOGGING_SERVICE_NAME).to(CentralizedLoggingService).inSingletonScope();
container.bind<UserBehaviorService>(UserBehaviorService).toSelf().inSingletonScope();

import { DevicePostureController } from '../controllers/DevicePostureController';
import { DevicePostureService } from '../services/device-posture.service';
container.bind<DevicePostureService>(TYPES.DevicePostureService).to(DevicePostureService).inSingletonScope();
container.bind<DevicePostureController>(TYPES.DevicePostureController).to(DevicePostureController).inSingletonScope();
container.bind<SemanticCacheService>(TYPES.SemanticCacheService).to(SemanticCacheService).inSingletonScope();
container.bind<KnowledgeGraphService>(TYPES.KnowledgeGraphService).to(KnowledgeGraphService).inSingletonScope();
container.bind<CloudFailoverService>(TYPES.CloudFailoverService).to(CloudFailoverService).inSingletonScope();
container.bind<ServiceMeshService>(TYPES.ServiceMeshService).to(ServiceMeshService).inSingletonScope();
container.bind<ZeroTrustService>(TYPES.ZeroTrustService).to(ZeroTrustService).inSingletonScope();
container.bind<AnomalyDetectionService>(TYPES.AnomalyDetectionService).to(AnomalyDetectionService).inSingletonScope();
container.bind<AutoDocumentationService>(TYPES.AutoDocumentationService).to(AutoDocumentationService).inSingletonScope();
container.bind<FeatureFlagService>(TYPES.FeatureFlagService).to(FeatureFlagService).inSingletonScope();
container.bind<DoraMetricsService>(TYPES.DoraMetricsService).to(DoraMetricsService).inSingletonScope();
container.bind<QwenTTSService>(TYPES.QwenTTSService).to(QwenTTSService).inSingletonScope();
container.bind<WhatsAppService>(TYPES.WhatsAppService).to(WhatsAppService).inSingletonScope();
// ========================================
// GOOGLE ECOSYSTEM INTEGRATION
// ========================================
import { GmailService } from '../services/gmail.service';
import { SheetsService } from '../services/sheets.service';
import { Gemini2Service } from '../services/gemini-2.service';

container.bind<GmailService>(GmailService).toSelf().inSingletonScope();
container.bind<SheetsService>(SheetsService).toSelf().inSingletonScope();
container.bind<Gemini2Service>(Gemini2Service).toSelf().inSingletonScope();

export { container, TYPES };

