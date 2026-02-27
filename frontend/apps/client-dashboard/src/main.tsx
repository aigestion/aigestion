// 🌌 Sentry MUST be first import
import './lib/sentry';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes of god-tier stability
      gcTime: 1000 * 60 * 60 * 24, // 24h cache retention
    },
  },
});

// ⚡ Sovereign Persistence: Hydrate cache from localStorage
try {
  const localStoragePersister = {
    persistClient: async (client: any) => {
      localStorage.setItem('AIG_DASHBOARD_CACHE', JSON.stringify(client));
    },
    restoreClient: async () => {
      const cache = localStorage.getItem('AIG_DASHBOARD_CACHE');
      return cache ? JSON.parse(cache) : undefined;
    },
    removeClient: async () => {
      localStorage.removeItem('AIG_DASHBOARD_CACHE');
    },
  };
  
  // Note: Simplified persistence for god-mode speed
  const savedState = localStorage.getItem('AIG_DASHBOARD_CACHE');
  if (savedState) {
    queryClient.setQueryData([], JSON.parse(savedState));
  }
} catch (e) {
  console.warn('[SovereignCache] Hydration skipped');
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
