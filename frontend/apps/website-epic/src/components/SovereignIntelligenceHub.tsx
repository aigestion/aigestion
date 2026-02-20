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
  Cpu,
  Database,
  Shield,
  AlertTriangle,
  Server
} from 'lucide-react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { sovereignGodMode, SwarmMission } from '../services/sovereign-godmode';
import { useNotification } from '../contexts/NotificationContext';
import { SpotlightWrapper } from './design-system/SpotlightWrapper';
import { GodModeText } from './design-system/GodModeText';
import { TiltCard } from './design-system/TiltCard';
import { cn } from '../utils/cn';

export const SovereignIntelligenceHub: React.FC = () => {
  const { notify } = useNotification();
  const [objective, setObjective] = useState('');
  const [missions, setMissions] = useState<SwarmMission[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceEnrollmentActive, setVoiceEnrollmentActive] = useState(false);
  const [sovereignSession, setSovereignSession] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'terminal' | 'missions' | 'memory' | 'sentinel'>(
    'terminal'
  );
  const [decryptedFindings, setDecryptedFindings] = useState<Record<string, string>>({});
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);
  const [forecasts, setForecasts] = useState<any[]>([]);

  useEffect(() => {
    loadMissions();
    if (activeTab === 'sentinel') {
      loadForecasts();
    }
  }, [activeTab]);

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
          setVoiceEnrollmentActive(false);
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

  const healingProposals = missions.filter(m => m.metadata?.isHealingProposal);
  const standardMissions = missions.filter(m => !m.metadata?.isHealingProposal);

  return (
    <SpotlightWrapper className="flex flex-col h-full text-white font-sans overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nexus-cyan/5 to-transparent bg-[length:100%_4px] opacity-20 animate-scan" />
      </div>

      {/* Header */}
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-md relative z-10">
        <div>
          <GodModeText
            text="SOVEREIGN INTELLIGENCE HUB"
            effect="hologram"
            className="text-3xl font-black tracking-[0.2em] mb-1"
          />
          <div className="flex items-center gap-2 text-nexus-silver/40 text-xs font-orbitron tracking-widest uppercase">
             <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse" />
             Centro de Mando de Enjambre Autónomo v2.5
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {healingProposals.length > 0 && !isVaultLocked && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg animate-pulse">
              <Activity size={12} className="text-amber-500" />
              <span className="text-[10px] text-amber-500 font-orbitron font-bold">
                SYSTEM HEALING REQUIRED
              </span>
            </div>
          )}

          <div className="flex flex-col items-end mr-4">
            <button
              onClick={isVaultLocked ? handleSovereignUnlock : () => setIsVaultLocked(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold transition-all border shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                 isVaultLocked
                   ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse hover:bg-red-500/20'
                   : 'bg-nexus-cyan/10 text-nexus-cyan border-nexus-cyan/30 hover:bg-nexus-cyan/20'
              )}
            >
              {isAuthenticating ? (
                'VERIFICANDO...'
              ) : isVaultLocked ? (
                <>
                  <Lock size={12} /> VAULT LOCKED
                </>
              ) : (
                <>
                  <Unlock size={12} /> VAULT OPEN
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-nexus-cyan font-bold tracking-widest">IA STATUS</span>
            <span className={cn("text-xs uppercase font-bold", isVaultLocked ? "text-red-400" : "text-green-400")}>
              {isVaultLocked ? 'RESTRICTED' : 'GOD MODE ACTIVE'}
            </span>
          </div>

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
                 "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                 isRecordingVoice
                   ? 'bg-red-500/20 border-red-500 animate-pulse shadow-red-glow'
                   : 'bg-nexus-cyan/5 border-nexus-cyan/30 hover:bg-nexus-cyan/20 hover:border-nexus-cyan/50 hover:shadow-cyan-glow'
               )}
               onClick={handleVoiceEnrollment}
               title="Enroll Sovereign VoiceKey"
            >
               <Mic size={18} className={isRecordingVoice ? "text-red-500" : "text-nexus-cyan"} />
            </button>

             <button
               className="w-10 h-10 rounded-full bg-nexus-cyan/5 border border-nexus-cyan/30 flex items-center justify-center hover:bg-nexus-cyan/20 hover:border-nexus-cyan/50 transition-all hover:shadow-cyan-glow"
               onClick={handleEnrollHardwareKey}
               title="Register Hardware Key"
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
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-full blur-xl"
              />
              <div className="relative w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center shadow-red-glow">
                <Mic size={40} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
            <GodModeText
              text="ESCANEANDO BIOMETRÍA DE VOZ"
              effect="glitch"
              className="mt-8 text-2xl font-bold text-white"
            />
            <p className="text-nexus-silver/60 font-orbitron text-xs mt-4 animate-pulse uppercase tracking-widest">
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
            { id: 'missions', icon: Activity, label: 'MISIONES', alert: healingProposals.length > 0 },
            { id: 'memory', icon: Network, label: 'MEMORIA' },
            { id: 'sentinel', icon: Eye, label: 'CENTINELA' },
            { id: 'infra', icon: Server, label: 'INFRAESTRUCTURA' }
          ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={cn(
                 "p-3 rounded-xl transition-all relative group",
                 activeTab === item.id
                   ? 'bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                   : 'text-white/30 hover:text-white hover:bg-white/5'
               )}
               title={item.label}
             >
               <item.icon size={24} className={cn("transition-transform duration-300", activeTab === item.id ? "scale-110" : "group-hover:scale-105")} />
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

                {/* Diagnostic Mini-Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-nexus-cyan/30 transition-colors">
                    <span className="text-[10px] font-orbitron text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <Network size={12} /> Estado Bridge
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      <span className="text-nexus-cyan text-xs font-bold font-mono">
                        TUNNEL_ACTIVE
                      </span>
                    </div>
                  </div>
                  {forecasts.map(f => (
                    <div
                      key={f.metric}
                      className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-nexus-violet/30 transition-colors"
                    >
                      <span className="text-[10px] font-orbitron text-white/30 uppercase tracking-widest block truncate">
                        {f.metric}
                      </span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-xl font-orbitron font-bold text-nexus-silver">
                          {Math.round(f.currentValue)}%
                        </span>
                        <span
                          className={`text-[10px] font-mono ${f.predictedValue1h > f.currentValue ? 'text-amber-500' : 'text-green-400'}`}
                        >
                          → {Math.round(f.predictedValue1h)}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* Placeholder Stats if empty */}
                  {forecasts.length === 0 && (
                     <>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 opacity-50">
                           <span className="text-[10px] font-orbitron text-white/30 uppercase tracking-widest">CPU LOAD</span>
                             <div className="h-6 w-full bg-white/5 rounded mt-2 animate-pulse" />
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 opacity-50">
                           <span className="text-[10px] font-orbitron text-white/30 uppercase tracking-widest">MEMORY</span>
                           <div className="h-6 w-full bg-white/5 rounded mt-2 animate-pulse" />
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 opacity-50">
                           <span className="text-[10px] font-orbitron text-white/30 uppercase tracking-widest">I/O OPS</span>
                           <div className="h-6 w-full bg-white/5 rounded mt-2 animate-pulse" />
                        </div>
                     </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                     { color: 'text-nexus-cyan', title: 'ORQUESTACIÓN', desc: 'Multimodelo y multiagente autónomo.' },
                     { color: 'text-nexus-violet', title: 'SOBERANÍA', desc: 'Datos persistidos en Knowledge Graph privado.' },
                     { color: 'text-green-400', title: 'ZERO TRUST', desc: 'Comunicación cifrada inter-servicios.' }
                  ].map((feature, i) => (
                      <TiltCard key={i} className="bg-black/20 p-6 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                        <div className={cn("text-[10px] font-bold tracking-[0.2em] mb-2 uppercase", feature.color)}>
                          {feature.title}
                        </div>
                        <p className="text-xs text-nexus-silver/60">
                          {feature.desc}
                        </p>
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
                  <GodModeText effect="glitch" text="HISTORIAL DE OPERACIONES" className="text-2xl font-black" />
                  <button
                    onClick={loadMissions}
                    className="p-2 rounded-lg bg-white/5 hover:bg-nexus-cyan/20 hover:text-nexus-cyan transition-all"
                    title="Refresh Missions"
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
                              <h5 className="font-bold text-amber-500 text-sm mb-1">{proposal.objective}</h5>
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
                                "p-3 rounded-xl border transition-colors",
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
                                <span>{new Date(mission.createdAt).toLocaleDateString('es-ES')}</span>
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
                              <div className="flex items-center gap-2 text-red-400 text-[10px] font-orbitron tracking-wider px-4 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
                                <Lock size={12} /> ENCRYPTED
                              </div>
                            ) : (
                              <button
                                onClick={() => handleRevealFindings(mission)}
                                disabled={isDecrypting === mission.id}
                                className={cn(
                                  "px-5 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider border",
                                  decryptedFindings[mission.id]
                                    ? "bg-white/5 border-white/10 text-white/50"
                                    : "bg-nexus-cyan/10 border-nexus-cyan/30 text-nexus-cyan hover:bg-nexus-cyan/20"
                                )}
                              >
                                {isDecrypting === mission.id
                                  ? 'DECRYPTING...'
                                  : decryptedFindings[mission.id]
                                    ? 'UNLOCKED'
                                    : 'VER FINDINGS'}
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
                            <pre className="whitespace-pre-wrap">{decryptedFindings[mission.id]}</pre>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'memory' && (
               <div className="flex flex-col items-center justify-center h-64 opacity-50">
                  <Database size={48} className="text-nexus-cyan mb-4 animate-pulse" />
                  <div className="text-sm font-orbitron tracking-widest text-nexus-silver">
                     MEMORY GRAPH VISUALIZATION
                  </div>
                  <div className="text-[10px] uppercase mt-2 text-white/30">
                     Sovereign Node Link Inactive
                  </div>
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Status Ticker - Absolute Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/5 bg-black/80 backdrop-blur-md flex items-center px-4 overflow-hidden z-20">
         <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {['NEUROCORE_READY', 'SWARM_ENGINE_STABLE', 'MEMORY_GRAPH_SYNCED', 'QUANTUM_TUNNEL_ESTABLISHED', 'ZERO_TRUST_ENFORCED'].map((tag, i) => (
               <div
                  key={i}
                  className="flex items-center gap-2 text-[9px] font-orbitron tracking-[0.2em] text-nexus-silver/30 uppercase"
               >
                  <div className="w-1 h-1 rounded-full bg-nexus-cyan" />
                  {tag}
               </div>
            ))}
         </div>
      </div>
    </SpotlightWrapper>
  );
};
