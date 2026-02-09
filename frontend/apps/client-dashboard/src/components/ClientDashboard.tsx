import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Target, TrendingUp, Users, Award, Briefcase, Star, Zap, CheckCircle, Activity, AlertCircle } from 'lucide-react'
import { api, SystemHealth } from '../services/api'

const ClientDashboard = () => {
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');

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
  ]

  const progressData = [
    { name: 'Ene', completado: 65, objetivo: 80 },
    { name: 'Feb', completado: 78, objetivo: 85 },
    { name: 'Mar', completado: 82, objetivo: 90 },
    { name: 'Abr', completado: 91, objetivo: 95 },
    { name: 'May', completado: 88, objetivo: 92 },
    { name: 'Jun', completado: 95, objetivo: 98 },
  ]

  const achievements = [
    { title: '🚀 Primer Proyecto', description: 'Completado con éxito', unlocked: true },
    { title: '⭐ Cliente Feliz', description: '5 estrellas de satisfacción', unlocked: true },
    { title: '🎯 Meta Mensual', description: 'Alcanzado el objetivo', unlocked: true },
    { title: '💎 Experto Nivel 5', description: 'En progreso...', unlocked: false },
  ]

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
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
          connectionStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
          connectionStatus === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        }`}>
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">📈 Progreso de Proyectos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="completado" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="objetivo" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">🏆 Logros y Trofeos</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  achievement.unlocked
                    ? 'bg-emerald-500/20 border-emerald-500/50'
                    : 'bg-gray-500/20 border-gray-500/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'opacity-50'}`}>
                    {achievement.unlocked ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.unlocked ? 'text-white/70' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-emerald-400" />
            Proyectos Recientes
          </h3>
          <div className="space-y-2">
            <div className="p-2 bg-emerald-500/20 rounded border border-emerald-500/50">
              <p className="text-white font-medium">Dashboard Analytics</p>
              <p className="text-white/70 text-sm">Completado • 100%</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded border border-blue-500/50">
              <p className="text-white font-medium">API Integration</p>
              <p className="text-white/70 text-sm">En progreso • 75%</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Actividad Reciente
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Último login</span>
              <span className="text-emerald-400">Hace 2h</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Proyectos actualizados</span>
              <span className="text-blue-400">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Métricas de Crecimiento
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Proyectos este mes</span>
              <span className="text-emerald-400">+2</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Satisfacción cliente</span>
              <span className="text-purple-400">+5%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export { ClientDashboard }
