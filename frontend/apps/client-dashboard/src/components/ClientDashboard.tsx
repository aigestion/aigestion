import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Activity,
  AlertCircle,
} from 'lucide-react';
import { api, SystemHealth } from '../services/api';
import { SovereignTreasury } from './SovereignTreasury';
import { PortfolioWidget } from './PortfolioWidget';
import { StrategyWidget } from './StrategyWidget';
import { AlertsWidget } from './AlertsWidget';

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
    // Poll every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  const stats = [
    { title: 'Proyectos Activos', value: '8', icon: Briefcase, color: 'text-emerald-400' },
    { title: 'Tasa de Éxito', value: '94.2%', icon: Target, color: 'text-blue-400' },
    { title: 'Clientes Satisfechos', value: '156', icon: Users, color: 'text-purple-400' },
    { title: 'Logros Conseguidos', value: '23', icon: Award, color: 'text-orange-400' },
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
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold text-white">💎 Base Personal</h1>
        <div className="flex space-x-4">
          <button className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
            <Star className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>

      {/* System Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 mb-4"
      >
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
            connectionStatus === 'connected'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : connectionStatus === 'error'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}
        >
          {connectionStatus === 'connected' ? (
            <>
              <Activity className="w-3 h-3" />
              <span>System Online</span>
            </>
          ) : connectionStatus === 'error' ? (
            <>
              <AlertCircle className="w-3 h-3" />
              <span>System Offline</span>
            </>
          ) : (
            <>
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Connecting...</span>
            </>
          )}
        </div>
        {health?.data?.version && (
          <span className="text-xs text-white/30">v{health.data.version}</span>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="h-[400px]"
        >
          <PortfolioWidget />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="h-[400px]"
        >
          <StrategyWidget />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="h-[400px]"
        >
          <SovereignTreasury />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="h-[400px]"
        >
          <AlertsWidget />
        </motion.div>
      </div>
    </div>
  );
};

export { ClientDashboard };
