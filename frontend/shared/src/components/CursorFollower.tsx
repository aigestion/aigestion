import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CursorFollower: React.FC = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    const [cursorType, setCursorType] = useState<'DEFAULT' | 'POINTER' | 'TEXT' | 'ACTION'>('DEFAULT');

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            const style = window.getComputedStyle(target);
            const cursor = style.cursor;

            if (cursor === 'pointer') {
                if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') setCursorType('ACTION');
                else setCursorType('POINTER');
            } else if (cursor === 'text') {
                setCursorType('TEXT');
            } else {
                setCursorType('DEFAULT');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    const isPointer = cursorType === 'POINTER' || cursorType === 'ACTION';

    return (
        <motion.div
            className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-10000 mix-blend-difference flex items-center justify-center"
            style={{
                x,
                y,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            <motion.div
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    rotate: cursorType === 'ACTION' ? 45 : 0,
                    borderRadius: cursorType === 'TEXT' ? '2px' : cursorType === 'ACTION' ? '4px' : '50%',
                    width: cursorType === 'TEXT' ? '2px' : '100%',
                    height: cursorType === 'TEXT' ? '24px' : '100%',
                    backgroundColor: isPointer ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(255,255,255,1)',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="border shadow-[0_0_20px_rgba(255,255,255,0.3)] relative"
            >
                {cursorType === 'ACTION' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-1 bg-black rounded-full" />
                    </div>
                )}
            </motion.div>
            {isPointer && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 border border-white/20 rounded-full animate-ping"
                />
            )}
        </motion.div>
    );
};
