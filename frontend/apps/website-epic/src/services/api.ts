const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

export interface SystemHealth {
  success: boolean;
  data: {
    status: string;
    timestamp: string;
    details?: string;
    version?: string;
  };
  requestId: string;
}

export const api = {
  getSystemHealth: async (): Promise<SystemHealth> => {
    try {
      const response = await fetch(`${API_URL}/v1/health`);
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
      const response = await fetch(`${API_URL}/v1/system/diagnostic`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching system diagnostics:', error);
      throw error;
    }
  },
  getAnalyticsOverview: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/v1/analytics/overview`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      throw error;
    }
  },
  getDashboardData: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/v1/analytics/dashboard-data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
};
