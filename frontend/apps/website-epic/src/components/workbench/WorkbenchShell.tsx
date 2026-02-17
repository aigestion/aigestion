import React, { ReactNode } from 'react';
import { useWorkbench } from './WorkbenchContext';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkbenchShellProps {
  activityBar: ReactNode;
  sideBar: ReactNode;
  mainArea: ReactNode;
  bottomPanel?: ReactNode;
  statusBar: ReactNode;
}

export const WorkbenchShell: React.FC<WorkbenchShellProps> = ({
  activityBar,
  sideBar,
  mainArea,
  bottomPanel,
  statusBar,
}) => {
  const { isSidebarOpen } = useWorkbench();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-nexus-obsidian text-white selection:bg-nexus-cyan/30 font-sans relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(10,10,10,0))]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-nexus-violet/10 blur-[150px] rounded-full mix-blend-screen opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-nexus-cyan/10 blur-[150px] rounded-full mix-blend-screen opacity-30" />
      </div>

      {/* Top Area: Activity | Sidebar | Main */}
      <div className="flex flex-1 overflow-hidden z-10 backdrop-blur-[1px]">
        {/* Activity Bar (Fixed width) */}
        <aside className="w-[60px] flex-shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl z-30 flex flex-col justify-between shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
          {activityBar}
        </aside>

        {/* Sidebar (Collapsible) */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 border-r border-white/5 bg-nexus-dark-gray/60 backdrop-blur-md overflow-hidden relative"
        >
          <div className="w-[300px] h-full relative">
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50" />
            {sideBar}
          </div>
        </motion.aside>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative">
          <div className="flex-1 overflow-hidden relative rounded-tl-xl border-t border-l border-white/5 bg-black/20 backdrop-blur-sm shadow-inner mx-1 mt-1 transition-all">
            {mainArea}
          </div>

          {/* Bottom Panel (Collapsible/Resizable could go here) */}
          <AnimatePresence>
            {bottomPanel && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                exit={{ height: 0 }}
                className="h-[200px] border-t border-white/10 bg-[#1e1e1e]"
              >
                {bottomPanel}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Status Bar (Fixed height) */}
      <footer className="h-[24px] bg-nexus-obsidian border-t border-white/10 text-white text-[10px] flex items-center px-3 select-none z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] justify-between font-mono">
        {statusBar}
      </footer>
    </div>
  );
};
