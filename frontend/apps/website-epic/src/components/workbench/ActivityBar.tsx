import { useWorkbench } from './WorkbenchContext';
import { LayoutDashboard, Search, Bot, Settings, FolderGit2, Shield } from 'lucide-react';

export const ActivityBar = () => {
  const { activeActivity, setActiveActivity } = useWorkbench();

  const activities = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'intelligence', icon: Shield, label: 'Sovereign Intelligence' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'ai', icon: Bot, label: 'Daniela AI' },
    { id: 'files', icon: FolderGit2, label: 'Projects' },
  ];

  return (
    <div className="flex flex-col items-center py-4 h-full justify-between w-full">
      <div className="flex flex-col items-center gap-6 w-full">
        {activities.map(item => {
          const Icon = item.icon;
          const isActive = activeActivity === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveActivity(item.id)}
              title={item.label}
              className={`relative group p-2 transition-all duration-300 w-full flex justify-center
                 ${isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
               `}
            >
              {isActive && (
                <>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-cyan-400 rounded-r-full shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]" />
                  <div className="absolute inset-0 bg-cyan-400/5 blur-lg" />
                </>
              )}
              <Icon
                size={26}
                strokeWidth={isActive ? 2 : 1.5}
                className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'group-hover:scale-105'}`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6 w-full pb-4">
        <button
          onClick={() => setActiveActivity('settings')}
          title="Settings"
          className={`p-2 transition-colors relative ${activeActivity === 'settings' ? 'text-purple-400' : 'text-gray-500 hover:text-white hover:rotate-90 duration-500'}`}
        >
          {activeActivity === 'settings' && (
            <div className="absolute inset-0 bg-purple-500/10 blur-xl" />
          )}
          <Settings
            size={24}
            strokeWidth={1.5}
            className={
              activeActivity === 'settings' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''
            }
          />
        </button>
      </div>
    </div>
  );
};
