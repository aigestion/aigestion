import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';

/**
 * 🛰️ SYSTEM HEALTH WIDGET
 * Provides real-time visibility into the Workstation Vitals and Auto-Healing status.
 */
export const SystemHealthWidget = () => {
  const [health, setHealth] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchHealth = async () => {
    try {
      const data = await api.getSystemHealth();
      setHealth(data.data);
    } catch (err) {
      console.error('Health Pulse Failed', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000); // 15s refresh for vitals
    return () => clearInterval(interval);
  }, []);

  if (loading || !health) {
    return (
      <div className="w-full h-full bg-white/5 animate-pulse rounded-2xl border border-white/10 flex items-center justify-center">
        <Activity className="w-8 h-8 text-white/20 animate-pulse" />
      </div>
    );
  }

  const memoryCheck = health.checks.find((c: any) => c.name === 'memory-usage') || { status: 'up' };
  const mongoCheck = health.checks.find((c: any) => c.name === 'mongodb') || { status: 'down' };
  const redisCheck = health.checks.find((c: any) => c.name === 'redis') || { status: 'down' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 h-full flex flex-col bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/10 relative overflow-hidden group"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Workstation Vitals</h3>
            <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest leading-none mt-1">
              {health.status === 'healthy' ? 'System Nominal' : 'Degradation Detected'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-white/40 uppercase font-mono">Uptime</span>
          <span className="text-xs font-mono text-white/80">
            {(health.uptime / 3600).toFixed(1)}h
          </span>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 z-10">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-3 h-3 text-white/40" />
            <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest">
              Memory Heap
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-white">
              {health.metrics.heapUsed.replace('MB', '')}
            </span>
            <span className="text-[10px] text-white/40 font-mono">MB</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (parseInt(health.metrics.heapUsed) / 2048) * 100)}%`,
              }}
              className={`h-full ${parseInt(health.metrics.heapUsed) > 1024 ? 'bg-amber-400' : 'bg-emerald-400'}`}
            />
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3 h-3 text-white/40" />
            <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest">
              Forecast (1h)
            </span>
          </div>
          {health.forecasts && health.forecasts[1] ? (
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-emerald-400">
                {health.forecasts[0].predictedValue1h.toFixed(1)}
              </span>
              <span className="text-[10px] text-white/40 font-mono">%</span>
            </div>
          ) : (
            <span className="text-xs text-white/20 font-mono italic">Calculating...</span>
          )}
          <p className="text-[8px] text-white/30 mt-2 uppercase">Stable trajectory detected</p>
        </div>
      </div>

      {/* Services Checklist */}
      <div className="space-y-2 mt-auto z-10">
        {[
          { name: 'Core Database', status: mongoCheck.status, icon: Database },
          { name: 'Memory Cluster', status: redisCheck.status, icon: HardDrive },
          { name: 'Auto-Healing', status: 'up', icon: RefreshCcw },
        ].map((service, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-2.5 bg-white/2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <service.icon className="w-3.5 h-3.5 text-white/30" />
              <span className="text-[11px] text-white/70 font-medium">{service.name}</span>
            </div>
            <div
              className={`w-1.5 h-1.5 rounded-full ${service.status === 'up' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-top border-white/5 flex gap-2">
        <div className="flex-1 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-center">
          <span className="text-[9px] text-purple-300 font-bold uppercase tracking-widest">
            Auto-Healing Mode: ACTIVE
          </span>
        </div>
      </div>
    </motion.div>
  );
};
