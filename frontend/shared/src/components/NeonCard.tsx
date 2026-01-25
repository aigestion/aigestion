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
            whileHover={{ y: -5, scale: 1.01 }}
            className={`premium-glass p-8 rounded-[2.5rem] group relative overflow-hidden focus-mode-transition ${isXRay ? 'liquid-ui' : ''} ${className}`}
        >
            {/* Dynamic Border Gradient */}
            <div className="absolute inset-0 rounded-[2.5rem] p-[1px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none group-hover:from-white/20 transition-all" />

            {/* Corner Accent */}
            <div
                className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: accentColor }}
            />

            {title && (
                <div className="relative z-10 mb-6 flex items-center justify-between">
                    <h4 className="text-[10px] font-orbitron tracking-[0.4em] text-nexus-silver/60 uppercase flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                        {isXRay ? '// NEURAL_STREAM' : title}
                    </h4>
                    {isXRay && <span className="text-[8px] font-mono text-nexus-cyan-glow animate-pulse">LIVE_FEED</span>}
                </div>
            )}

            <div className={`relative z-10 focus-mode-transition ${isXRay ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
                {children}
            </div>

            {isXRay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 p-10 flex flex-col justify-center font-mono text-[9px] text-nexus-cyan-glow bg-black/80 backdrop-blur-sm"
                >
                    <div className="space-y-2 border-l-2 border-nexus-cyan/50 pl-4">
                        <p>CORE_ENTITY: <span className="text-white">{title || 'ANONYMOUS'}</span></p>
                        <p>MEMORY_ADDR: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                        <p>RENDER_MODE: <span className="text-nexus-violet-glow">LIQUID_UI_v2</span></p>
                        <div className="w-full bg-nexus-cyan/20 h-0.5 mt-2">
                            <motion.div
                                className="h-full bg-nexus-cyan"
                                animate={{ width: ["0%", "100%"] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                    </div>
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
