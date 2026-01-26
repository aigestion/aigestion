import React, { createContext, useContext, useState, ReactNode } from 'react';

type ActivityId = 'dashboard' | 'search' | 'ai' | 'settings' | 'files' | string;

interface WorkbenchContextType {
  activeActivity: ActivityId;
  setActiveActivity: (id: ActivityId) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

const WorkbenchContext = createContext<WorkbenchContextType | undefined>(undefined);

export const WorkbenchProvider = ({ children }: { children: ReactNode }) => {
  const [activeActivity, setActiveActivity] = useState<ActivityId>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Logic: if clicking the same activity that is active, toggle sidebar
  const handleActivityChange = (id: ActivityId) => {
    if (activeActivity === id) {
      toggleSidebar();
    } else {
      setActiveActivity(id);
      setSidebarOpen(true);
    }
  };

  return (
    <WorkbenchContext.Provider value={{
      activeActivity,
      setActiveActivity: handleActivityChange,
      isSidebarOpen,
      toggleSidebar,
      setSidebarOpen
    }}>
      {children}
    </WorkbenchContext.Provider>
  );
};

export const useWorkbench = () => {
  const context = useContext(WorkbenchContext);
  if (!context) {
    throw new Error('useWorkbench must be used within a WorkbenchProvider');
  }
  return context;
};
