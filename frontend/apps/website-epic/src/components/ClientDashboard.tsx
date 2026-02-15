import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Target,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  Shield,
  Loader2,
} from 'lucide-react';
import { api, SystemHealth } from '../services/api';

const ClientDashboard = () => {
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

  return (
    <div className="min-h-screen bg-black/90 p-6 md:p-12 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] animate-gradient-x">
              BASE{' '}
              <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                PERSONAL
              </span>
            </h1>
            <p className="text-gray-400 mt-2 font-light tracking-wide">
              Panel de Control de Inteligencia Soberana
            </p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 text-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]"
            >
              <Star className="w-4 h-4" />
              <span className="font-orbitron text-sm tracking-wider">PRIORIDAD</span>
            </motion.button>
          </div>
        </motion.div>

        {/* System Status Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
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
          {health?.data?.version && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-orbitron">
              v{health.data.version}
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group hover:border-white/20 hover:bg-black/50 transition-all duration-300 relative overflow-hidden"
            >
              <div
                className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl ${stat.bg}`}
              />

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-orbitron mb-1">
                    {stat.title}
                  </p>
                  <div className="text-3xl font-bold text-white tracking-tight flex items-baseline">
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      decimals={stat.value % 1 !== 0 ? 1 : 0}
                      separator=","
                    />
                    <span className="text-sm ml-1 text-gray-500">{stat.suffix}</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-white/5 border border-white/5 ${stat.shadow} ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
            <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
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
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
              <Award className="w-5 h-5 text-orange-400" />
              TROFEOS ACTIVADOS
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                      : 'bg-white/5 border-white/5 opacity-60 grayscale'
                  }`}
                >
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="shrink-0">
                      {achievement.unlocked ? (
                        <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
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
                        className={`text-sm mt-0.5 ${achievement.unlocked ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-emerald-500/20">
                        <Star className="w-12 h-12 absolute -right-2 -top-2 opacity-10 rotate-12" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-colors duration-300 group">
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

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-colors duration-300">
            <h3 className="text-sm font-bold font-orbitron mb-4 flex items-center tracking-wider text-yellow-400">
              <Zap className="w-4 h-4 mr-2" />
              ACTIVIDAD EN VIVO
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-gray-400">Último acceso</span>
                <span className="text-white font-mono">Hace 2h</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-gray-400">Sync Status</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Nivel de Energía</span>
                <span className="text-yellow-400 font-bold">98%</span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-colors duration-300">
            <h3 className="text-sm font-bold font-orbitron mb-4 flex items-center tracking-wider text-purple-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              MÉTRICAS DE IMPACTO
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <p className="text-3xl font-bold text-white mb-1">+2</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Proyectos</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <p className="text-3xl font-bold text-white mb-1">+5%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Satisfacción</p>
              </div>
              <div className="col-span-2 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl p-3 border border-purple-500/20 flex items-center justify-between">
                <span className="text-xs text-purple-300">Crecimiento Total</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { ClientDashboard };
