import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, DollarSign, Activity, Settings, Database, Shield, Zap } from 'lucide-react'

const AdminDashboard = () => {
  const stats = [
    { title: 'Usuarios Totales', value: '12,543', icon: Users, color: 'text-blue-400' },
    { title: 'Ingresos Mensuales', value: '$45,678', icon: DollarSign, color: 'text-green-400' },
    { title: 'Tasa de Crecimiento', value: '+23.5%', icon: TrendingUp, color: 'text-purple-400' },
    { title: 'Actividad del Sistema', value: '98.2%', icon: Activity, color: 'text-orange-400' },
  ]

  const chartData = [
    { name: 'Ene', usuarios: 4000, ingresos: 2400 },
    { name: 'Feb', usuarios: 3000, ingresos: 1398 },
    { name: 'Mar', usuarios: 2000, ingresos: 9800 },
    { name: 'Abr', usuarios: 2780, ingresos: 3908 },
    { name: 'May', usuarios: 1890, ingresos: 4800 },
    { name: 'Jun', usuarios: 2390, ingresos: 3800 },
  ]

  const pieData = [
    { name: 'Desktop', value: 400, color: '#8884d8' },
    { name: 'Mobile', value: 300, color: '#82ca9d' },
    { name: 'Tablet', value: 300, color: '#ffc658' },
  ]

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold text-white">🏆 Cuartel General Admin</h1>
        <div className="flex space-x-4">
          <button className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
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
          <h2 className="text-xl font-semibold text-white mb-4">📊 Estadísticas de Usuarios</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="usuarios" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">🎯 Distribución de Dispositivos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-400" />
            Base de Datos
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Conexiones Activas</span>
              <span className="text-green-400">24</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Queries por Segundo</span>
              <span className="text-blue-400">1,247</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Seguridad
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Intentos Bloqueados</span>
              <span className="text-red-400">142</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Sesiones Activas</span>
              <span className="text-green-400">89</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Rendimiento
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Response Time</span>
              <span className="text-green-400">124ms</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Uptime</span>
              <span className="text-green-400">99.9%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export { AdminDashboard }
