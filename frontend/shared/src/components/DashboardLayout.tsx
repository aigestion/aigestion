import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, LayoutDashboard, Database, Shield, Zap, Settings, LogOut, Wind, Thermometer, ShoppingBag } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { useAuth } from '../hooks/useAuth';
import { ParticleBackground } from './ParticleBackground';
import { CursorFollower } from './CursorFollower';
import { CommandTerminal } from './CommandTerminal';
import { NexusFilters } from './NexusFilters';
import { GhostModeAlert } from './GhostModeAlert';
import { WarRoomOverlay } from './WarRoomOverlay';
import { CollaborativeCursors } from './CollaborativeCursors';
import { EcoModeSwitch } from './EcoModeSwitch';
import { NetworkDiagnostics } from './NetworkDiagnostics';
import { VoiceCommander } from './VoiceCommander';
import { ZenMode } from './ZenMode';
import { PullToRefresh } from './PullToRefresh';
import { RadialActionMenu } from './RadialActionMenu';
import { BioAuthScreen } from './BioAuthScreen';
import { FlashAlertSystem } from './FlashAlertSystem';
import { WidgetMarketplace } from './WidgetMarketplace';
import { NexusWarRoom } from './NexusWarRoom';
import { NexusWarp } from './NexusWarp';
import { GlobalCommandBar } from './GlobalCommandBar';
import { ROICalculator } from './ROICalculator';
import { MobileGodModeProvider, useMobileGodMode } from '../contexts/MobileGodModeContext';
import { useNexusBackup } from '../hooks/useNexusBackup';
import { useNeuralSentiment } from '../hooks/useNeuralSentiment';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => {
  const { playHover, playWuaw } = useSound();

  return (
    <motion.button
      onMouseEnter={playHover}
      whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        playWuaw();
        onClick?.();
      }}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative group
            ${active ? 'text-nexus-cyan-glow' : 'text-nexus-silver/60 hover:text-white'}`}
    >
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 w-1 h-8 bg-nexus-cyan-glow rounded-r-full shadow-[0_0_15px_rgba(0,245,255,0.8)]"
        />
      )}
      <Icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]' : ''} />
      <span className="font-orbitron text-[10px] tracking-[0.2em] uppercase font-bold">{label}</span>
    </motion.button>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  type: 'ADMIN' | 'CLIENT' | 'DEMO';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, type }) => {
  const { role, loading } = useAuth();
  const { playHover, playWuaw } = useSound();
  const [isFocusMode, setIsFocusMode] = React.useState(false);
  const [isWarRoomOpen, setIsWarRoomOpen] = React.useState(false);
  const [isEcoMode, setIsEcoMode] = React.useState(false);
  const [isZenOpen, setIsZenOpen] = React.useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = React.useState(false);
  const [isNexusWarRoomOpen, setIsNexusWarRoomOpen] = React.useState(false);
  const [isWarping, setIsWarping] = React.useState(false);
  const [isROICalculatorOpen, setIsROICalculatorOpen] = React.useState(false);

  const { batteryLevel, setIsAuthenticated } = useMobileGodMode();
  useNeuralSentiment();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'f') {
        setIsFocusMode(prev => !prev);
        playWuaw();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Mejora #10: Zero-Wait Start (Guardar estado)
    const savedFocus = localStorage.getItem('nexus_focus_mode');
    if (savedFocus === 'true') setIsFocusMode(true);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playWuaw]);

  // Mejora #8: Eco-Danielas (Auto-Eco si batería < 20%)
  React.useEffect(() => {
    if (batteryLevel < 20 && !isEcoMode) {
      setIsEcoMode(true);
      playWuaw();
    }
  }, [batteryLevel, isEcoMode, playWuaw]);

  React.useEffect(() => {
    localStorage.setItem('nexus_focus_mode', String(isFocusMode));
  }, [isFocusMode]);

  React.useEffect(() => {
    (window as any).openNexusMarketplace = () => setIsMarketplaceOpen(true);
    (window as any).setIsNexusWarRoomOpen = (isOpen: boolean) => setIsNexusWarRoomOpen(isOpen);
    (window as any).triggerWarp = () => {
      setIsWarping(true);
      setTimeout(() => setIsWarping(false), 2000);
    };
    (window as any).openROIVisionary = () => setIsROICalculatorOpen(true);
  }, []);

  const isAuthorized = type === 'DEMO' || (role === type) || (role === 'ADMIN');

  if (loading) {
    return (
      <div className="h-screen bg-[#010103] flex flex-col items-center justify-center font-orbitron">
        <div className="w-16 h-16 border-2 border-nexus-cyan-glow/20 border-t-nexus-cyan-glow rounded-full animate-spin mb-8" />
        <span className="text-nexus-cyan-glow animate-pulse tracking-[0.3em]">AUTENTICANDO...</span>
      </div>
    );
  }

  const themeClass = type === 'ADMIN' ? 'border-nexus-cyan/20' : type === 'CLIENT' ? 'border-nexus-violet/20' : 'border-white/10';
  const accentGlow = type === 'ADMIN' ? 'bg-nexus-cyan/5' : type === 'CLIENT' ? 'bg-nexus-violet/5' : 'bg-white/5';

  const handleRefresh = async () => {
    playWuaw();
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <MobileGodModeProvider>
      <div className="flex h-screen bg-nexus-obsidian text-white overflow-hidden relative transition-colors duration-1000">
        <AnimatePresence>
          {!useMobileGodMode().isAuthenticated && (
            <BioAuthScreen onAuth={() => useMobileGodMode().setIsAuthenticated(true)} />
          )}
        </AnimatePresence>

        <NexusFilters />
        <GhostModeAlert />
        <CollaborativeCursors />
        <WarRoomOverlay isOpen={isWarRoomOpen} onClose={() => setIsWarRoomOpen(false)} />
        <ZenMode isOpen={isZenOpen} onClose={() => setIsZenOpen(false)} />
        {/* <WarRoomMobile isOpen={isWarRoomOpen} onClose={() => setIsWarRoomOpen(false)} /> */}
        <WidgetMarketplace isOpen={isMarketplaceOpen} onClose={() => setIsMarketplaceOpen(false)} />
        <FlashAlertSystem />
        <CommandTerminal />
        {!isEcoMode && <ParticleBackground color={type === 'ADMIN' ? '0, 245, 255' : '138, 43, 226'} />}
        <CursorFollower />
        <AnimatePresence>
          {isNexusWarRoomOpen && <NexusWarRoom onClose={() => setIsNexusWarRoomOpen(false)} />}
        </AnimatePresence>
        <NexusWarp isVisible={isWarping} />
        <GlobalCommandBar />
        <ROICalculator isOpen={isROICalculatorOpen} onClose={() => setIsROICalculatorOpen(false)} />

        {/* Sidebar */}
        <aside className={`w-72 border-r ${themeClass} bg-white/[0.01] backdrop-blur-3xl flex flex-col z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)] focus-mode-transition
                ${isFocusMode ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-3 nexus-heartbeat">
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br from-nexus-violet via-nexus-cyan to-nexus-violet p-[1.5px] animate-pulse-glow`}>
                <div className="w-full h-full bg-[#010103] rounded-xl flex items-center justify-center text-white">
                  <Zap size={18} />
                </div>
              </div>
              <span className="font-orbitron font-black tracking-[0.2em] text-lg bg-clip-text text-transparent bg-linear-to-r from-white to-white/40">AIGESTION</span>
            </div>
          </div>

          <nav className="flex-1 py-8 overflow-y-auto scrollbar-hide">
            <SidebarItem icon={LayoutDashboard} label="Panel General" active />
            <SidebarItem icon={Database} label="Nodos & Datos" />
            <SidebarItem icon={Shield} label="Seguridad AI" />
            <SidebarItem icon={Zap} label="Automatización" />
            <SidebarItem icon={Settings} label="Configuración" />
          </nav>

          <div className="p-8 border-t border-white/5 bg-white/[0.02] flex flex-col gap-6">
            <VoiceCommander />
            <SidebarItem icon={LogOut} label="Desconexión" onClick={() => window.location.href = '/'} />
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-hidden relative focus-mode-transition flex flex-col ${isFocusMode ? 'ml-0' : ''}`}>
          <header className={`sticky top-0 z-40 px-12 py-10 flex justify-between items-center bg-transparent backdrop-blur-xl border-b border-white/[0.03] focus-mode-transition
                    ${isFocusMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div>
              <span className="text-[10px] font-orbitron tracking-[0.4em] text-nexus-silver/40 uppercase block mb-1">Ecosistema {type}</span>
              <h2 className="text-3xl font-orbitron font-black tracking-tighter uppercase text-glow">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-8">
              <OledToggle />
              <button
                onClick={() => setIsZenOpen(true)}
                className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <Wind size={18} />
              </button>
              <EcoModeSwitch isEco={isEcoMode} onChange={setIsEcoMode} />
              {/* <VoiceToAction /> */}
              <HardwareMonitor />
              <NetworkDiagnostics />
              <button
                onClick={() => setIsMarketplaceOpen(true)}
                className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-nexus-cyan hover:text-nexus-cyan-glow"
              >
                <ShoppingBag size={18} />
              </button>
              <button
                onClick={() => setIsNexusWarRoomOpen(true)}
                className="hidden lg:flex items-center gap-2 px-6 py-2 rounded-full bg-red-600/10 border border-red-500/20 text-[9px] font-orbitron font-black text-red-500 hover:bg-red-600/20 transition-all uppercase"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                COMANDO DE CRISIS
              </button>
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold font-orbitron">Daniela AI</span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-nexus-silver/20 font-mono tracking-widest uppercase">LAT: 12ms</span>
                  <span className="text-[9px] text-green-400 font-mono tracking-widest animate-pulse uppercase">● online</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 p-1 relative group cursor-pointer">
                <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=AIG" className="w-full h-full rounded-xl opacity-80" alt="avatar" />
                <div className="absolute inset-0 border border-nexus-cyan-glow/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </header>

          <PullToRefresh onRefresh={handleRefresh}>
            <div className="px-12 py-12 relative animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-[calc(100vh-130px)]">
              {/* <EcosytemMonitor /> */}
              {/* <ProactiveWidgets /> */}
              {isAuthorized ? children : (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20"
                  >
                    <Shield size={40} className="text-red-500 animate-pulse" />
                  </motion.div>
                  <h3 className="text-3xl font-orbitron font-black text-white tracking-widest uppercase mb-4">ACCESO RESTRINGIDO</h3>
                  <p className="text-nexus-silver/40 font-mono text-sm max-w-md mx-auto italic">
                    Su nivel de autorización actual ({role}) no permite el acceso a la frecuencia {type}. Por favor, contacte con el administrador del núcleo.
                  </p>
                  <div className="mt-12 flex gap-4">
                    <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-orbitron font-bold tracking-widest hover:bg-white/10 transition-all uppercase">
                      SOLICITAR PERMISOS
                    </button>
                    <button onClick={() => window.history.back()} className="px-8 py-4 rounded-xl bg-white text-black text-xs font-orbitron font-bold tracking-widest hover:scale-105 transition-all uppercase">
                      REGRESAR
                    </button>
                  </div>
                </div>
              )}
            </div>
          </PullToRefresh>

          {/* Ambient Background Elements */}
          <div className={`fixed top-0 right-0 w-[800px] h-[800px] ${accentGlow} blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40`} />
          <div className={`fixed bottom-0 left-72 w-[600px] h-[600px] ${accentGlow} blur-[130px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30`} />

          {/* Mobile Enhancements */}
          <RadialActionMenu />
          <WhisperNotifications />
        </main>
      </div>
    </MobileGodModeProvider>
  );
};

const OledToggle = () => {
  const { isOledMode, setIsOledMode } = useMobileGodMode();
  return (
    <button
      onClick={() => setIsOledMode(!isOledMode)}
      className={`px-4 py-2 rounded-full border transition-all text-[8px] font-orbitron font-black uppercase tracking-widest ${isOledMode ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
        }`}
    >
      {isOledMode ? 'OLED: ON' : 'OLED: OFF'}
    </button>
  );
};

const HardwareMonitor = () => {
  const { batteryLevel, isCharging, tempStatus } = useMobileGodMode();
  const { playHover } = useSound();

  return (
    <div
      onMouseEnter={playHover}
      className="hidden sm:flex items-center gap-4 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full"
    >
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-3 border border-white/40 rounded-xs relative`}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${batteryLevel}%` }}
            className={`absolute bottom-0 left-0 right-0 ${batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`}
          />
          {isCharging && <Zap size={8} className="absolute inset-0 m-auto text-white animate-pulse" />}
        </div>
        <span className="text-[8px] font-mono text-white/40">{batteryLevel}%</span>
      </div>
      <div className="w-px h-3 bg-white/10" />
      <div className="flex items-center gap-2">
        <Thermometer size={12} className={tempStatus === 'HOT' ? 'text-red-500 animate-bounce' : tempStatus === 'WARM' ? 'text-nexus-gold' : 'text-nexus-cyan-glow'} />
        <span className="text-[8px] font-mono text-white/40 uppercase">{tempStatus}</span>
      </div>
    </div>
  );
};
const WhisperNotifications = () => {
  const [whisper, setWhisper] = React.useState<string | null>(null);

  React.useEffect(() => {
    const whispers = [
      "SISTEMA SEGURO. TODO BAJO CONTROL.",
      "DANIELA IA: ANALIZANDO NODOS...",
      "CONEXIÓN NEURAL ESTABLE.",
      "GOD MODE ACTIVADO. NIVEL DE AUTORIDAD: MÁXIMO.",
      "ESCANEANDO AMBIENTE PARA OPTIMIZACIÓN...",
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setWhisper(whispers[Math.floor(Math.random() * whispers.length)]);
        setTimeout(() => setWhisper(null), 4000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {whisper && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[5000] pointer-events-none"
        >
          <div className="bg-black/60 backdrop-blur-md border border-white/5 px-6 py-2 rounded-full shadow-2xl">
            <span className="text-[9px] font-mono text-nexus-cyan-glow uppercase tracking-[0.4em] animate-pulse">
              {whisper}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
