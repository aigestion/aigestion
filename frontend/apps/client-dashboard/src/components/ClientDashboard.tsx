import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Target, TrendingUp, Users, Award,
  Briefcase, Star, Zap, CheckCircle,
  Activity, AlertCircle, Mic, Home,
  Bell, Wallet, PhoneCall,
} from 'lucide-react';
import { api, SystemHealth } from '../services/api';
import { SovereignTreasury } from './SovereignTreasury';
import { PortfolioWidget } from './PortfolioWidget';
import { StrategyWidget } from './StrategyWidget';
import { AlertsWidget } from './AlertsWidget';
import { DanielaVoiceModal } from './DanielaVoiceModal';

// ──────────────────────────────────────────────────────
// Hook: detect mobile screen
// ──────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

// ──────────────────────────────────────────────────────
// Mobile Bottom Navigation
// ──────────────────────────────────────────────────────
const MobileNav = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'portfolio', icon: Wallet, label: 'Cartera' },
    { id: 'alerts', icon: Bell, label: 'Alertas' },
    { id: 'actions', icon: Zap, label: 'Acciones' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
              activeTab === tab.id
                ? 'text-purple-400'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 w-8 h-0.5 bg-purple-400 rounded-full"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────
// Stat Card (mobile-optimized)
// ──────────────────────────────────────────────────────
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  index,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
  index: number;
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.08 }}
    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 active:scale-95 transition-transform"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/60 text-xs mb-1">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-2 rounded-lg bg-white/5`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </motion.div>
);

// ──────────────────────────────────────────────────────
// Main Dashboard
// ──────────────────────────────────────────────────────
const ClientDashboard = () => {
  const isMobile = useIsMobile();
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<
    'checking' | 'connected' | 'error'
  >('checking');
  const [activeTab, setActiveTab] = React.useState('home');
  const [voiceModalOpen, setVoiceModalOpen] = React.useState(false);

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await api.getSystemHealth();
        setHealth(data);
        setConnectionStatus('connected');
      } catch {
        setConnectionStatus('error');
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: 'Proyectos Activos', value: '8', icon: Briefcase, color: 'text-emerald-400' },
    { title: 'Tasa de Éxito', value: '94.2%', icon: Target, color: 'text-blue-400' },
    { title: 'Clientes', value: '156', icon: Users, color: 'text-purple-400' },
    { title: 'Logros', value: '23', icon: Award, color: 'text-orange-400' },
  ];

  const progressData = [
    { name: 'Ene', completado: 65, objetivo: 80 },
    { name: 'Feb', completado: 78, objetivo: 85 },
    { name: 'Mar', completado: 82, objetivo: 90 },
    { name: 'Abr', completado: 91, objetivo: 95 },
    { name: 'May', completado: 88, objetivo: 92 },
    { name: 'Jun', completado: 95, objetivo: 98 },
  ];

  const chartHeight = isMobile ? 240 : 400;

  // Mobile tab content
  const renderMobileTab = () => {
    switch (activeTab) {
      case 'portfolio':
        return <div className="h-[360px]"><PortfolioWidget /></div>;
      case 'alerts':
        return <div className="h-[360px]"><AlertsWidget /></div>;
      case 'actions':
        return (
          <div className="h-[360px] grid grid-cols-2 gap-3">
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="flex flex-col items-center justify-center gap-2 bg-purple-600/30 border border-purple-500/40 rounded-xl p-4 active:scale-95 transition-transform"
            >
              <Mic className="w-8 h-8 text-purple-400" />
              <span className="text-xs text-white font-medium">Hablar con Daniela</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-emerald-600/30 border border-emerald-500/40 rounded-xl p-4 active:scale-95 transition-transform">
              <PhoneCall className="w-8 h-8 text-emerald-400" />
              <span className="text-xs text-white font-medium">Llamar Contacto</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-blue-600/30 border border-blue-500/40 rounded-xl p-4 active:scale-95 transition-transform">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-white font-medium">Ver Mercados</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-orange-600/30 border border-orange-500/40 rounded-xl p-4 active:scale-95 transition-transform">
              <CheckCircle className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-white font-medium">Mis Tareas</span>
            </button>
          </div>
        );
      default: // 'home'
        return (
          <>
            {/* Stats grid — 2 cols on mobile */}
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat} index={i} />
              ))}
            </div>

            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
            >
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
                📈 Progreso vs Objetivo
              </p>
              <ResponsiveContainer width="100%" height={chartHeight * 0.6}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Line type="monotone" dataKey="completado" stroke="#a855f7" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="objetivo" stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Strategy and Treasury — stacked on mobile */}
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div style={{ height: chartHeight }}><StrategyWidget /></div>
              <div style={{ height: chartHeight }}><SovereignTreasury /></div>
            </div>
          </>
        );
    }
  };

  return (
    <div className={`relative ${isMobile ? 'pb-20' : ''}`}>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className={`font-bold text-white ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
              💎 {isMobile ? 'NEXUS' : 'Base Personal'}
            </h1>
            {/* Connection status pill */}
            <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              connectionStatus === 'connected'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : connectionStatus === 'error'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              <Activity className={`w-2.5 h-2.5 ${connectionStatus === 'checking' ? 'animate-pulse' : ''}`} />
              <span>{connectionStatus === 'connected' ? 'En Línea' : connectionStatus === 'error' ? 'Fuera de Línea' : 'Conectando...'}</span>
              {health?.data?.version && <span className="opacity-50">v{health.data.version}</span>}
            </div>
          </div>
          {!isMobile && (
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-xl text-white text-sm transition-all"
            >
              <Mic className="w-4 h-4" />
              Daniela
            </button>
          )}
        </motion.div>

        {/* Content */}
        {isMobile ? renderMobileTab() : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => <StatCard key={i} {...stat} index={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style={{ height: chartHeight }}><PortfolioWidget /></div>
              <div style={{ height: chartHeight }}><StrategyWidget /></div>
              <div style={{ height: chartHeight }}><SovereignTreasury /></div>
              <div style={{ height: chartHeight }}><AlertsWidget /></div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />}

      {/* Floating Daniela Voice Button (mobile) */}
      {isMobile && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          onClick={() => setVoiceModalOpen(true)}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/50 flex items-center justify-center active:scale-90 transition-transform"
          style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
        >
          <Mic className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Daniela Voice Modal */}
      <DanielaVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  );
};

export { ClientDashboard };
