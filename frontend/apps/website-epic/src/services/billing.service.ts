import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface BillingSnapshot {
  hasActiveSubscription: boolean;
  subscription?: {
    id: string;
    status: string;
    current_period_end: number;
    plan: {
      id: string;
      amount: number;
      currency: string;
      interval: string;
    };
  };
  invoices: {
    id: string;
    amount_paid: number;
    currency: string;
    status: string;
    created: number;
    pdf_url: string;
  }[];
}

class BillingService {
  private async getHeaders(): Promise<HeadersInit> {
    if (!supabase) {
      console.warn('Supabase not configured, using public headers');
      return { 'Content-Type': 'application/json' };
    }
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getBillingSnapshot(): Promise<BillingSnapshot> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/billing/snapshot`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch billing snapshot');
    }

    return response.json();
  }

  async createCheckoutSession(priceId: string): Promise<{ sessionId: string; url: string }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/billing/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  }

  async createPortalSession(): Promise<{ url: string }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${API_URL}/billing/portal`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create portal session');
    }

    return response.json();
  }
}

export const billingService = new BillingService();
