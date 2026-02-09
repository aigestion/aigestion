/**
 * Twilio Communication Service
 * Provides SMS, voice, and WhatsApp communication capabilities
 */

export interface TwilioMessage {
  sid: string;
  from: string;
  to: string;
  body: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  dateCreated: string;
  dateUpdated: string;
  dateSent?: string;
  errorCode?: string;
  errorMessage?: string;
  price?: string;
  priceUnit?: string;
  numSegments: number;
  numMedia: number;
}

export interface TwilioCall {
  sid: string;
  from: string;
  to: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
  startTime?: string;
  endTime?: string;
  duration?: string;
  price?: string;
  priceUnit?: string;
  direction:
    | 'inbound'
    | 'outbound'
    | 'outbound-api'
    | 'outbound-call'
    | 'inbound-call'
    | 'trunking-originating'
    | 'trunking-terminating';
  answeredBy?: 'human' | 'machine';
  forwardedFrom?: string;
  callerName?: string;
}

export interface TwilioPhoneNumber {
  sid: string;
  accountSid: string;
  friendlyName: string;
  phoneNumber: string;
  dateCreated: string;
  dateUpdated: string;
  beta: boolean;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
    fax: boolean;
  };
  status: 'in-use' | 'available' | 'closed';
  emergencyAddress?: {
    customerName: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
}

export interface TwilioAccountInfo {
  sid: string;
  friendlyName: string;
  status: 'active' | 'suspended' | 'closed';
  type: 'Trial' | 'Full';
  dateCreated: string;
  dateUpdated: string;
  subresourceUris: {
    balances: string;
    calls: string;
    conferences: string;
    messages: string;
    transcriptions: string;
    addresses: string;
    incomingPhoneNumbers: string;
    outgoingCallerIds: string;
    applications: string;
    connectApps: string;
    notifications: string;
    usage: string;
    keys: string;
    queues: string;
    sip: string;
    shortCodes: string;
    signingKeys: string;
    monitor: string;
    pricing: string;
    media: string;
  };
}

export interface TwilioWhatsAppMessage {
  to: string;
  from: string;
  body: string;
  mediaUrl?: string[];
  statusCallback?: string;
}

class TwilioService {
  private accountSid: string;
  private authToken: string;
  private recoveryCode: string;
  private baseURL = 'https://api.twilio.com/2010-04-01';

  constructor() {
    this.accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID || '';
    this.authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN || '';
    this.recoveryCode = import.meta.env.VITE_TWILIO_RECOVERY_CODE || '';

    if (!this.accountSid || !this.authToken) {
      console.warn('Twilio credentials not found in environment variables');
    }
  }

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): Record<string, string> {
    const credentials = btoa(`${this.accountSid}:${this.authToken}`);
    return {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  /**
   * Send SMS message
   */
  async sendSMS(to: string, from: string, body: string): Promise<TwilioMessage> {
    try {
      const formData = new URLSearchParams({
        To: to,
        From: from,
        Body: body,
      });

      const response = await fetch(`${this.baseURL}/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twilio SMS error: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsApp(message: TwilioWhatsAppMessage): Promise<TwilioMessage> {
    try {
      const formData = new URLSearchParams({
        To: message.to,
        From: message.from,
        Body: message.body,
      });

      if (message.mediaUrl && message.mediaUrl.length > 0) {
        message.mediaUrl.forEach((url, index) => {
          formData.append(`MediaUrl[${index}]`, url);
        });
      }

      if (message.statusCallback) {
        formData.append('StatusCallback', message.statusCallback);
      }

      const response = await fetch(`${this.baseURL}/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twilio WhatsApp error: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  /**
   * Make voice call
   */
  async makeCall(to: string, from: string, url?: string, twiml?: string): Promise<TwilioCall> {
    try {
      const formData = new URLSearchParams({
        To: to,
        From: from,
      });

      if (url) {
        formData.append('Url', url);
      } else if (twiml) {
        formData.append('Twiml', twiml);
      } else {
        // Default TwiML for simple call
        formData.append('Url', 'https://demo.twilio.com/welcome/voice/');
      }

      const response = await fetch(`${this.baseURL}/Accounts/${this.accountSid}/Calls.json`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twilio call error: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }

  /**
   * Get message details
   */
  async getMessage(messageSid: string): Promise<TwilioMessage> {
    try {
      const response = await fetch(
        `${this.baseURL}/Accounts/${this.accountSid}/Messages/${messageSid}.json`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Twilio get message error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching message ${messageSid}:`, error);
      throw error;
    }
  }

  /**
   * Get call details
   */
  async getCall(callSid: string): Promise<TwilioCall> {
    try {
      const response = await fetch(
        `${this.baseURL}/Accounts/${this.accountSid}/Calls/${callSid}.json`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Twilio get call error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching call ${callSid}:`, error);
      throw error;
    }
  }

  /**
   * Get all messages
   */
  async getMessages(limit: number = 50, offset: number = 0): Promise<TwilioMessage[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/Accounts/${this.accountSid}/Messages.json?Limit=${limit}&Offset=${offset}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Twilio get messages error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Get all calls
   */
  async getCalls(limit: number = 50, offset: number = 0): Promise<TwilioCall[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/Accounts/${this.accountSid}/Calls.json?Limit=${limit}&Offset=${offset}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Twilio get calls error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.calls;
    } catch (error) {
      console.error('Error fetching calls:', error);
      throw error;
    }
  }

  /**
   * Get account phone numbers
   */
  async getPhoneNumbers(): Promise<TwilioPhoneNumber[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/Accounts/${this.accountSid}/IncomingPhoneNumbers.json`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Twilio get phone numbers error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.incoming_phone_numbers;
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      throw error;
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<TwilioAccountInfo> {
    try {
      const response = await fetch(`${this.baseURL}/Accounts/${this.accountSid}.json`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Twilio account info error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  /**
   * Generate TwiML for voice response
   */
  generateTwiML(options: {
    say?: { text: string; voice?: 'man' | 'woman'; language?: string };
    play?: string;
    gather?: {
      action?: string;
      method?: 'GET' | 'POST';
      timeout?: number;
      finishOnKey?: string;
      numDigits?: number;
      say?: { text: string; voice?: 'man' | 'woman'; language?: string };
    };
    hangup?: boolean;
    redirect?: string;
  }): string {
    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';

    if (options.say) {
      const voice = options.say.voice ? ` voice="${options.say.voice}"` : '';
      const language = options.say.language ? ` language="${options.say.language}"` : '';
      twiml += `<Say${voice}${language}>${options.say.text}</Say>`;
    }

    if (options.play) {
      twiml += `<Play>${options.play}</Play>`;
    }

    if (options.gather) {
      const action = options.gather.action ? ` action="${options.gather.action}"` : '';
      const method = options.gather.method ? ` method="${options.gather.method}"` : '';
      const timeout = options.gather.timeout ? ` timeout="${options.gather.timeout}"` : '';
      const finishOnKey = options.gather.finishOnKey
        ? ` finishOnKey="${options.gather.finishOnKey}"`
        : '';
      const numDigits = options.gather.numDigits ? ` numDigits="${options.gather.numDigits}"` : '';

      twiml += `<Gather${action}${method}${timeout}${finishOnKey}${numDigits}>`;

      if (options.gather.say) {
        const voice = options.gather.say.voice ? ` voice="${options.gather.say.voice}"` : '';
        const language = options.gather.say.language
          ? ` language="${options.gather.say.language}"`
          : '';
        twiml += `<Say${voice}${language}>${options.gather.say.text}</Say>`;
      }

      twiml += '</Gather>';
    }

    if (options.redirect) {
      twiml += `<Redirect>${options.redirect}</Redirect>`;
    }

    if (options.hangup) {
      twiml += '<Hangup />';
    }

    twiml += '</Response>';
    return twiml;
  }

  /**
   * Send verification code via SMS
   */
  async sendVerificationCode(to: string, code: string, from?: string): Promise<TwilioMessage> {
    const message = `Tu código de verificación AIGestion es: ${code}. Válido por 10 minutos.`;
    const fromNumber = from || '+15017122661'; // Default Twilio number or use your own

    return this.sendSMS(to, fromNumber, message);
  }

  /**
   * Create conference call
   */
  async createConference(
    participants: string[],
    from: string,
    _options?: {
      waitUrl?: string;
      startConferenceOnEnter?: boolean;
      endConferenceOnExit?: boolean;
      muted?: boolean;
      beep?: 'onEnter' | 'onExit' | 'true' | 'false';
    }
  ): Promise<TwilioCall[]> {
    const calls: TwilioCall[] = [];

    for (const participant of participants) {
      const twiml = this.generateTwiML({
        say: {
          text: 'Bienvenido a la conferencia de AIGestion. Por favor espere a que se unan otros participantes.',
          voice: 'woman',
          language: 'es-ES',
        },
      });

      try {
        const call = await this.makeCall(participant, from, undefined, twiml);
        calls.push(call);
      } catch (error) {
        console.error(`Error adding participant ${participant}:`, error);
      }
    }

    return calls;
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(
    startDate?: string,
    endDate?: string
  ): Promise<{
    usage: Array<{
      category: string;
      count: number;
      units: string;
      price: string;
      price_unit: string;
    }>;
  }> {
    try {
      let url = `${this.baseURL}/Accounts/${this.accountSid}/Usage/Records.json`;
      const params = new URLSearchParams();

      if (startDate) params.append('StartDate', startDate);
      if (endDate) params.append('EndDate', endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Twilio usage stats error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      throw error;
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for E.164 format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Format phone number to E.164 format
   */
  formatPhoneNumber(phoneNumber: string, countryCode: string = '+1'): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // If already in E.164 format, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }

    // Add country code if needed
    if (cleaned.length === 10) {
      return `${countryCode}${cleaned}`;
    }

    // If already includes country code without +
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }

    return phoneNumber;
  }

  /**
   * Recover account using recovery code
   */
  async recoverAccount(): Promise<boolean> {
    try {
      // This would typically involve calling Twilio's account recovery endpoint
      // For now, we'll just validate the recovery code format
      if (this.recoveryCode && this.recoveryCode.length > 10) {
        console.log('Account recovery code is valid format');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error recovering account:', error);
      return false;
    }
  }
}

// Export singleton instance
export const twilioService = new TwilioService();

// Export types for external use
export type { TwilioService };
