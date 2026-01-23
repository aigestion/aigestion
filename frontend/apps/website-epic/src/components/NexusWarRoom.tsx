import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  Database,
  Zap,
  ShieldAlert,
  RefreshCw,
  Terminal as TerminalIcon,
  X,
  Lock,
  Wifi
} from 'lucide-react';
import { socket } from '../utils/socket'; // Asumiendo que existe un socket centralizado

interface NeuralMetrics {
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  sanityScore: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
}

export const NexusWarRoom: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<NeuralMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: 0,
    sanityScore: 100,
    status: 'OPTIMAL'
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [isCommanding, setIsCommanding] = useState(false);

  useEffect(() => {
    socket.on('nexus:neural_heartbeat', (data: NeuralMetrics) => {
      setMetrics(data);
    });

    socket.on('nexus:neural_warning', (data: NeuralMetrics) => {
      setLogs(prev => [`[WARNING] System Sanity at ${data.sanityScore}%`, ...prev].slice(0, 10));
    });

    return () => {
      socket.off('nexus:neural_heartbeat');
      socket.off('nexus:neural_warning');
    };
  }, []);

  const executeNexusCommand = async (command: string) => {
    setIsCommanding(true);
    setLogs(prev => [`[EXEC] Executing ${command}...`, ...prev]);

    try {
      const response = await fetch('/api/v1/nexus/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const result = await response.json();
      setLogs(prev => [`[OK] ${result.message}`, ...prev]);
    } catch (error) {
      setLogs(prev => [`[ERROR] Fault in command execution`, ...prev]);
    } finally {
      setIsCommanding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, scale: 1, backdropFilter: 'blur(20px)' }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 font-mono"
    >
      <div className="relative w-full max-w-5xl h-[80vh] bg-black/40 border border-cyan-500/30 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.1)]">

        {/* Scanning Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 animate-scan pointer-events-none" />

        {/* Header */}
        <header className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-cyan-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
            <h2 className="text-xl font-bold tracking-tighter text-white uppercase italic">Nexus War Room // God Mode</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-white/60" />
          </button>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto custom-scrollbar">

          {/* Left Panel: Neural Metrics */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} /> telemetry_active
            </h3>

            <div className="space-y-4">
              <MetricItem
                icon={<Cpu size={20} />}
                label="NEURAL_LOAD"
                value={`${metrics.cpuUsage}%`}
                progress={metrics.cpuUsage}
                color="cyan"
              />
              <MetricItem
                icon={<Database size={20} />}
                label="SYNAPTIC_MEM"
                value={`${metrics.memoryUsage}%`}
                progress={metrics.memoryUsage}
                color="violet"
              />
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] text-white/40 font-bold uppercase">SANITY_SCORE</span>
                  <span className={`text-2xl font-black ${metrics.sanityScore > 80 ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics.sanityScore}%
                  </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${metrics.sanityScore}%` }}
                    className={`h-full ${metrics.sanityScore > 80 ? 'bg-green-400' : 'bg-red-400'}`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                <Wifi size={20} className="mx-auto mb-2 text-cyan-400" />
                <span className="block text-[10px] text-white/40 uppercase">Ecosystem_Sync</span>
                <span className="text-sm font-bold text-white">ENABLED</span>
              </div>
              <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 text-center">
                <Lock size={20} className="mx-auto mb-2 text-violet-400" />
                <span className="block text-[10px] text-white/40 uppercase">Priv_Shield</span>
                <span className="text-sm font-bold text-white italic">ACTIVE</span>
              </div>
            </div>
          </section>

          {/* Center Panel: System Console */}
          <section className="lg:col-span-2 flex flex-col gap-6">
             <div className="flex-1 bg-black/60 rounded-xl border border-white/5 p-4 relative flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-white/20">
                  <TerminalIcon size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">kernel_logs_stream</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 text-[11px] leading-relaxed">
                  <AnimatePresence initial={false}>
                    {logs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`font-mono ${log.includes('ERROR') ? 'text-red-400' : log.includes('OK') ? 'text-green-400' : 'text-cyan-300'}`}
                      >
                        <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="absolute top-0 right-0 p-4 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
                </div>
             </div>

             {/* Command Actions */}
             <div className="grid grid-cols-3 gap-4">
               <ActionButton
                 icon={<RefreshCw size={18} />}
                 label="SYSTEM_PURGE"
                 onClick={() => executeNexusCommand('SYSTEM_PURGE')}
                 loading={isCommanding}
                 color="cyan"
               />
               <ActionButton
                 icon={<Zap size={18} />}
                 label="SYNC_VR"
                 onClick={() => executeNexusCommand('SYNC_VR_STATE')}
                 loading={isCommanding}
                 color="violet"
               />
               <ActionButton
                 icon={<ShieldAlert size={18} />}
                 label="GHOST_INIT"
                 onClick={() => executeNexusCommand('OVERRIDE_HEALTH')}
                 loading={isCommanding}
                 color="red"
               />
             </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="p-4 border-t border-white/5 bg-black/80 flex justify-between items-center text-[10px]">
          <div className="flex gap-4 text-white/20">
            <span>REGION: OMNIPRESENT</span>
            <span>NODE_ID: NEXUS_SUPREME</span>
          </div>
          <div className="text-cyan-500/50 italic font-bold">AIGESTION // OPERATIONAL</div>
        </footer>
      </div>
    </motion.div>
  );
};

const MetricItem: React.FC<{ icon: React.ReactNode, label: string, value: string, progress: number, color: 'cyan' | 'violet' }> = ({ icon, label, value, progress, color }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-3">
        <div className={`text-${color}-400 opacity-60`}>{icon}</div>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{label}</span>
      </div>
      <span className={`text-sm font-black text-${color}-400`}>{value}</span>
    </div>
    <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        animate={{ width: `${progress}%` }}
        className={`h-full ${color === 'cyan' ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-violet-400 shadow-[0_0_10px_#a78bfa]'}`}
      />
    </div>
  </div>
);

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, loading: boolean, color: 'cyan' | 'violet' | 'red' }> = ({ icon, label, onClick, loading, color }) => (
  <button
    disabled={loading}
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
      ${color === 'cyan' ? 'border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400' : ''}
      ${color === 'violet' ? 'border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 text-violet-400' : ''}
      ${color === 'red' ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400' : ''}
      ${loading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}
    `}
  >
    {icon}
    <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
  </button>
);
