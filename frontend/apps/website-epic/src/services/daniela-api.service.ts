export interface DanielaResponse {
  response: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'maintenance';
  version: string;
  statistics: {
    totalUsers: number;
    activeConversations: number;
    messagesProcessed: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

class DanielaApiService {
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/v1/daniela${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Daniela API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async checkConnectivity(): Promise<boolean> {
    try {
      await this.fetchApi('/status');
      return true;
    } catch {
      return false;
    }
  }

  async getSystemStatus(): Promise<any> {
    return this.fetchApi('/system-status');
  }

  /**
   * Obtiene insights estratégicos generados por Daniela
   */
  async getInsights(): Promise<any[]> {
    const data = (await this.fetchApi('/insights')) as any;
    return data.insights || [];
  }

  async chat(message: string, _userId: string, sessionId: string): Promise<DanielaResponse> {
    return this.fetchApi('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  }
}

export const danielaApi = new DanielaApiService();
