import React from 'react';
import { useWorkbench } from './WorkbenchContext';
import { Dashboard } from '../../components/Dashboard';

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
      case 'search':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-2xl font-light mb-2">Global Search</div>
            <p>Search results will appear here</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-10 text-white font-sans bg-[#050505] min-h-full">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Settings
            </h1>
            <div className="grid gap-6 max-w-xl">
              <div className="bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <label className="block text-sm font-bold mb-3 text-gray-300">
                  Theme Preference
                </label>
                <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-cyan-500/50 outline-none text-gray-300 backdrop-blur-sm">
                  <option>Cyberpunk Dark (Default)</option>
                  <option>Nebula Blue</option>
                  <option>Matrix Green</option>
                </select>
              </div>

              <div className="bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <label className="block text-sm font-bold mb-3 text-gray-300">
                  Daniela Personality
                </label>
                <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500/50 outline-none text-gray-300 backdrop-blur-sm">
                  <option>Professional (Technical)</option>
                  <option>Casual (Friendly)</option>
                  <option>Creative (Brainstorming)</option>
                </select>
              </div>
            </div>
          </div>
        );
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
