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

export interface PartnerMetrics {
  totalTokens: number;
  totalCost: number;
  totalPlatformCommission: number;
  totalCreatorCommission: number;
  userCount: number;
  status: string;
  timestamp: string;
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
  getPartnerMetrics: async (): Promise<PartnerMetrics> => {
    try {
      const token = localStorage.getItem('token'); // Get auth token if available
      const response = await fetch(`${API_URL}/billing/metrics/partner`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching partner metrics:', error);
      throw error;
    }
  },
};
