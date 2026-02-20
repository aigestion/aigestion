import { motion } from 'framer-motion';
import {
  AlertCircle,
  Award,
  Briefcase,
  CheckCircle,
  Loader2,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import React from 'react';
import CountUp from 'react-countup';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { SystemHealth, api } from '../services/api';
import { GodModeText } from './design-system/GodModeText';
import { SpotlightWrapper } from './design-system/SpotlightWrapper';
import { TiltCard } from './design-system/TiltCard';
import SubscriptionGuard from './guards/SubscriptionGuard';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<
    'checking' | 'connected' | 'error'
  >('checking');

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await api.getSystemHealth();
        setHealth(data);
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Proyectos Activos',
      value: 8,
      icon: Briefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400',
      shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
      suffix: '',
    },
    {
      title: 'Tasa de Éxito',
      value: 94.2,
      icon: Target,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400',
      shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
      suffix: '%',
    },
    {
      title: 'Clientes Satisfechos',
      value: 156,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400',
      shadow: 'shadow-[0_0_20px_rgba(192,132,252,0.3)]',
      suffix: '',
    },
    {
      title: 'Logros Conseguidos',
      value: 23,
      icon: Award,
      color: 'text-orange-400',
      bg: 'bg-orange-400',
      shadow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
      suffix: '',
    },
  ];

  const progressData = [
    { name: 'Ene', completado: 65, objetivo: 80 },
    { name: 'Feb', completado: 78, objetivo: 85 },
    { name: 'Mar', completado: 82, objetivo: 90 },
    { name: 'Abr', completado: 91, objetivo: 95 },
    { name: 'May', completado: 88, objetivo: 92 },
    { name: 'Jun', completado: 95, objetivo: 98 },
  ];

  const achievements = [
    { title: '🚀 Primer Proyecto', description: 'Completado con éxito', unlocked: true },
    { title: '⭐ Cliente Feliz', description: '5 estrellas de satisfacción', unlocked: true },
    { title: '🎯 Meta Mensual', description: 'Alcanzado el objetivo', unlocked: true },
    { title: '💎 Experto Nivel 5', description: 'En progreso...', unlocked: false },
  ];

  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  return (
    <SubscriptionGuard
      accessType="dashboard"
      showUpgradePrompt={true}
      onAccessDenied={validation => {
        console.log('[ClientDashboard] Access denied:', validation);
      }}
    >
      <SpotlightWrapper className="min-h-screen bg-nexus-obsidian text-white overflow-hidden relative">
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-50 max-w-7xl mx-auto mt-4 p-4 bg-nexus-cyan/10 border border-nexus-cyan/30 rounded-2xl flex items-center justify-between backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
              <span className="text-nexus-cyan font-orbitron text-[10px] tracking-[0.2em] font-bold">
                NEXUS GUEST ACCESS: ACTIVE
              </span>
            </div>
            <span className="text-nexus-silver/50 text-[9px] font-mono uppercase tracking-widest hidden md:block">
              Sovereign Protocol - Limited Clearance
            </span>
          </motion.div>
        )}
        <div className="absolute inset-0 z-0">
          <div className="grain-overlay opacity-20" />
          <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] bg-center opacity-10" />
        </div>

        <div className="p-6 md:p-12 relative z-10 max-w-7xl mx-auto space-y-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-baseline gap-4">
                <GodModeText
                  text="HOLA,"
                  effect="none"
                  className="text-4xl md:text-5xl font-bold text-white/80"
                />
                <GodModeText
                  text={user?.name?.toUpperCase() || 'VIAJERO'}
                  effect="hologram"
                  className="text-4xl md:text-5xl font-bold text-nexus-cyan"
                />
              </div>

              <p className="text-nexus-silver/60 mt-2 font-orbitron tracking-wide text-sm">
                Panel de Control de Inteligencia Soberana
              </p>
            </div>

            {/* System Status Indicator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 backdrop-blur-md transition-all duration-300 ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : connectionStatus === 'error'
                      ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                      : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                }`}
              >
                {connectionStatus === 'connected' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="font-orbitron">SYSTEM ONLINE</span>
                  </>
                ) : connectionStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-orbitron">OFFLINE</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="font-orbitron">CONNECTING...</span>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat: any, index: number) => (
              <TiltCard key={index} className="h-full" tiltMaxAngleX={4} tiltMaxAngleY={4}>
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group hover:border-white/20 hover:bg-black/50 transition-all duration-300 relative overflow-hidden h-full">
                  <div
                    className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl ${stat.bg}`}
                  />

                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-nexus-silver/60 text-xs uppercase tracking-wider font-orbitron mb-1">
                        {stat.title}
                      </p>
                      <div className="text-3xl font-bold text-white tracking-tight flex items-baseline">
                        <CountUp
                          end={stat.value}
                          duration={2.5}
                          decimals={stat.value % 1 !== 0 ? 1 : 0}
                          separator=","
                        />
                        <span className="text-sm ml-1 text-nexus-silver/40">{stat.suffix}</span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-white/5 border border-white/5 ${stat.shadow} ${stat.color} group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TiltCard className="h-full" tiltMaxAngleX={2} tiltMaxAngleY={2}>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-nexus-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
                <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-nexus-cyan" />
                  VELOCIDAD DE EJECUCIÓN
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <defs>
                        <linearGradient id="colorCompletado" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorObjetivo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 12, fontFamily: 'Orbitron' }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 12, fontFamily: 'Orbitron' }}
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
                          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                        }}
                        itemStyle={{ color: '#fff', fontFamily: 'sans-serif' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Area
                        type="monotone"
                        dataKey="completado"
                        stroke="#22d3ee"
                        fillOpacity={1}
                        fill="url(#colorCompletado)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="objetivo"
                        stroke="#a855f7"
                        fillOpacity={1}
                        fill="url(#colorObjetivo)"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="h-full" tiltMaxAngleX={2} tiltMaxAngleY={2}>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                  <Award className="w-5 h-5 text-orange-400" />
                  TROFEOS ACTIVADOS
                </h2>
                <div className="space-y-4">
                  {achievements.map((achievement: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group/achievement ${
                        achievement.unlocked
                          ? 'bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                          : 'bg-white/5 border-white/5 opacity-60 grayscale'
                      }`}
                    >
                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="shrink-0">
                          {achievement.unlocked ? (
                            <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20 group-hover/achievement:scale-110 transition-transform">
                              <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            </div>
                          ) : (
                            <div className="bg-white/5 p-2 rounded-full">
                              <Shield className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-bold font-orbitron text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}
                          >
                            {achievement.title}
                          </h3>
                          <p
                            className={`text-sm mt-0.5 ${achievement.unlocked ? 'text-nexus-silver/60' : 'text-gray-600'}`}
                          >
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <div className="text-emerald-500/20">
                            <Star className="w-12 h-12 absolute -right-2 -top-2 opacity-10 rotate-12 group-hover/achievement:rotate-45 transition-transform duration-700" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <TiltCard className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-colors duration-300 group h-full">
                <h3 className="text-sm font-bold font-orbitron mb-4 flex items-center tracking-wider text-emerald-400">
                  <Briefcase className="w-4 h-4 mr-2" />
                  PROYECTOS RECIENTES
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-white font-medium text-sm">Dashboard Analytics</p>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        DONE
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-full shadow-[0_0_10px_#34d399]" />
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-white font-medium text-sm">API Integration</p>
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                        75%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-400 h-full w-3/4 shadow-[0_0_10px_#60a5fa]" />
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-colors duration-300 h-full">
                <h3 className="text-sm font-bold font-orbitron mb-4 flex items-center tracking-wider text-yellow-400">
                  <Zap className="w-4 h-4 mr-2" />
                  ACTIVIDAD EN VIVO
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-nexus-silver/60">Último acceso</span>
                    <span className="text-white font-mono">Hace 2h</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-nexus-silver/60">Sync Status</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-nexus-silver/60">Nivel de Energía</span>
                    <span className="text-yellow-400 font-bold">98%</span>
                  </div>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-nexus-violet/30 transition-colors duration-300 h-full">
                <h3 className="text-sm font-bold font-orbitron mb-4 flex items-center tracking-wider text-nexus-violet">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  MÉTRICAS DE IMPACTO
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 group hover:border-nexus-violet/30 transition-colors">
                    <p className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                      +2
                    </p>
                    <p className="text-[10px] text-nexus-silver/60 uppercase tracking-wider">
                      Proyectos
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 group hover:border-nexus-violet/30 transition-colors">
                    <p className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                      +5%
                    </p>
                    <p className="text-[10px] text-nexus-silver/60 uppercase tracking-wider">
                      Satisfacción
                    </p>
                  </div>
                  <div className="col-span-2 bg-gradient-to-r from-nexus-violet/10 to-transparent rounded-xl p-3 border border-nexus-violet/20 flex items-center justify-between group cursor-pointer hover:bg-nexus-violet/20 transition-colors">
                    <span className="text-xs text-nexus-violet">Crecimiento Total</span>
                    <TrendingUp className="w-4 h-4 text-nexus-violet group-hover:rotate-45 transition-transform" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </SpotlightWrapper>
    </SubscriptionGuard>
  );
};

export { ClientDashboard };
