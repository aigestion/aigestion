import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RemoteCursor {
    id: string;
    name: string;
    x: number;
    y: number;
    color: string;
}

export const CollaborativeCursors: React.FC = () => {
    const [cursors, setCursors] = useState<RemoteCursor[]>([]);

    useEffect(() => {
        // Simulation of other admins moving
        const interval = setInterval(() => {
            setCursors([
                {
                    id: '1',
                    name: 'Admin_Alejandro',
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    color: '#00f5ff'
                },
                {
                    id: '2',
                    name: 'Daniela_AI',
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    color: '#8a2be2'
                }
            ]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[8888] overflow-hidden">
            <AnimatePresence>
                {cursors.map(cursor => (
                    <motion.div
                        key={cursor.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6, x: cursor.x, y: cursor.y }}
                        transition={{ type: 'spring', damping: 30, stiffness: 100 }}
                        className="absolute top-0 left-0"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.65376 12.3745L15.9392 20.3745L13.7842 12.3745H17.8931L5.65376 4V12.3745Z" fill={cursor.color} stroke="white" strokeWidth="1" />
                        </svg>
                        <div
                            className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 whitespace-nowrap ml-4 -mt-2"
                            style={{ boxShadow: `0 0 15px ${cursor.color}44` }}
                        >
                            <span className="text-[7px] font-orbitron font-black uppercase text-black" style={{ color: cursor.color }}>{cursor.name}</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
