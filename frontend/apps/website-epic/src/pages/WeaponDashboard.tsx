import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Cpu, HardDrive, Wifi, Shield, Zap,
  Brain, Terminal, Mic, Server, Eye, RefreshCw,
  ChevronRight, Database, Network, Lock,
} from 'lucide-react';
import { NexusCommandBar } from '../components/design-system/NexusCommandBar';
import { NexusMetricCard } from '../components/design-system/NexusMetricCard';
import { NexusProgressRing } from '../components/design-system/NexusProgressRing';
import { NexusStatusBadge } from '../components/design-system/NexusStatusBadge';
import { NexusCard } from '../components/design-system/NexusCard';
import { NexusGrid } from '../components/design-system/NexusGrid';
import { LiquidBackground } from '../components/design-system/LiquidBackground';

// ─── Types ──────────────────────────────────────────
interface SystemVitals {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'syncing';
  latency?: number;
}

// ─── Simulated Data Hooks ───────────────────────────
const useSystemVitals = () => {
  const [vitals, setVitals] = useState<SystemVitals>({
    cpu: 18, memory: 52, disk: 34, network: 87, uptime: '14d 7h 32m',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 4)),
        disk: Math.max(20, Math.min(80, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 6)),
        uptime: prev.uptime,
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return vitals;
};

const useServiceHealth = () => {
  const [services] = useState<ServiceStatus[]>([
    { name: 'Daniela Core', status: 'online', latency: 12 },
    { name: 'Swarm Engine', status: 'online', latency: 28 },
    { name: 'RAG Pipeline', status: 'online', latency: 45 },
    { name: 'Neural Bridge', status: 'syncing', latency: 67 },
    { name: 'Voice Engine', status: 'online', latency: 15 },
    { name: 'Sovereign Auth', status: 'online', latency: 8 },
    { name: 'ChromaDB', status: 'online', latency: 22 },
    { name: 'Redis Cache', status: 'online', latency: 3 },
  ]);
  return services;
};

// ─── Sub-components ──────────────────────────────────

const VoiceWaveform: React.FC = () => {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-[2px] h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-nexus-cyan/40 to-nexus-cyan"
          animate={{
            height: [8, Math.random() * 40 + 8, 8],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.04,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const NeuralPulse: React.FC = () => (
  <div className="relative w-full h-16 overflow-hidden rounded-lg">
    {/* Background grid */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />
    {/* Sweeping line */}
    <motion.div
      className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-nexus-cyan to-transparent"
      animate={{ left: ['0%', '100%'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />
    {/* ECG line */}
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <motion.path
        d="M0,32 L20,32 L30,10 L40,54 L50,32 L70,32 L80,20 L90,44 L100,32 L120,32 L130,8 L140,56 L150,32 L200,32 L210,14 L220,50 L230,32 L280,32 L290,18 L300,46 L310,32 L400,32"
        fill="none"
        stroke="#00F5FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.6}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  </div>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
}> = ({ icon, label, color, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`group relative flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all hover:border-${color}/30`}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `radial-gradient(120px circle at 20% 50%, var(--tw-gradient-stops))`,
      }}
    />
    <div className="relative z-10 flex items-center gap-3 w-full">
      <div className={`p-2 rounded-lg bg-white/[0.04]`}>{icon}</div>
      <span className="text-xs font-orbitron font-bold uppercase tracking-[0.12em] text-white/80 group-hover:text-white transition-colors">
        {label}
      </span>
      <ChevronRight className="w-3 h-3 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
    </div>
  </motion.button>
);

// ─── Main Component ─────────────────────────────────
const WeaponDashboard: React.FC = () => {
  const vitals = useSystemVitals();
  const services = useServiceHealth();
  const [error, setError] = useState<string | null>(null);

  const cpuSpark = [12, 15, 18, 14, 22, 19, 16, 20, 18, 15, 17, vitals.cpu];
  const memSpark = [48, 50, 52, 49, 55, 53, 51, 54, 52, 50, 51, vitals.memory];

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-rose-500 font-orbitron text-lg">CRITICAL ERROR: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-obsidian text-white overflow-hidden relative">
      {/* Ambient Background */}
      <LiquidBackground />

      {/* Grain overlay */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-50 opacity-[0.15]" />

      {/* Command Bar */}
      <NexusCommandBar
        title="GOD MODE"
        subtitle="Sovereign Intelligence Hub // All Systems Nominal"
        status={
          <div className="flex items-center gap-4">
            <NexusStatusBadge status="online" label="SYSTEM ACTIVE" size="md" />
            <span className="text-[10px] text-white/20 font-mono">
              UPTIME: {vitals.uptime}
            </span>
          </div>
        }
      />

      {/* Main Content */}
      <main className="relative z-10 p-6 md:p-8 space-y-8">
        {/* ── System Vitals ──────────────────────── */}
        <section>
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 font-orbitron">
            System Vitals
          </h2>
          <NexusGrid cols={4} gap="md">
            <NexusMetricCard
              label="CPU Load"
              value={Math.round(vitals.cpu)}
              suffix="%"
              icon={<Cpu className="w-4 h-4 text-nexus-cyan" />}
              variant="cyan"
              trend={vitals.cpu > 60 ? 'up' : 'down'}
              trendValue={vitals.cpu > 60 ? 'High' : 'Normal'}
              sparkline={cpuSpark}
            />
            <NexusMetricCard
              label="Memory"
              value={Math.round(vitals.memory)}
              suffix="%"
              icon={<HardDrive className="w-4 h-4 text-nexus-violet" />}
              variant="violet"
              trend="neutral"
              trendValue="Stable"
              sparkline={memSpark}
            />
            <NexusMetricCard
              label="Disk I/O"
              value={Math.round(vitals.disk)}
              suffix="%"
              icon={<Database className="w-4 h-4 text-nexus-gold" />}
              variant="gold"
              trend="down"
              trendValue="Optimal"
            />
            <NexusMetricCard
              label="Network"
              value={Math.round(vitals.network)}
              suffix=" Mbps"
              icon={<Wifi className="w-4 h-4 text-emerald-400" />}
              variant="green"
              trend="up"
              trendValue="Fast"
            />
          </NexusGrid>
        </section>

        {/* ── Progress Rings + Neural Pulse ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NexusCard variant="cyan" className="p-6 lg:col-span-1">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6 font-orbitron">
              System Health
            </h3>
            <div className="flex items-center justify-around">
              <NexusProgressRing value={vitals.cpu} size="md" label="CPU" variant="cyan" />
              <NexusProgressRing value={vitals.memory} size="md" label="MEM" variant="violet" />
              <NexusProgressRing value={100 - vitals.disk} size="md" label="DISK" variant="green" />
            </div>
          </NexusCard>

          <NexusCard variant="violet" className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] font-orbitron">
                Neural Activity Pulse
              </h3>
              <NexusStatusBadge status="online" label="LIVE" />
            </div>
            <NeuralPulse />
            <div className="flex items-center justify-between mt-4 text-[9px] text-white/20 font-mono uppercase">
              <span>Latency: 12ms</span>
              <span>Throughput: 847 ops/s</span>
              <span>Queue: 0</span>
            </div>
          </NexusCard>
        </div>

        {/* ── Service Health + Voice Panel ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Service Health Grid */}
          <NexusCard variant="default" className="p-6 lg:col-span-3">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-5 font-orbitron">
              Service Health Matrix
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <NexusStatusBadge status={svc.status} />
                  </div>
                  <p className="text-[10px] font-bold text-white/70 font-orbitron tracking-wider truncate">
                    {svc.name}
                  </p>
                  {svc.latency !== undefined && (
                    <p className="text-[9px] text-white/20 font-mono mt-1">
                      {svc.latency}ms
                    </p>
                  )}
                </div>
              ))}
            </div>
          </NexusCard>

          {/* Daniela Voice Panel */}
          <NexusCard variant="cyan" glow className="p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-nexus-cyan/10 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                <Mic className="w-5 h-5 text-nexus-cyan" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white font-orbitron tracking-wider">
                  DANIELA CORE
                </h3>
                <p className="text-[9px] text-white/30 font-mono uppercase">
                  Voice AI • Ready
                </p>
              </div>
            </div>
            <VoiceWaveform />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-nexus-cyan/20 to-nexus-violet/20 border border-nexus-cyan/20 text-nexus-cyan font-orbitron text-xs font-bold tracking-[0.15em] uppercase hover:from-nexus-cyan/30 hover:to-nexus-violet/30 transition-all shadow-[0_0_20px_rgba(0,245,255,0.1)]"
            >
              Activate Voice Link
            </motion.button>
          </NexusCard>
        </div>

        {/* ── Quick Actions ──────────────────────── */}
        <section>
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 font-orbitron">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickAction icon={<Brain className="w-4 h-4 text-nexus-violet" />} label="Swarm Deploy" color="nexus-violet" />
            <QuickAction icon={<Shield className="w-4 h-4 text-nexus-gold" />} label="Security Scan" color="nexus-gold" />
            <QuickAction icon={<Eye className="w-4 h-4 text-nexus-cyan" />} label="Visual Audit" color="nexus-cyan" />
            <QuickAction icon={<Terminal className="w-4 h-4 text-emerald-400" />} label="Neural Shell" color="emerald-400" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default WeaponDashboard;
