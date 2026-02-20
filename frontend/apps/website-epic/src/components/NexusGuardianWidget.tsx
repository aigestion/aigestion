import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Zap, ShieldAlert, Cpu, BarChart3 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export const NexusGuardianWidget: React.FC = () => {
  const [sanityScore, setSanityScore] = useState(98);
  const [cpuLoad, setCpuLoad] = useState(24);
  const [memoryLoad, setMemoryLoad] = useState(42);
  const [status, setStatus] = useState<'HEALTHY' | 'DEGRADED' | 'CRITICAL'>('HEALTHY');

  // Fetch real-time monitoring
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/v1/system/metrics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCpuLoad(Math.round(data.cpu));
          setMemoryLoad(Math.round(data.memory));
          
          // Dynamic sanity score based on real load
          const sanity = 100 - (data.cpu / 4) - (data.memory / 8);
          setSanityScore(Math.floor(sanity));
          setStatus('HEALTHY');
        }
      } catch (error) {
        console.error('Error fetching system metrics:', error);
        setStatus('DEGRADED');
      }
    };

    fetchMetrics(); // Initial fetch
    const interval = setInterval(fetchMetrics, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 premium-glass border-nexus-cyan/20 bg-black/40 rounded-3xl w-full max-w-sm font-sans"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-nexus-cyan/10 border border-nexus-cyan/30">
            <Shield className="w-5 h-5 text-nexus-cyan-glow" />
          </div>
          <div>
            <h3 className="text-sm font-orbitron font-bold text-white tracking-widest uppercase">
              NEXUS GUARDIAN
            </h3>
            <p className="text-[10px] text-nexus-cyan-glow/60 uppercase tracking-[0.2em]">
              SISTEMA PROTEGIDO
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`text-xl font-orbitron font-black ${sanityScore > 80 ? 'text-nexus-cyan-glow' : 'text-yellow-400'}`}
          >
            {sanityScore}%
          </span>
          <span className="text-[8px] text-nexus-silver/40 uppercase tracking-tighter">
            SANITY SCORE
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* CPU Tracker */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-orbitron text-nexus-silver/50 uppercase">
            <span className="flex items-center gap-2">
              <Cpu className="w-3 h-3" /> CPU LOAD
            </span>
            <span>{cpuLoad}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${cpuLoad}%` }}
              className="h-full bg-nexus-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            />
          </div>
        </div>

        {/* Memory Tracker */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-orbitron text-nexus-silver/50 uppercase">
            <span className="flex items-center gap-2">
              <Activity className="w-3 h-3" /> MEMORY
            </span>
            <span>{memoryLoad}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${memoryLoad}%` }}
              className="h-full bg-nexus-violet shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-nexus-cyan/30 flex flex-col items-center gap-2 group transition-all"
        >
          <Zap className="w-4 h-4 text-nexus-cyan transition-transform group-hover:scale-110" />
          <span className="text-[8px] font-orbitron font-bold text-nexus-silver/60 uppercase tracking-wider">
            RITUAL RÁPIDO
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-nexus-violet/30 flex flex-col items-center gap-2 group transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-nexus-violet transition-transform group-hover:rotate-12" />
          <span className="text-[8px] font-orbitron font-bold text-nexus-silver/60 uppercase tracking-wider">
            PURGA TOTAL
          </span>
        </motion.button>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-[9px] font-mono text-nexus-silver/40">SENTINEL_ACTIVE_v2.0</span>
        </div>
        <BarChart3 className="w-3 h-3 text-nexus-silver/20" />
      </div>
    </motion.div>
  );
};
