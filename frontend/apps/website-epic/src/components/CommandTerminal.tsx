import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandTerminal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['SISTEMA OPERATIVO AIGESTION v2.6', 'Consola de comandos autorizada.', 'Escribe "help" para ver opciones.']);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '`') {
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        const response: string[] = [`> ${input}`];

        switch (cmd) {
            case 'help':
                response.push('COMANDOS DISPONIBLES:', '- help: Muestra esta ayuda', '- clear: Limpia la terminal', '- daniela: Estado del núcleo de voz', '- exit: Cierra la terminal', '- status: Estado de los nodos globales');
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'daniela':
                response.push('DANIELA AI: ESTADO OPTIMAL', 'Latencia: 12ms', 'Sentimiento: Neutral/Analítico');
                break;
            case 'status':
                response.push('NODOS ACTIVOS: 142', 'Carga de Red: 24%', 'Sincronización: 100%');
                break;
            case 'exit':
                setIsOpen(false);
                break;
            default:
                response.push(`Error: Comando "${cmd}" no reconocido.`);
        }

        setHistory(prev => [...prev, ...response]);
        setInput('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-x-0 top-0 z-10000 p-4"
                >
                    <div className="max-w-4xl mx-auto premium-glass border-nexus-cyan/20 bg-black/90 rounded-b-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center text-[10px] font-orbitron tracking-widest text-nexus-silver/40">
                            <span>AIGESTION_TERMINAL_v2.6 // SECURE_SHELL</span>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            </div>
                        </div>

                        <div className="h-64 overflow-y-auto p-6 font-mono text-xs space-y-2 scrollbar-hide">
                            {history.map((line, i) => (
                                <div key={i} className={line.startsWith('>') ? 'text-nexus-cyan-glow' : 'text-nexus-silver'}>
                                    {line}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleCommand} className="p-4 bg-white/5 border-t border-white/5 flex items-center gap-3">
                            <span className="text-nexus-cyan-glow font-mono">$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 font-mono text-nexus-cyan-glow"
                                placeholder="Escribe un comando..."
                            />
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
