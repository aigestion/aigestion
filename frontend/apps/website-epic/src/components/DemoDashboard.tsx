import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Brain,
  Shield,
  Zap,
  Terminal,
  Layout,
  Server,
  Cpu,
  Lock,
  Globe,
  Database,
  BarChart3,
} from 'lucide-react';
import { api, SystemHealth } from '../services/api';

const DemoDashboard = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>(
    'checking'
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    cpu: 24,
    ram: 42,
    net: 120,
    daniela: 98,
  });

  useEffect(() => {
    const controller = new AbortController();

    const checkConnection = async () => {
      try {
        const data = await api.getSystemHealth();
        setHealth(data);
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
      }
    };

    const fetchAnalytics = async () => {
      try {
        const analytics = await api.getAnalyticsOverview();
        // api may throw or return 429 — guard silently
        if (!analytics) return;
        if (analytics.status === 429) {
          console.warn('[DemoDashboard] Analytics rate limited.');
          return;
        }
        if (analytics.success && analytics.data) {
          // Map backend metrics to local metrics
          // Fallback to random if expected fields are missing, but prioritize real data
          setMetrics(prev => ({
            cpu: analytics.data.cpuUsage || analytics.data.cpu || prev.cpu,
            ram: analytics.data.memoryUsage || analytics.data.memory || prev.ram,
            net: analytics.data.networkTraffic || analytics.data.traffic || prev.net,
            daniela: analytics.data.danielaEfficiency || analytics.data.efficiency || prev.daniela,
          }));
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.warn('Silent analytics fetch error:', error);
      }
    };

    checkConnection();
    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 60000); // Fetch real data every 60s (rate-limit friendly)

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const features = [
    { id: 'overview', name: 'Control Central', icon: Layout, color: 'text-nexus-cyan' },
    { id: 'daniela', name: 'Núcleo Daniela', icon: Brain, color: 'text-nexus-violet' },
    { id: 'infra', name: 'Infraestructura', icon: Server, color: 'text-nexus-gold' },
    { id: 'security', name: 'Soberanía', icon: Shield, color: 'text-emerald-400' },
  ];

  return (
    <section
      id="demo-dashboard"
      className="relative py-32 bg-nexus-obsidian overflow-hidden border-y border-white/5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.05)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
          <div>
            <span className="text-nexus-cyan text-[10px] font-mono tracking-[0.5em] uppercase mb-4 block animate-pulse">
              Ecosistema Visionario AIGestion.net
            </span>
            <h2 className="text-responsive-h1 font-black text-white mb-6 uppercase tracking-tight">
              Sovereign <span className="text-nexus-cyan">Workspace</span>
            </h2>
            <p className="text-nexus-silver/80 max-w-xl text-lg font-light leading-relaxed">
              Experimente el centro neurálgico del ecosistema AIGestion.net. Una arquitectura de orquestación diseñada para la soberanía absoluta y el control total de su infraestructura.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-right shadow-2xl">
              <div className="text-[10px] text-nexus-silver/40 uppercase tracking-widest mb-1">
                Estado del Sistema
              </div>
              <div className="flex items-center gap-2 text-nexus-cyan font-bold">
                <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_10px_rgba(0,245,255,1)]" />
                SÍNCRONO
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 min-h-[600px]">
          {/* Navigation Sidebar Simulation */}
          <div className="lg:col-span-3 space-y-4">
            {features.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-500 border ${
                  activeTab === f.id
                    ? 'bg-white/10 border-nexus-cyan/50 text-white shadow-[0_0_20px_rgba(0,245,255,0.1)]'
                    : 'bg-transparent border-white/5 text-nexus-silver/40 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <f.icon className={`w-5 h-5 ${activeTab === f.id ? f.color : ''}`} />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{f.name}</span>
              </button>
            ))}

            <div className="mt-12 p-6 bg-linear-to-br from-nexus-violet/20 to-nexus-cyan/20 rounded-2xl border border-white/10 shadow-inner">
              <div className="flex items-center gap-2 mb-4 text-white text-[10px] font-bold tracking-widest">
                <span className="text-nexus-gold animate-bounce">
                  <Zap size={16} />
                </span>
                IMPULSADO POR DANIELA
              </div>

              <p className="text-[10px] text-nexus-silver/60 leading-relaxed uppercase font-bold">
                Optimización activa al 99.8%. Todos los nodos operando bajo protocolo de soberanía.
              </p>
            </div>
          </div>

          {/* Main Dashboard Canvas */}
          <div className="lg:col-span-9">
            <div className="relative w-full h-full bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Header Bar */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-6">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/40" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                    <div className="w-2 h-2 rounded-full bg-green-500/40" />
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="text-[10px] text-nexus-silver/40 font-mono tracking-widest">
                    SESSION_ID: NEXUS-449-ALPHA
                  </div>
                </div>
                <div className="flex gap-4">
                  <Terminal className="w-4 h-4 text-nexus-silver/20 hover:text-nexus-cyan cursor-pointer transition-colors" />
                  <Lock className="w-4 h-4 text-nexus-silver/20 hover:text-nexus-cyan cursor-pointer transition-colors" />
                </div>
              </div>

              {/* Dynamic Content Area */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      <StatCard
                        label="Carga de CPU"
                        value={`${metrics.cpu}%`}
                        icon={Cpu}
                        color="text-nexus-cyan"
                      />
                      <StatCard
                        label="Memoria Buffer"
                        value={`${metrics.ram}%`}
                        icon={Database}
                        color="text-nexus-violet"
                      />
                      <StatCard
                        label="Eficiencia Daniela"
                        value={`${metrics.daniela}%`}
                        icon={Brain}
                        color="text-nexus-gold"
                      />

                      <div className="md:col-span-3 bg-white/5 rounded-2xl p-8 border border-white/5 mt-4">
                        <div className="flex items-center justify-between mb-8">
                          <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-nexus-silver/60">
                            Flujo de Tráfico Neural
                          </h4>
                          <Globe className="w-4 h-4 text-nexus-cyan animate-pulse" />
                        </div>
                        <div className="h-48 flex items-end gap-2 px-4">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.random() * 80 + 20}%` }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: i * 0.05,
                              }}
                              className="flex-1 bg-linear-to-t from-nexus-cyan/40 to-nexus-violet/40 rounded-t-sm"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'daniela' && (
                    <motion.div
                      key="daniela"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-nexus-violet/5 rounded-2xl p-8 border border-nexus-violet/20 flex gap-6">
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-nexus-violet to-nexus-cyan p-px">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                            <img
                              src="https://api.dicebear.com/7.x/bottts/svg?seed=Daniela"
                              alt="Daniela"
                              className="w-10 h-10"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] text-nexus-violet font-bold tracking-[0.2em] mb-2">
                            DANIELA COGNITIVE v2.4
                          </div>
                          <p className="text-white text-lg font-light leading-relaxed italic">
                            "Infraestructura optimizada. He reducido la latencia en un 12% mediante
                            el re-ruteo predictivo de paquetes. ¿Desea ejecutar el reporte de
                            rentabilidad trimestral?"
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <ActionCard label="Generar Reporte ROI" icon={BarChart3} />
                        <ActionCard label="Optimizar Carga" icon={Zap} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white/3 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] text-nexus-silver/40 font-bold tracking-widest uppercase">
        {label}
      </span>
      <Icon className={`w-4 h-4 ${color} opacity-40 group-hover:opacity-100 transition-opacity`} />
    </div>
    <div className="text-3xl font-black text-white">{value}</div>
  </div>
);

const ActionCard = ({ label, icon: Icon }: any) => (
  <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 cursor-pointer transition-all">
    <Icon className="w-5 h-5 text-nexus-cyan" />
    <span className="text-[10px] font-bold tracking-widest text-white uppercase">{label}</span>
  </div>
);

export { DemoDashboard };
