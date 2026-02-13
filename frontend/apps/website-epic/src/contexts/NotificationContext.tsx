import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GodModeNotification } from '../components/GodModeNotification';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notify: (title: string, message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { playPop } = useSoundEffects();

  const notify = useCallback(
    (title: string, message: string, type: Notification['type'] = 'info') => {
      const id = Math.random().toString(36).substr(2, 9);
      playPop();
      setNotifications(prev => [...prev, { id, title, message, type }]);

      // Auto remove
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    },
    [playPop]
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <GodModeNotification
              key={n.id}
              title={n.title}
              message={n.message}
              type={n.type}
              onClose={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
