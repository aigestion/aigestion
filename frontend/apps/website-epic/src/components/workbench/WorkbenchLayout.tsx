import React from 'react';
import { WorkbenchProvider } from './WorkbenchContext';
import { WorkbenchShell } from './WorkbenchShell';
import { ActivityBar } from './ActivityBar';
import { SideBar } from './SideBar';
import { WorkspaceArea } from './WorkspaceArea';
import { StatusBar } from './StatusBar';

interface WorkbenchLayoutProps {
  user: any;
  onLogout: () => void;
}

export const WorkbenchLayout: React.FC<WorkbenchLayoutProps> = ({ user, onLogout }) => {
  return (
    <WorkbenchProvider>
      <WorkbenchShell
        activityBar={<ActivityBar />}
        sideBar={<SideBar />}
        mainArea={<WorkspaceArea user={user} onLogout={onLogout} />}
        statusBar={<StatusBar />}
        // bottomPanel can be added here later
      />
    </WorkbenchProvider>
  );
};
