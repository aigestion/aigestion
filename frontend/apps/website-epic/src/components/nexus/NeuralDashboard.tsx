import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  Activity,
  Globe,
  Database,
  Cpu,
  Server,
  CheckCircle,
  XCircle,
  Eye,
  Camera,
  AlertTriangle,
  Mic,
  MessageSquare,
  Terminal,
} from 'lucide-react';
import { apiConfig } from '../../config/app.config';
import { NexusCard } from '../design-system/NexusCard';
import { NexusMetricCard } from '../design-system/NexusMetricCard';
import { NexusCommandBar } from '../design-system/NexusCommandBar';
import { NexusStatusBadge } from '../design-system/NexusStatusBadge';
import { SpotlightWrapper } from '../design-system/SpotlightWrapper';
import { cn } from '../../utils/cn';

/**
 * NEURAL DASHBOARD (Phase 8)
 * Immersive visual interface for the AIGestion Nexus.
 * Features: Reasoning Pulse, Stitch Map visualization, and Swarm Status.
 */
export const NeuralDashboard: React.FC = () => {
  const [pulseActive, setPulseActive] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'distributed' | 'analytics' | 'local'>(
    'distributed'
  );

  const [health, setHealth] = useState<any>(null);
  const [visionReport, setVisionReport] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [liveSession, setLiveSession] = useState<any>(null);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchHealth = async () => {
      try {
        const response = await fetch(`${apiConfig.baseUrl}/v1/health`, {
          signal: controller.signal,
        });
        // 429 = rate limited — skip silently
        if (response.status === 429) {
          console.warn('[NeuralDashboard] Health check rate limited.');
          return;
        }
        const data = await response.json();
        setHealth(data);
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Failed to fetch health:', error);
      }
    };

    fetchHealth();
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
      fetchHealth();
    }, 60000); // Poll every 60s (rate-limit friendly)
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const runVisualAudit = async () => {
    setIsAuditing(true);
    try {
      // For Phase 11 Demo: We send a "Virtual Frame" of the current UI state
      // In production, this would be a real base64 from html2canvas
      const virtualFrame =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

      const response = await fetch(`${apiConfig.baseUrl}/v1/vision/dashboard-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: virtualFrame }),
      });
      const data = await response.json();
      setVisionReport(data);
    } catch (error) {
      console.error('Visual Audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleLiveSession = async () => {
    if (liveSession) {
      setLiveSession(null);
      setLiveLogs(prev => [...prev, '>> Session Terminated.']);
      return;
    }

    try {
      setLiveLogs(prev => [...prev, '>> Initiating God-Mode Live Handshake...']);
      const response = await fetch(`${apiConfig.baseUrl}/v1/ai/live-session`);
      const { data } = await response.json();
      setLiveSession(data);
      setLiveLogs(prev => [
        ...prev,
        `>> Connected to Vertex Live [${data.sessionId}]`,
        `>> Voice: ${data.voice} ACTIVE`,
      ]);
    } catch (e) {
      setLiveLogs(prev => [...prev, '!! Connection Fault. Check Sovereign Credentials.']);
    }
  };

  const handleSendLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLiveLogs(prev => [...prev, `User: ${inputText}`]);
    // Simulate real-time response (Phase 12 Demo)
    setTimeout(() => {
      setLiveLogs(prev => [
        ...prev,
        `Nexus: Analizando entrada multimodal... [Audio Payload Generated]`,
      ]);
    }, 500);
    setInputText('');
  };

  return (
    <div className="relative min-h-screen bg-nexus-obsidian text-white selection:bg-nexus-cyan/30 overflow-hidden">
      <SpotlightWrapper>
        {/* HEADER */}
        <NexusCommandBar
          title="NEXUS NEURAL PORTAL"
          subtitle="Sovereign Intelligence | Autonomous Neural Monitoring"
          status={
            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/30 uppercase font-orbitron tracking-widest mb-1">Swarm Link</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      animate={i <= 4 ? { opacity: [1, 0.4, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className={cn(
                        "w-1 h-3 rounded-full",
                        i <= 4 ? "bg-nexus-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-white/10"
                      )}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={runVisualAudit}
                disabled={isAuditing}
                className={cn(
                  "flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all duration-500 font-orbitron text-[10px] tracking-[0.2em] font-bold uppercase",
                  isAuditing 
                    ? "bg-nexus-violet/20 border-nexus-violet/50 text-nexus-violet animate-pulse" 
                    : "bg-white/5 border-white/10 hover:border-nexus-cyan/50 hover:bg-nexus-cyan/5 text-white/70 hover:text-white"
                )}
              >
                {isAuditing ? <Camera size={14} /> : <Eye size={14} />}
                {isAuditing ? 'Auditing Matrix...' : 'Execute Visual Audit'}
              </button>
              <NexusStatusBadge status="online" label="GOD MODE" />
            </div>
          }
        />

        {/* VISION ALERTS (Overlay) */}
        <AnimatePresence>
          {visionReport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-24 right-8 z-50 w-96"
            >
              <NexusCard variant={visionReport.status === 'ok' ? 'green' : 'critical'} glow className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 font-orbitron">
                    <Shield size={12} className="text-nexus-cyan" /> EYE OF NEXUS REPORT
                  </h4>
                  <button onClick={() => setVisionReport(null)} className="text-white/30 hover:text-white transition-colors">
                    <XCircle size={16} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-xs text-white/80 leading-relaxed font-mono">
                    {visionReport.details}
                  </p>
                  {visionReport.recommendation && (
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] text-nexus-cyan font-bold font-orbitron uppercase tracking-wider mb-1">Directiva Nexus:</p>
                      <p className="text-[11px] text-white/50 italic">"{visionReport.recommendation}"</p>
                    </div>
                  )}
                </div>
              </NexusCard>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto p-8 relative z-10">
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT COLUMN: REASONING & INFRA */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* REASONING PULSE */}
              <NexusCard variant="violet" glow className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] font-orbitron flex items-center gap-2">
                    <Zap size={14} className="text-nexus-violet" /> Reasoning Pulse
                  </h3>
                  <div className="animate-ping w-1.5 h-1.5 rounded-full bg-nexus-violet" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { gem: 'Jules', action: 'Code Audit Delta-X', status: 'Verifying', val: 88 },
                    { gem: 'Stitch', action: 'Weaving BQ Context', status: 'Active', val: 99 },
                    { gem: 'Aurora', action: 'Neural Briefing 2.0', status: 'Standby', val: 45 },
                  ].map((p, idx) => (
                    <div key={idx} className="group relative">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider font-orbitron">{p.gem}</p>
                          <p className="text-[9px] text-white/40 font-mono italic">{'>> '}{p.action}</p>
                        </div>
                        <NexusStatusBadge status={p.status === 'Active' ? 'online' : 'syncing'} size="sm" />
                      </div>
                      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${p.val}%` }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                          className={cn(
                            "h-full rounded-full",
                            p.status === 'Active' ? "bg-nexus-cyan" : "bg-nexus-violet"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </NexusCard>

              {/* INFRASTRUCTURE HEALTH */}
              <NexusCard variant="default" className="p-6">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] font-orbitron mb-8 flex items-center gap-2">
                  <Server size={14} className="text-nexus-cyan" /> Infra Matrix
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'MongoDB', status: health?.details?.mongodb?.status || 'checking', icon: <Database size={14} /> },
                    { name: 'Pinecone', status: health?.details?.pinecone?.status || 'checking', icon: <Activity size={14} /> },
                    { name: 'Redis', status: health?.details?.redis?.status || 'checking', icon: <Zap size={14} /> },
                    { name: 'Vertex AI', status: health?.status === 'ok' ? 'ok' : 'checking', icon: <Cpu size={14} /> },
                  ].map((s, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-nexus-cyan opacity-50">{s.icon}</div>
                        <NexusStatusBadge status={s.status === 'ok' ? 'online' : 'critical'} size="sm" />
                      </div>
                      <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest font-orbitron leading-none">{s.name}</p>
                    </div>
                  ))}
                </div>
              </NexusCard>

              {/* LIVE TERMINAL */}
              <NexusCard variant="default" glow className="p-6 flex flex-col h-[380px] border-nexus-cyan/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] font-orbitron flex items-center gap-2">
                    <Terminal size={14} className="text-nexus-cyan" /> Live Terminal
                  </h3>
                  <button
                    onClick={toggleLiveSession}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-bold font-orbitron tracking-widest border transition-all duration-300",
                      liveSession 
                        ? "bg-nexus-violet/20 border-nexus-violet/50 text-nexus-violet" 
                        : "bg-nexus-cyan/10 border-nexus-cyan/30 text-nexus-cyan hover:bg-nexus-cyan/20"
                    )}
                  >
                    {liveSession ? 'OFFLINE' : 'INITIALIZE'}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mb-6 scrollbar-hide font-mono text-[10px]">
                  {liveLogs.map((log, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={cn(
                        "leading-relaxed",
                        log.startsWith('!!') ? 'text-red-400' : log.startsWith('>>') ? 'text-nexus-cyan' : 'text-white/50'
                      )}
                    >
                      <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                      {log}
                    </motion.div>
                  ))}
                  {liveSession && (
                    <motion.div
                      animate={{ opacity: [0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="text-nexus-cyan font-bold"
                    >
                      _AWAITING_SIGNAL_
                    </motion.div>
                  )}
                </div>

                <form onSubmit={handleSendLive} className="relative mt-auto">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={liveSession ? 'Comando Neural...' : 'Puente Desconectado'}
                    disabled={!liveSession}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-[10px] font-mono focus:outline-none focus:border-nexus-cyan/50 transition-all placeholder:text-white/20"
                  />
                  <button
                    type="submit"
                    disabled={!liveSession}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-nexus-cyan disabled:opacity-30 hover:scale-110 transition-transform"
                  >
                    <Mic size={16} />
                  </button>
                </form>
              </NexusCard>
            </div>

            {/* CENTER COLUMN: STITCH MAP & NEURAL NETWORK */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              <NexusCard variant="cyan" glow className="relative flex-1 min-h-[600px] overflow-hidden group">
                {/* GRID OVERLAY */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
                
                {/* SCANNER LINE */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                   <motion.div 
                     animate={{ y: ['-100%', '200%'] }}
                     transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                     className="w-full h-40 bg-gradient-to-b from-transparent via-nexus-cyan/10 to-transparent opacity-50"
                   />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col p-12">
                   <div className="flex justify-between items-start mb-20">
                      <div>
                        <h2 className="text-2xl font-black font-orbitron tracking-[0.3em] text-white">
                          STITCH MATRIX <span className="text-nexus-cyan">V1.4</span>
                        </h2>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mt-2 italic">
                          {'>> '}Visualización Multimodal en Tiempo Real
                        </p>
                      </div>
                      <div className="text-right">
                         <div className="text-3xl font-black font-orbitron text-white">99.8%</div>
                         <div className="text-[9px] font-bold text-nexus-cyan uppercase tracking-widest">Efficiency Vector</div>
                      </div>
                   </div>

                   {/* NEURAL NETWORK VISUALIZATION */}
                   <div className="relative flex-1 flex items-center justify-center">
                      <div className="absolute w-full h-full">
                         <svg width="100%" height="100%" viewBox="0 0 800 500" className="opacity-40">
                            {/* Lines */}
                            {[...Array(20)].map((_, i) => (
                              <motion.line
                                key={`line-${i}`}
                                x1={Math.random() * 800}
                                y1={Math.random() * 500}
                                x2={Math.random() * 800}
                                y2={Math.random() * 500}
                                stroke="rgba(6,182,212,0.2)"
                                strokeWidth="1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                                transition={{ duration: Math.random() * 5 + 5, repeat: Infinity }}
                              />
                            ))}
                            {/* Nodes */}
                            {[...Array(15)].map((_, i) => (
                              <motion.circle
                                key={`node-${i}`}
                                cx={Math.random() * 800}
                                cy={Math.random() * 500}
                                r="3"
                                fill="#06b6d4"
                                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                              />
                            ))}
                         </svg>
                      </div>

                      <div className="z-20 grid grid-cols-3 gap-24 relative">
                        {[
                          { id: 'distributed', name: 'Distributed State', icon: <Globe size={40} />, color: 'cyan' },
                          { id: 'analytics', name: 'Neural Engine', icon: <Cpu size={56} />, color: 'violet', active: true },
                          { id: 'local', name: 'Knowledge Hub', icon: <Database size={40} />, color: 'cyan' },
                        ].map((layer) => (
                          <motion.div
                            key={layer.id}
                            onClick={() => setActiveLayer(layer.id as any)}
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                              "cursor-pointer text-center group transition-all duration-500",
                              activeLayer === layer.id ? "scale-110" : "opacity-30 blur-[2px] grayscale hover:blur-0 hover:grayscale-0 hover:opacity-60"
                            )}
                          >
                            <div className={cn(
                              "w-32 h-32 mx-auto rounded-[2rem] flex items-center justify-center border transition-all duration-700 relative",
                              layer.color === 'violet' 
                                ? "bg-nexus-violet/20 border-nexus-violet/40 shadow-[0_0_50px_rgba(139,92,246,0.2)]" 
                                : "bg-nexus-cyan/20 border-nexus-cyan/40 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
                            )}>
                               <div className={cn(
                                 "absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse",
                                 layer.color === 'violet' ? "shadow-[inset_0_0_20px_rgba(139,92,246,0.3)]" : "shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]"
                               )} />
                               {React.cloneElement(layer.icon as React.ReactElement, { 
                                 className: layer.color === 'violet' ? 'text-nexus-violet' : 'text-nexus-cyan',
                                 size: layer.active ? 48 : 32
                               })}
                            </div>
                            <p className={cn(
                              "mt-6 text-[10px] font-black uppercase tracking-[0.3em] font-orbitron",
                              layer.color === 'violet' ? 'text-nexus-violet' : 'text-white/60'
                            )}>
                              {layer.name}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                   </div>

                   <div className="mt-auto grid grid-cols-3 gap-12 pt-12 border-t border-white/5">
                      <div>
                         <p className="text-[10px] text-white/30 uppercase font-orbitron tracking-widest mb-2">Neural Threads</p>
                         <p className="text-xl font-bold text-white font-mono tracking-tighter">14.092 <span className="text-nexus-cyan text-[10px]">ACTIVE</span></p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] text-white/30 uppercase font-orbitron tracking-widest mb-2">Sync Latency</p>
                         <p className="text-xl font-bold text-white font-mono tracking-tighter">1.2ms <span className="text-emerald-500 text-[10px]">FIXED</span></p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-white/30 uppercase font-orbitron tracking-widest mb-2">Region Identity</p>
                         <p className="text-xl font-bold text-white font-mono tracking-tighter">NEXUS_ALPHA_01</p>
                      </div>
                   </div>
                </div>
              </NexusCard>

              {/* SECONDARY PANELS */}
              <div className="grid grid-cols-2 gap-8">
                <NexusCard className="p-8">
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-orbitron mb-6 flex items-center gap-2">
                    <Shield size={14} className="text-nexus-cyan" /> Secure Enclave
                  </h4>
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-full border border-nexus-cyan/30 flex items-center justify-center relative">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 border-t-2 border-nexus-cyan rounded-full"
                        />
                        <Shield className="text-nexus-cyan" size={24} />
                     </div>
                     <div>
                        <p className="text-lg font-bold text-white font-orbitron italic">Protocols Active</p>
                        <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-1">Sovereign Encryption V6</p>
                     </div>
                  </div>
                </NexusCard>

                <NexusCard className="p-8">
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-orbitron mb-6 flex items-center gap-2">
                    <Activity size={14} className="text-nexus-violet" /> Pulse Analysis
                  </h4>
                  <div className="flex items-end gap-1 h-12">
                     {[40, 70, 45, 90, 65, 30, 80, 50, 95, 60].map((h, i) => (
                       <motion.div
                         key={i}
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
                         className="flex-1 bg-nexus-violet/40 rounded-t-sm"
                       />
                     ))}
                  </div>
                   <p className="text-[9px] text-white/30 font-mono tracking-widest uppercase mt-4 text-center">Spectral Signature Stable</p>
                </NexusCard>
              </div>
            </div>
          </div>
        </main>

        {/* STATUS BAR */}
        <footer className="fixed bottom-0 left-0 w-full bg-nexus-obsidian/90 backdrop-blur-xl border-t border-white/5 py-4 px-8 z-50 flex justify-between items-center selection:none">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-orbitron text-white/30 tracking-[0.2em]">CLOUD RUN</span>
               <NexusStatusBadge status={health?.status === 'ok' ? 'online' : 'critical'} label={health?.status?.toUpperCase() || 'BUSCANDO'} size="sm" />
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-12">
               <span className="text-[9px] font-orbitron text-white/30 tracking-[0.2em]">MONGODB</span>
               <NexusStatusBadge status={health?.details?.mongodb?.status === 'ok' ? 'online' : 'critical'} label={health?.details?.mongodb?.status?.toUpperCase() || 'BUSCANDO'} size="sm" />
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-12">
               <span className="text-[9px] font-orbitron text-white/30 tracking-[0.2em]">AI STUDIO</span>
               <span className="text-[10px] font-black text-nexus-cyan font-orbitron tracking-widest glow-cyan">SUPREME</span>
            </div>
          </div>
          <div className="text-[9px] font-black font-orbitron text-white/20 tracking-[0.4em]">
            © 2026 ANTIGRAVITY // SOVEREIGN NEXUS 
          </div>
        </footer>
      </SpotlightWrapper>

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-nexus-violet/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-nexus-cyan/5 rounded-full blur-[120px] animate-pulse" />
      </div>
    </div>
  );
};


