import React from 'react';
import { useWorkbench } from './WorkbenchContext';
import { Dashboard } from '../../components/Dashboard';
import { SovereignIntelligenceHub } from '../../components/SovereignIntelligenceHub';
import { SettingsDashboard } from '../../components/settings/SettingsDashboard';

interface WorkspaceAreaProps {
  user: any;
  onLogout: () => void;
}

export const WorkspaceArea: React.FC<WorkspaceAreaProps> = ({ user, onLogout }) => {
  const { activeActivity } = useWorkbench();

  // Simple view switcher based on activity or internal workspace state
  const renderContent = () => {
    switch (activeActivity) {
      case 'dashboard':
        return <Dashboard user={user} onLogout={onLogout} />;
      case 'intelligence':
        return <SovereignIntelligenceHub />;
      case 'search':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-2xl font-light mb-2">Global Search</div>
            <p>Search results will appear here</p>
          </div>
        );
      case 'settings':
        return <SettingsDashboard />;
      default:
        // Default to Dashboard
        return <Dashboard user={user} onLogout={onLogout} />;
    }
  };

  return (
    <div className="w-full h-full overflow-hidden bg-transparent">
      <div className="h-full w-full overflow-y-auto custom-scrollbar">{renderContent()}</div>
    </div>
  );
};
