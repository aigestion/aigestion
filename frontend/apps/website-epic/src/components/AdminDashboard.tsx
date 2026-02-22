import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  Database,
  Shield,
  Zap,
} from 'lucide-react';
import { NexusCard } from './design-system/NexusCard';
import { NexusMetricCard } from './design-system/NexusMetricCard';
import { NexusCommandBar } from './design-system/NexusCommandBar';
import { NexusStatusBadge } from './design-system/NexusStatusBadge';
import { NexusGrid } from './design-system/NexusGrid';

const AdminDashboard = () => {
  const stats = [
    { title: 'Usuarios Totales', value: '12,543', icon: Users, color: 'text-nexus-cyan', shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]' },
    { title: 'Ingresos Mensuales', value: '$45,678', icon: DollarSign, color: 'text-emerald-400', shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]' },
    { title: 'Tasa de Crecimiento', value: '+23.5%', icon: TrendingUp, color: 'text-nexus-violet', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
    { title: 'Actividad del Sistema', value: '98.2%', icon: Activity, color: 'text-orange-400', shadow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]' },
  ];

  const chartData = [
    { name: 'Ene', usuarios: 4000, ingresos: 2400 },
    { name: 'Feb', usuarios: 3000, ingresos: 1398 },
    { name: 'Mar', usuarios: 2000, ingresos: 9800 },
    { name: 'Abr', usuarios: 2780, ingresos: 3908 },
    { name: 'May', usuarios: 1890, ingresos: 4800 },
    { name: 'Jun', usuarios: 2390, ingresos: 3800 },
  ];

  const pieData = [
    { name: 'Desktop', value: 400, color: '#22d3ee' }, // nexus-cyan
    { name: 'Mobile', value: 300, color: '#a855f7' }, // nexus-violet
    { name: 'Tablet', value: 300, color: '#fbbf24' }, // amber
  ];

  return (
    <div className="min-h-screen bg-nexus-obsidian p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-nexus-violet/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-nexus-cyan/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <NexusCommandBar
          title="GOD ADMIN"
          subtitle="Sovereign Control Interface // Neural Permissions Active"
          status={
            <div className="flex items-center gap-4">
              <NexusStatusBadge status="online" label="NEXUS CORE ACTIVE" />
              <div className="px-3 py-1 rounded-full bg-nexus-violet/10 border border-nexus-violet/20 flex items-center gap-2">
                 <Shield className="w-3 h-3 text-nexus-violet" />
                 <span className="text-[10px] text-nexus-violet font-bold font-orbitron uppercase tracking-widest">Lvl 4 Auth</span>
              </div>
            </div>
          }
        />

        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NexusMetricCard
              label="Usuarios Totales"
              value={12543}
              icon={<Users className="w-5 h-5" />}
              variant="cyan"
              trend="up"
              trendValue="+12% mes"
              sparkline={[30, 45, 35, 60, 55, 70, 65, 80]}
            />
            <NexusMetricCard
              label="Ingresos Mensuales"
              value={45678}
              prefix="$"
              icon={<DollarSign className="w-5 h-5" />}
              variant="green"
              trend="up"
              trendValue="+8.2%"
              sparkline={[20, 30, 40, 35, 50, 60, 75, 90]}
            />
            <NexusMetricCard
              label="Tasa de Crecimiento"
              value={23.5}
              suffix="%"
              decimals={1}
              icon={<TrendingUp className="w-5 h-5" />}
              variant="violet"
              trend="up"
              trendValue="Target 25%"
              sparkline={[10, 15, 12, 20, 18, 25, 22, 30]}
            />
            <NexusMetricCard
              label="Actividad del Sistema"
              value={98.2}
              suffix="%"
              decimals={1}
              icon={<Activity className="w-5 h-5" />}
              variant="gold"
              trend="neutral"
              trendValue="Healthy"
              sparkline={[95, 97, 98, 96, 99, 98, 97, 98.2]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <NexusCard variant="default" glow className="p-8">
              <h2 className="text-lg font-orbitron font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                  <TrendingUp className="w-5 h-5 text-nexus-cyan" />
                  Estadísticas de Usuarios
              </h2>
              <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                          dataKey="name"
                          stroke="rgba(255,255,255,0.2)"
                          tick={{fontSize: 10, fontFamily: 'Orbitron', fill: 'rgba(255,255,255,0.3)'}}
                          axisLine={false}
                          tickLine={false}
                          dy={15}
                      />
                      <YAxis
                          stroke="rgba(255,255,255,0.2)"
                          tick={{fontSize: 10, fontFamily: 'Orbitron', fill: 'rgba(255,255,255,0.3)'}}
                          axisLine={false}
                          tickLine={false}
                          dx={-15}
                      />
                      <Tooltip
                          contentStyle={{
                              backgroundColor: 'rgba(5,5,5,0.9)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '16px',
                              backdropFilter: 'blur(20px)',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                          }}
                          itemStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'Orbitron' }}
                          labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontSize: '10px' }}
                      />
                      <Line type="monotone" dataKey="usuarios" stroke="#22d3ee" strokeWidth={3} dot={false} activeDot={{r: 4, strokeWidth: 0, fill: '#22d3ee'}} />
                      <Line type="monotone" dataKey="ingresos" stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{r: 4, strokeWidth: 0, fill: '#a855f7'}} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
            </NexusCard>

            <NexusCard variant="default" glow className="p-8">
              <h2 className="text-lg font-orbitron font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                  <Zap className="w-5 h-5 text-nexus-violet" />
                  Distribución Tráfico
              </h2>
              <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                      <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                      >
                          {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                      </Pie>
                      <Tooltip
                          contentStyle={{
                              backgroundColor: 'rgba(5,5,5,0.9)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '16px',
                              backdropFilter: 'blur(20px)',
                          }}
                          itemStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'Orbitron' }}
                      />
                      <Legend
                          verticalAlign="middle"
                          align="right"
                          layout="vertical"
                          iconType="circle"
                          formatter={(value) => <span className="text-[10px] font-orbitron text-white/40 uppercase tracking-widest">{value}</span>}
                      />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
            </NexusCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
            <NexusCard variant="cyan" className="p-6">
              <h3 className="text-xs font-bold font-orbitron text-white mb-6 flex items-center tracking-[0.2em] border-b border-white/5 pb-3">
                  <Database className="w-4 h-4 mr-2 text-nexus-cyan" />
                  BASE DE DATOS
              </h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                    <span className="text-white/40 font-orbitron uppercase tracking-widest">Conexiones</span>
                    <span className="text-nexus-cyan font-mono font-bold">24 ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-white/40 font-orbitron uppercase tracking-widest">QPS Neural</span>
                    <span className="text-white font-bold font-mono">1,247.90</span>
                  </div>
              </div>
            </NexusCard>

            <NexusCard variant="red" className="p-6">
              <h3 className="text-xs font-bold font-orbitron text-white mb-6 flex items-center tracking-[0.2em] border-b border-white/5 pb-3">
                  <Shield className="w-4 h-4 mr-2 text-rose-500" />
                  SEGURIDAD
              </h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                    <span className="text-white/40 font-orbitron uppercase tracking-widest">Bloqueos Threat</span>
                    <span className="text-rose-500 font-mono font-bold">142 INTRUSIONS</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-white/40 font-orbitron uppercase tracking-widest">Sesiones Activas</span>
                    <span className="text-emerald-400 font-bold font-mono">89 SECURE</span>
                  </div>
              </div>
            </NexusCard>

            <NexusCard variant="gold" className="p-6">
              <h3 className="text-xs font-bold font-orbitron text-white mb-6 flex items-center tracking-[0.2em] border-b border-white/5 pb-3">
                  <Zap className="w-4 h-4 mr-2 text-nexus-gold" />
                  RENDIMIENTO
              </h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                    <span className="text-white/40 font-orbitron uppercase tracking-widest">Latencia Global</span>
                    <span className="text-emerald-400 font-mono font-bold">124MS</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-white/40 font-orbitron uppercase tracking-widest">Neural Uptime</span>
                    <span className="text-nexus-gold font-bold font-mono">99.999%</span>
                  </div>
              </div>
            </NexusCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export { AdminDashboard };
