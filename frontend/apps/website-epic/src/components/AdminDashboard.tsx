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
import { TiltCard } from './design-system/TiltCard';
import { GodModeText } from './design-system/GodModeText';

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

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between"
        >
            <div className="flex items-baseline gap-4">
                <GodModeText text="GOD" effect="none" className="text-4xl md:text-5xl font-bold" />
                <GodModeText
                text="ADMIN"
                effect="hologram"
                className="text-4xl md:text-5xl font-bold text-nexus-violet"
                />
            </div>

            <TiltCard className="rounded-xl">
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-nexus-violet/50 transition-all group">
                <Settings className="w-5 h-5 text-nexus-silver/60 group-hover:text-nexus-violet group-hover:rotate-90 transition-all duration-500" />
                </button>
            </TiltCard>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
            <TiltCard key={index} className="h-full" tiltMaxAngleX={4} tiltMaxAngleY={4}>
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group h-full">
                    <div className="flex items-center justify-between z-10 relative">
                        <div>
                        <p className="text-nexus-silver/50 text-xs font-orbitron tracking-widest uppercase mb-2">{stat.title}</p>
                        <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${stat.color} ${stat.shadow} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </TiltCard>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TiltCard className="h-full">
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-nexus-cyan" />
                    ESTADÍSTICAS DE USUARIOS
                </h2>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{fontSize: 12, fontFamily: 'Orbitron'}}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{fontSize: 12, fontFamily: 'Orbitron'}}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="usuarios" stroke="#22d3ee" strokeWidth={3} dot={{r: 4, fill: '#22d3ee'}} activeDot={{r: 6, strokeWidth: 0}} />
                        <Line type="monotone" dataKey="ingresos" stroke="#a855f7" strokeWidth={3} dot={{r: 4, fill: '#a855f7'}} activeDot={{r: 6, strokeWidth: 0}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </TiltCard>

            <TiltCard className="h-full">
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-nexus-violet" />
                    DISTRIBUCIÓN
                </h2>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            iconType="circle"
                        />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </TiltCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TiltCard className="h-full">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 h-full group hover:border-blue-400/30 transition-colors">
                <h3 className="text-sm font-bold font-orbitron text-white mb-4 flex items-center tracking-widest">
                    <Database className="w-4 h-4 mr-2 text-blue-400" />
                    BASE DE DATOS
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-nexus-silver/60">Conexiones</span>
                    <span className="text-green-400 font-mono">24 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-nexus-silver/60">QPS</span>
                    <span className="text-blue-400 font-bold font-mono">1,247</span>
                    </div>
                </div>
                </div>
            </TiltCard>

            <TiltCard className="h-full">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 h-full group hover:border-red-400/30 transition-colors">
                <h3 className="text-sm font-bold font-orbitron text-white mb-4 flex items-center tracking-widest">
                    <Shield className="w-4 h-4 mr-2 text-red-400" />
                    SEGURIDAD
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-nexus-silver/60">Bloqueos</span>
                    <span className="text-red-400 font-mono">142</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-nexus-silver/60">Sesiones</span>
                    <span className="text-green-400 font-bold font-mono">89 Safe</span>
                    </div>
                </div>
                </div>
            </TiltCard>

            <TiltCard className="h-full">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 h-full group hover:border-yellow-400/30 transition-colors">
                <h3 className="text-sm font-bold font-orbitron text-white mb-4 flex items-center tracking-widest">
                    <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                    RENDIMIENTO
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-nexus-silver/60">Latencia</span>
                    <span className="text-green-400 font-mono">124ms</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                    <span className="text-nexus-silver/60">Uptime</span>
                    <span className="text-green-400 font-bold font-mono">99.9%</span>
                    </div>
                </div>
                </div>
            </TiltCard>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboard };
