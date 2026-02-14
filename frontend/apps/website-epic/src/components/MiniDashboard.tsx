import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Users, Shield, Zap } from 'lucide-react';

interface MiniDashboardProps {
  onClose: () => void;
}

export const MiniDashboard: React.FC<MiniDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ revenue: 124500, users: 8420, security: 98 });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 100),
        users: prev.users + Math.floor(Math.random() * 5),
        security: Math.min(100, Math.max(90, prev.security + (Math.random() - 0.5))),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="w-full max-w-5xl bg-[#050505] rounded-3xl border border-nexus-cyan/30 shadow-[0_0_100px_rgba(0,245,255,0.2)] overflow-hidden font-sans relative">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/5 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-xs font-orbitron tracking-widest text-nexus-cyan">
              NEXUS_OS // DEMO_MODE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-white/5 border-r border-white/5 p-6 flex flex-col gap-2">
            {[
              { id: 'overview', icon: <TrendingUp className="w-4 h-4" />, label: 'Vista General' },
              { id: 'users', icon: <Users className="w-4 h-4" />, label: 'Usuarios Activos' },
              { id: 'security', icon: <Shield className="w-4 h-4" />, label: 'Seguridad' },
              { id: 'ai', icon: <Zap className="w-4 h-4" />, label: 'Daniela AI' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <div className="mt-auto">
              <div className="p-4 rounded-xl bg-gradient-to-br from-nexus-violet/20 to-purple-900/20 border border-nexus-violet/30">
                <h4 className="text-xs font-bold text-white mb-2">Plan Enterprise</h4>
                <p className="text-[10px] text-gray-400 mb-3">
                  Desbloquea el poder total de Nexus OS.
                </p>
                <button className="w-full py-2 bg-nexus-violet hover:bg-nexus-violet-glow text-white text-xs font-bold rounded-lg transition-all">
                  ACTUALIZAR AHORA
                </button>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 p-8 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.05),transparent_50%)]">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Ingresos en Tiempo Real
                </span>
                <div className="text-3xl font-orbitron font-bold text-white mt-2">
                  ${data.revenue.toLocaleString('es-ES')}
                </div>
                <span className="text-xs text-green-400 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" /> +12.5% vs ayer
                </span>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Usuarios Conectados
                </span>
                <div className="text-3xl font-orbitron font-bold text-white mt-2">
                  {data.users.toLocaleString('es-ES')}
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-nexus-cyan"
                    animate={{ width: `${(data.users / 10000) * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Integridad del Sistema
                </span>
                <div className="text-3xl font-orbitron font-bold text-white mt-2">
                  {data.security.toFixed(1)}%
                </div>
                <span className="text-xs text-nexus-cyan flex items-center gap-1 mt-2">
                  <Shield className="w-3 h-3" /> OPTIMAL
                </span>
              </div>
            </div>

            <div className="h-64 rounded-2xl bg-white/5 border border-white/10 p-6 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="text-center z-10">
                <h3 className="text-xl font-bold text-white mb-2">Mapa Neuronal Global</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Visualización 3D no disponible en modo demo.
                </p>
                <button className="px-6 py-3 border border-nexus-cyan text-nexus-cyan rounded-full hover:bg-nexus-cyan hover:text-black transition-all font-bold text-xs tracking-widest uppercase">
                  Desbloquear Full Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
