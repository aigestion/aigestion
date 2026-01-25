import { motion } from 'framer-motion';
import React from 'react';

export const GodViewMap: React.FC = () => {
    return (
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-black border border-white/10 premium-glass">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 perspective-1000 transform-style-3d rotate-x-60" />

            {/* World Map SVG (Simplified representation) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <svg viewBox="0 0 1000 500" className="w-full h-full fill-nexus-violet/20 stroke-nexus-cyan/30 stroke-1">
                    <path d="M150,250 Q250,150 400,250 T600,250 T900,250" />
                    {/* Abstract continents can be added here */}
                    <circle cx="200" cy="200" r="50" />
                    <circle cx="500" cy="300" r="80" />
                    <circle cx="800" cy="150" r="60" />
                </svg>
            </div>

            {/* Active Nodes */}
            {[...Array(15)].map((_, i) => (
                <Node key={i} />
            ))}

            {/* Scanning Line */}
            <motion.div
                className="absolute top-0 bottom-0 w-1 bg-nexus-cyan/50 box-shadow-[0_0_20px_var(--nexus-cyan)] blur-[2px]"
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* UI Overlay */}
            <div className="absolute top-4 left-4 p-4 premium-glass rounded-xl">
                <h3 className="text-xs font-orbitron text-nexus-cyan tracking-widest">GLOBAL_OVERSEER</h3>
                <div className="flex gap-4 mt-2">
                    <div>
                        <span className="text-[10px] text-gray-400">NODES</span>
                        <div className="text-xl font-mono text-white">4,291</div>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400">TRAFFIC</span>
                        <div className="text-xl font-mono text-green-400">8.2 TB/s</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Node: React.FC = () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 2;

    return (
        <motion.div
            className="absolute w-2 h-2 bg-white rounded-full box-shadow-[0_0_10px_white]"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
        >
            <div className="absolute inset-0 bg-nexus-cyan rounded-full animate-ping opacity-75" />

            {/* Connection Line */}
            <svg className="absolute top-1 left-1 w-24 h-24 pointer-events-none overflow-visible">
                <motion.line
                    x1="0" y1="0" x2={Math.random() * 50} y2={Math.random() * 50}
                    stroke="rgba(0,245,255,0.2)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay }}
                />
            </svg>
        </motion.div>
    );
};
