import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MixpanelService } from './mixpanel.service';
import { AmplitudeBackendService } from './amplitude.service';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(
    private mixpanelService: MixpanelService,
    private amplitudeService: AmplitudeBackendService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.trackRequest(method, url, duration, user, true);
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          this.trackRequest(method, url, duration, user, false, err);
        },
      }),
    );
  }

  private trackRequest(
    method: string,
    url: string,
    duration: number,
    user: any,
    success: boolean,
    error?: any,
  ) {
    // We only track critical operations or performance metrics
    const isCritical = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
    const userId = user?.id || user?._id || 'anonymous';

    if (isCritical || !success) {
      const properties = {
        method,
        path: url,
        duration_ms: duration,
        success,
        user_id: userId,
        user_email: user?.email,
        error_message: error?.message,
        error_code: error?.status || error?.code,
      };

      // Mixpanel
      this.mixpanelService.track('API Request', properties);

      // Amplitude
      this.amplitudeService.track('API Request', userId, properties);
    }
  }
}
