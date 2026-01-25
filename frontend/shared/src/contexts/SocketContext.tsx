import React, { createContext, useContext, useEffect, useState } from 'react';

interface SocketContextType {
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (msg: any) => void;
  subscribe: (topic: string, callback: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Record<string, ((data: any) => void)[]>>({});

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      setIsConnected(true);
      console.log('[NEXUS_SOCKET] Connected to Neural Network');
    }, 1000);

    // Simulate incoming data stream
    const dataInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const mockData = {
          type: 'METRIC_UPDATE',
          payload: {
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100),
            network: Math.floor(Math.random() * 1000),
            activeNodes: 140 + Math.floor(Math.random() * 10)
          },
          timestamp: Date.now()
        };
        setLastMessage(mockData);
        notifySubscribers('metrics', mockData);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(dataInterval);
    };
  }, []);

  const notifySubscribers = (topic: string, data: any) => {
    if (subscribers[topic]) {
      subscribers[topic].forEach(cb => cb(data));
    }
  };

  const subscribe = (topic: string, callback: (data: any) => void) => {
    setSubscribers(prev => ({
      ...prev,
      [topic]: [...(prev[topic] || []), callback]
    }));

    return () => {
      setSubscribers(prev => ({
        ...prev,
        [topic]: (prev[topic] || []).filter(cb => cb !== callback)
      }));
    };
  };

  const sendMessage = (msg: any) => {
    console.log('[NEXUS_SOCKET] Sending:', msg);
    // In a real app, this would be socket.send(JSON.stringify(msg));
  };

  return (
    <SocketContext.Provider value={{ isConnected, lastMessage, sendMessage, subscribe }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
