import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
    const baseStyle = "bg-white/[0.03] overflow-hidden relative border border-white/5";
    const variantStyle =
        variant === 'circle' ? 'rounded-full' :
        variant === 'text' ? 'rounded-md h-4 w-full' :
        'rounded-2xl';

    return (
        <div className={`${baseStyle} ${variantStyle} ${className}`}>
            <motion.div
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/[0.05] to-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            />
        </div>
    );
};
