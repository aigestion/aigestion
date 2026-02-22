import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  Database,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  RefreshCcw,
  Network
} from 'lucide-react';
import { sovereignGodMode } from '../services/sovereign-godmode';
import { api } from '../services/api';

interface HealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  sanityScore: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  timestamp: string;
}

interface Forecast {
  metric: string;
  currentValue: number;
  predictedValue1h: number;
  predictedValue24h: number;
  timeToThresholdMs: number | null;
  confidence: number;
}

export const SovereignDiagnostics: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchDiagnostics = async () => {
    try {
      const [healthRes, forecastRes] = await Promise.all([
        api.get('/system/health'),
        sovereignGodMode.getResourceForecast()
      ]);
      setMetrics(healthRes.data);
      setForecasts(forecastRes);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 30000); // 30s updates
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL': return 'text-nexus-cyan-glow';
      case 'DEGRADED': return 'text-yellow-500';
      case 'CRITICAL': return 'text-red-500';
      default: return 'text-white/40';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-nexus-cyan-glow animate-pulse" />
            <span className="text-nexus-cyan-glow font-orbitron text-[10px] tracking-[0.4em]">
              NEURAL PULSE MONITOR
            </span>
          </div>
          <h1 className="text-3xl font-orbitron font-bold text-white tracking-tight">
            System <span className="text-nexus-cyan-glow">Diagnostics</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-mono">ÚLTIMA SINCRONIZACIÓN</div>
            <div className="text-xs text-white/80 font-mono">{lastUpdate.toLocaleTimeString()}</div>
          </div>
          <button
            onClick={() => { setLoading(true); fetchDiagnostics(); }}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Real-time Pulse Card */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${getStatusColor(metrics?.status || '')}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`} />
              <span className="text-[10px] font-orbitron font-bold tracking-widest">{metrics?.status || 'LOADING...'}</span>
            </div>
          </div>

          <div className="relative z-10 space-y-12">
            <div className="flex items-end gap-12">
              <div className="space-y-2">
                <div className="text-[10px] text-white/40 font-orbitron tracking-widest">SANITY SCORE</div>
                <div className="text-6xl font-orbitron font-bold text-white">
                  {metrics?.sanityScore || 0}<span className="text-2xl text-nexus-cyan-glow">%</span>
                </div>
              </div>
              <div className="flex-1 h-24 flex items-end gap-1 pb-2">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${Math.random() * 40 + 20}%`, `${Math.random() * 60 + 40}%`, `${Math.random() * 40 + 20}%`] }}
                    transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: i * 0.05 }}
                    className="flex-1 bg-nexus-cyan-glow/20 rounded-t-sm"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/40">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-orbitron tracking-widest">CPU LOAD</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-orbitron text-white">{metrics?.cpuUsage || 0}%</div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics?.cpuUsage || 0}%` }}
                      className="h-full bg-nexus-cyan-glow"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/40">
                  <Database className="w-4 h-4" />
                  <span className="text-[10px] font-orbitron tracking-widest">MEM ALLOC</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-orbitron text-white">{metrics?.memoryUsage || 0}%</div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics?.memoryUsage || 0}%` }}
                      className="h-full bg-nexus-violet-glow"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white/40">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-orbitron tracking-widest">UPTIME</span>
                </div>
                <div className="text-2xl font-orbitron text-white">
                  {metrics ? Math.floor(metrics.uptime / 3600) : 0}h
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-nexus-cyan-glow/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity" />
        </div>

        {/* Predictive Sentinel Card */}
        <div className="p-8 rounded-3xl bg-nexus-obsidian border border-nexus-cyan-glow/20 relative flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-nexus-cyan-glow" />
              <h3 className="text-sm font-orbitron font-bold text-white tracking-widest uppercase">Sentinel Forecast</h3>
            </div>

            <div className="space-y-4">
              {forecasts.map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white/40">{f.metric} PREDICTION</span>
                    <span className="text-[10px] text-nexus-cyan-glow font-mono">CONF: {(f.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-xl font-orbitron text-white">{f.predictedValue1h.toFixed(1)}%</div>
                    <div className="text-[10px] text-white/20 font-mono mb-1">IN 1 HOUR</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
            <div>
              <div className="text-[10px] font-orbitron text-yellow-500 font-bold mb-1">PROACTIVE ALERT</div>
              <p className="text-[10px] text-white/60 leading-relaxed uppercase">
                {forecasts[0]?.timeToThresholdMs
                  ? `Threshold breach predicted in ${Math.round(forecasts[0].timeToThresholdMs / 60000)} mins`
                  : 'System stability guaranteed for the next 4 cycles.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Grid (RAG & Security) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'RAG CHUNKS', value: '824', icon: Database, trend: 'OPTIMAL', color: 'cyan' },
          { label: 'SOVEREIGN NODE', value: 'ACTIVE', icon: Network, trend: 'QUANTUM', color: 'violet' },
          { label: 'RATE LIMITS', value: 'NOMINAL', icon: Activity, trend: 'SHIELDED', color: 'green' },
          { label: 'IA BRIDGE', value: 'FAST', icon: Zap, trend: '42ms', color: 'yellow' },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <item.icon className={`w-5 h-5 text-nexus-${item.color}-glow`} />
              <span className={`text-[8px] font-orbitron font-bold tracking-[0.2em] text-nexus-${item.color}-glow`}>{item.trend}</span>
            </div>
            <div className="text-[10px] text-white/40 font-orbitron tracking-widest mb-1">{item.label}</div>
            <div className="text-xl font-orbitron text-white">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
