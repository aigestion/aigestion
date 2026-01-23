import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Layout, Plus, Check, Search, Filter, X } from 'lucide-react';

interface Widget {
  id: string;
  name: string;
  description: string;
  category: 'ANALYTICS' | 'AI' | 'HARDWARE' | 'SECURITY';
  premium: boolean;
  price: string;
}

const AVAILABLE_WIDGETS: Widget[] = [
  { id: '1', name: 'Neural Pulse', description: 'Real-time CPU/GPU neural matching.', category: 'HARDWARE', premium: false, price: 'FREE' },
  { id: '2', name: 'Ghost Traffic', description: 'Monitor anonymous login attempts.', category: 'SECURITY', premium: true, price: 'PREMIUM' },
  { id: '3', name: 'Daniela Mood', description: 'Proactive AI sentiment analyzer.', category: 'AI', premium: true, price: 'GOLD' },
  { id: '4', name: 'Sales Vortex', description: 'Dynamic sales funnel visualization.', category: 'ANALYTICS', premium: false, price: 'FREE' },
  { id: '5', name: 'Bio-Sync', description: 'Advanced biometric health monitor.', category: 'HARDWARE', premium: true, price: 'NEXUS' },
];

export const WidgetMarketplace: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PREMIUM'>('ALL');
  const [installed, setInstalled] = useState<string[]>(['1']);

  const installWidget = (id: string) => {
    if (installed.includes(id)) return;
    setInstalled([...installed, id]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[11000] bg-nexus-obsidian flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-xl flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
                <ShoppingBag className="text-nexus-cyan" /> MARKETPLACE_NEXUS
              </h2>
              <p className="text-[10px] font-mono text-white/40 uppercase">Ecosistema de Widgets V2.0</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full border border-white/10">
              <X size={24} />
            </button>
          </div>

          {/* Search & Tabs */}
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="BUSCAR MÓDULOS..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-mono focus:border-nexus-cyan-glow outline-none transition-all"
              />
            </div>

            <div className="flex gap-2">
              {['ALL', 'PREMIUM'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all
                    ${activeTab === tab ? 'bg-nexus-cyan text-black' : 'bg-white/5 text-white/40 border border-white/5'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Widget List */}
          <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-4">
            {AVAILABLE_WIDGETS
              .filter(w => activeTab === 'ALL' || w.premium)
              .map((widget) => (
                <motion.div
                  key={widget.id}
                  layout
                  className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 relative overflow-hidden group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                    ${widget.category === 'AI' ? 'bg-purple-500/20 text-purple-400' :
                      widget.category === 'SECURITY' ? 'bg-red-500/20 text-red-400' :
                      widget.category === 'HARDWARE' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-green-500/20 text-green-400'}
                  `}>
                    {widget.category === 'AI' && <Star size={28} />}
                    {widget.category === 'SECURITY' && <ShieldAlert size={28} />}
                    {widget.category === 'HARDWARE' && <Layout size={28} />}
                    {widget.category === 'ANALYTICS' && <Check size={28} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold tracking-tight">{widget.name}</h3>
                      {widget.premium && (
                        <span className="text-[8px] bg-nexus-gold/20 text-nexus-gold px-2 py-0.5 rounded-full border border-nexus-gold/30">PREMIUM</span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-1">{widget.description}</p>
                  </div>

                  <button
                    onClick={() => installWidget(widget.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all
                      ${installed.includes(widget.id)
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white text-black active:scale-95'}
                    `}
                  >
                    {installed.includes(widget.id) ? 'INSTALLED' : widget.price}
                  </button>

                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
