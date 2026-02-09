import { env } from '../config/env';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

interface PortalSessionResponse {
  url: string;
}

interface PayPalOrderResponse {
    id: string;
    status: string;
    links: any[];
}

export const billingApi = {
  // Stripe Methods
  createCheckoutSession: async (priceId: string, token: string): Promise<CheckoutSessionResponse> => {
    const response = await fetch(`${API_URL}/billing/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return response.json();
  },

  createPortalSession: async (token: string): Promise<PortalSessionResponse> => {
    const response = await fetch(`${API_URL}/billing/portal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }

    return response.json();
  },

  getBillingSnapshot: async (token: string) => {
      const response = await fetch(`${API_URL}/billing/snapshot`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      if (!response.ok) throw new Error('Failed to fetch billing snapshot');
      return response.json();
  },

  // PayPal Methods
  createPayPalOrder: async (amount: string, currency: string, token: string): Promise<PayPalOrderResponse> => {
      const response = await fetch(`${API_URL}/billing/paypal/create-order`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ amount, currency })
      });

      if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create PayPal order');
      }
      return response.json();
  },

  capturePayPalOrder: async (orderId: string, token: string) => {
      const response = await fetch(`${API_URL}/billing/paypal/capture-order`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to capture PayPal order');
      }
      return response.json();
  }
};
