import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export const GlobalParticleMesh: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* Deep Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-black" />

            {/* Subtle Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexus-violet/10 rounded-full blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexus-cyan/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

            {/* Interactive Particles */}
            {[...Array(20)].map((_, i) => (
                <Particle key={i} mouseX={mousePosition.x} mouseY={mousePosition.y} />
            ))}

             {/* Grain Overlay */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>
    );
};

const Particle: React.FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
    const [initialX] = useState(Math.random() * window.innerWidth);
    const [initialY] = useState(Math.random() * window.innerHeight);
    const [size] = useState(Math.random() * 2 + 1);
    const [duration] = useState(Math.random() * 20 + 10);
    const [delay] = useState(Math.random() * 5);

    return (
        <motion.div
            className="absolute rounded-full bg-white opacity-20"
            style={{
                width: size,
                height: size,
                x: initialX,
                y: initialY,
            }}
            animate={{
                y: [initialY, initialY - 100, initialY],
                opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
            }}
        />
    );
};
