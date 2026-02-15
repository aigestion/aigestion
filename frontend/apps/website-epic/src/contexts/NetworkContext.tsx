import React, { createContext, useContext, ReactNode } from 'react';
import { useNetworkStatus, NetworkStatus } from '../hooks/useNetworkStatus';

const NetworkContext = createContext<NetworkStatus>({
  isOnline: true,
  isMetered: false,
  connectionType: 'unknown',
  effectiveType: '4g',
});

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const status = useNetworkStatus();

  return <NetworkContext.Provider value={status}>{children}</NetworkContext.Provider>;
};

export const useNetwork = () => useContext(NetworkContext);
