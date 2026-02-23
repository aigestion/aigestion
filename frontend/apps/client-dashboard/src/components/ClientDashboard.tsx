import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Target,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  Zap,
  CheckCircle,
  Activity,
  Mic,
  Home,
  Bell,
  Wallet,
  PhoneCall,
} from 'lucide-react';
import { api, SystemHealth } from '../services/api';
import { SovereignTreasury } from './SovereignTreasury';
import { PortfolioWidget } from './PortfolioWidget';
import { StrategyWidget } from './StrategyWidget';
import { AlertsWidget } from './AlertsWidget';
import { SovereignMap } from './SovereignMap';
import { SystemHealthWidget } from './SystemHealthWidget';
import { SovereignPersonaModal, Persona } from './SovereignPersonaModal';
import { PersonaMarketplace } from './PersonaMarketplace';
import { SIMAOverlay } from './SIMAOverlay';
import { ShoppingCart, Eye } from 'lucide-react';
import { PerceptionGrid } from './PerceptionGrid';

// ──────────────────────────────────────────────────────
// Hook: detect device layout (mobile + landscape)
// ──────────────────────────────────────────────────────
function useDeviceLayout() {
  const isMobileDevice =
    typeof globalThis.window !== 'undefined'
      ? globalThis.matchMedia('(pointer: coarse)').matches || globalThis.innerWidth < 768
      : false;

  const [layout, setLayout] = React.useState({
    isMobile: isMobileDevice,
    isLandscape:
      typeof globalThis.window !== 'undefined'
        ? globalThis.matchMedia('(orientation: landscape)').matches
        : false,
  });

  React.useEffect(() => {
    const update = () => {
      const coarse = globalThis.matchMedia('(pointer: coarse)').matches;
      const narrow = globalThis.innerWidth < 768;
      const landscape = globalThis.matchMedia('(orientation: landscape)').matches;
      // A touch device in landscape (e.g. Pixel 8 → 915px) stays mobile
      const mobile = narrow || (coarse && globalThis.innerHeight < 500);
      setLayout({ isMobile: mobile, isLandscape: landscape });
    };

    globalThis.addEventListener('resize', update);
    const mql = globalThis.matchMedia('(orientation: landscape)');
    mql.addEventListener('change', update);

    // Run once to catch initial state correctly
    update();

    return () => {
      globalThis.removeEventListener('resize', update);
      mql.removeEventListener('change', update);
    };
  }, []);

  return layout;
}

// ──────────────────────────────────────────────────────
// Mobile Navigation (Bottom bar + Landscape sidebar rail)
// ──────────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'home', icon: Home, label: 'Inicio' },
  { id: 'portfolio', icon: Wallet, label: 'Cartera' },
  { id: 'marketplace', icon: ShoppingCart, label: 'Mercado' },
  { id: 'perception', icon: Eye, label: 'Percepción' },
  { id: 'alerts', icon: Bell, label: 'Alertas' },
  { id: 'actions', icon: Zap, label: 'Acciones' },
];

const MobileNav = ({
  activeTab,
  onTabChange,
  landscape = false,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  landscape?: boolean;
}) => {
  // 🌌 Landscape → vertical sidebar rail
  if (landscape) {
    return (
      <div
        className="fixed left-0 top-0 bottom-0 z-40 w-14 bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col items-center justify-center gap-4"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'text-purple-400 bg-purple-500/20'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[8px] font-medium mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Portrait → bottom bar with safe area insets
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 h-16">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
              activeTab === tab.id ? 'text-purple-400' : 'text-white/40 hover:text-white/70'
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
};;

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
  const { isMobile, isLandscape } = useDeviceLayout();
  const mobileLandscape = isMobile && isLandscape;
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<
    'checking' | 'connected' | 'error'
  >('checking');
  const [activeTab, setActiveTab] = React.useState('home');
  const [voiceModalOpen, setVoiceModalOpen] = React.useState(false);
  const [activePersona, setActivePersona] = React.useState<Persona>({
    id: 'daniela',
    name: 'Daniela Nexus',
    description: 'Voz oficial del Nexus',
    color: 'from-purple-500 to-indigo-600',
  });

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

  const chartHeight = mobileLandscape ? 180 : isMobile ? 240 : 400;

  // Mobile tab content
  const renderMobileTab = () => {
    switch (activeTab) {
      case 'portfolio':
        return (
          <div className="h-[360px]">
            <PortfolioWidget />
          </div>
        );
      case 'marketplace':
        return (
          <PersonaMarketplace
            activePersonaId={activePersona.id}
            onSelectPersona={p => setActivePersona(p)}
          />
        );
      case 'perception':
        return (
          <div className="h-[450px]">
            <PerceptionGrid />
          </div>
        );
      case 'alerts':
        return (
          <div className="h-[360px]">
            <AlertsWidget />
          </div>
        );
      case 'actions':
        return (
          <div className="h-[360px] grid grid-cols-2 gap-3">
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="flex flex-col items-center justify-center gap-2 bg-purple-600/30 border border-purple-500/40 rounded-xl p-4 active:scale-95 transition-transform"
            >
              <Mic className="w-8 h-8 text-purple-400" />
              <span className="text-xs text-white font-medium">
                Hablar con {activePersona.name.split(' ')[0]}
              </span>
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
            {/* Stats grid — adaptive: 2 portrait / 4 landscape / 4 desktop */}
            <div
              className={`grid gap-3 ${
                mobileLandscape
                  ? 'grid-cols-4'
                  : isMobile
                    ? 'grid-cols-2'
                    : 'grid-cols-2 md:grid-cols-4'
              }`}
            >
              {stats.map(stat => (
                <StatCard key={stat.title} {...stat} index={stats.indexOf(stat)} />
              ))}
            </div>

            {/* Sovereign Map Widget (Tactical Radar) */}
            <div className="h-[200px] w-full">
              <SovereignMap />
            </div>

            {/* System Health Widget */}
            <div className="h-[260px] w-full">
              <SystemHealthWidget />
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
                    contentStyle={{
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completado"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="objetivo"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Strategy and Treasury — side-by-side in landscape, stacked portrait */}
            <div
              className={`grid gap-3 ${mobileLandscape ? 'grid-cols-2' : isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}
            >
              <div style={{ height: chartHeight }}>
                <StrategyWidget />
              </div>
              <div style={{ height: chartHeight }}>
                <SovereignTreasury />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={`relative ${isMobile ? (mobileLandscape ? 'pl-16 pb-2' : 'pb-20') : ''}`}
      style={{
        paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined,
        paddingLeft: mobileLandscape ? 'calc(3.5rem + env(safe-area-inset-left))' : undefined,
      }}
    >
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
            <div
              className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : connectionStatus === 'error'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              <Activity
                className={`w-2.5 h-2.5 ${connectionStatus === 'checking' ? 'animate-pulse' : ''}`}
              />
              <span>
                {connectionStatus === 'connected'
                  ? 'En Línea'
                  : connectionStatus === 'error'
                    ? 'Fuera de Línea'
                    : 'Conectando...'}
              </span>
              {health?.data?.version && <span className="opacity-50">v{health.data.version}</span>}
            </div>
          </div>
          {!isMobile && (
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-xl text-white text-sm transition-all shadow-lg shadow-purple-900/20"
            >
              <Mic className="w-4 h-4" />
              {activePersona.name}
            </button>
          )}
        </motion.div>

        {/* Content */}
        {isMobile ? (
          renderMobileTab()
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(stat => (
                <StatCard key={stat.title} {...stat} index={stats.indexOf(stat)} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style={{ height: chartHeight }}>
                <PortfolioWidget />
              </div>
              <div style={{ height: chartHeight }}>
                <StrategyWidget />
              </div>
              <div style={{ height: chartHeight }}>
                <SovereignTreasury />
              </div>
              <div style={{ height: chartHeight }}>
                <SovereignMap />
              </div>
              <div style={{ height: chartHeight }}>
                <AlertsWidget />
              </div>
              <div style={{ height: chartHeight }}>
                <PerceptionGrid />
              </div>
              <div className="col-span-1 md:col-span-2">
                <PersonaMarketplace
                  activePersonaId={activePersona.id}
                  onSelectPersona={p => setActivePersona(p)}
                />
              </div>
              <div style={{ height: chartHeight }}>
                <SystemHealthWidget />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} landscape={mobileLandscape} />
      )}

      {/* Floating Daniela Voice Button (mobile) */}
      {isMobile && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          onClick={() => setVoiceModalOpen(true)}
          className={`fixed z-50 rounded-full bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/50 flex items-center justify-center active:scale-90 transition-transform ${
            mobileLandscape ? 'bottom-4 right-4 w-11 h-11' : 'bottom-20 right-4 w-14 h-14'
          }`}
          style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
            marginBottom: mobileLandscape ? undefined : 'env(safe-area-inset-bottom)',
          }}
        >
          <Mic className={mobileLandscape ? 'w-5 h-5 text-white' : 'w-6 h-6 text-white'} />
        </motion.button>
      )}

      {/* SIMA Sovereign Overlay */}
      <SIMAOverlay
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        activePersona={activePersona}
      />
    </div>
  );
};

export { ClientDashboard };
