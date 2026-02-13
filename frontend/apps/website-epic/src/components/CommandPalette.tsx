import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '../hooks/useSound';
import { Search, Map, CreditCard, User, Box, Shield, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface CommandItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  shortcut?: string;
  path?: string;
  action?: () => void;
}

export const CommandPalette: React.FC = () => {
  const { playHover, playClick } = useSound();
  const { setIsContactModalOpen } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: '1',
      icon: <Map className="w-4 h-4" />,
      title: 'Explorar Mapa Global',
      path: '/map',
      shortcut: 'G M',
    },
    {
      id: '2',
      icon: <CreditCard className="w-4 h-4" />,
      title: 'Ver Planes y Precios',
      path: '/pricing',
      shortcut: 'P',
    },
    {
      id: '3',
      icon: <User className="w-4 h-4" />,
      title: 'Contactar Ventas',
      action: () => setIsContactModalOpen(true),
      shortcut: 'C',
    },

    {
      id: '4',
      icon: <Box className="w-4 h-4" />,
      title: 'Documentación API',
      path: '/docs',
      shortcut: 'D',
    },
    { id: '5', icon: <Shield className="w-4 h-4" />, title: 'Estado del Sistema', path: '/status' },
    {
      id: '6',
      icon: <Zap className="w-4 h-4" />,
      title: 'Iniciar Prueba Gratuita',
      action: () => alert('Starting Trial...'),
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) playHover();
        else playClick();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (index: number) => {
    const item = filteredCommands[index];
    if (item) {
      if (item.action) item.action();
      if (item.path) console.log(`Navigating to ${item.title}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-nexus-cyan mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Escribe un comando o busca..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                  }
                  if (e.key === 'Enter') {
                    handleSelect(selectedIndex);
                  }
                }}
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-mono"
              />
              <div className="text-xs text-gray-400 font-mono border border-white/10 px-2 py-1 rounded">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {filteredCommands.map((cmd, index) => (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-nexus-cyan/10 border-l-2 border-nexus-cyan'
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${index === selectedIndex ? 'text-nexus-cyan bg-nexus-cyan/10' : 'text-gray-400 bg-white/5'}`}
                    >
                      {cmd.icon}
                    </div>
                    <span
                      className={`text-sm font-medium ${index === selectedIndex ? 'text-white' : 'text-gray-400'}`}
                    >
                      {cmd.title}
                    </span>
                  </div>
                  {cmd.shortcut && (
                    <span className="text-xs text-gray-500 font-mono tracking-widest">
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              ))}

              {filteredCommands.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No se encontraron resultados para "{query}"
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <span>↑↓ para navegar</span>
              <span>AIGESTION COMMAND CENTER v2.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
