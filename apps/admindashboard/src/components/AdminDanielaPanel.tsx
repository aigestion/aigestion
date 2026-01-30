import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DanielaConversationPanel } from '@shared/components/DanielaConversationPanel';
import { DanielaHeader } from './daniela/DanielaHeader';
import { DanielaStats } from './daniela/DanielaStats';
import { DanielaTabs } from './daniela/DanielaTabs';
import { DanielaAnalytics } from './daniela/DanielaAnalytics';
import { DanielaSettings } from './daniela/DanielaSettings';

export const AdminDanielaPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conversation' | 'analytics' | 'settings'>('conversation');

  return (
    <div className="space-y-6">
      <DanielaHeader />

      <DanielaStats />

      <DanielaTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[600px]"
          >
            <DanielaConversationPanel />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DanielaAnalytics />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DanielaSettings />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
