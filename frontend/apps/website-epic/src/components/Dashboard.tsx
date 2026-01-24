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
  User
} from 'lucide-react';
import React, { useState } from 'react';
import { useEnhancedVoiceAssistant } from '../hooks/useEnhancedVoiceAssistant';
import { DanielaConversationPanel } from './DanielaConversationPanel';

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

  const {
    status,
    messages,
    emotionalAnalysis,
    suggestedActions,
    isRecording,
    isProcessing,
    error
  } = useEnhancedVoiceAssistant();

  const menuItems = [
    {
      id: 'daniela',
      label: 'Daniela AI',
      icon: Brain,
      color: 'from-nexus-cyan to-nexus-violet'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const subscriptionColors = {
    free: 'text-nexus-silver',
    premium: 'text-nexus-violet',
    enterprise: 'text-nexus-gold'
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian text-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/5 backdrop-blur-3xl border border-white/10"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <>
            {/* Overlay */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />
            )}

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed lg:relative z-50 w-72 h-screen bg-nexus-obsidian-deep border-r border-white/10 ${sidebarOpen ? 'block' : 'hidden lg:block'
                }`}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-nexus-silver">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="w-3 h-3 text-nexus-cyan" />
                      <span className={`text-xs font-medium ${subscriptionColors[user.subscription as keyof typeof subscriptionColors]}`}>
                        {user.subscription.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                          ? `bg-linear-to-r ${item.color} text-white shadow-lg`
                          : 'text-nexus-silver hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* Stats */}
              <div className="p-4 border-t border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-nexus-silver text-sm">Conversaciones</span>
                    <span className="text-white font-semibold">{messages.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nexus-silver text-sm">Estado</span>
                    <span className={`text-sm font-medium ${status === 'active' ? 'text-green-400' :
                      status === 'processing' ? 'text-yellow-400' :
                        status === 'error' ? 'text-red-400' :
                          'text-nexus-silver'
                      }`}>
                      {status === 'active' ? 'Activo' :
                        status === 'processing' ? 'Procesando' :
                          status === 'error' ? 'Error' :
                            'Inactivo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nexus-silver text-sm">Suscripción</span>
                    <span className={`text-xs font-medium ${subscriptionColors[user.subscription as keyof typeof subscriptionColors]}`}>
                      {user.subscription}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-nexus-silver hover:bg-white/5 hover:text-white transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="bg-nexus-obsidian-deep border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h1>
              <p className="text-nexus-silver text-sm mt-1">
                {activeTab === 'daniela' && 'Tu asistente de IA emocional'}
                {activeTab === 'analytics' && 'Métricas y análisis de uso'}
                {activeTab === 'settings' && 'Configuración de tu cuenta'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-400' :
                  status === 'processing' ? 'bg-yellow-400 animate-pulse' :
                    status === 'error' ? 'bg-red-400' :
                      'bg-nexus-silver'
                  }`} />
                <span className="text-sm text-nexus-silver hidden sm:block">
                  {status === 'active' ? 'Daniela Activa' :
                    status === 'processing' ? 'Procesando...' :
                      status === 'error' ? 'Error' :
                        'Inactivo'}
                </span>
              </div>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-nexus-silver">{user.subscription}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
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
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Conversaciones</h3>
                      <MessageSquare className="w-5 h-5 text-nexus-cyan" />
                    </div>
                    <div className="text-3xl font-bold text-white">{messages.length}</div>
                    <p className="text-nexus-silver text-sm">Total este mes</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Estado Emocional</h3>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {emotionalAnalysis?.emotion?.toUpperCase() || 'NEUTRAL'}
                    </div>
                    <p className="text-nexus-silver text-sm">
                      Confianza: {emotionalAnalysis?.confidence ? `${Math.round(emotionalAnalysis.confidence * 100)}%` : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Sugerencias</h3>
                      <Brain className="w-5 h-5 text-nexus-violet" />
                    </div>
                    <div className="text-3xl font-bold text-white">{suggestedActions.length}</div>
                    <p className="text-nexus-silver text-sm">Acciones disponibles</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Suscripción</h3>
                      <Shield className="w-5 h-5 text-nexus-gold" />
                    </div>
                    <div className="text-3xl font-bold text-white uppercase">{user.subscription}</div>
                    <p className="text-nexus-silver text-sm">Plan actual</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Actividad Reciente</h3>
                  <div className="h-64 flex items-center justify-center text-nexus-silver">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Gráficos de actividad próximamente</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Configuración de Cuenta</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-nexus-silver mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-nexus-silver mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nexus-silver cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-nexus-silver mb-2">
                        Suscripción Actual
                      </label>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{user.subscription}</span>
                          <button className="px-4 py-2 bg-linear-to-r from-nexus-cyan to-nexus-violet text-white rounded-lg text-sm font-medium hover:from-nexus-cyan/80 hover:to-nexus-violet/80 transition-all">
                            Actualizar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Preferencias de Daniela</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-nexus-silver mb-2">
                        Voz de Daniela
                      </label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50">
                        <option>Bella (Default)</option>
                        <option>Adam</option>
                        <option>Domi</option>
                        <option>Elli</option>
                        <option>Emily</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-nexus-silver mb-2">
                        Idioma
                      </label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50">
                        <option>Español</option>
                        <option>English</option>
                        <option>Português</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-nexus-silver mb-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-white/10 bg-white/5 text-nexus-cyan"
                        />
                        Notificaciones por email
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
