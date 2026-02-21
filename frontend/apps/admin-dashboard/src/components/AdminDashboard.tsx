import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Settings,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Shield,
  Zap,
  Map as MapIcon,
  Globe,
  Database as WarehouseIcon,
  Brain,
  Truck,
  Layout,
  Briefcase,
  ChevronRight,
  PieChart as PieChartIcon,
  Wallet,
  Landmark,
} from 'lucide-react';
import { api, SystemHealth } from '../services/api';
import { PartnerMetrics } from './PartnerMetrics';
import { SovereignJudgeLog } from './SovereignJudgeLog';
import { SovereignHealthRadar } from './SovereignHealthRadar';
import { SwarmVisualizer } from './dashboard/SwarmVisualizer';
import { VoiceVisualizer } from './voice/VoiceVisualizer';
import { useEcosystem } from '../providers/EcosystemProvider';
import { EcosystemType } from '../config/EcosystemRegistry';
import ParallaxWrapper from './ParallaxWrapper';

const AdminDashboard = () => {
  const { profile, setEcosystem } = useEcosystem();
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [treasury, setTreasury] = React.useState<{ status: string; currentBurn: number; reserveTarget: number } | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await api.getSystemHealth();
        setHealth(data);
        setConnectionStatus('connected');
        // Simulated treasury fetch (would be api.getSovereignHealth)
        setTreasury({ status: 'STABLE', currentBurn: 12450, reserveTarget: 50000 });
      } catch (error) {
        setConnectionStatus('error');
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: 'Usuarios Totales', value: '12,543', icon: Users, color: profile.primaryColor },
    { title: 'Ingresos Mensuales', value: '$45,678', icon: DollarSign, color: profile.secondaryColor },
    { title: 'Tasa de Crecimiento', value: '+23.5%', icon: TrendingUp, color: profile.accentColor },
    { title: 'Actividad del Sistema', value: '98.2%', icon: Activity, color: profile.primaryColor },
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
    { name: 'Desktop', value: 400, color: profile.primaryColor },
    { name: 'Mobile', value: 300, color: profile.secondaryColor },
    { name: 'Tablet', value: 300, color: profile.accentColor },
  ];

  const getProfileIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck': return <Truck className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      case 'Shield': return <Shield className="w-8 h-8" />;
      case 'Brain': return <Brain className="w-8 h-8" />;
      default: return <Layout className="w-8 h-8" />;
    }
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Dynamic Ecosystem Switcher - The "Sovereign Switch" */}
      <motion.div
        className="flex space-x-2 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit backdrop-blur-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {(['AI_AGENCY', 'LOGISTICS', 'SAAS', 'LEGAL'] as EcosystemType[]).map(type => (
          <button
            key={type}
            onClick={() => setEcosystem(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              profile.id === type
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 shadow-2xl backdrop-blur-md">
            {getProfileIcon(profile.branding.logo)}
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none text-white">
              <span style={{ color: profile.primaryColor }}>{profile.branding.title}</span> COMANDO
            </h1>
            <p className="text-white/40 mt-2 font-medium tracking-[0.3em] text-[10px] uppercase italic">
              {profile.branding.subtitle} — v2.5.0
            </p>
          </div>
        </div>

        <SovereignHealthRadar />

        {/* Tactical Radar (Maps) */}
        <div className="glass-card overflow-hidden relative min-h-[100px] flex items-center px-6">
          <div className="p-px bg-linear-to-r from-white/20 to-transparent rounded-xl">
            <div className="bg-slate-950/80 px-4 py-2 rounded-[11px] flex items-center space-x-2 backdrop-blur-md">
              <Shield className="w-4 h-4" style={{ color: profile.primaryColor }} />
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                Modo Dios Activo
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Status - Quantum Pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2 h-2 rounded-full animate-ping absolute ${
                connectionStatus === 'connected' ? 'bg-cyan-500' : 'bg-red-500'
              }`}
            ></span>
            <span
              className={`w-2 h-2 rounded-full relative z-10 ${
                connectionStatus === 'connected' ? 'bg-cyan-400' : 'bg-red-400'
              }`}
            ></span>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              connectionStatus === 'connected' ? 'text-cyan-400' : 'text-red-400'
            }`}
          >
            {connectionStatus === 'connected' ? 'Enlace Sincronizado' : 'Uplink Fallido'}
          </span>
        </div>

        <div className="hidden md:flex space-x-2">
          <div className="px-3 py-1 bg-white/5 rounded-md border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
            DRX_LATENCY: 8ms
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-md border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
            ECO_DENSITY: 100%
          </div>
        </div>
      </motion.div>

      {/* Sovereign Treasury Command Center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 p-8 rounded-4xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Landmark className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                  Reserva Soberana
                </h2>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                  Gestión de Capital Autónoma
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-emerald-400">
                {treasury?.status || 'STABLE'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  Liquidez Disponible
                </span>
                <p className="text-3xl font-black text-white">$142,500</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  Tasa de Consumo 30D
                </span>
                <p className="text-3xl font-black text-white">
                  ${treasury?.currentBurn?.toLocaleString() || '12,450'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  Crecimiento de TVL
                </span>
                <p className="text-3xl font-black text-emerald-400">+12.4%</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-white/40 uppercase">
                  Reserve Progress to Target ($50k)
                </span>
                <span className="text-xs font-black text-white">
                  {(((treasury?.currentBurn || 0) / 50000) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((treasury?.currentBurn || 0) / 50000) * 100}%` }}
                  className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-4xl bg-white/2 border border-white/5 backdrop-blur-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-white tracking-tighter uppercase">
                Estratega de Rendimiento
              </h2>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase">USDC/ETH LP</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Recolección Activa: 14.2% APR
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 opacity-50">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase">SOL Staking</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Analizando Oportunidad...
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full py-4 mt-8 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
            Rebalancear Cartera
          </button>
        </div>
      </motion.div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* VISUALIZERS */}
          <div className="grid grid-cols-1 gap-6">
            <SwarmVisualizer />
            <VoiceVisualizer />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-4xl bg-white/2 border border-white/5 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-white flex items-center tracking-tighter">
              <Shield className="w-5 h-5 mr-3" style={{ color: profile.accentColor }} />
              SEGMENTOS DEL ECOSISTEMA
            </h2>
            <span className="text-[9px] text-white/20 font-mono font-bold uppercase tracking-widest">
              SVRGN_CORE_V5
            </span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={15}
                dataKey="value"
                cornerRadius={10}
              >
                {pieData.map(entry => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: 'none',
                  backdropFilter: 'blur(20px)',
                }}
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="p-8 rounded-4xl bg-white/2 border border-white/5 hover:border-white/10 transition-all backdrop-blur-md group">
          <h3 className="text-sm font-black text-white/40 mb-8 flex items-center tracking-[0.2em] uppercase">
            <WarehouseIcon className="w-4 h-4 mr-3" style={{ color: profile.primaryColor }} />
            Núcleo de Datos
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-white">2.4 TB</span>
              <span className="text-[10px] font-bold text-white/30 uppercase">Capacidad Usada</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-3/4" style={{ backgroundColor: profile.primaryColor }} />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-4xl bg-white/2 border border-white/5 hover:border-white/10 transition-all backdrop-blur-md group">
          <h3 className="text-sm font-black text-white/40 mb-8 flex items-center tracking-[0.2em] uppercase">
            <Shield className="w-4 h-4 mr-3" style={{ color: profile.secondaryColor }} />
            Seguridad
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">ÓPTIMO</span>
            <Zap className="w-6 h-6 animate-pulse" style={{ color: profile.accentColor }} />
          </div>
          <p className="mt-4 text-[10px] text-white/20 font-bold uppercase tracking-widest">
            Cortafuegos Neural Sincronizado
          </p>
        </div>

        <div className="p-8 rounded-4xl bg-white/2 border border-white/5 hover:border-white/10 transition-all backdrop-blur-md group">
          <h3 className="text-sm font-black text-white/40 mb-8 flex items-center tracking-[0.2em] uppercase">
            <Globe className="w-4 h-4 mr-3" style={{ color: profile.accentColor }} />
            Red
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex space-x-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`pulse-${i}`}
                    className="grow h-4 rounded-sm bg-white/10"
                    style={{ opacity: Math.random() + 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export { AdminDashboard };
