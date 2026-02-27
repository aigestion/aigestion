import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Brain,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { SpotlightWrapper } from './design-system/SpotlightWrapper';
import { NexusCommandBar } from './design-system/NexusCommandBar';
import { NexusMetricCard } from './design-system/NexusMetricCard';
import { NexusStatusBadge } from './design-system/NexusStatusBadge';
import { NexusCard } from './design-system/NexusCard';

// --- Sub-components ---

const DashboardSidebar: React.FC<{
  user: { name: string; email: string; subscription: string };
  activeTab: string;
  setActiveTab: (tab: any) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  menuItems: any[];
  messagesCount: number;
  status: string;
  isProcessing: boolean;
  onLogout: () => void;
}> = ({
  user,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  messagesCount,
  status,
  isProcessing,
  onLogout,
}) => {
  const subscriptionColors = {
    free: 'text-nexus-silver',
    premium: 'text-nexus-violet',
    enterprise: 'text-nexus-gold',
  };

  return (
    <AnimatePresence>
      {(sidebarOpen || true) && (
        <>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
          )}

          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed lg:relative z-50 w-72 h-screen bg-nexus-obsidian/90 backdrop-blur-xl border-r border-white/5 ${
              sidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-nexus-cyan/20 to-nexus-violet/20 border border-white/10 flex items-center justify-center relative group">
                  <User className="w-6 h-6 text-nexus-cyan group-hover:text-white transition-colors" />
                  <div className="absolute inset-0 rounded-full bg-nexus-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className="font-bold text-white font-orbitron tracking-wide">
                    {user.name}
                  </h3>
                  <p className="text-xs text-nexus-silver/60">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border border-white/10 font-bold uppercase tracking-wider ${subscriptionColors[user.subscription as keyof typeof subscriptionColors].replace('text-', 'bg-').replace('silver', 'gray-800').replace('violet', 'purple-900/50').replace('gold', 'yellow-900/50')} text-white`}
                    >
                      {user.subscription}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <div className="space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border border-transparent group relative overflow-hidden ${
                        activeTab === item.id
                          ? `bg-white/5 border-nexus-cyan/20 text-white shadow-[0_0_15px_rgba(0,245,255,0.1)]`
                          : 'text-nexus-silver/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute inset-0 bg-gradient-to-r from-nexus-cyan/10 to-transparent opacity-50"
                        />
                      )}
                      <Icon
                        className={`w-5 h-5 relative z-10 ${activeTab === item.id ? 'text-nexus-cyan' : 'group-hover:text-white transition-colors'}`}
                      />
                      <span className="font-medium relative z-10 font-orbitron tracking-wide text-sm">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-nexus-silver/50 text-xs uppercase tracking-wider">
                    Conversaciones
                  </span>
                  <span className="text-white font-mono font-bold">{messagesCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-nexus-silver/50 text-xs uppercase tracking-wider">
                    Estado
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isProcessing
                        ? 'text-yellow-400 animate-pulse'
                        : status === 'active'
                          ? 'text-emerald-400'
                          : status === 'error'
                            ? 'text-rose-400'
                            : 'text-nexus-silver'
                    }`}
                  >
                    {isProcessing
                      ? 'Procesando'
                      : status === 'active'
                        ? 'Activo'
                        : status === 'error'
                          ? 'Error'
                          : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-nexus-silver/50 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 border border-transparent transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-orbitron text-xs font-bold uppercase tracking-widest">
                  Cerrar Sesión
                </span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const AnalyticsTab: React.FC<{
  messagesCount: number;
  emotionalAnalysis: any;
  suggestedActions: any[];
  userSubscription: string;
}> = ({ messagesCount, emotionalAnalysis, suggestedActions, userSubscription }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NexusMetricCard
          label="Conversaciones"
          value={messagesCount}
          icon={<MessageSquare className="w-5 h-5 text-nexus-cyan" />}
          variant="cyan"
          trend="neutral"
          trendValue="Total mes"
        />

        <NexusMetricCard
          label="Estado Emocional"
          value={Math.round((emotionalAnalysis?.confidence || 0) * 100)}
          suffix="%"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          variant="green"
          trend={
            emotionalAnalysis?.confidence && emotionalAnalysis.confidence > 0.7
              ? 'up'
              : 'neutral'
          }
          trendValue={emotionalAnalysis?.emotion?.toUpperCase() || 'NEUTRAL'}
        />

        <NexusMetricCard
          label="Sugerencias"
          value={suggestedActions.length}
          icon={<Brain className="w-5 h-5 text-nexus-violet" />}
          variant="violet"
          trend="up"
          trendValue="Disponible"
        />

        <NexusMetricCard
          value={
            userSubscription === 'enterprise'
              ? 100
              : userSubscription === 'premium'
                ? 75
                : 25
          }
          suffix="%"
          label={userSubscription.toUpperCase()}
          icon={<Shield className="w-5 h-5 text-nexus-gold" />}
          variant="gold"
          trend="neutral"
          trendValue="Nivel de Acceso"
        />
      </div>

      <NexusCard variant="default" glow className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <BarChart3 size={100} />
        </div>
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-[0.2em] font-orbitron border-b border-white/5 pb-4">
          Actividad Neural Reciente
        </h3>
        <div className="h-64 flex flex-col items-center justify-center text-nexus-silver/30 gap-6">
          <Activity className="w-12 h-12 animate-pulse text-nexus-cyan" />
          <div className="text-center">
            <p className="font-orbitron text-xs tracking-[0.3em] text-white/60">
              RECOPILANDO TELEMETRÍA...
            </p>
            <p className="text-[10px] text-white/20 font-mono mt-2 uppercase tracking-widest">
              Sincronizando con Global Sync Mesh
            </p>
          </div>
        </div>
      </NexusCard>
    </motion.div>
  );
};

const SettingsTab: React.FC<{ user: { name: string; email: string; subscription: string } }> = ({
  user,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="premium-glass p-8 rounded-2xl border border-white/5">
        <h3 className="text-lg font-orbitron font-bold text-white mb-8 border-b border-white/5 pb-4">
          CONFIGURACIÓN DE CUENTA
        </h3>

        <div className="space-y-6 max-w-2xl">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold text-nexus-silver/70 mb-2 uppercase tracking-wide"
            >
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              defaultValue={user.name}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-nexus-cyan/50 focus:bg-white/5 transition-all font-mono text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-nexus-silver/70 mb-2 uppercase tracking-wide"
            >
              Identificador Email
            </label>
            <input
              id="email"
              type="email"
              defaultValue={user.email}
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-nexus-silver/50 cursor-not-allowed font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-nexus-silver/70 mb-2 uppercase tracking-wide">
              Nivel de Suscripción
            </label>
            <div className="p-6 bg-gradient-to-br from-nexus-violet/10 to-transparent border border-nexus-violet/20 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-2xl font-orbitron font-bold text-white">
                    {user.subscription}
                  </span>
                  <p className="text-[10px] text-nexus-silver/60 uppercase tracking-widest mt-1">
                    Plan Activo
                  </p>
                </div>
                <button className="px-6 py-2 bg-nexus-violet hover:bg-nexus-violet-light text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-nexus-violet/50">
                  Actualizar Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="premium-glass p-8 rounded-2xl border border-white/5">
        <h3 className="text-lg font-orbitron font-bold text-white mb-8 border-b border-white/5 pb-4">
          PREFERENCIAS DE DANIELA
        </h3>

        <div className="space-y-6 max-w-2xl">
          <div>
            <label
              htmlFor="voice-model"
              className="block text-xs font-bold text-nexus-silver/70 mb-2 uppercase tracking-wide"
            >
              Modelo de Voz
            </label>
            <div className="relative">
              <select
                id="voice-model"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-nexus-cyan/50 appearance-none font-mono text-sm"
              >
                <option>Bella (Neural v4)</option>
                <option>Adam (Neural v4)</option>
                <option>Domi (Neural v4)</option>
                <option>Elli (Neural v4)</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 rotate-90 pointer-events-none" />
            </div>
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-xs font-bold text-nexus-silver/70 mb-2 uppercase tracking-wide"
            >
              Idioma Principal
            </label>
            <div className="relative">
              <select
                id="language"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-nexus-cyan/50 appearance-none font-mono text-sm"
              >
                <option>Español (ES)</option>
                <option>English (US)</option>
                <option>Português (BR)</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 rotate-90 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-white/20 bg-black/40 text-nexus-cyan focus:ring-offset-0 focus:ring-0"
              />
              <span className="text-sm font-medium text-white">
                Recibir notificaciones prioritarias por email
              </span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface DashboardProps {
  user: {
    email: string;
    name: string;
    subscription: string;
  };
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'daniela' | 'analytics' | 'settings'>('daniela');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>(
    'checking'
  );

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

  const { status, messages, emotionalAnalysis, suggestedActions, isProcessing } =
    useEnhancedVoiceAssistant({
      sessionId: 'dashboard-session',
      userId: user.email,
    });

  const menuItems = [
    {
      id: 'daniela',
      label: 'Daniela AI',
      icon: Brain,
      color: 'from-nexus-cyan to-nexus-violet',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const subscriptionColors = {
    free: 'text-nexus-silver',
    premium: 'text-nexus-violet',
    enterprise: 'text-nexus-gold',
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian text-white font-sans overflow-hidden">
      {/* Background enhancements */}
      <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] bg-center opacity-5 pointer-events-none fixed" />
      <div className="grain-overlay pointer-events-none fixed inset-0 z-50 opacity-20" />

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/5 backdrop-blur-3xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        messagesCount={messages.length}
        status={status}
        isProcessing={isProcessing}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen relative">
        <SpotlightWrapper>
          {/* Header */}
          <NexusCommandBar
            title={menuItems.find(item => item.id === activeTab)?.label || 'DASHBOARD'}
            subtitle={
              activeTab === 'daniela'
                ? 'Secuencia de Inicialización: IA Emocional'
                : activeTab === 'analytics'
                  ? 'Cargando Métricas: Flujo en Tiempo Real'
                  : 'Configuración del Sistema: Protocolo de Usuario'
            }
            status={
              <div className="flex items-center gap-6">
                <NexusStatusBadge
                  status={
                    isProcessing
                      ? 'syncing'
                      : status === 'active'
                        ? 'online'
                        : status === 'error'
                          ? 'critical'
                          : 'offline'
                  }
                  label={
                    isProcessing
                      ? 'PROCESANDO'
                      : status === 'active'
                        ? 'SISTEMA IA ONLINE'
                        : status === 'error'
                          ? 'ERROR DEL SISTEMA'
                          : 'SISTEMA EN ESPERA'
                  }
                  size="md"
                />
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-nexus-cyan shadow-[0_0_8px_rgba(0,245,255,0.5)]' : 'bg-rose-500'}`}
                  />
                  <span className="text-[10px] text-white/40 font-mono">
                    {connectionStatus === 'connected' ? 'WSS: CONECTADO' : 'WSS: DESCONECTADO'}
                  </span>
                </div>
              </div>
            }
          />

          {/* Content */}
          <main className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'daniela' && (
                <motion.div
                  key="daniela"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DanielaConversationPanel />
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab
                  messagesCount={messages.length}
                  emotionalAnalysis={emotionalAnalysis}
                  suggestedActions={suggestedActions}
                  userSubscription={user.subscription}
                />
              )}

              {activeTab === 'settings' && <SettingsTab user={user} />}
            </AnimatePresence>
          </main>
        </SpotlightWrapper>
      </div>
    </div>
  );
};

// Helper for select arrow
const ChevronRight = ({ className }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
);
