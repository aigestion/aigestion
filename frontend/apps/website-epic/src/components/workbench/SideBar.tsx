import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkbench } from './WorkbenchContext';
import { DanielaPanel } from './DanielaPanel';

export const SideBar = () => {
  const { activeActivity } = useWorkbench();
  const navigate = useNavigate();
  const location = useLocation();

  const mainViews = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Analytics', path: '/dashboard/admin' },
    { label: 'Client View', path: '/dashboard/client' },
    { label: 'Billing', path: '/dashboard/billing' },
  ];

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="h-[40px] flex items-center px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/50 select-none border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent shadow-sm">
        {activeActivity}
      </div>

      <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {activeActivity === 'dashboard' && (
          <div className="text-sm">
            <div className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase opacity-70 tracking-widest">
              Main Views
            </div>
            <ul className="space-y-1 px-2">
              {mainViews.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <li
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`cursor-pointer p-2 rounded-md transition-all duration-200 flex items-center gap-3 group border border-transparent 
                      ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                          : 'text-gray-400 hover:bg-cyan-500/5 hover:text-cyan-200'
                      }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-colors shadow-[0_0_5px_rgba(6,182,212,0)] group-hover:shadow-[0_0_8px_rgba(6,182,212,0.5)]
                      ${isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-cyan-500/20 group-hover:bg-cyan-400'}`}
                    />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeActivity === 'ai' && (
          <div className="h-full flex flex-col">
            <DanielaPanel />
          </div>
        )}

        {activeActivity === 'search' && (
          <div className="flex flex-col gap-2 p-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-[#181818] border border-[#303030] text-gray-200 text-xs p-2.5 pl-3 rounded-md focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-900/50 placeholder:text-gray-600 transition-all shadow-inner group-hover:bg-[#1f1f1f]"
              />
              <div className="absolute right-2 top-2.5 text-[10px] text-gray-600 bg-[#222] px-1.5 rounded border border-[#333] opacity-70">
                Ctrl+F
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
