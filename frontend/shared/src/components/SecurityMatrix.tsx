import { motion } from 'framer-motion';
import React from 'react';

export const SecurityMatrix: React.FC = () => {
    return (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-1 p-1 bg-black/50 rounded-2xl border border-nexus-violet/20 premium-glass">
            {[...Array(64)].map((_, i) => (
                <GridCell key={i} index={i} />
            ))}
        </div>
    );
};

const GridCell: React.FC<{ index: number }> = ({ index }) => {
    const isThreat = Math.random() > 0.95;
    const isActive = Math.random() > 0.7;

    return (
        <motion.div
            className={`aspect-square rounded-sm border border-white/5 relative overflow-hidden ${isThreat ? 'bg-red-500/20 shadow-[inset_0_0_10px_rgba(239,68,68,0.5)]' :
                    isActive ? 'bg-nexus-violet/10' : 'bg-transparent'
                }`}
            whileHover={{ scale: 1.1, zIndex: 10, borderColor: 'rgba(255,255,255,0.5)' }}
        >
            <div className="absolute top-1 left-1 text-[6px] font-mono text-white/30">
                {index.toString(16).padStart(2, '0').toUpperCase()}
            </div>

            {isThreat && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    ⚠
                </motion.div>
            )}

            {isActive && !isThreat && (
                <motion.div
                    className="absolute bottom-1 right-1 w-1 h-1 bg-nexus-cyan rounded-full"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                />
            )}
        </motion.div>
    );
};
