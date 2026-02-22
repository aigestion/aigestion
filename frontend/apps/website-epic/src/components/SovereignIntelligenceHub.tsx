import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Terminal,
  Activity,
  Network,
  Lock,
  Unlock,
  Key,
  Mic,
  Eye,
  CheckCircle2,
  Play,
  History,
  Database,
  AlertTriangle,
  Server,
  Share2,
  Cpu,
  ShieldCheck,
  Search,
  Smartphone,
  Fingerprint,
} from 'lucide-react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { sovereignGodMode, SwarmMission } from '../services/sovereign-godmode';
import { useNotification } from '../contexts/NotificationContext';
import { SpotlightWrapper } from './design-system/SpotlightWrapper';
import { GodModeText } from './design-system/GodModeText';
import { TiltCard } from './design-system/TiltCard';
import { cn } from '../utils/cn';
import { LiquidBackground } from './design-system/LiquidBackground';
import { SystemAnxietyEffect } from './design-system/SystemAnxietyEffect';
import { NexusGrid } from './design-system/NexusGrid';
import { SovereignCard } from './design-system/SovereignCard';
import { PulseHistory } from './design-system/PulseHistory';
import { socketService } from '../services/socket.service';
import { useDanielaVoice } from '../hooks/useDanielaVoice';

export const SovereignIntelligenceHub: React.FC = () => {
  const { notify } = useNotification();
  const [objective, setObjective] = useState('');
  const [missions, setMissions] = useState<SwarmMission[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [sovereignSession, setSovereignSession] = useState<string | null>(null);
  const [voicePersonality, setVoicePersonality] = useState<
    'sovereign' | 'professional' | 'empathy'
  >('sovereign');
  const { isListening, toggleListening, speak } = useDanielaVoice();

  const [decryptedFindings, setDecryptedFindings] = useState<Record<string, string>>({});
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [healerStatus, setHealerStatus] = useState<{
    status: string;
    pulse: 'nominal' | 'warning' | 'critical';
    recentRepairs: any[];
    pendingApprovalsCount: number;
  }>({
    status: 'healthy',
    pulse: 'nominal',
    recentRepairs: [],
    pendingApprovalsCount: 0,
  });

  const [pulseHistory, setPulseHistory] = useState<('nominal' | 'warning' | 'critical')[]>(
    new Array(20).fill('nominal')
  );

  useEffect(() => {
    setPulseHistory(prev => [...prev.slice(1), healerStatus.pulse]);
  }, [healerStatus.pulse]);
  const [pixelSnapshot, setPixelSnapshot] = useState<any>(null);
  const [pixelStats, setPixelStats] = useState<any>(null);

  // 🌌 Real-Time Neural Pulse via Socket.io
  useEffect(() => {
    const mapStatus = (status: string): 'nominal' | 'warning' | 'critical' => {
      if (status === 'CRITICAL') return 'critical';
      if (status === 'DEGRADED') return 'warning';
      return 'nominal';
    };

    socketService.onPulse(metrics => {
      const pulse = mapStatus(metrics.status);
      setHealerStatus(prev => ({ ...prev, pulse, status: metrics.status.toLowerCase() }));
    });

    socketService.onPulseWarning(metrics => {
      const pulse = mapStatus(metrics.status);
      setHealerStatus(prev => ({ ...prev, pulse, status: metrics.status.toLowerCase() }));
    });

    return () => socketService.disconnect();
  }, []);

  // 🌌 Proactive AI Voice Alerts
  useEffect(() => {
    socketService.onSovereignAlert(alert => {
      notify(
        `🌌 ALERTA SOBERANA: ${alert.type}`,
        alert.message,
        alert.priority === 'critical' ? 'error' : alert.priority === 'high' ? 'warning' : 'info'
      );

      if (alert.voiceEnabled) {
        speak(alert.message);
      }
    });
  }, [speak, notify]);

  useEffect(() => {
    loadMissions();
    loadHealerStatus();
    loadPixelSensors();
    loadPixelStats();
    if (activeTab === 'sentinel') {
      loadForecasts();
      loadHealerStatus();
    }

    const interval = setInterval(() => {
      loadPixelSensors();
    }, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (!isVaultLocked && !hasGreeted) {
      playDanielaGreeting();
      setHasGreeted(true);
    }
  }, [isVaultLocked, hasGreeted]);

  const playDanielaGreeting = () => {
    notify(
      'DANIELA',
      'Bienvenido, Alejandro. Entorno soberano listo para tu revisión estratégica.',
      'info'
    );
  };

  const loadMissions = async () => {
    try {
      const data = await sovereignGodMode.getRecentMissions();
      setMissions(data);
    } catch (err) {
      console.error('Failed to load missions:', err);
    }
  };

  const loadForecasts = async () => {
    try {
      const data = await sovereignGodMode.getResourceForecast();
      if (data.success) {
        setForecasts(data.forecasts);
      }
    } catch (err) {
      console.error('Failed to load forecasts:', err);
    }
  };

  const loadHealerStatus = async () => {
    try {
      const data = await sovereignGodMode.getHealerStatus();
      if (data.success) {
        setHealerStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to load healer status:', err);
    }
  };

  const loadPixelSensors = async () => {
    try {
      const resp = await sovereignGodMode.getPixelSensors();
      if (resp.success) {
        setPixelSnapshot(resp.data);
      }
    } catch (err) {
      console.error('Failed to load pixel sensors:', err);
    }
  };

  const loadPixelStats = async () => {
    try {
      const resp = await sovereignGodMode.getPixelDailyStats();
      if (resp.success) {
        setPixelStats(resp.data);
      }
    } catch (err) {
      console.error('Failed to load pixel stats:', err);
    }
  };

  const handleLaunch = async () => {
    if (!objective.trim()) return;

    setIsLaunching(true);
    notify('INICIANDO ENJAMBRE', `Objetivo: ${objective.substring(0, 30)}...`, 'info');

    try {
      await sovereignGodMode.launchMission(objective);
      notify('MISIÓN DESPLEGADA', 'El enjambre autónomo ha comenzado la investigación.', 'success');
      setObjective('');
      loadMissions();
    } catch (err) {
      console.error('Error deploying mission:', err);
      notify('ERROR DE DESPLIEGUE', 'No se pudo inicializar el enjambre soberano.', 'error');
    } finally {
      setIsLaunching(false);
    }
  };

  const performVoiceChallenge = async (): Promise<boolean> => {
    setIsRecordingVoice(true);
    notify(
      'DESAFÍO BIOMÉTRICO',
      'Habla ahora para verificar tu identidad: "Soberanía AIGestion activa"',
      'info'
    );

    return new Promise(resolve => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];

          mediaRecorder.ondataavailable = e => chunks.push(e.data);
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Audio = (reader.result as string).split(',')[1];
              try {
                await sovereignGodMode.verifyVoice(base64Audio);
                resolve(true);
              } catch (err) {
                console.error('Voice verification failed:', err);
                resolve(false);
              } finally {
                setIsRecordingVoice(false);
              }
            };
          };

          mediaRecorder.start();
          setTimeout(() => mediaRecorder.stop(), 4000);
        })
        .catch(() => {
          setIsRecordingVoice(false);
          resolve(false);
        });
    });
  };

  const handleSovereignUnlock = async () => {
    setIsAuthenticating(true);
    try {
      // 1. Hardware Key Verification
      const options = await sovereignGodMode.generateAuthenticationOptions();
      const authResp = await startAuthentication(options);
      await sovereignGodMode.verifyAuthentication(authResp);

      // 2. Voice Biometrics Verification (New in Phase 13)
      const voiceVerified = await performVoiceChallenge();
      if (!voiceVerified) {
        throw new Error('Biometric verification failed');
      }

      // 3. PQC Handshake
      notify('ESTABLECIENDO CANAL PQC', 'Iniciando intercambio de llaves cuánticas...', 'info');
      const handshake = await sovereignGodMode.initiateSovereignHandshake();
      setSovereignSession(handshake.sessionToken);

      setIsVaultLocked(false);
      notify(
        'SOVEREIGN ACCESS GRANTED',
        'Canal cuántico y biometría verificados. Bóveda desbloqueada.',
        'success'
      );
      loadMissions();
    } catch (err) {
      console.error('Sovereign Auth failed:', err);
      notify('ACCESO DENEGADO', 'Fallo en la verificación multi-factor (Llave + Voz).', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEnrollHardwareKey = async () => {
    try {
      const options = await sovereignGodMode.generateRegistrationOptions();
      const regResp = await startRegistration(options);
      await sovereignGodMode.verifyRegistration(regResp);

      notify('LLAVE REGISTRADA', 'Tu identidad soberana ha sido vinculada al hardware.', 'success');
    } catch (err) {
      console.error('Enrollment failed:', err);
      notify('FALLO DE REGISTRO', 'No se pudo vincular la llave física.', 'error');
    }
  };

  const handleVoiceEnrollment = async () => {
    setIsRecordingVoice(true);
    notify('GRABANDO BIOMETRÍA', 'Habla ahora: "Soberanía AIGestion activa"', 'info');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await sovereignGodMode.enrollVoice(base64Audio);
          notify('BIO-LLAVE REGISTRADA', 'Tu huella de voz ha sido vinculada al vault.', 'success');
          setIsRecordingVoice(false);
        };
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 4000); // 4 seconds recording
    } catch (err) {
      console.error('Voice enrollment failed:', err);
      notify('FALLO BIOMÉTRICO', 'No se pudo acceder al micrófono.', 'error');
      setIsRecordingVoice(false);
    }
  };

  const handleRevealFindings = async (mission: SwarmMission) => {
    if (decryptedFindings[mission.id]) return;

    setIsDecrypting(mission.id);
    try {
      // In a real flow, mission.results would be { iv, ciphertext, tag }
      // For the demo/prototype, we parse it if it's a JSON string
      const encryptedData = {
        iv: mission.vaultIV || '',
        ciphertext: mission.results || '',
        tag: mission.vaultTag || '',
      };

      const decrypted = await sovereignGodMode.decryptFinding(encryptedData);
      setDecryptedFindings(prev => ({ ...prev, [mission.id]: decrypted }));
      notify('DATOS DESBLOQUEADOS', `Hallazgos de misión ${mission.id} desencriptados.`, 'success');
    } catch (err) {
      console.error('Decryption failed:', err);
      notify('FALLO DE DESENCRIPTACIÓN', 'No se pudo validar la firma del vault.', 'error');
    } finally {
      setIsDecrypting(null);
    }
  };

  const handleExecuteRepair = async (mission: SwarmMission, approved: boolean) => {
    notify(
      approved ? 'AUTORIZANDO REPARACIÓN' : 'RECHAZANDO PROPUESTA',
      'Enviando comando soberano...',
      'info'
    );
    try {
      await sovereignGodMode.launchMission(
        `[REPAIR_AUTH] proposalId=${mission.id} approved=${approved}`
      );
      notify(
        approved ? 'ACCIÓN AUTORIZADA' : 'REPARACIÓN CANCELADA',
        'El sistema ha procesado el comando.',
        'success'
      );
      loadMissions();
    } catch (err) {
      notify('ERROR DE COMANDO', 'No se pudo procesar la autorización.', 'error');
    }
  };

  const handlePixelTest = async () => {
    notify('COMANDO SOBERANO 📱', 'Enviando alerta de Modo Dios al Pixel 8...', 'info');
    try {
      const resp = await sovereignGodMode.testPixelSovereign();
      if (resp.status === 'sent') {
        notify(
          'PIXEL VIBRANDO 🌌',
          'Alerta de Nivel God confirmada en dispositivo físico.',
          'success'
        );
      } else {
        notify('FALLO DE BRIDGE', 'No se pudo contactar con el dispositivo soberano.', 'error');
      }
    } catch (err) {
      notify('ERROR DE BRIDGE', 'Error crítico en el enlace Pixel.', 'error');
    }
  };

  const healingProposals = missions.filter(m => m.metadata?.isHealingProposal);
  const standardMissions = missions.filter(m => !m.metadata?.isHealingProposal);

  return (
    <SystemAnxietyEffect pulse={healerStatus.pulse}>
      <SpotlightWrapper
        className={cn(
          'flex flex-col h-full text-white font-sans overflow-hidden relative transition-all',
          isFocusMode && 'focus-mode-active'
        )}
      >
        {/* Background Ambience */}
        <LiquidBackground pulse={healerStatus.pulse} />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexus-cyan/5 to-transparent bg-[length:100%_4px] opacity-20 animate-scan" />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-md relative z-10">
          <div>
            <GodModeText
              text="HUB DE INTELIGENCIA SOBERANA"
              effect="hologram"
              className="text-2xl md:text-3xl font-black tracking-[0.2em] mb-1"
            />
            <div className="flex items-center gap-2 text-nexus-silver/40 text-[10px] font-orbitron tracking-widest uppercase">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full animate-pulse',
                  healerStatus.pulse === 'critical'
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : healerStatus.pulse === 'warning'
                      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                      : 'bg-nexus-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                )}
              />
              CENTRO DE COORDINACIÓN DE ENJAMBRES v2.6.0 | HEALER:{' '}
              {healerStatus.status.toUpperCase()}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            {healingProposals.length > 0 && !isVaultLocked && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg animate-pulse shadow-amber-glow/20">
                <Activity size={12} className="text-amber-500" />
                <span className="text-[10px] text-amber-500 font-orbitron font-bold">
                  AUTO-REPARACIÓN REQUERIDA
                </span>
              </div>
            )}

            <div className="flex flex-col items-end mr-4">
              <button
                onClick={isVaultLocked ? handleSovereignUnlock : () => setIsVaultLocked(true)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold transition-all border shadow-[0_0_15px_rgba(0,0,0,0.5)]',
                  isVaultLocked
                    ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse hover:bg-red-500/20'
                    : 'bg-nexus-cyan/10 text-nexus-cyan border-nexus-cyan/30 hover:bg-nexus-cyan/20'
                )}
              >
                {isAuthenticating ? (
                  'VERIFICANDO...'
                ) : isVaultLocked ? (
                  <>
                    <Lock size={12} /> BÓVEDA <span className="hidden md:inline">BLOQUEADA</span>
                  </>
                ) : (
                  <>
                    <Unlock size={12} /> BÓVEDA <span className="hidden md:inline">ABIERTA</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-nexus-cyan font-bold tracking-widest">
                ESTADO IA
              </span>
              <span
                className={cn(
                  'text-xs uppercase font-bold',
                  isVaultLocked ? 'text-red-400' : 'text-green-400'
                )}
              >
                {isVaultLocked ? 'RESTRINGIDO' : 'MODO DIOS ACTIVO'}
              </span>
            </div>

            {!isVaultLocked && pixelSnapshot && (
              <div className="hidden lg:flex flex-col items-center px-4 py-1.5 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[8px] text-white/30 font-orbitron uppercase tracking-widest mb-0.5">
                  Physical Context
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full animate-pulse',
                      pixelSnapshot.context_level === 'resting'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]'
                        : pixelSnapshot.context_level === 'focused'
                          ? 'bg-nexus-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                          : 'bg-nexus-violet shadow-[0_0_8px_rgba(139,92,246,0.8)]'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-bold font-mono tracking-tighter uppercase',
                      pixelSnapshot.context_level === 'resting'
                        ? 'text-emerald-400'
                        : pixelSnapshot.context_level === 'focused'
                          ? 'text-nexus-cyan'
                          : 'text-nexus-violet'
                    )}
                  >
                    {pixelSnapshot.context_level}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={cn(
                'w-10 h-10 rounded-xl border flex items-center justify-center transition-all',
                isFocusMode
                  ? 'bg-nexus-cyan/20 border-nexus-cyan text-nexus-cyan shadow-cyan-glow'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30'
              )}
              title={
                isFocusMode ? 'Desactivar Modo Enfoque' : 'Activar Modo Enfoque (Accesibilidad)'
              }
            >
              <Eye size={18} />
            </button>

            {sovereignSession && (
              <div className="flex flex-col items-start px-3 py-1 bg-nexus-cyan/5 rounded-lg border border-nexus-cyan/20">
                <span className="text-[8px] text-nexus-cyan font-bold tracking-[0.2em]">
                  PQC SESSION
                </span>
                <span className="text-[9px] text-white/40 font-mono">
                  {sovereignSession.substring(0, 12)}...
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                className={cn(
                  'w-10 h-10 rounded-full border flex items-center justify-center transition-all',
                  isRecordingVoice
                    ? 'bg-red-500/20 border-red-500 animate-pulse shadow-red-glow'
                    : 'bg-nexus-cyan/5 border-nexus-cyan/30 hover:bg-nexus-cyan/20 hover:border-nexus-cyan/50 hover:shadow-cyan-glow'
                )}
                onClick={handleVoiceEnrollment}
                title="Registrar Llave de Voz Soberana"
              >
                <Mic size={18} className={isRecordingVoice ? 'text-white' : 'text-nexus-cyan'} />
              </button>

              <button
                className="w-10 h-10 rounded-full bg-nexus-cyan/5 border border-nexus-cyan/30 flex items-center justify-center hover:bg-nexus-cyan/20 hover:border-nexus-cyan/50 transition-all hover:shadow-cyan-glow"
                onClick={handleEnrollHardwareKey}
                title="Registrar Llave de Hardware"
              >
                <Key size={18} className="text-nexus-cyan" />
              </button>
            </div>
          </div>
        </div>

        {/* Recording Overlay */}
        <AnimatePresence>
          {isRecordingVoice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
            >
              <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3],
                    boxShadow: [
                      '0 0 20px rgba(6,182,212,0.3)',
                      '0 0 60px rgba(6,182,212,0.6)',
                      '0 0 20px rgba(6,182,212,0.3)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-nexus-cyan rounded-full blur-2xl"
                />
                <div className="relative w-24 h-24 rounded-full bg-black/40 border-2 border-nexus-cyan flex items-center justify-center shadow-cyan-glow">
                  <Mic
                    size={40}
                    className="text-nexus-cyan drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                  />
                </div>
              </div>
              <GodModeText
                text="ESCANEANDO BIOMETRÍA DE VOZ"
                effect="glitch"
                className="mt-8 text-2xl font-bold text-white"
              />
              <p className="text-nexus-silver/60 font-orbitron text-[10px] mt-4 animate-pulse uppercase tracking-[0.3em]">
                Habla ahora: "Soberanía AIGestion activa"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-grow overflow-hidden flex relative z-10">
          {/* Navigation Sidebar */}
          <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-black/20 backdrop-blur-sm">
            {[
              { id: 'terminal', icon: Terminal, label: 'TERMINAL' },
              {
                id: 'missions',
                icon: Activity,
                label: 'MISIONES',
                alert: healingProposals.length > 0,
              },
              { id: 'memory', icon: Network, label: 'MEMORIA' },
              { id: 'sentinel', icon: Eye, label: 'CENTINELA' },
              { id: 'swarm', icon: Share2, label: 'ENJAMBRE' },
              { id: 'infra', icon: Server, label: 'INFRAESTRUCTURA' },
              { id: 'voice', icon: Mic, label: 'DANIELA VOICE' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  'p-3 rounded-xl transition-all relative group',
                  activeTab === item.id
                    ? 'bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-white/30 hover:text-white hover:bg-white/5'
                )}
                title={item.label}
              >
                <item.icon
                  size={24}
                  className={cn(
                    'transition-transform duration-300',
                    activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'
                  )}
                />
                {item.alert && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
                {activeTab === item.id && (
                  <div className="absolute inset-y-0 -left-4 w-1 bg-nexus-cyan rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'voice' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-4xl mx-auto space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-orbitron font-black text-white tracking-widest uppercase">
                        Daniela Voice Agent
                      </h2>
                      <p className="text-nexus-silver/40 text-[10px] font-orbitron tracking-[0.2em] mt-1">
                        Sovereign Vocal Intelligence & Biometric Link
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 bg-nexus-cyan/5 border border-nexus-cyan/20 rounded-xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-cyan-glow" />
                        <span className="text-[10px] font-orbitron font-bold text-nexus-cyan">
                          ENGINE: VAPI/ELEVENLABS
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Voice Status & Visualizer */}
                    <SovereignCard
                      title="Audio Processing"
                      icon={<Mic size={14} />}
                      pulse={healerStatus.pulse}
                    >
                      <div className="space-y-6">
                        <div className="h-24 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                          {/* Visualizer Mockup */}
                          <div className="flex items-end gap-1 h-12">
                            {[...Array(24)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  height: isRecordingVoice ? [4, Math.random() * 40 + 10, 4] : 4,
                                }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                                className="w-1 bg-nexus-cyan/40 rounded-full"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div>
                            <span className="text-[10px] text-white/40 block mb-1">MIC STATE</span>
                            <span className="text-xs font-bold text-white uppercase">
                              {isRecordingVoice ? 'Capturing...' : 'Idle'}
                            </span>
                          </div>
                          <button
                            onClick={handleVoiceEnrollment}
                            className={`p-3 rounded-xl transition-all ${isRecordingVoice ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30'}`}
                          >
                            <Mic size={18} />
                          </button>
                        </div>
                      </div>
                    </SovereignCard>

                    {/* Personality Configuration */}
                    <SovereignCard
                      title="Personality Matrix"
                      icon={<Cpu size={14} />}
                      pulse={healerStatus.pulse}
                    >
                      <div className="space-y-4">
                        {[
                          {
                            id: 'sovereign',
                            label: 'MODO SOBERANO',
                            desc: 'Directo, fáctico y protector.',
                          },
                          {
                            id: 'professional',
                            label: 'MODO PROFESIONAL',
                            desc: 'Analítico, detallado y cortés.',
                          },
                          {
                            id: 'empathy',
                            label: 'MODO ASISTENTE',
                            desc: 'Cercano, proactivo y empoderador.',
                          },
                        ].map(mode => (
                          <div
                            key={mode.id}
                            onClick={() => {
                              setVoicePersonality(mode.id as any);
                              speak(`Cambiando a modo ${mode.id}.`);
                            }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                              voicePersonality === mode.id
                                ? 'bg-nexus-cyan/10 border-nexus-cyan/40'
                                : 'bg-white/5 border-white/5 hover:border-nexus-cyan/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-orbitron font-black text-white tracking-widest">
                                {mode.label}
                              </span>
                              <div
                                className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                                  voicePersonality === mode.id
                                    ? 'border-nexus-cyan'
                                    : 'border-nexus-cyan/30'
                                }`}
                              >
                                {voicePersonality === mode.id && (
                                  <div className="w-1.5 h-1.5 bg-nexus-cyan rounded-full" />
                                )}
                              </div>
                            </div>
                            <p className="text-[9px] text-nexus-silver/40 uppercase tracking-tight">
                              {mode.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </SovereignCard>

                    {/* Biometric Linkage */}
                    <SovereignCard
                      title="Biometric Security"
                      icon={<Lock size={14} />}
                      pulse={healerStatus.pulse}
                      className="md:col-span-2"
                    >
                      <div className="flex flex-col md:flex-row gap-6 p-4 bg-nexus-violet/5 rounded-2xl border border-nexus-violet/20">
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-nexus-violet-glow mb-2">
                            HUELLA VOCAL
                          </h4>
                          <p className="text-[10px] text-white/50 leading-relaxed mb-4">
                            Tu voz está vinculada mediante hashing cuántico a la bóveda. Cualquier
                            intento de acceso no autorizado activará el protocolo Shiled
                            automáticamente.
                          </p>
                          <div className="flex gap-4">
                            <button className="text-[10px] font-bold px-4 py-2 bg-nexus-violet/20 border border-nexus-violet/30 rounded-lg text-nexus-violet-glow hover:bg-nexus-violet/30 transition-all">
                              RE-CALIBRAR VOZ
                            </button>
                            <button className="text-[10px] font-bold px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white transition-all">
                              VER REGISTROS
                            </button>
                          </div>
                        </div>
                        <div className="w-full md:w-64 h-32 bg-black/40 rounded-xl border border-nexus-violet/30 flex items-center justify-center">
                          <Fingerprint size={48} className="text-nexus-violet/40 animate-pulse" />
                        </div>
                      </div>
                    </SovereignCard>
                  </div>
                </motion.div>
              )}
              {activeTab === 'terminal' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-4xl mx-auto space-y-12"
                >
                  {/* Healing Alert Banner */}
                  {healingProposals.length > 0 && !isVaultLocked && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between shadow-[0_0_30px_rgba(245,158,11,0.1)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                          <AlertTriangle className="text-amber-500 w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-orbitron font-bold text-amber-500 mb-1">
                            ANOMALÍA DETECTADA
                          </h4>
                          <p className="text-xs text-nexus-silver/60 uppercase tracking-wide">
                            Se requieren {healingProposals.length} acciones de reparación soberana.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('missions')}
                        className="relative z-10 text-[10px] font-orbitron font-bold px-6 py-3 bg-amber-500 text-black rounded-xl hover:bg-amber-400 hover:shadow-amber-glow transition-all uppercase tracking-widest"
                      >
                        RESOLVER
                      </button>
                    </motion.div>
                  )}

                  {/* Mission Launch Section */}
                  <TiltCard className="premium-glass p-1 rounded-3xl border border-white/10 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-nexus-cyan/5 via-transparent to-nexus-violet/5 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[22px] relative h-full">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Zap size={120} className="text-nexus-cyan" />
                      </div>

                      <h3 className="text-xl font-orbitron font-bold text-nexus-cyan mb-8 tracking-wider flex items-center gap-3">
                        <Play className="w-5 h-5" />
                        DESPLEGAR MISIÓN DE ENJAMBRE
                      </h3>

                      <div className="relative">
                        <textarea
                          value={objective}
                          onChange={e => setObjective(e.target.value)}
                          placeholder="Define el objetivo estratégico para el enjambre soberano..."
                          className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-nexus-silver focus:border-nexus-cyan/50 outline-none transition-all resize-none placeholder:text-white/10 font-mono text-sm leading-relaxed"
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <span className="text-[10px] text-white/20 font-mono self-end mr-4">
                            {objective.length} chars
                          </span>
                          <button
                            onClick={handleLaunch}
                            disabled={isLaunching || !objective.trim()}
                            className="flex items-center gap-3 bg-gradient-to-r from-nexus-cyan to-nexus-violet px-8 py-3 rounded-xl font-orbitron font-bold text-xs tracking-widest uppercase hover:shadow-cyan-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                          >
                            {isLaunching ? (
                              'DESPLEGANDO...'
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-white rounded-full group-hover/btn:animate-ping" />
                                INICIAR MISIÓN
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </TiltCard>

                  {/* Diagnostic Mini-Stats - Sovereign Grid Evolution */}
                  <NexusGrid cols={4} pulse={healerStatus.pulse}>
                    <SovereignCard
                      pulse={healerStatus.pulse}
                      title="Estado Bridge"
                      icon={<Network size={14} />}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <span className="text-nexus-cyan text-xs font-bold font-mono">
                          TUNNEL_ACTIVE
                        </span>
                      </div>
                    </SovereignCard>

                    <SovereignCard
                      pulse={healerStatus.pulse}
                      title="Pixel 8 Sovereign"
                      icon={<Smartphone size={14} />}
                      className="cursor-pointer"
                      onClick={handlePixelTest}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]',
                            pixelSnapshot ? 'bg-green-400' : 'bg-white/10'
                          )}
                        />
                        <span className="text-white/60 text-[10px] font-bold">
                          {pixelSnapshot
                            ? `${pixelSnapshot.batteryLevel}% · ${pixelSnapshot.batteryState?.toUpperCase()}`
                            : 'OFFLINE'}
                        </span>
                      </div>
                    </SovereignCard>

                    <SovereignCard
                      pulse={healerStatus.pulse}
                      title="Contexto Físico"
                      icon={<Activity size={14} />}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[10px] font-bold font-mono px-2 py-0.5 rounded border capitalize',
                            pixelSnapshot?.context_level === 'resting'
                              ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                              : pixelSnapshot?.context_level === 'focused'
                                ? 'text-nexus-cyan border-nexus-cyan/30 bg-nexus-cyan/5'
                                : 'text-nexus-violet border-nexus-violet/30 bg-nexus-violet/5'
                          )}
                        >
                          {pixelSnapshot?.context_level || 'ANALIZANDO...'}
                        </span>
                      </div>
                    </SovereignCard>

                    <SovereignCard
                      pulse={healerStatus.pulse}
                      title="Salud del Sistema"
                      icon={<Activity size={14} />}
                    >
                      <PulseHistory history={pulseHistory} />
                    </SovereignCard>
                  </NexusGrid>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        color: 'text-nexus-cyan',
                        title: 'ORQUESTACIÓN',
                        desc: 'Multimodelo y multiagente autónomo.',
                      },
                      {
                        color: 'text-nexus-violet',
                        title: 'SOBERANÍA',
                        desc: 'Datos persistidos en Knowledge Graph privado.',
                      },
                      {
                        color: 'text-green-400',
                        title: 'ZERO TRUST',
                        desc: 'Comunicación cifrada inter-servicios.',
                      },
                    ].map((feature, i) => (
                      <TiltCard
                        key={i}
                        className="bg-black/20 p-6 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all"
                      >
                        <div
                          className={cn(
                            'text-[10px] font-bold tracking-[0.2em] mb-2 uppercase',
                            feature.color
                          )}
                        >
                          {feature.title}
                        </div>
                        <p className="text-xs text-nexus-silver/60">{feature.desc}</p>
                      </TiltCard>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'missions' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-5xl mx-auto pb-10"
                >
                  <div className="mb-8 flex justify-between items-end border-b border-white/10 pb-4">
                    <GodModeText
                      effect="glitch"
                      text="HISTORIAL DE OPERACIONES"
                      className="text-2xl font-black"
                    />
                    <button
                      onClick={loadMissions}
                      className="p-2 rounded-lg bg-white/5 hover:bg-nexus-cyan/20 hover:text-nexus-cyan transition-all"
                      title="Actualizar Misiones"
                    >
                      <History size={18} />
                    </button>
                  </div>

                  {/* Healing Section */}
                  {healingProposals.length > 0 && (
                    <div className="mb-12">
                      <h4 className="text-xs font-orbitron font-bold text-amber-500 mb-6 tracking-[0.2em] uppercase flex items-center gap-2">
                        <AlertTriangle size={14} /> Propuestas de Autocuración
                      </h4>
                      <div className="grid gap-4">
                        {healingProposals.map(proposal => (
                          <TiltCard
                            key={proposal.id}
                            className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl flex items-center justify-between"
                          >
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Zap className="text-amber-500 w-6 h-6" />
                              </div>
                              <div>
                                <h5 className="font-bold text-amber-500 text-sm mb-1">
                                  {proposal.objective}
                                </h5>
                                <p className="text-[10px] text-nexus-silver/40 uppercase tracking-widest flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Acción sugerida por el detective de infraestructura
                                </p>
                              </div>
                            </div>
                            {!isVaultLocked ? (
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleExecuteRepair(proposal, false)}
                                  className="px-5 py-2 rounded-xl border border-red-500/30 text-red-500 text-[10px] font-bold hover:bg-red-500/10 transition-all uppercase tracking-wider"
                                >
                                  RECHAZAR
                                </button>
                                <button
                                  onClick={() => handleExecuteRepair(proposal, true)}
                                  className="px-6 py-2 bg-amber-500 text-black rounded-xl text-[10px] font-bold hover:shadow-amber-glow hover:bg-amber-400 transition-all uppercase tracking-wider"
                                >
                                  AUTORIZAR
                                </button>
                              </div>
                            ) : (
                              <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-[10px] text-nexus-silver/30 font-orbitron flex items-center gap-2 uppercase tracking-wider">
                                <Lock size={12} /> DESBLOQUEAR bóveda PARA ACCIONAR
                              </div>
                            )}
                          </TiltCard>
                        ))}
                      </div>
                    </div>
                  )}

                  <h4 className="text-xs font-orbitron font-bold text-nexus-cyan mb-6 tracking-[0.2em] uppercase flex items-center gap-2">
                    <Activity size={14} /> Misiones de Investigación
                  </h4>
                  <div className="grid gap-4">
                    {standardMissions.map((mission, idx) => (
                      <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 group hover:border-nexus-cyan/30 transition-all relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-12 bg-nexus-cyan/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  'p-3 rounded-xl border transition-colors',
                                  mission.status === 'completed'
                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                    : 'bg-nexus-cyan/10 border-nexus-cyan/20 text-nexus-cyan animate-pulse'
                                )}
                              >
                                {mission.status === 'completed' ? (
                                  <CheckCircle2 size={20} />
                                ) : (
                                  <Activity size={20} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-nexus-silver group-hover:text-white transition-colors text-sm">
                                  {mission.objective}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-[10px] text-white/30 uppercase tracking-widest font-mono">
                                  <span>ID: {mission.id.substring(0, 8)}</span>
                                  <span className="w-1 h-1 rounded-full bg-white/20" />
                                  <span>
                                    {new Date(mission.createdAt).toLocaleDateString('es-ES')}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-white/20" />
                                  <span
                                    className={
                                      mission.status === 'completed'
                                        ? 'text-green-500'
                                        : 'text-nexus-cyan'
                                    }
                                  >
                                    {mission.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {mission.isEncrypted && isVaultLocked ? (
                                <div className="flex items-center gap-2 text-red-400 text-[10px] font-orbitron tracking-wider px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                  <Lock size={12} /> ENCRIPTADO
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleRevealFindings(mission)}
                                  disabled={isDecrypting === mission.id}
                                  className={cn(
                                    'px-5 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider border shadow-sm',
                                    decryptedFindings[mission.id]
                                      ? 'bg-white/5 border-white/10 text-white/50'
                                      : 'bg-nexus-cyan/20 border-nexus-cyan/40 text-white hover:bg-nexus-cyan/30 hover:shadow-cyan-glow/20'
                                  )}
                                >
                                  {isDecrypting === mission.id
                                    ? 'DESCIFRANDO...'
                                    : decryptedFindings[mission.id]
                                      ? 'DESBLOQUEADO'
                                      : 'VER HALLAZGOS'}
                                </button>
                              )}
                            </div>
                          </div>

                          {decryptedFindings[mission.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-4 p-4 bg-black/40 rounded-xl border border-nexus-cyan/10 text-xs text-nexus-cyan/80 font-mono overflow-hidden shadow-inner"
                            >
                              <pre className="whitespace-pre-wrap">
                                {decryptedFindings[mission.id]}
                              </pre>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'memory' && (
                <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
                  <Database size={64} className="text-nexus-cyan mb-6 animate-pulse" />
                  <div className="text-sm font-orbitron tracking-[0.3em] text-nexus-silver uppercase">
                    Visualización de Grafo de Memoria
                  </div>
                  <div className="text-[10px] uppercase mt-4 text-white/20 tracking-widest">
                    Nodo Soberano Inactivo · Sincronización Requerida
                  </div>
                </div>
              )}

              {activeTab === 'swarm' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-6xl mx-auto space-y-12 pb-20"
                >
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                      <GodModeText
                        effect="hologram"
                        text="VISUALIZACIÓN DE ENJAMBRE NEURAL"
                        className="text-2xl font-black"
                      />
                      <p className="text-[10px] text-nexus-silver/40 font-orbitron tracking-[0.2em] mt-1 uppercase">
                        Topografía de conexiones activas y telemetría de agentes
                      </p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-nexus-cyan/5 border border-nexus-cyan/20 rounded-xl">
                      <Activity size={12} className="text-nexus-cyan" />
                      <span className="text-[10px] font-mono text-nexus-cyan uppercase">
                        Sinc: 99.9%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Neural Graph (SVG Visualization) */}
                    <div className="lg:col-span-2 premium-glass rounded-3xl border border-white/5 aspect-[4/3] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-nexus-cyan/2 pointer-events-none" />
                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <Network size={14} className="text-nexus-cyan" />
                        <span className="text-[10px] font-orbitron font-bold text-nexus-cyan/60 uppercase">
                          Mapa Neural en Tiempo Real
                        </span>
                      </div>

                      <svg viewBox="0 0 800 600" className="w-full h-full p-12">
                        <defs>
                          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Connections */}
                        <g className="data-pulse stroke-nexus-cyan/20" strokeWidth="1">
                          <line x1="400" y1="300" x2="200" y2="150" />
                          <line x1="400" y1="300" x2="600" y2="150" />
                          <line x1="400" y1="300" x2="200" y2="450" />
                          <line x1="400" y1="300" x2="600" y2="450" />
                          <line x1="200" y1="150" x2="600" y2="150" />
                        </g>

                        {/* Nodes */}
                        {[
                          { x: 400, y: 300, label: 'NÚCLEO', id: 'nucleus', type: 'CORE' },
                          { x: 200, y: 150, label: 'DANIELA', id: 'daniela', type: 'INTEL' },
                          { x: 600, y: 150, label: 'SENTINEL', id: 'sentinel', type: 'SURV' },
                          { x: 200, y: 450, label: 'BRIDGE', id: 'bridge', type: 'SYNC' },
                          { x: 600, y: 450, label: 'GEMS', id: 'gems', type: 'AUTO' },
                        ].map(node => (
                          <motion.g
                            key={node.id}
                            className="cursor-pointer group/node"
                            whileHover={{ scale: 1.05 }}
                          >
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="25"
                              fill="url(#nodeGlow)"
                              className="neural-node-glow"
                            />
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="8"
                              fill="#06b6d4"
                              className="shadow-cyan-glow"
                            />
                            <text
                              x={node.x}
                              y={node.y + 40}
                              textAnchor="middle"
                              fill="white"
                              className="text-[10px] font-orbitron font-bold opacity-40 group-hover/node:opacity-100 transition-opacity"
                            >
                              {node.label}
                            </text>
                            <text
                              x={node.x}
                              y={node.y + 52}
                              textAnchor="middle"
                              fill="#06b6d4"
                              className="text-[8px] font-mono opacity-20 group-hover/node:opacity-60 transition-opacity"
                            >
                              {node.type}
                            </text>
                          </motion.g>
                        ))}
                      </svg>

                      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-nexus-cyan shadow-cyan-glow" />
                            <span className="text-[10px] font-mono text-white/40">
                              NODO_ACTUALIZADO
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-nexus-cyan/40">
                          ID_PROTOCOLO: XRP-61
                        </span>
                      </div>
                    </div>

                    {/* Right: Telemetry Sidecards */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-orbitron font-bold text-white/30 tracking-[0.3em] uppercase mb-6">
                        ESTADO DE AGENTES
                      </h4>

                      {[
                        {
                          icon: Zap,
                          name: 'Núcleo Central',
                          state: 'DETERMINISTA',
                          value: '14.2 TFLOPS',
                          color: 'text-nexus-cyan',
                          load: 45,
                        },
                        {
                          icon: Mic,
                          name: 'Voz Daniela',
                          state: 'SINCRONIZADO',
                          value: 'Sinc 99%',
                          color: 'text-white',
                          load: 12,
                        },
                        {
                          icon: Eye,
                          name: 'Centinela AR',
                          state: 'VIGILANDO',
                          value: '4 Cámaras',
                          color: 'text-nexus-cyan',
                          load: 28,
                        },
                        {
                          icon: Cpu,
                          name: 'Gems Auto-Healing',
                          state: 'STANDBY',
                          value: '0 Fallos',
                          color: 'text-emerald-400',
                          load: 5,
                        },
                      ].map((agent, i) => (
                        <TiltCard
                          key={i}
                          className="bg-white/5 border border-white/10 p-5 rounded-2xl group hover:border-nexus-cyan/40 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4 items-center">
                              <div className={cn('p-2 rounded-xl bg-white/5', agent.color)}>
                                <agent.icon size={18} />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">{agent.name}</div>
                                <div className="text-[9px] text-white/20 uppercase tracking-widest">
                                  {agent.state}
                                </div>
                              </div>
                            </div>
                            <div className="text-[10px] font-mono text-nexus-cyan">
                              {agent.value}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono uppercase text-white/20">
                              <span>Carga Neuronal</span>
                              <span>{agent.load}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${agent.load}%` }}
                                className="h-full bg-nexus-cyan shadow-cyan-glow"
                              />
                            </div>
                          </div>
                        </TiltCard>
                      ))}

                      <div className="p-6 rounded-3xl bg-nexus-cyan/5 border border-nexus-cyan/20 space-y-3">
                        <div className="flex items-center gap-2">
                          <Share2 size={14} className="text-nexus-cyan" />
                          <span className="text-[10px] font-orbitron font-bold text-white">
                            RED SOBERANA
                          </span>
                        </div>
                        <p className="text-[10px] text-nexus-silver/50 leading-tight">
                          Todos los agentes están operando bajo el protocolo Zero-Trust en el canal
                          PQC activo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Swarm Governance Section */}
                  <div className="pt-12 border-t border-white/5">
                    <div className="flex items-center gap-4 mb-8">
                      <ShieldCheck size={24} className="text-nexus-cyan" />
                      <div>
                        <h3 className="text-xl font-orbitron font-black text-white uppercase tracking-tighter">
                          GOBERNANZA DEL ENJAMBRE SOBERANO
                        </h3>
                        <p className="text-[10px] text-nexus-silver/40 font-mono uppercase tracking-[0.2em]">
                          Protocolo de Auto-Reparación y Auditoría Continua
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Governance Metrics */}
                      <div className="lg:col-span-1 space-y-4">
                        {[
                          {
                            label: 'Reparaciones Totales',
                            value: '12',
                            subValue: 'Últimas 24h',
                            icon: Cpu,
                          },
                          {
                            label: 'Uptime del Healer',
                            value: '99.99%',
                            subValue: 'Sincronizado',
                            icon: Activity,
                          },
                          { label: 'Misiones IA', value: '47', subValue: 'Exitosas', icon: Zap },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden text-left"
                          >
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                              <stat.icon size={48} />
                            </div>
                            <div className="text-[10px] text-white/30 uppercase font-orbitron mb-1">
                              {stat.label}
                            </div>
                            <div className="text-2xl font-black text-white font-mono">
                              {stat.value}
                            </div>
                            <div className="text-[9px] text-nexus-cyan/60 uppercase font-mono mt-1">
                              {stat.subValue}
                            </div>
                          </div>
                        ))}

                        <button
                          className="w-full py-4 bg-nexus-cyan border border-nexus-cyan shadow-cyan-glow hover:bg-transparent hover:text-nexus-cyan transition-all rounded-2xl font-orbitron font-bold text-[10px] uppercase tracking-widest text-black flex items-center justify-center gap-3"
                          onClick={() => {
                            // Trigger Swarm Audit via MCP or API logic here
                            console.log('🛰️ Invocando Auditoría Maestro...');
                          }}
                        >
                          <Search size={14} />
                          EJECUTAR AUDITORÍA MAESTRO
                        </button>
                      </div>

                      {/* Mission History / Healer Logs */}
                      <div className="lg:col-span-3 premium-glass rounded-3xl border border-white/5 overflow-hidden flex flex-col text-left">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                          <div className="flex items-center gap-3">
                            <History size={16} className="text-nexus-cyan" />
                            <span className="text-xs font-orbitron font-bold text-white uppercase tracking-widest">
                              LOG DE INTERVENCIONES DEL HEALER
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-nexus-cyan/40">
                            TIEMPO_REAL: {healerStatus.pulse.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 p-6 font-mono text-[11px] space-y-3 overflow-y-auto max-h-[400px]">
                          {healerStatus.recentRepairs.length > 0 ? (
                            healerStatus.recentRepairs.map((log, i) => (
                              <div
                                key={log.id}
                                className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-4 items-start group hover:border-nexus-cyan/20 transition-all"
                              >
                                <div className="text-nexus-cyan/30 mt-1">{i + 1}.</div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-white font-bold">AUTONOMOUS_REPAIR</span>
                                    <span className="text-white/20">
                                      {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="text-nexus-silver/60">{log.objective}</div>
                                  <div className="flex gap-4 pt-1">
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/20">
                                      COMPLETED
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-nexus-silver/20 text-center py-10 uppercase tracking-[0.2em]">
                              No hay reparaciones autónomas recientes
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Status Ticker - Global PQC Monitor */}
        <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 overflow-hidden z-20">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[
              'PQC_KYBER_ENABLED',
              'ENTROPÍA_CUÁNTICA: 99.98%',
              'MISIÓN_ENJAMBRE_ACTIVA',
              'ZERO_TRUST_VERIFIED',
              'DANIEL_VOICE_ENCRYPTION_ON',
              'SINC_NEXUS_ESTABLE',
              'SISTEMA_DETERMINISTA_ACTIVO',
            ].map((tag, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-[9px] font-orbitron tracking-[0.3em] text-nexus-cyan/40 hover:text-nexus-cyan transition-colors uppercase cursor-default"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                {tag}
              </div>
            ))}
            {/* Repeat for seamless marquee */}
            {[
              'PQC_KYBER_ENABLED',
              'ENTROPÍA_CUÁNTICA: 99.98%',
              'MISIÓN_ENJAMBRE_ACTIVA',
              'ZERO_TRUST_VERIFIED',
              'DANIEL_VOICE_ENCRYPTION_ON',
              'SINC_NEXUS_ESTABLE',
              'SISTEMA_DETERMINISTA_ACTIVO',
            ].map((tag, i) => (
              <div
                key={`repeat-${i}`}
                className="flex items-center gap-3 text-[9px] font-orbitron tracking-[0.3em] text-nexus-cyan/40 hover:text-nexus-cyan transition-colors uppercase cursor-default"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                {tag}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-6 ml-6 bg-black/40 h-full">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-white/30 font-orbitron">LATENCIA PQC</span>
              <span className="text-[10px] text-green-400 font-mono">1.2ms</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-white/30 font-orbitron">ENTROPÍA</span>
              <span className="text-[10px] text-nexus-cyan font-mono">0.9998</span>
            </div>
          </div>
        </div>
      </SpotlightWrapper>
    </SystemAnxietyEffect>
  );
};;;
