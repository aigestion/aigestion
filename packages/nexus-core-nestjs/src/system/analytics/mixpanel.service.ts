import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mixpanel from 'mixpanel';

@Injectable()
export class MixpanelService implements OnModuleInit {
  private mixpanel: Mixpanel.Mixpanel;
  private token: string;

  constructor(private configService: ConfigService) {
    this.token = this.configService.get<string>('MIXPANEL_TOKEN')!;
  }

  onModuleInit() {
    if (this.token) {
      this.mixpanel = Mixpanel.init(this.token, {
        protocol: 'https',
      });
      console.log('🚀 Backend Mixpanel initialized God Mode');
    } else {
      console.warn('⚠️ Mixpanel token not found in backend config');
    }
  }

  track(eventName: string, properties: any = {}) {
    if (!this.mixpanel) return;

    this.mixpanel.track(eventName, {
      ...properties,
      source: 'backend',
      environment: process.env.NODE_ENV || 'development',
    });
  }

  identify(distinctId: string) {
    if (!this.mixpanel) return;
    // Server-side identification is handled per event usually,
    // but we can set user profile here if needed.
  }

  setUserProfile(distinctId: string, profile: any) {
    if (!this.mixpanel) return;
    this.mixpanel.people.set(distinctId, profile);
  }
}
