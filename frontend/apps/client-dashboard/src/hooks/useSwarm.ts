import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useSwarmHistory = () => {
  return useQuery({
    queryKey: ['swarm', 'history'],
    queryFn: async () => {
      const result = await api.getSwarmHistory();
      if (!result || !result.history) return [];
      return [...result.history].reverse(); // Latest first
    },
    refetchInterval: 10000, // Sync every 10s
    staleTime: 5000,
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => api.getSystemHealth(),
    refetchInterval: 30000,
  });
};
