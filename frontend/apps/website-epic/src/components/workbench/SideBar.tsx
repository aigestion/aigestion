import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkbench } from './WorkbenchContext';
import { DanielaPanel } from './DanielaPanel';
import { Search } from 'lucide-react';

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
      <div className="h-[40px] flex items-center px-4 text-[10px] font-orbitron font-bold uppercase tracking-[0.2em] text-nexus-cyan/60 select-none border-b border-white/5 bg-black/20 shadow-sm">
        {activeActivity}
      </div>

      <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {activeActivity === 'dashboard' && (
          <div className="text-sm">
            <div className="px-4 py-4 text-[9px] font-orbitron font-bold text-nexus-silver/40 uppercase tracking-widest">
              NEXUS VIEWS
            </div>
            <ul className="space-y-1 px-2">
              {mainViews.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <li
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`cursor-pointer p-2 rounded-lg transition-all duration-300 flex items-center gap-3 group border border-transparent
                      ${
                        isActive
                          ? 'bg-nexus-cyan/10 text-nexus-cyan border-nexus-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                          : 'text-nexus-silver/60 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                      ${isActive ? 'bg-nexus-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-110' : 'bg-white/10 group-hover:bg-white/40'}`}
                    />
                    <span className="text-xs font-medium tracking-wide">{item.label}</span>
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
                placeholder="Search database..."
                className="w-full bg-black/40 border border-white/10 text-nexus-silver text-xs p-2.5 pl-9 rounded-lg focus:outline-none focus:border-nexus-cyan/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] placeholder:text-nexus-silver/30 transition-all font-mono"
              />
              <div className="absolute left-3 top-2.5 text-nexus-silver/30 group-focus-within:text-nexus-cyan transition-colors">
                 <Search size={14} />
              </div>
              <div className="absolute right-2 top-2.5 text-[9px] text-nexus-silver/30 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                ⌘K
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
