import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, LayoutDashboard, Database, Shield, Zap, Settings, LogOut, Menu } from 'lucide-react';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
    <motion.button
        whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative group
            ${active ? 'text-nexus-cyan-glow' : 'text-nexus-silver/60 hover:text-white'}`}
    >
        {active && (
            <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 w-1 h-8 bg-nexus-cyan-glow rounded-r-full shadow-[0_0_15px_rgba(0,245,255,0.8)]"
            />
        )}
        <Icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]' : ''} />
        <span className="font-orbitron text-[10px] tracking-[0.2em] uppercase font-bold">{label}</span>
    </motion.button>
);

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
    type: 'ADMIN' | 'CLIENT' | 'DEMO';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, type }) => {
    const accentColor = type === 'ADMIN' ? 'text-nexus-cyan-glow' : type === 'CLIENT' ? 'text-nexus-violet-glow' : 'text-white';

    return (
        <div className="flex h-screen bg-[#010103] text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-white/[0.01] backdrop-blur-3xl flex flex-col z-50">
                <div className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-linear-to-br from-nexus-violet to-nexus-cyan p-[1px]`}>
                            <div className="w-full h-full bg-[#010103] rounded-lg flex items-center justify-center">
                                <Zap size={14} className="text-white" />
                            </div>
                        </div>
                        <span className="font-orbitron font-black tracking-widest text-sm">AIGESTION</span>
                    </div>
                    <div className="mt-4">
                        <span className={`text-[9px] font-orbitron tracking-[0.3em] font-bold uppercase opacity-40`}>
                            {type} CONSOLE v2.6
                        </span>
                    </div>
                </div>

                <nav className="flex-1 py-8">
                    <SidebarItem icon={LayoutDashboard} label="Panel General" active />
                    <SidebarItem icon={Database} label="Nodos & Datos" />
                    <SidebarItem icon={Shield} label="Seguridad AI" />
                    <SidebarItem icon={Zap} label="Automatización" />
                    <SidebarItem icon={Settings} label="Configuración" />
                </nav>

                <div className="p-8 border-t border-white/5">
                    <SidebarItem icon={LogOut} label="Desconexión" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative scrollbar-hide">
                {/* Header */}
                <header className="sticky top-0 z-40 px-12 py-8 flex justify-between items-center bg-transparent backdrop-blur-sm">
                    <h2 className="text-2xl font-orbitron font-black tracking-tighter uppercase">
                        {title}
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                                 <div key={i} className="w-8 h-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                 </div>
                             ))}
                        </div>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <Menu size={20} />
                        </button>
                    </div>
                </header>

                <div className="px-12 pb-32">
                    {children}
                </div>

                {/* Ambient Glows */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-nexus-cyan/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="fixed bottom-0 left-72 w-[500px] h-[500px] bg-nexus-violet/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </main>
        </div>
    );
};
