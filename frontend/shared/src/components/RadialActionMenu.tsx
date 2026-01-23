import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, MessageSquare, Plus, Box, Mic, Scan, ShoppingBag, Eye } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { ARVisualizer } from './ARVisualizer';
import { Food3DScanner } from './Food3DScanner';
import { NexusVRRestaurant } from './NexusVRRestaurant';

export const RadialActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [isFood3DOpen, setIsFood3DOpen] = useState(false);
  const [isVROpen, setIsVROpen] = useState(false);
  const { playHover, playWuaw } = useSound();

  const actions = [
    { icon: Mic, label: 'V2A', color: 'text-nexus-cyan-glow', action: () => { } },
    { icon: Box, label: 'AR', color: 'text-nexus-violet-glow', action: () => setIsAROpen(true) },
    { icon: Scan, label: 'FOOD3D', color: 'text-orange-400', action: () => setIsFood3DOpen(true) },
    { icon: Eye, label: 'VR_REST', color: 'text-green-400', action: () => setIsVROpen(true) },
    {
      icon: ShoppingBag, label: 'STORE', color: 'text-nexus-cyan', action: () => {
        // This will be handled by DashboardLayout if we lift state, or just alert for now
        // Actually I'll implement a way to trigger it.
        (window as any).openNexusMarketplace?.();
      }
    },
    { icon: MessageSquare, label: 'CHAT', color: 'text-nexus-gold', action: () => { } },
  ];

  return (
    <div className="fixed bottom-12 right-12 z-[10000] lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
            />

            {/* Actions */}
            {actions.map((action, i) => {
              const angle = (i * (360 / actions.length)) * (Math.PI / 180);
              const radius = 80;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x: -x, y: -y }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={playHover}
                  onClick={() => {
                    playWuaw();
                    action.action();
                    setIsOpen(false);
                  }}
                  className="absolute w-12 h-12 rounded-full bg-nexus-obsidian border border-white/10 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
                >
                  <action.icon size={18} className={`${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[6px] font-orbitron font-black text-white/40 uppercase mt-1">{action.label}</span>
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>

      <ARVisualizer isOpen={isAROpen} onClose={() => setIsAROpen(false)} />
      {isFood3DOpen && <Food3DScanner onClose={() => setIsFood3DOpen(false)} />}
      <NexusVRRestaurant isOpen={isVROpen} onClose={() => setIsVROpen(false)} />

      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          playWuaw();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(138,43,226,0.3)] nexus-heartbeat
          ${isOpen ? 'bg-red-500 text-white rotate-45' : 'bg-linear-to-br from-nexus-violet via-nexus-cyan to-nexus-violet-glow text-white'}`}
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
};
