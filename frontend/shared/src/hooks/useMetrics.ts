import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useMetrics = () => {
  const { subscribe } = useSocket();
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    activeNodes: 0
  });

  useEffect(() => {
    const unsubscribe = subscribe('metrics', (data) => {
      if (data.type === 'METRIC_UPDATE') {
        setMetrics(data.payload);
      }
    });

    return () => unsubscribe();
  }, [subscribe]);

  return metrics;
};
