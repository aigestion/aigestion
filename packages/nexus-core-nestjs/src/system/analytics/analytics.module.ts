import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MixpanelService } from './mixpanel.service';
import { AmplitudeBackendService } from './amplitude.service';
import { AnalyticsInterceptor } from './analytics.interceptor';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MixpanelService, AmplitudeBackendService, AnalyticsInterceptor],
  exports: [MixpanelService, AmplitudeBackendService, AnalyticsInterceptor],
})
export class AnalyticsModule {}
