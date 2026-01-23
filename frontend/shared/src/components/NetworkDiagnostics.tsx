import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Zap } from 'lucide-react';

export const NetworkDiagnostics: React.FC = () => {
    const [latency, setLatency] = React.useState(12);
    const [status, setStatus] = React.useState<'STABLE' | 'WARNING' | 'CRITICAL'>('STABLE');

    React.useEffect(() => {
        const interval = setInterval(() => {
            const l = Math.floor(Math.random() * 50) + 10;
            setLatency(l);
            setStatus(l > 45 ? 'CRITICAL' : l > 30 ? 'WARNING' : 'STABLE');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
            <div className={`p-2 rounded-lg ${
                status === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                status === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-nexus-cyan/10 text-nexus-cyan-glow'
            }`}>
                {status === 'CRITICAL' ? <WifiOff size={16} /> : <Wifi size={16} />}
            </div>

            <div>
                <div className="flex items-center gap-2">
                    <span className="text-[7px] font-orbitron text-white/40 uppercase tracking-widest">Neural Latency</span>
                    <Zap size={10} className="text-nexus-cyan-glow animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-orbitron font-black text-white">{latency}</span>
                    <span className="text-[8px] font-mono text-white/20 uppercase">ms</span>
                    <span className={`text-[6px] font-mono px-1 rounded ${
                         status === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                         status === 'WARNING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                    }`}>{status}</span>
                </div>
            </div>

            {/* Sparkline simulation */}
            <div className="flex items-end gap-0.5 h-6 ml-4">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-0.5 rounded-t-xs transition-all duration-1000 ${status === 'CRITICAL' ? 'bg-red-500/30' : 'bg-nexus-cyan/30'}`}
                        style={{ height: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>
        </div>
    );
};
