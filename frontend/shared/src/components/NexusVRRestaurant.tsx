import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Eye, ShoppingCart, Star, ArrowLeft, ChevronRight, Share2, Info } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  calories: string;
  model3d: string; // Emoji placeholder for now
}

const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Solomillo al Grill', description: 'Corte de ternera premium con reducción de vino tinto y romero.', price: '34.00€', rating: 4.8, calories: '450 kcal', model3d: '🥩' },
  { id: '2', name: 'Bowl de Sushi Nexus', description: 'Selección de atún rojo y salmón con arroz infusionado en algas.', price: '28.00€', rating: 4.9, calories: '320 kcal', model3d: '🍣' },
  { id: '3', name: 'Pasta de Setas Silvestres', description: 'Pasta artesanal con mezcla de setas de temporada y trufa negra.', price: '26.00€', rating: 4.7, calories: '510 kcal', model3d: '🍝' },
];

export const NexusVRRestaurant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[12000] bg-nexus-obsidian flex flex-col items-center overflow-hidden"
        >
          {/* Ambient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* Header */}
          <header className="relative z-10 w-full p-8 flex justify-between items-center backdrop-blur-md border-b border-white/5">
            <button onClick={onClose} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span className="text-[10px] font-orbitron tracking-widest uppercase">SALIR_REST_MODE</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-black italic tracking-tighter text-glow">NEXUS_VR_GASTRO</h1>
              <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.5em]">Experiencia 3D Holística</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-full relative">
                <ShoppingCart size={20} className="text-nexus-cyan" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-nexus-violet-glow rounded-full text-[8px] flex items-center justify-center font-bold">2</span>
              </div>
            </div>
          </header>

          <main className="relative z-10 flex-1 w-full max-w-6xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Menu List */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-1 h-8 bg-nexus-cyan-glow rounded-full" />
                <h2 className="text-xl font-orbitron font-bold tracking-widest text-white/80">CARTA_DE_AUTOR</h2>
              </div>

              {MENU_ITEMS.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full p-6 border rounded-3xl flex justify-between items-center text-left transition-all group
                    ${selectedItem?.id === item.id ? 'border-nexus-cyan-glow bg-nexus-cyan/5 shadow-[0_0_30px_rgba(0,245,255,0.1)]' : 'border-white/10 bg-white/[0.02]'}
                  `}
                >
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-nexus-cyan transition-colors">{item.name}</h3>
                    <p className="text-xs text-white/40 mt-1 line-clamp-1">{item.description}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="text-xs font-mono font-bold text-nexus-cyan-glow">{item.price}</span>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-nexus-gold fill-nexus-gold" />
                        <span className="text-[10px] text-white/60">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`transition-transform duration-300 ${selectedItem?.id === item.id ? 'rotate-90 text-nexus-cyan' : 'text-white/20'}`} />
                </motion.button>
              ))}
            </div>

            {/* Right: 3D Visualization Canvas */}
            <div className="relative aspect-square flex items-center justify-center">
              <AnimatePresence mode="wait">
                {selectedItem ? (
                  <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="relative w-full h-full flex flex-col items-center justify-center"
                  >
                    {/* Floating Platform */}
                    <div className="absolute bottom-20 w-80 h-12 bg-nexus-cyan/10 blur-3xl rounded-full" />
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-80 h-80 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-3xl"
                    >
                      <motion.div
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="text-[120px] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                        {selectedItem.model3d}
                      </motion.div>

                      {/* Interactive Tags */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-10 right-0 p-3 bg-nexus-obsidian border border-nexus-cyan/30 rounded-2xl flex items-center gap-2"
                      >
                        <Box size={14} className="text-nexus-cyan" />
                        <span className="text-[10px] font-mono">TEXTURE_4K_READY</span>
                      </motion.div>
                    </motion.div>

                    {/* Meta Info */}
                    <div className="mt-12 text-center space-y-4">
                      <div className="flex justify-center gap-2">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/50">{selectedItem.calories}</span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/50">GLUTEN_FREE</span>
                      </div>
                      <div className="flex gap-4">
                        <button className="flex-1 px-8 py-4 bg-nexus-cyan text-black font-black rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2">
                          AÑADIR A LA MESA
                        </button>
                        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center text-white/20 gap-4">
                    <Eye size={80} className="animate-pulse" />
                    <p className="font-orbitron tracking-widest uppercase text-xs">Selecciona un plato para vista VR</p>
                  </div>
                )}
              </AnimatePresence>

              {/* VR Controls UI */}
              <div className="absolute top-10 right-10 flex flex-col gap-2">
                <button className="p-3 bg-nexus-obsidian border border-white/10 rounded-xl text-white/40 hover:text-nexus-cyan transition-colors">
                  <RotateCcw size={18} />
                </button>
                <button className="p-3 bg-nexus-obsidian border border-white/10 rounded-xl text-white/40 hover:text-nexus-cyan transition-colors">
                  <Info size={18} />
                </button>
              </div>
            </div>
          </main>

          {/* Footer Navigation */}
          <footer className="relative z-10 w-full p-8 border-t border-white/5 flex justify-center gap-12 bg-black/40 backdrop-blur-xl">
            {['ENTRANTES', 'PRINCIPALES', 'POSTRES', 'BODEGA'].map((cat) => (
              <button key={cat} className="text-[10px] font-orbitron font-bold tracking-[0.3em] text-white/30 hover:text-nexus-cyan transition-colors">
                {cat}
              </button>
            ))}
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { RotateCcw } from 'lucide-react';
