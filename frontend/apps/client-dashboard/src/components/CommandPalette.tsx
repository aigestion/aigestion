import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  Wallet, 
  Zap, 
  Shield, 
  Activity, 
  Mic, 
  Command,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  category: string;
}

export const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: 'treasury', title: 'Ver Tesoro Soberano', description: 'Acceso a finanzas y bonos', icon: Wallet, action: () => console.log('Nav to Treasury'), category: 'Navegación' },
    { id: 'health', title: 'Estado del Sistema', description: 'Diagnóstico de servicios backend', icon: Activity, action: () => console.log('Nav to Health'), category: 'Sistema' },
    { id: 'voice', title: 'Hablar con Daniela', description: 'Activar interfaz de voz', icon: Mic, action: () => console.log('Voice activate'), category: 'IA' },
    { id: 'mission', title: 'Nueva Misión', description: 'Desplegar agente de swarm', icon: Zap, action: () => console.log('New Mission'), category: 'Tareas' },
    { id: 'security', title: 'Auditoría de Seguridad', description: 'Verificar honeypots y bloqueos', icon: Shield, action: () => console.log('Security audit'), category: 'Seguridad' },
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        filteredCommands[selectedIndex]?.action();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-start justify-center pt-[15vh] z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search className="w-5 h-5 text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe un comando o busca algo..."
                  className="bg-transparent border-none outline-none text-white w-full text-lg placeholder:text-zinc-600 font-light"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 font-mono">
                  <Command className="w-3 h-3" /> K
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCommands.map((cmd, idx) => (
                      <button
                        key={cmd.id}
                        onClick={() => { cmd.action(); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                          selectedIndex === idx ? "bg-white/10" : "hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            selectedIndex === idx ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                          )}>
                            <cmd.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">{cmd.title}</p>
                            <p className="text-[10px] text-zinc-500">{cmd.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">{cmd.category}</span>
                          <ArrowRight className={cn(
                            "w-4 h-4 transition-all",
                            selectedIndex === idx ? "text-emerald-400 translate-x-0" : "text-zinc-700 -translate-x-2 opacity-0"
                          )} />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center opacity-30">
                    <Terminal className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-sm uppercase tracking-widest">Ningún patrón detectado</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">↑↓</span> Navegar</span>
                  <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">Enter</span> Ejecutar</span>
                </div>
                <span>Sovereign Command Hub v2.1</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
