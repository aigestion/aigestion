const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error de conexión');
    }

    // Backend returns { success: true, ...data } or { data: ... }
    // My backend controller uses `buildResponse` which returns { success, data, meta } usually?
    // Let's check `auth.controller.ts` usage of `buildResponse`.
    // It returns `res.status(200).json(buildResponse({ user: ... }, ...))`
    // `buildResponse` structure needs to be known.
    // Assuming standard responseWrapper.

    return data.data || data;
  } catch (error) {
    console.error(`API Error ${endpoint}:`, error);
    throw error;
  }
}

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    return request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyEmail: async (data: { userId: string; code: string }) => {
    return request<any>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateRole: async (data: { userId: string; role: 'family' | 'professional' }, token: string) => {
    return request<any>('/auth/role', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` } as any,
      body: JSON.stringify(data),
    });
  },

  updatePlan: async (data: { userId: string; plan: string }, token: string) => {
    return request<any>('/auth/plan', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` } as any,
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return request<any>('/auth/logout', { method: 'POST' });
  },

  // Subscription endpoints
  getSubscription: async (userId: string, token: string) => {
    return request<any>(`/subscription/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  validateSubscription: async (userId: string, accessType: string, token: string) => {
    return request<any>('/subscription/validate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, accessType }),
    });
  },

  createPaymentSession: async (userId: string, planId: string, token: string) => {
    return request<any>('/subscription/create-payment-session', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, planId }),
    });
  },

  cancelSubscription: async (userId: string, token: string) => {
    return request<any>(`/subscription/${userId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateSubscription: async (userId: string, updates: any, token: string) => {
    return request<any>(`/subscription/${userId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  },
};
