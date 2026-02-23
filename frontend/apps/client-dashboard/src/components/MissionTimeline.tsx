import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  MessageSquare, 
  Activity, 
  Zap, 
  History,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

/**
 * 🛰️ MISSION TIMELINE WIDGET
 * Real-time visualization of Swarm Intelligence mission events and agent interactions.
 */
export const MissionTimeline = () => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const result = await api.getSwarmHistory();
      if (result && result.history) {
        setHistory(result.history.reverse()); // Latest first
      }
    } catch (err) {
      console.error('Failed to fetch mission history', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      'Overlord': 'text-purple-400',
      'Detective': 'text-blue-400',
      'Architect': 'text-emerald-400',
      'Builder': 'text-amber-400',
      'Critic': 'text-rose-400',
      'Mechanic': 'text-cyan-400',
      'Navigator': 'text-indigo-400',
      'System': 'text-white/40'
    };
    return colors[agent] || 'text-white/60';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-5 h-full flex flex-col bg-zinc-950/60 backdrop-blur-2xl rounded-2xl border border-white/10 relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Terminal className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight text-shadow-glow">Mission Intelligence</h3>
            <p className="text-[10px] text-purple-400 font-mono uppercase tracking-widest leading-none mt-1">
              Live Neural Log
            </p>
          </div>
        </div>
        <button 
          onClick={fetchHistory}
          disabled={loading}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors group/refresh"
        >
          <RefreshCcw className={`w-4 h-4 text-white/40 group-hover/refresh:text-white transition-all ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar z-10 font-mono">
        {history.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <History className="w-12 h-12 mb-2" />
            <span className="text-xs uppercase tracking-tighter">No entry detected</span>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {history.map((event, idx) => (
            <motion.div
              key={`${event.timestamp}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              className="relative pl-6 pb-2 border-l border-white/5 last:pb-0"
            >
              {/* Dot indicator */}
              <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-white/10 border border-white/20 group-hover:scale-125 transition-transform" />
              
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-tight ${getAgentColor(event.sender)}`}>
                  {event.sender}
                </span>
                <ArrowRight className="w-2 h-2 text-white/20" />
                <span className={`text-[10px] font-bold uppercase tracking-tight ${getAgentColor(event.receiver)}`}>
                  {event.receiver}
                </span>
                <span className="text-[8px] text-white/10 ml-auto">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[11px] text-white/70 leading-relaxed whitespace-pre-wrap break-words">
                  {event.content}
                </p>
                {event.type === 'ACTION' && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[9px] text-amber-400/60 uppercase font-bold tracking-widest">Autonomous Action Executed</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Interface Status */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Telemetry Bridge: Nominal</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-glow" />
          <div className="w-1 h-1 rounded-full bg-blue-500 shadow-glow animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-purple-500 shadow-glow" />
        </div>
      </div>
    </motion.div>
  );
};
