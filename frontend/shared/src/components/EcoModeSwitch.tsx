import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Cpu } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface EcoModeSwitchProps {
    isEco: boolean;
    onChange: (val: boolean) => void;
}

export const EcoModeSwitch: React.FC<EcoModeSwitchProps> = ({ isEco, onChange }) => {
    const { playHover, playWuaw } = useSound();

    return (
        <div
            onClick={() => {
                onChange(!isEco);
                playWuaw();
            }}
            onMouseEnter={playHover}
            className={`flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all duration-500 border ${
                isEco ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-white/40'
            }`}
        >
            <motion.div
                animate={{ rotate: isEco ? 360 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {isEco ? <Leaf size={14} /> : <Cpu size={14} />}
            </motion.div>
            <span className="text-[8px] font-orbitron font-black tracking-widest uppercase">
                {isEco ? 'ECO_MODE: ACTIVE' : 'PERFORMANCE: HIGH'}
            </span>
            <div className={`w-8 h-4 rounded-full relative p-1 transition-colors ${isEco ? 'bg-green-500' : 'bg-white/20'}`}>
                <motion.div
                    animate={{ x: isEco ? 16 : 0 }}
                    className="w-2 h-2 rounded-full bg-white shadow-sm"
                />
            </div>
        </div>
    );
};
