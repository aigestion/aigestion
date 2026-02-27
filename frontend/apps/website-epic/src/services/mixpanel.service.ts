import mixpanel from 'mixpanel-browser';

export interface MixpanelProfile {
  $name?: string;
  $email?: string;
  $avatar?: string;
  role?: string;
  subscription?: string;
  [key: string]: any;
}

class MixpanelService {
  private static instance: MixpanelService;
  private initialized = false;
  private token = import.meta.env.VITE_MIXPANEL_TOKEN || '';

  static getInstance(): MixpanelService {
    if (!MixpanelService.instance) {
      MixpanelService.instance = new MixpanelService();
    }
    return MixpanelService.instance;
  }

  initialize(): void {
    if (this.initialized || !this.token) return;

    try {
      mixpanel.init(this.token, {
        debug: import.meta.env.DEV,
        track_pageview: true,
        persistence: 'localStorage',
      });
      this.initialized = true;
      console.log('🚀 Mixpanel initialized God Mode');
    } catch (error) {
      console.error('❌ Failed to initialize Mixpanel:', error);
    }
  }

  identify(userId: string, profile?: MixpanelProfile): void {
    if (!this.initialized) return;
    
    mixpanel.identify(userId);
    if (profile) {
      mixpanel.people.set(profile);
    }
  }

  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.initialized) return;
    
    mixpanel.track(eventName, {
      ...properties,
      platform: 'web',
      environment: import.meta.env.MODE,
    });
  }

  alias(alias: string, originalId: string): void {
    if (!this.initialized) return;
    mixpanel.alias(alias, originalId);
  }

  reset(): void {
    if (!this.initialized) return;
    mixpanel.reset();
  }
}

export const mixpanelService = MixpanelService.getInstance();
