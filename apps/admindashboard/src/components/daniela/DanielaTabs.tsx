import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Shield } from 'lucide-react';

interface DanielaTabsProps {
  activeTab: 'conversation' | 'analytics' | 'settings';
  setActiveTab: (tab: 'conversation' | 'analytics' | 'settings') => void;
}

export const DanielaTabs: React.FC<DanielaTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'conversation', label: 'Conversación', icon: <Brain className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analítica', icon: <Activity className="w-4 h-4" /> },
    { id: 'settings', label: 'Configuración', icon: <Shield className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="flex gap-2 border-b border-white/10">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 font-orbitron font-black text-sm transition-all border-b-2 ${
            activeTab === tab.id
              ? 'text-nexus-cyan-glow border-nexus-cyan-glow'
              : 'text-nexus-silver/60 border-transparent hover:text-white'
          }`}
        >
          {tab.icon}
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};
