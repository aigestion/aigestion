import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, Zap, Cpu, Eye, ShoppingBag, X, RefreshCw } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface Command {
    id: string;
    icon: React.ReactNode;
    label: string;
    category: string;
    action: () => void;
}

export const GlobalCommandBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { playWuaw, playHover } = useSound();
    const inputRef = useRef<HTMLInputElement>(null);

    const commands: Command[] = [
        {
            id: 'warp-rest',
            icon: <Eye size={16} />,
            label: 'Warp to VR Restaurant',
            category: 'Navigation',
            action: () => {
                (window as any).triggerWarp?.();
                // Simulación de navegación diferida tras el warp
            }
        },
        {
            id: 'system-purge',
            icon: <RefreshCw size={16} />,
            label: 'Neural System Purge',
            category: 'System',
            action: async () => {
                await fetch('/api/v1/nexus/command', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: 'SYSTEM_PURGE' })
                });
            }
        },
        {
            id: 'open-store',
            icon: <ShoppingBag size={16} />,
            label: 'Nexus Marketplace',
            category: 'Ecosystem',
            action: () => (window as any).openNexusMarketplace?.()
        },
        {
            id: 'roi-vision',
            icon: <RefreshCw size={16} />,
            label: 'ROI Visionary Simulator',
            category: 'Business',
            action: () => (window as any).openROIVisionary?.()
        },
        {
            id: 'health',
            icon: <Cpu size={16} />,
            label: 'Neural Health Status',
            category: 'Diagnostics',
            action: () => {
                // En una implementación real, esto abriría el War Room overlay
                // Simulamos abrir DashboardLayout state si estuviéramos conectados
                (window as any).setIsNexusWarRoomOpen?.(true);
            }
        },
        {
            id: 'ghost-mode',
            icon: <Search size={16} />,
            label: 'Iniciate Ghost Rotation',
            category: 'Security',
            action: () => {
                fetch('/api/v1/nexus/command', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: 'OVERRIDE_HEALTH', params: { targetStatus: 'GHOST' } })
                });
            }
        },
    ];

    const filteredCommands = commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                if (!isOpen) playWuaw();
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, playWuaw]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-nexus-obsidian/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="relative w-full max-w-2xl bg-black/40 border border-nexus-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.2)]"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-4 p-6 border-b border-white/10">
                            <Search className="text-nexus-cyan-glow" size={24} />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Omniscient Command: Type to search or execute..."
                                className="flex-1 bg-transparent border-none outline-none text-xl font-orbitron text-white placeholder:text-white/20"
                            />
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white/40">
                                <span className="font-sans">ESC</span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[50vh] overflow-y-auto p-2 custom-scrollbar">
                            {filteredCommands.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredCommands.map((command) => (
                                        <button
                                            key={command.id}
                                            onMouseEnter={playHover}
                                            onClick={() => {
                                                command.action();
                                                setIsOpen(false);
                                                playWuaw();
                                            }}
                                            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-nexus-cyan/20 group-hover:text-nexus-cyan-glow transition-colors">
                                                    {command.icon}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors uppercase tracking-wider">{command.label}</span>
                                                    <span className="text-[10px] text-white/20 uppercase tracking-widest">{command.category}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] text-nexus-cyan-glow italic">EXECUTE</span>
                                                <Zap size={10} className="text-nexus-cyan-glow" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-white/20 italic">
                                    No se han encontrado registros en la base omnisciente.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-[9px] text-white/20">
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑↓</span>
                                    <span>NAVIGATE</span>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] text-white/20">
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">ENTER</span>
                                    <span>SELECT</span>
                                </div>
                            </div>
                            <span className="text-[9px] font-orbitron font-black text-nexus-cyan/40">AIGESTION // SINGULARITY_OS</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
