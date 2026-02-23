import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Activity, Cpu, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SensorData {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'nominal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface PerceptionGridProps {
  sensors: any;
  className?: string;
}

export const PerceptionGrid: React.FC<PerceptionGridProps> = ({ sensors, className }) => {
  // 🌌 Mock data if sensors are empty for premium visualization
  const activeSensors: SensorData[] = sensors?.items?.map((s: any) => ({
    id: s.id,
    label: s.name || 'SENSOR_NODE',
    value: s.value || Math.floor(Math.random() * 100),
    unit: s.unit || '%',
    status: s.status || 'nominal',
    trend: 'stable',
  })) || [
    { id: '1', label: 'NEURAL_LOAD', value: 42, unit: '%', status: 'nominal', trend: 'stable' },
    { id: '2', label: 'QUANTUM_DRIFT', value: 0.82, unit: 'ghz', status: 'nominal', trend: 'up' },
    { id: '3', label: 'VAULT_SHIELD', value: 99.9, unit: '%', status: 'nominal', trend: 'stable' },
    { id: '4', label: 'ANXIETY_LEVEL', value: 12, unit: 'bps', status: 'warning', trend: 'down' },
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {activeSensors.map((sensor, idx) => (
        <motion.div
          key={sensor.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="premium-glass p-5 rounded-2xl border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 bg-nexus-cyan/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div
              className={cn(
                'p-2 rounded-lg',
                sensor.status === 'nominal'
                  ? 'bg-nexus-cyan/10 text-nexus-cyan'
                  : 'bg-red-500/10 text-red-500'
              )}
            >
              {idx % 4 === 0 ? (
                <Eye size={16} />
              ) : idx % 4 === 1 ? (
                <Cpu size={16} />
              ) : idx % 4 === 2 ? (
                <Shield size={16} />
              ) : (
                <Activity size={16} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full animate-pulse',
                  sensor.status === 'nominal' ? 'bg-nexus-cyan' : 'bg-red-500'
                )}
              />
              <span className="text-[8px] font-orbitron tracking-widest text-white/20 uppercase">
                {sensor.status}
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="text-[10px] text-nexus-silver/40 font-orbitron tracking-tighter mb-1 uppercase">
              {sensor.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-nexus-silver group-hover:text-white transition-colors">
                {sensor.value}
              </span>
              <span className="text-[10px] text-nexus-silver/20 font-mono">{sensor.unit}</span>
            </div>
          </div>

          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (sensor.value / (sensor.unit === '%' ? 1 : 100)) * 100)}%`,
              }}
              className={cn(
                'h-full rounded-full shadow-lg',
                sensor.status === 'nominal'
                  ? 'bg-nexus-cyan shadow-nexus-cyan/20'
                  : 'bg-red-500 shadow-red-500/20'
              )}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
