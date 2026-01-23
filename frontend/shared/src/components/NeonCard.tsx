import React from 'react';
import { motion } from 'framer-motion';

interface NeonCardProps {
    children: React.ReactNode;
    title?: string;
    accentColor?: string;
    className?: string;
}

export const NeonCard: React.FC<NeonCardProps> = ({ children, title, accentColor = 'rgba(0, 245, 255, 0.5)', className = '' }) => {
    const [isXRay, setIsXRay] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = () => {
        timerRef.current = setTimeout(() => setIsXRay(true), 800);
    };

    const handleTouchEnd = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsXRay(false);
    };

    return (
        <motion.div
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            whileHover={{ y: -5 }}
            className={`premium-glass p-8 rounded-[2.5rem] border-white/5 group relative overflow-hidden focus-mode-transition ${isXRay ? 'liquid-ui' : ''} ${className}`}
        >
            {/* Corner Accent */}
            <div
                className="absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: accentColor }}
            />

            {title && (
                <h4 className="text-[10px] font-orbitron tracking-[0.4em] text-nexus-silver/40 uppercase mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    {isXRay ? '// NEURAL_METADATA_STREAM' : title}
                </h4>
            )}

            <div className={`focus-mode-transition ${isXRay ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                {children}
            </div>

            {isXRay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 p-10 flex flex-col justify-center font-mono text-[8px] text-nexus-cyan-glow bg-black/60"
                >
                    <p className="mb-2">CORE_ENTITY: {title || 'ANONYMOUS'}</p>
                    <p className="mb-1 text-white/40">MEMORY_ADDR: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                    <p className="mb-1 text-white/40">RENDER_MODE: LIQUID_UI</p>
                    <p className="mb-1 text-white/40">INTEGRITY: 100%</p>
                </motion.div>
            )}

            {/* Bottom Glow Indicator */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px]"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
            />
        </motion.div>
    );
};
