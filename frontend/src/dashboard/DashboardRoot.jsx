/**
 * 🛡️ AIGestion.net Nexus Component
 * © 2026 Alejandro Manuel Alfonso Fernández (DNI: 28921591B). Proprietary & Restricted.
 * SHA-256 Auth Signature: NEXUS-GOD-LEVEL-UI-CORE-v1.0
 * Unauthorized copying, distribution, or decompilation is strictly prohibited.
 */
import React, { useState, useEffect } from 'react';
import NetworkStatus from '../components/ui/NetworkStatus';
import Tooltip from '../components/Tooltip';
import Breadcrumbs from './components/Breadcrumbs';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleEcosystemPanel } from './GoogleEcosystemPanel';
import { SocialMediaManager } from './SocialMediaManager';
import { Toaster } from 'react-hot-toast';
import { OmniChannelInbox } from './OmniChannelInbox'; // Mejora 15
import { IntelligenceHub } from './IntelligenceHub';
import { AutomationStore } from './AutomationStore';
import { VirtualOfficePanel } from './VirtualOfficePanel';
import MultimediaStudio from '../features/multimedia/MultimediaStudio'; // Mejora: V2 Studio
import { LayoutManager } from './components/LayoutManager';
import { VoiceCommandService } from '../services/voice-command.service.js'; // Mejora 46
import { VoiceOverlay } from './components/VoiceOverlay';
import { FinanceAdminPanel } from './FinanceAdminPanel';


export const DashboardRoot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showLayoutManager, setShowLayoutManager] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  // Definición de módulos para personalización (Mejora 47)
  const [layout, setLayout] = useState([
    {
      id: 'ecosystem',
      label: 'Ecosistema Google',
      icon: '🌐',
      path: '/dashboard/ecosystem',
      visible: true,
    },
    { id: 'social', label: 'Gestor Social', icon: '📱', path: '/dashboard/social', visible: true },
    { id: 'inbox', label: 'Buzón Omnicanal', icon: '📬', path: '/dashboard/inbox', visible: true },
    {
      id: 'intelligence',
      label: 'Hub Inteligencia',
      icon: '🧠',
      path: '/dashboard/intelligence',
      visible: true,
    },
    {
      id: 'store',
      label: 'Tienda Automática',
      icon: '🛒',
      path: '/dashboard/store',
      visible: true,
    },
    {
      id: 'multimedia',
      label: 'Prime Media Studio',
      icon: '🎙️',
      path: '/dashboard/multimedia',
      visible: true,
    },
    {
      id: 'finance',
      label: 'Panel Financiero',
      icon: '💰',
      path: '/dashboard/finance',
      visible: true,
    },
  ]);

  // Inicializar Control por Voz (Mejora 46)
  useEffect(() => {
    const voiceService = new VoiceCommandService(
      cmd => {
        if (cmd.type === 'NAVIGATE') {
          navigate(`/dashboard/${cmd.path}`);
        }
      },
      text => setVoiceText(text)
    );

    if (isVoiceActive) {
      voiceService.start();
    } else {
      voiceService.stop();
    }

    return () => voiceService.stop();
  }, [isVoiceActive, navigate]);

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
      <NetworkStatus />
      <VoiceOverlay text={voiceText} isActive={isVoiceActive} />
      <Toaster position="top-right" />
      {/* Sidebar Premium */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl z-10">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo.png"
              alt="AIGestion.net Logo"
              className="w-12 h-12 rounded-full shadow-lg border-2 border-white/10"
            />
            <div>
              <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AIGestion.net
              </h1>
              <p className="text-[9px] uppercase font-black text-gray-400 leading-none tracking-widest">
                Nexus-V4
              </p>
            </div>
          </div>
          <Tooltip text="Toggle voice control">
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`p-2 rounded-full transition-all ${isVoiceActive ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'bg-gray-100 text-gray-400'}`}
              title="Control por Voz"
            >
              🎙️
            </button>
          </Tooltip>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {layout
            .filter(m => m.visible)
            .map(item => (
              <Tooltip text={item.label}>
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg dark:shadow-blue-900/40' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </Tooltip>
            ))}

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setShowLayoutManager(!showLayoutManager)}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-dashed border-gray-200 dark:border-gray-700"
            >
              <span>⚙️</span> Personalizar UI
            </button>
          </div>
        </nav>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <img
              src="/brand/daniela_executive_headshot.png"
              alt="Admin"
              className="w-8 h-8 rounded-full border border-blue-200 object-cover"
            />
            <div>
              <p className="text-[10px] font-black text-gray-400 leading-none">ADMIN</p>
              <p className="text-xs font-bold mt-1">admin@aigestion.net</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {showLayoutManager && (
          <div className="absolute top-8 right-8 w-96 z-50">
            <LayoutManager defaultItems={layout} onLayoutChange={setLayout} />
          </div>
        )}

        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-10">
          <div>
            <h2 className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">
              Sistema Operativo AIGestion v4.0
            </h2>
            <p className="text-sm font-bold mt-1">Bienvenido de nuevo, Alejandro</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-100 dark:border-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black text-green-600 dark:text-green-400">
                SALUD DEL SISTEMA: 100%
              </span>
            </div>
          </div>
        </header>
        <Breadcrumbs />

        <section className="flex-1 p-10 overflow-auto">
          <Routes>
            <Route path="ecosystem" element={<GoogleEcosystemPanel />} />
            <Route path="social" element={<SocialMediaManager />} />
            <Route path="inbox" element={<OmniChannelInbox />} />
            <Route path="intelligence" element={<IntelligenceHub />} />
            <Route path="store" element={<AutomationStore />} />
            <Route path="multimedia" element={<MultimediaStudio />} />
            <Route path="metaverse" element={<VirtualOfficePanel />} />
            <Route path="finance" element={<FinanceAdminPanel />} />
            <Route path="*" element={<GoogleEcosystemPanel />} />
          </Routes>
        </section>
      </main>
    </div>
  );
};
