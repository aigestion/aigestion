import * as amplitude from '@amplitude/analytics-browser';

export interface AmplitudeProfile {
  name?: string;
  email?: string;
  role?: string;
  subscription?: string;
  [key: string]: any;
}

class AmplitudeService {
  private static instance: AmplitudeService;
  private initialized = false;
  private apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY || '';

  static getInstance(): AmplitudeService {
    if (!AmplitudeService.instance) {
      AmplitudeService.instance = new AmplitudeService();
    }
    return AmplitudeService.instance;
  }

  initialize(): void {
    if (this.initialized || !this.apiKey) return;

    try {
      amplitude.init(this.apiKey, {
        defaultTracking: true,
      });
      this.initialized = true;
      console.log('🚀 Amplitude initialized God Mode');
    } catch (error) {
      console.error('❌ Failed to initialize Amplitude:', error);
    }
  }

  setUserId(userId: string): void {
    if (!this.initialized) return;
    amplitude.setUserId(userId);
  }

  setUserProperties(properties: AmplitudeProfile): void {
    if (!this.initialized) return;
    const identifyEvent = new amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identifyEvent.set(key, value);
    });
    amplitude.identify(identifyEvent);
  }

  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.initialized) return;
    amplitude.track(eventName, {
      ...properties,
      platform: 'web',
      environment: import.meta.env.MODE,
    });
  }

  reset(): void {
    if (!this.initialized) return;
    amplitude.reset();
  }
}

export const amplitudeService = AmplitudeService.getInstance();
