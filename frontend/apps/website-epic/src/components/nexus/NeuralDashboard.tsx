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
    <div className="relative min-h-screen bg-black text-white p-8 font-mono overflow-hidden">
      {/* BACKGROUND MESH GRADIENT */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent_50%)] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#ec4899,transparent_40%)]" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center mb-12 border-b border-indigo-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]">
            <Shield className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">NEXUS NEURAL PORTAL</h1>
            <p className="text-xs text-indigo-400 uppercase tracking-widest">
              Sovereign Intelligence | God Mode Active
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase">Swarm Connectivity</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-gray-700'}`}
                />
              ))}
            </div>
          </div>
          <div className="h-10 w-px bg-gray-800" />
          <button
            onClick={runVisualAudit}
            disabled={isAuditing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isAuditing ? 'bg-indigo-600/20 border-indigo-500/50 animate-pulse' : 'bg-gray-900 border-white/10 hover:border-indigo-500/50'}`}
          >
            {isAuditing ? (
              <Camera size={16} className="text-indigo-400" />
            ) : (
              <Eye size={16} className="text-indigo-400" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isAuditing ? 'Auditing UI...' : 'Run Visual Audit'}
            </span>
          </button>
          <Activity className={`text-indigo-400 ${pulseActive ? 'animate-bounce' : ''}`} />
        </div>
      </header>

      {/* VISION ALERTS (Overlay) */}
      <AnimatePresence>
        {visionReport && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-8 z-50 w-80 p-4 bg-gray-900/90 border border-indigo-500/50 rounded-2xl backdrop-blur-2xl shadow-[0_0_50px_rgba(79,70,229,0.3)]"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} /> EYE OF NEXUS REPORT
              </h4>
              <button
                onClick={() => setVisionReport(null)}
                className="text-gray-500 hover:text-white"
              >
                <XCircle size={14} />
              </button>
            </div>
            <div
              className={`p-3 rounded-xl border mb-3 ${visionReport.status === 'ok' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {visionReport.status === 'ok' ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <AlertTriangle size={14} className="text-red-500" />
                )}
                <span
                  className={`text-[11px] font-bold uppercase ${visionReport.status === 'ok' ? 'text-green-400' : 'text-red-400'}`}
                >
                  {visionReport.status === 'ok' ? 'Vision Optimal' : 'Anomaly Detected'}
                </span>
              </div>
              <p className="text-[10px] text-gray-300 leading-relaxed">{visionReport.details}</p>
            </div>
            {visionReport.recommendation && (
              <p className="text-[9px] text-indigo-300 italic">
                "G-Mode Sugerencia: {visionReport.recommendation}"
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN GRID */}
      <div className="relative z-10 grid grid-cols-12 gap-8">
        {/* REASONING PULSE (Left Column) */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="p-6 bg-gray-900/50 border border-indigo-500/20 rounded-2xl backdrop-blur-xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" /> REASONING PULSE
            </h3>
            <div className="space-y-4">
              {[
                { gem: 'Jules', action: 'Code Audit Delta-X', status: 'Verifying' },
                { gem: 'Stitch', action: 'Weaving BQ Context', status: 'Active' },
                { gem: 'Aurora', action: 'Neural Briefing 2.0', status: 'Standby' },
              ].map((p, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-indigo-950/20 rounded-xl border border-white/5"
                >
                  <div>
                    <p className="text-xs font-bold text-indigo-300">{p.gem}</p>
                    <p className="text-[10px] text-gray-400">{p.action}</p>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full border ${p.status === 'Active' ? 'bg-green-500/20 border-green-500/50 text-green-400 animate-pulse' : 'border-gray-700 text-gray-500'}`}
                  >
                    {p.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-900/50 border border-green-500/20 rounded-2xl backdrop-blur-xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Server size={16} className="text-green-400" /> INFRASTRUCTURE HEALTH
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: 'MongoDB',
                  status: health?.details?.mongodb?.status || 'checking',
                  icon: <Database size={14} />,
                },
                {
                  name: 'Pinecone',
                  status: health?.details?.pinecone?.status || 'checking',
                  icon: <Activity size={14} />,
                },
                {
                  name: 'Redis',
                  status: health?.details?.redis?.status || 'checking',
                  icon: <Zap size={14} />,
                },
                {
                  name: 'Vertex AI',
                  status: health?.status === 'ok' ? 'ok' : 'checking',
                  icon: <Cpu size={14} />,
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-indigo-400">{s.icon}</div>
                    {s.status === 'ok' ? (
                      <CheckCircle size={12} className="text-green-500" />
                    ) : (
                      <XCircle size={12} className="text-red-500 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                      {s.name}
                    </p>
                    <p
                      className={`text-[8px] uppercase ${s.status === 'ok' ? 'text-green-500' : 'text-red-400'}`}
                    >
                      {s.status === 'ok' ? 'Operational' : 'Degraded'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE TERMINAL (Phase 12) */}
          <div className="p-6 bg-black border border-indigo-500/50 rounded-2xl backdrop-blur-xl flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Terminal size={16} className="text-indigo-400" /> LIVE TERMINAL
              </h3>
              <button
                onClick={toggleLiveSession}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${liveSession ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-green-500/20 border-green-500/50 text-green-400'}`}
              >
                {liveSession ? 'DISCONNECT' : 'INITIALIZE LIVE'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide text-[10px]">
              {liveLogs.map((log, i) => (
                <div
                  key={i}
                  className={`${log.startsWith('!!') ? 'text-red-400' : log.startsWith('>>') ? 'text-indigo-400' : 'text-gray-300'}`}
                >
                  {log}
                </div>
              ))}
              {liveSession && (
                <motion.div
                  animate={{ opacity: [0, 1] }}
                  transition={{ repeat: Infinity }}
                  className="text-indigo-500 text-[8px]"
                >
                  _LISTENING_
                </motion.div>
              )}
            </div>
            <form onSubmit={handleSendLive} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={liveSession ? 'Interrogate the Nexus...' : 'Live Session Offline'}
                disabled={!liveSession}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={!liveSession}
                className="p-2 bg-indigo-600 rounded-lg disabled:opacity-50 disabled:grayscale transition-all"
              >
                <Mic size={14} />
              </button>
            </form>
          </div>
        </section>

        {/* STITCH MAP (Center Column) */}
        <section className="col-span-12 lg:col-span-8 p-8 bg-gray-900/80 border border-indigo-500/40 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />

          {/* Visual representation of the Stitch layer */}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className="absolute w-80 h-80 border-2 border-dashed border-indigo-500/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              className="absolute w-60 h-60 border border-pink-500/30 rounded-full"
            />

            <div className="z-10 grid grid-cols-3 gap-12 text-center">
              <div
                onClick={() => setActiveLayer('distributed')}
                className={`group cursor-pointer transition-all ${activeLayer === 'distributed' ? 'scale-110' : 'opacity-40 grayscale'}`}
              >
                <div className="w-20 h-20 mx-auto bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/50 group-hover:shadow-[0_0_30px_#4f46e5]">
                  <Globe className="text-indigo-400" size={32} />
                </div>
                <p className="mt-4 text-[10px] font-bold tracking-widest uppercase">
                  Distributed State
                </p>
              </div>

              <div
                onClick={() => setActiveLayer('analytics')}
                className={`group cursor-pointer transition-all ${activeLayer === 'analytics' ? 'scale-110' : 'opacity-40 grayscale'}`}
              >
                <div className="w-24 h-24 mx-auto bg-pink-600/20 rounded-3xl flex items-center justify-center border border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.3)]">
                  <Cpu className="text-pink-400" size={40} />
                </div>
                <p className="mt-4 text-[10px] font-bold tracking-widest uppercase text-pink-400">
                  Consensus Engine
                </p>
              </div>

              <div
                onClick={() => setActiveLayer('local')}
                className={`group cursor-pointer transition-all ${activeLayer === 'local' ? 'scale-110' : 'opacity-40 grayscale'}`}
              >
                <div className="w-20 h-20 mx-auto bg-cyan-600/20 rounded-2xl flex items-center justify-center border border-cyan-500/50 group-hover:shadow-[0_0_30px_#06b6d4]">
                  <Database className="text-cyan-400" size={32} />
                </div>
                <p className="mt-4 text-[10px] font-bold tracking-widest uppercase">
                  Knowledge Hub
                </p>
              </div>
            </div>

            {/* Interactive lines simulation (Visual only) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1="10%"
                y1="50%"
                x2="50%"
                y2="50%"
                stroke="rgba(79, 70, 229, 0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="90%"
                y1="50%"
                x2="50%"
                y2="50%"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            <span>Stitch Efficiency: 99.8%</span>
            <span>Neural Threads: 14,092 Active</span>
            <span>Region: Sovereign Nexus v1</span>
          </div>
        </section>
      </div>

      {/* STATUS BAR */}
      <footer className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 p-2 text-[8px] text-gray-600 flex justify-between px-8 z-50">
        <div className="flex gap-4">
          <span>
            Cloud Run:{' '}
            <span className={health?.status === 'ok' ? 'text-green-500' : 'text-red-500'}>
              🟢 {health?.status?.toUpperCase() || 'CHECKING'}
            </span>
          </span>
          <span>
            MongoDB Atlas:{' '}
            <span
              className={
                health?.details?.mongodb?.status === 'ok' ? 'text-green-500' : 'text-red-500'
              }
            >
              🟢 {health?.details?.mongodb?.status?.toUpperCase() || 'CHECKING'}
            </span>
          </span>
          <span>
            AI Studio: <span className="text-blue-400">🔵 SUPREME</span>
          </span>
        </div>
        <div>© 2026 ANTIGRAVITY | GOD MODE V4.2</div>
      </footer>
    </div>
  );
};
