import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amplitude from '@amplitude/analytics-node';

@Injectable()
export class AmplitudeBackendService implements OnModuleInit {
  private apiKey: string;
  private initialized = false;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('AMPLITUDE_API_KEY')!;
  }

  onModuleInit() {
    if (this.apiKey) {
      amplitude.init(this.apiKey);
      this.initialized = true;
      console.log('🚀 Backend Amplitude initialized God Mode');
    } else {
      console.warn('⚠️ Amplitude API key not found in backend config');
    }
  }

  track(eventName: string, userId: string, properties: any = {}) {
    if (!this.initialized) return;

    amplitude.track(eventName, {
      ...properties,
      source: 'backend',
      environment: process.env.NODE_ENV || 'development',
    }, {
      user_id: userId,
    });
  }

  setUserProperties(userId: string, properties: any) {
    if (!this.initialized) return;
    const identifyEvent = new amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identifyEvent.set(key, value as string | number | boolean);
    });
    amplitude.identify(identifyEvent, { user_id: userId });
  }
}
