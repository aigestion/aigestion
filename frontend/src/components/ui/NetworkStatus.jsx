import React from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { AlertCircle, WifiOff } from 'lucide-react';

const NetworkStatus = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-red-400/50 flex items-center gap-3">
        <WifiOff className="w-5 h-5" />
        <div>
          <h4 className="font-medium text-sm">You are offline</h4>
          <p className="text-xs text-white/90">Check your internet connection.</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
