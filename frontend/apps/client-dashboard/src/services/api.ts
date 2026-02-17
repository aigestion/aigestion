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
};
