const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

export interface SystemHealth {
  success: boolean;
  data: {
    status: string;
    timestamp: string;
    details?: string;
    version?: string;
    uptime?: number;
  };
  requestId: string;
}

export const api = {
  getSystemHealth: async (): Promise<SystemHealth> => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  },
  getSystemDiagnostic: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/system/diagnostic`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching system diagnostics:', error);
      throw error;
    }
  },
  getTreasuryOverview: async (userId: string = 'default_sovereign_user'): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/treasury/overview?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching treasury overview:', error);
      throw error;
    }
  },
  purchaseBond: async (data: { amount: number; tier: string; userId?: string }): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/treasury/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error purchasing bond:', error);
      throw error;
    }
  },
  getPortfolio: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/finance/portfolio`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  },
  getMarketData: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/finance/market`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  },
  getFinanceStrategy: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/finance/strategy`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching finance strategy:', error);
      throw error;
    }
  },
  getFinanceAlerts: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/finance/alerts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching finance alerts:', error);
      throw error;
    }
  },
  getPersonas: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/personas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching personas:', error);
      throw error;
    }
  },
  hirePersona: async (personaId: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/personas/hire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personaId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error hiring persona:', error);
      throw error;
    }
  },
  startAstraeaSession: async (
    userId: string,
    location?: { lat: number; lng: number }
  ): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/astraea/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, location }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error starting Astraea session:', error);
      throw error;
    }
  },
  induceAstraeaCall: async (userId: string, phoneNumber: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/astraea/call/induce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, phoneNumber }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error inducing Astraea call:', error);
      throw error;
    }
  analyzeVision: async (params: {
    imageUri?: string;
    imageBase64?: string;
    instruction?: string;
  }): Promise<{ success: boolean; analysis: string; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/swarm/vision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error in vision analysis:', error);
      throw error;
    }
  },
  getSwarmHistory: async (): Promise<{ success: boolean; history: any[]; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/swarm/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data; // Response builder wraps result in data property
    } catch (error) {
      console.error('Error fetching swarm history:', error);
      throw error;
    }
  },
};

