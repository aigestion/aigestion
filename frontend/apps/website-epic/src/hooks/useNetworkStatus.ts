import { useState, useEffect } from 'react';



export interface NetworkStatus {
  isOnline: boolean;
  isMetered: boolean; // True if cellular/saveData
  connectionType: string; // 'wifi', '4g', etc.
  effectiveType: string; // '4g', '3g', '2g', 'slow-2g'
}

export const useNetworkStatus = (): NetworkStatus => {
  const getNetworkConnection = () => {
    return (
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection
    );
  };

  const getStatus = (): NetworkStatus => {
    const connection = getNetworkConnection();
    const isOnline = navigator.onLine;

    return {
      isOnline,
      isMetered: connection ? connection.saveData || ['cellular', 'bluetooth'].includes(connection.type) : false,
      connectionType: connection ? connection.type : 'unknown',
      effectiveType: connection ? connection.effectiveType : '4g', // Default to 4g if API unsupported
    };
  };

  const [status, setStatus] = useState<NetworkStatus>(getStatus());

  useEffect(() => {
    const handleOnline = () => setStatus(getStatus());
    const handleOffline = () => setStatus(getStatus());
    
    const connection = getNetworkConnection();
    const handleConnectionChange = () => setStatus(getStatus());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return status;
};
