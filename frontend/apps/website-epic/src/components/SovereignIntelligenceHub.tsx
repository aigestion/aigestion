import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Terminal,
  Activity,
  Database,
  Cpu,
  CheckCircle2,
  Play,
  History,
  Network,
  Lock,
  Unlock,
  Key,
  Mic,
  Eye,
} from 'lucide-react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { sovereignGodMode, SwarmMission } from '../services/sovereign-godmode';
import { useNotification } from '../contexts/NotificationContext';
import { KnowledgeGraphExplorer } from './KnowledgeGraphExplorer';

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
      // This would ideally be a separate endpoint, but for now we update the mission status
      // which the backend SovereignHealingService monitors if it were polling,
      // or we call a direct repair endpoint.
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
    <div className="flex flex-col h-full bg-[#050505] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-orbitron font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan via-white to-nexus-violet">
            SOVEREIGN INTELLIGENCE HUB
          </h1>
          <p className="text-nexus-silver/40 text-xs font-orbitron tracking-widest mt-2 uppercase">
            Centro de Mando de Enjambre Autónomo v2.5
          </p>
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold transition-all ${isVaultLocked ? 'bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}
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
            <span className="text-xs text-white/80 animate-pulse uppercase">
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
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-all ${isRecordingVoice ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-nexus-cyan/20 border-nexus-cyan/40 hover:bg-nexus-cyan/40'}`}
            onClick={handleVoiceEnrollment}
            title="Enroll Sovereign VoiceKey"
          >
            <Mic
              size={20}
              className={isRecordingVoice ? 'text-red-500' : 'text-nexus-cyan shadow-glow'}
            />
          </div>
          <div
            className="w-10 h-10 rounded-full bg-nexus-cyan/20 border border-nexus-cyan/40 flex items-center justify-center cursor-pointer hover:bg-nexus-cyan/40 transition-all"
            onClick={handleEnrollHardwareKey}
            title="Register Hardware Key"
          >
            <Key size={20} className="text-nexus-cyan shadow-glow" />
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-full"
              />
              <div className="relative w-24 h-24 rounded-full bg-red-500 flex items-center justify-center shadow-red-glow">
                <Mic size={40} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-orbitron font-bold text-white mt-8 tracking-widest uppercase">
              Escaneando Biometría de Voz
            </h2>
            <p className="text-nexus-silver/60 font-orbitron text-xs mt-4 animate-pulse">
              Habla ahora: "Soberanía AIGestion activa"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow overflow-hidden flex">
        {/* Navigation Sidebar */}
        <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'terminal' ? 'bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30' : 'text-white/30 hover:text-white'}`}
          >
            <Terminal size={24} />
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'missions' ? 'bg-nexus-violet/10 text-nexus-violet border border-nexus-violet/30' : 'text-white/30 hover:text-white'}`}
          >
            <div className="relative">
              <Activity size={24} />
              {healingProposals.length > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'memory' ? 'bg-nexus-cyan/10 text-nexus-cyan border border-white/10' : 'text-white/30 hover:text-white'}`}
          >
            <Network size={24} />
          </button>
          <button
            onClick={() => setActiveTab('sentinel')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'sentinel' ? 'bg-nexus-violet/10 text-nexus-violet border border-nexus-violet/30' : 'text-white/30 hover:text-white'}`}
          >
            <Eye size={24} />
          </button>
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
                    className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Activity className="text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-orbitron font-bold text-amber-500">
                          ANOMALÍA DETECTADA
                        </h4>
                        <p className="text-xs text-nexus-silver/60">
                          Se requieren {healingProposals.length} acciones de reparación soberana.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('missions')}
                      className="text-[10px] font-orbitron font-bold px-4 py-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-all"
                    >
                      REVISAR PROPUESTAS
                    </button>
                  </motion.div>
                )}

                {/* Mission Launch Section */}
                <section className="premium-glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={80} />
                  </div>

                  <h3 className="text-xl font-orbitron font-bold text-nexus-cyan mb-6 tracking-wider">
                    DEPLEGAR MISIÓN DE ENJAMBRE
                  </h3>

                  <div className="relative">
                    <textarea
                      value={objective}
                      onChange={e => setObjective(e.target.value)}
                      placeholder="Define el objetivo estratégico para el enjambre soberano..."
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-6 text-nexus-silver focus:border-nexus-cyan/50 outline-none transition-all resize-none placeholder:text-white/10"
                    />
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={handleLaunch}
                        disabled={isLaunching || !objective.trim()}
                        className="flex items-center gap-3 bg-gradient-to-r from-nexus-cyan to-nexus-violet px-8 py-3 rounded-xl font-orbitron font-bold text-xs tracking-widest uppercase hover:shadow-cyan-glow transition-all disabled:opacity-50"
                      >
                        {isLaunching ? (
                          'DESPLEGANDO...'
                        ) : (
                          <>
                            <Play size={16} fill="white" />
                            INICIAR MISIÓN
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Diagnostic Mini-Stats */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                      <span className="text-[10px] font-orbitron text-white/30 uppercase tracking-widest">
                        Estado Bridge
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
                        <span className="text-nexus-cyan text-xs font-bold">
                          SOVEREIGN_TUNNEL:8000
                        </span>
                      </div>
                    </div>
                    {forecasts.map(f => (
                      <div
                        key={f.metric}
                        className="bg-white/5 p-4 rounded-xl border border-white/5"
                      >
                        <span className="text-[10px] font-orbitron text-white/30 uppercase tracking-widest">
                          {f.metric} Projection
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-orbitron font-bold text-nexus-silver">
                            {Math.round(f.currentValue)}%
                          </span>
                          <span
                            className={`text-[10px] ${f.predictedValue1h > f.currentValue ? 'text-amber-500' : 'text-nexus-cyan'}`}
                          >
                            → {Math.round(f.predictedValue1h)}% (1h)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[10px] text-nexus-cyan font-bold tracking-widest mb-1 uppercase">
                        ORQUESTACIÓN
                      </div>
                      <p className="text-xs text-nexus-silver/60">
                        Multimodelo y multiagente autónomo.
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[10px] text-nexus-violet font-bold tracking-widest mb-1 uppercase">
                        SOBERANÍA
                      </div>
                      <p className="text-xs text-nexus-silver/60">
                        Datos persistidos en Knowledge Graph privado.
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[10px] text-green-400 font-bold tracking-widest mb-1 uppercase">
                        ZERO TRUST
                      </div>
                      <p className="text-xs text-nexus-silver/60">
                        Comunicación cifrada inter-servicios.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Status Ticker */}
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {['NEUROCORE_READY', 'SWARM_ENGINE_STABLE', 'MEMORY_GRAPH_SYNCED'].map(tag => (
                    <div
                      key={tag}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 text-[9px] font-orbitron tracking-widest text-nexus-silver/40"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse" />
                      {tag}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'missions' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-8 flex justify-between items-end">
                  <h3 className="text-2xl font-orbitron font-bold tracking-tighter">
                    HISTORIAL DE OPERACIONES
                  </h3>
                  <button
                    onClick={loadMissions}
                    className="text-nexus-cyan hover:text-white transition-colors"
                  >
                    <History size={20} />
                  </button>
                </div>

                {/* Healing Section */}
                {healingProposals.length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xs font-orbitron font-bold text-amber-500 mb-6 tracking-[0.2em] uppercase">
                      ⚠️ Propuestas de Autocuración (Requiere Autorización Soberana)
                    </h4>
                    <div className="grid gap-4">
                      {healingProposals.map(proposal => (
                        <div
                          key={proposal.id}
                          className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                              <Zap className="text-amber-500" />
                            </div>
                            <div>
                              <h5 className="font-bold text-amber-500/80">{proposal.objective}</h5>
                              <p className="text-[10px] text-nexus-silver/40 uppercase tracking-widest mt-1">
                                Acción sugerida por el detective de infraestructura
                              </p>
                            </div>
                          </div>
                          {!isVaultLocked ? (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleExecuteRepair(proposal, false)}
                                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 text-[10px] font-bold hover:bg-red-500/5 transition-all"
                              >
                                DENY
                              </button>
                              <button
                                onClick={() => handleExecuteRepair(proposal, true)}
                                className="px-6 py-2 bg-amber-500 text-black rounded-lg text-[10px] font-bold hover:shadow-amber-glow transition-all"
                              >
                                AUTHORIZE
                              </button>
                            </div>
                          ) : (
                            <div className="text-[10px] text-nexus-silver/30 font-orbitron flex items-center gap-2">
                              <Lock size={12} /> UNLOCK VAULT TO ACTION
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h4 className="text-xs font-orbitron font-bold text-nexus-cyan mb-6 tracking-[0.2em] uppercase">
                  Misiones de Investigación
                </h4>
                <div className="grid gap-6">
                  {standardMissions.map(mission => (
                    <div
                      key={mission.id}
                      className="bg-[#111] p-6 rounded-2xl border border-white/5 group hover:border-nexus-cyan/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-full ${mission.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-nexus-cyan/10 text-nexus-cyan animate-pulse'}`}
                          >
                            {mission.status === 'completed' ? (
                              <CheckCircle2 size={24} />
                            ) : (
                              <Activity size={24} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-nexus-silver group-hover:text-nexus-cyan transition-colors">
                              {mission.objective}
                            </h4>
                            <div className="flex gap-4 mt-2 text-[10px] text-white/30 uppercase tracking-widest">
                              <span>ID: {mission.id}</span>
                              <span>{new Date(mission.createdAt).toLocaleString()}</span>
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
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {mission.isEncrypted && isVaultLocked ? (
                            <div className="flex items-center gap-2 text-red-400 text-xs font-orbitron">
                              <Lock size={14} /> ENCRYPTED
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRevealFindings(mission)}
                              disabled={isDecrypting === mission.id}
                              className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20 disabled:opacity-50"
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
                          className="mt-4 p-6 bg-black/60 rounded-xl border border-nexus-cyan/20 text-xs font-mono text-nexus-silver/80 leading-relaxed whitespace-pre-wrap"
                        >
                          <div className="text-[9px] text-nexus-cyan mb-2 font-bold tracking-widest uppercase flex items-center gap-2">
                            <Unlock size={10} /> Sovereign Vault Clearance: GRANTED
                          </div>
                          {decryptedFindings[mission.id]}
                        </motion.div>
                      )}
                    </div>
                  ))}
                  {standardMissions.length === 0 && (
                    <div className="text-center py-20 text-white/20">
                      <Database size={40} className="mx-auto mb-4 opacity-50" />
                      <p className="font-orbitron tracking-widest text-sm">
                        SIN MISIONES REGISTRADAS
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'memory' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full flex flex-col"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-orbitron font-bold tracking-tighter">
                    SOVEREIGN KNOWLEDGE GRAPH
                  </h3>
                  <div className="text-[10px] text-nexus-silver/40 font-orbitron tracking-[0.3em] uppercase">
                    Visualizador de Memoria Distribuida
                  </div>
                </div>

                <div className="flex-grow bg-black/40 rounded-3xl border border-nexus-cyan/10 border-dashed relative overflow-hidden">
                  <KnowledgeGraphExplorer />
                </div>
              </motion.div>
            )}

            {activeTab === 'sentinel' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-6xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-orbitron font-bold text-nexus-variant">
                      SENTINEL: INTELIGENCIA TEMPORAL
                    </h2>
                    <p className="text-nexus-silver/50 tracking-[0.2em] text-xs mt-2 uppercase">
                      Proyección de Infraestructura y Predicción de Fallos
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-nexus-violet/10 border border-nexus-violet/30 flex items-center gap-3">
                    <Activity className="text-nexus-violet animate-pulse" size={16} />
                    <span className="text-[10px] font-orbitron text-nexus-violet font-bold">
                      SENTINEL_ACTIVE
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {forecasts.map((f, i) => (
                    <motion.div
                      key={f.metric}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="premium-glass p-8 rounded-3xl border border-white/5 hover:border-nexus-violet/30 transition-all duration-500"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-nexus-silver font-orbitron font-bold tracking-widest">
                            {f.metric} EVOLUTION
                          </h3>
                          <p className="text-[10px] text-white/20 mt-1 uppercase">
                            Basado en regresión lineal (Ventana 1h)
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-nexus-violet/20 flex items-center justify-center">
                          <Cpu className="text-nexus-violet" />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="text-xs text-white/40 uppercase">Carga Actual</span>
                          <span className="text-3xl font-orbitron font-bold text-nexus-cyan">
                            {Math.round(f.currentValue)}%
                          </span>
                        </div>

                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${f.currentValue}%` }}
                            className="h-full bg-nexus-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                          <div>
                            <span className="text-[10px] text-white/30 uppercase block mb-1">
                              Proj. 1 Hora
                            </span>
                            <span
                              className={`text-lg font-orbitron font-bold ${f.predictedValue1h > 90 ? 'text-red-500' : 'text-amber-500'}`}
                            >
                              {Math.round(f.predictedValue1h)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/30 uppercase block mb-1">
                              Proj. 24 Horas
                            </span>
                            <span className="text-lg font-orbitron font-bold text-nexus-silver">
                              {Math.round(f.predictedValue24h)}%
                            </span>
                          </div>
                        </div>

                        {f.timeToThresholdMs && (
                          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                            <h4 className="text-[10px] font-orbitron font-bold text-red-500 uppercase flex items-center gap-2">
                              <Zap size={12} /> CRITICAL BOTTLE_NECK_PREDICTED
                            </h4>
                            <p className="text-xs text-nexus-silver/80 mt-1">
                              Agotamiento de recursos estimado en:{' '}
                              <strong>{Math.round(f.timeToThresholdMs / 60000)} minutos</strong>
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sovereign Bridge Isolation Status */}
                <div className="premium-glass p-8 rounded-3xl border border-white/5 mt-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Network className="text-nexus-cyan" />
                    <h3 className="text-xl font-orbitron font-bold text-nexus-cyan tracking-wider uppercase">
                      Sovereign Bridge (Network isolation)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/30 uppercase block mb-2">
                        Internal Overlay
                      </span>
                      <code className="text-xs text-nexus-violet">swarm-private-net</code>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-white/30 uppercase block mb-2">
                        socat Gateway
                      </span>
                      <code className="text-xs text-nexus-cyan">sovereign-bridge:8000</code>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between">
                      <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
                        Isolation Status
                      </span>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-xs text-green-500 font-bold uppercase">SECURED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
