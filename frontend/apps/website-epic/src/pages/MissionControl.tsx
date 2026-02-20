import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Database,
  Shield,
  Cpu,
  Terminal,
  Zap,
  ChevronRight,
  Plus,
  Play,
  Download,
  Globe,
  Coins,
  Star,
  CheckCircle,
  XCircle,
  BarChart3,
  Gavel,
  Heart,
  RefreshCcw,
  Server,
} from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'failed';
  discovery: number;
  result?: string;
}

export const MissionControl = () => {
  const [missions] = useState<Mission[]>([
    { id: 'mstr_ref_01', name: 'Global Threat Audit', status: 'completed', discovery: 12 },
    { id: 'mstr_ref_02', name: 'DeFi Liquidity Scan', status: 'active', discovery: 5 },
  ]);

  const [activeTab, setActiveTab] = useState<
    'missions' | 'graph' | 'bi' | 'governance' | 'mcp' | 'marketplace'
  >('missions');

  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [challengeStep, setChallengeStep] = useState<
    'idle' | 'listening' | 'verifying' | 'success'
  >('idle');

  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-nexus-cyan-glow animate-pulse" />
              <span className="text-nexus-cyan-glow font-orbitron text-sm tracking-[0.3em]">
                SWARM ORCHESTRATION
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white tracking-tight">
              Mission <span className="text-nexus-cyan-glow">Control</span>
            </h1>
          </div>
          <button className="flex items-center gap-3 px-6 py-3 bg-nexus-cyan-glow/10 border border-nexus-cyan-glow/30 rounded-xl text-nexus-cyan-glow font-orbitron text-sm hover:bg-nexus-cyan-glow/20 transition-all group">
            <Plus className="w-4 h-4" />
            INICIAR NUEVA MISIÓN
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { label: 'AGENTES ACTIVOS', value: '12', icon: Cpu, color: 'cyan' },
            { label: 'SWARM REPLICAS', value: '3', icon: Zap, color: 'purple' },
            { label: 'HALLAZGOS HOY', value: '458', icon: Database, color: 'blue' },
            { label: 'SEGURIDAD SWARM', value: 'PROTECTED', icon: Shield, color: 'green' },
            { label: 'TENDENCIA CARGA', value: '+12%', icon: Activity, color: 'yellow' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <div className="flex items-center gap-4 mb-3">
                <stat.icon className={`w-5 h-5 text-nexus-${stat.color}-glow`} />
                <span className="text-white/40 font-orbitron text-[10px] tracking-widest uppercase">
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-orbitron text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10">
          {['missions', 'graph', 'bi', 'governance', 'mcp', 'marketplace'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-4 font-orbitron text-sm tracking-widest uppercase transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab === 'missions' && 'Misiones Activas'}
              {tab === 'graph' && 'Mapa de Conocimiento'}
              {tab === 'bi' && 'Predictive BI'}
              {tab === 'governance' && 'Gobernanza Swarm'}
              {tab === 'mcp' && 'Universal MCP Hub'}
              {tab === 'marketplace' && 'Persona Marketplace'}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-cyan-glow"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'missions' ? (
                <motion.div
                  key="missions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {missions.map(mission => (
                    <div
                      key={mission.id}
                      className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-nexus-cyan-glow/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              mission.status === 'active'
                                ? 'bg-nexus-cyan-glow/10 text-nexus-cyan-glow animate-pulse'
                                : 'bg-green-500/10 text-green-500'
                            }`}
                          >
                            <Activity className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-orbitron text-white group-hover:text-nexus-cyan-glow transition-colors">
                              {mission.name}
                            </h3>
                            <div className="flex items-center gap-3 text-white/40 text-xs mt-1">
                              <span className="font-mono">{mission.id}</span>
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <span>{mission.discovery} hallazgos detectados</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`px-3 py-1 rounded-full text-[10px] font-orbitron border ${
                              mission.status === 'active'
                                ? 'text-nexus-cyan-glow border-nexus-cyan-glow/30'
                                : 'text-green-500 border-green-500/30'
                            }`}
                          >
                            {mission.status.toUpperCase()}
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-nexus-cyan-glow transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : activeTab === 'graph' ? (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-[600px] rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] opacity-20" />
                  <div className="relative text-center space-y-4">
                    <Database className="w-16 h-16 text-nexus-cyan-glow/20 mx-auto" />
                    <p className="text-white/40 font-orbitron text-xs tracking-widest">
                      INICIALIZANDO NEURAL GRAPH VIZ...
                    </p>
                  </div>
                </motion.div>
              ) : activeTab === 'bi' ? (
                <motion.div
                  key="bi"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-orbitron text-white">Global Yield Harvester</h2>
                    <button
                      onClick={() => setShowBiometricModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-nexus-cyan-glow/10 border border-nexus-cyan-glow/30 rounded-lg text-nexus-cyan-glow font-orbitron text-[10px] hover:bg-nexus-cyan-glow/20 transition-all"
                    >
                      <Zap className="w-3 h-3" />
                      HARVEST ALL YIELDS
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        chain: 'Ethereum',
                        protocol: 'Lido',
                        apy: 4.2,
                        tvl: '12.4B',
                        status: 'optimal',
                      },
                      {
                        chain: 'Solana',
                        protocol: 'Jito',
                        apy: 7.8,
                        tvl: '1.2B',
                        status: 'optimal',
                      },
                      {
                        chain: 'Base',
                        protocol: 'Aerodrome',
                        apy: 12.4,
                        tvl: '450M',
                        status: 'high-yield',
                      },
                    ].map((yieldItem, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-nexus-cyan-glow/30 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                            {yieldItem.chain}
                          </span>
                          <span
                            className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${
                              yieldItem.status === 'optimal'
                                ? 'text-green-400 border-green-400/30 bg-green-400/10'
                                : 'text-nexus-cyan-glow border-nexus-cyan-glow/30 bg-nexus-cyan-glow/10'
                            }`}
                          >
                            {yieldItem.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-lg font-orbitron text-white mb-1">
                          {yieldItem.protocol}
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-2xl font-orbitron text-nexus-cyan-glow">
                              {yieldItem.apy}%
                            </div>
                            <div className="text-[10px] text-white/40">APY</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-orbitron text-white/80">
                              ${yieldItem.tvl}
                            </div>
                            <div className="text-[10px] text-white/40">TVL</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Coins className="w-5 h-5 text-yellow-500" />
                          <h3 className="font-orbitron text-white text-sm">SOVEREIGN YIELD</h3>
                        </div>
                        <span className="text-[10px] text-white/40">CREATOR EARNINGS</span>
                      </div>
                      <div className="text-3xl font-orbitron text-white mb-2">
                        $1,240.50 <span className="text-xs text-nexus-cyan-glow">NXS</span>
                      </div>
                      <p className="text-[10px] text-white/40 mb-6 font-mono">
                        +12.4% from projected commissions
                      </p>
                      <button className="w-full py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-orbitron text-[10px] hover:bg-yellow-500/20 transition-all">
                        CLAIM YIELD (AS AI BOND)
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                        <Star className="w-5 h-5 text-blue-400" />
                        <h3 className="font-orbitron text-white text-sm">
                          TOP PERFORMING PERSONAS
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Nexus Architect', rep: 0.98, multiplier: '1.5x' },
                          { name: 'Security Sentinel', rep: 0.95, multiplier: '1.2x' },
                        ].map(p => (
                          <div
                            key={p.name}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                          >
                            <div>
                              <div className="text-xs text-white">{p.name}</div>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star
                                    key={s}
                                    className={`w-2 h-2 ${s <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'}`}
                                  />
                                ))}
                                <span className="text-[8px] text-white/40 ml-1">Rep: {p.rep}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-nexus-cyan-glow font-mono">
                              {p.multiplier}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-nexus-cyan-glow/5 border border-nexus-cyan-glow/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-nexus-cyan-glow/10">
                        <BarChart3 className="w-6 h-6 text-nexus-cyan-glow" />
                      </div>
                      <div>
                        <h4 className="font-orbitron text-white text-sm">
                          LIFETIME VALUE (LTV) PROJECTION
                        </h4>
                        <p className="text-white/40 text-xs">
                          Estimated: $450 USD | Confidence: 85%
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-nexus-cyan-glow text-black font-orbitron text-[10px] font-bold hover:scale-105 transition-all">
                      GENERAR REPORTE BI
                    </button>
                  </div>
                </motion.div>
              ) : activeTab === 'governance' ? (
                <motion.div
                  key="governance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Gavel className="w-6 h-6 text-nexus-cyan-glow" />
                        <h3 className="font-orbitron text-white text-lg font-bold tracking-tight">
                          ACTIVE PROPOSALS
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-cyan-glow/10 border border-nexus-cyan-glow/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan-glow animate-pulse" />
                        <span className="text-[10px] text-nexus-cyan-glow font-orbitron">
                          SWARM CONSENSUS: 98%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: 'PROP-104',
                          type: 'TREASURY',
                          desc: 'Rebalance surplus capital to high-yield DeFi strategies.',
                          confidence: 0.96,
                        },
                        {
                          id: 'PROP-105',
                          type: 'SCALING',
                          desc: 'Auto-scale swarm replicas in EU-WEST-1 due to load.',
                          confidence: 0.94,
                        },
                      ].map(proposal => (
                        <div
                          key={proposal.id}
                          className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-cyan-glow/20 transition-all"
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[8px] font-orbitron tracking-widest ${
                                    proposal.type === 'TREASURY'
                                      ? 'bg-yellow-500/20 text-yellow-500'
                                      : 'bg-nexus-cyan-glow/20 text-nexus-cyan-glow'
                                  }`}
                                >
                                  {proposal.type}
                                </span>
                                <span className="font-mono text-[10px] text-white/20">
                                  {proposal.id}
                                </span>
                              </div>
                              <p className="text-sm text-white/80 leading-relaxed font-orbitron tracking-tight">
                                {proposal.desc}
                              </p>
                              <div className="flex items-center gap-4 mt-4">
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-nexus-cyan-glow"
                                    style={{ width: `${proposal.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-white/40 font-mono">
                                  Conf: {(proposal.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button className="p-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-all">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col items-center justify-center text-center space-y-4">
                    <Shield className="w-10 h-10 text-red-500/40" />
                    <div>
                      <h4 className="font-orbitron text-white text-sm">GOD MODE OVERRIDE</h4>
                      <p className="text-white/40 text-xs mt-1">
                        Manual veto power is currently active. User session: 28921591B
                      </p>
                    </div>
                    <button className="px-8 py-3 rounded-xl bg-red-500 text-white font-orbitron text-[10px] font-bold hover:bg-red-600 transition-all tracking-[0.2em]">
                      ACTIVATE GLOBAL VETO
                    </button>
                  </div>
                </motion.div>
              ) : activeTab === 'mcp' ? (
                <motion.div
                  key="mcp"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-orbitron text-white">Universal MCP Hub</h2>
                    <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                      <div className="w-2 h-2 rounded-full bg-nexus-cyan-glow" />
                      AUTO-DISCOVERY ACTIVE
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'GitHub Global MCP',
                        url: 'mcp://github.com/nexus',
                        status: 'ACTIVE',
                        tools: 14,
                        type: 'SSE',
                      },
                      {
                        name: 'Local Docker MCP',
                        url: 'stdio://nexus-docker',
                        status: 'PENDING',
                        tools: 8,
                        type: 'STDIO',
                      },
                      {
                        name: 'Financial Intelligence Node',
                        url: 'sse://finance.mcp.nexus',
                        status: 'ACTIVE',
                        tools: 22,
                        type: 'SSE',
                      },
                    ].map((server, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-nexus-cyan-glow/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Server
                              className={`w-5 h-5 ${server.status === 'ACTIVE' ? 'text-nexus-cyan-glow' : 'text-white/20'}`}
                            />
                            <h3 className="font-orbitron text-sm text-white">{server.name}</h3>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              server.status === 'ACTIVE'
                                ? 'bg-nexus-cyan-glow/20 text-nexus-cyan-glow'
                                : 'bg-white/10 text-white/40'
                            }`}
                          >
                            {server.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/40 mb-6">
                          <span className="font-mono">{server.url}</span>
                          <span className="font-orbitron">{server.tools} TOOLS</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className={`flex-1 py-3 rounded-xl font-orbitron text-[10px] transition-all ${
                              server.status === 'ACTIVE'
                                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                                : 'bg-nexus-cyan-glow/10 text-nexus-cyan-glow hover:bg-nexus-cyan-glow/20 border border-nexus-cyan-glow/30'
                            }`}
                          >
                            {server.status === 'ACTIVE' ? 'DEPLOYED' : 'ADOPT CAPABILITY'}
                          </button>
                          <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : activeTab === 'marketplace' ? (
                <motion.div
                  key="marketplace"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-orbitron text-white">SIMA Persona Marketplace</h2>
                    <span className="text-xs text-nexus-cyan-glow font-mono px-3 py-1 rounded-full bg-nexus-cyan-glow/10 border border-nexus-cyan-glow/20">
                      CREATOR NET ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Nexus Architect',
                        price: 45,
                        rep: 0.98,
                        tags: ['Arch', 'Strategy'],
                        desc: 'High-level system design and strategic planning agent.',
                      },
                      {
                        name: 'Security Sentinel',
                        price: 30,
                        rep: 0.95,
                        tags: ['Audit', 'Sec'],
                        desc: 'Aggressive vulnerability detection and threat mitigation.',
                      },
                      {
                        name: 'Yield Optimizer',
                        price: 55,
                        rep: 0.92,
                        tags: ['DeFi', 'Finance'],
                        desc: 'Autonomous yield farming and liquidity optimization lead.',
                      },
                    ].map((persona, i) => (
                      <div
                        key={i}
                        className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-nexus-cyan-glow/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-xl bg-nexus-cyan-glow/10 text-nexus-cyan-glow">
                            <Star className="w-6 h-6" />
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-orbitron text-white">
                              {persona.price}{' '}
                              <span className="text-[10px] text-nexus-cyan-glow">NXS</span>
                            </div>
                            <div className="text-[10px] text-white/40 font-mono">
                              REP: {persona.rep}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-orbitron text-white mb-2 group-hover:text-nexus-cyan-glow transition-colors">
                          {persona.name}
                        </h3>
                        <p className="text-xs text-white/60 mb-4 line-clamp-2">{persona.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {persona.tags.map(t => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-white/40 font-mono uppercase tracking-widest"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <button className="w-full py-3 rounded-xl bg-nexus-cyan-glow text-black font-orbitron text-[10px] font-bold hover:scale-[1.02] transition-all">
                          HIRE PERSONA
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Biometric Challenge Modal Overlay */}
            <AnimatePresence>
              {showBiometricModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />

                    <div className="relative text-center space-y-6">
                      <div className="flex justify-center">
                        <div
                          className={`p-4 rounded-full bg-red-500/10 border border-red-500/30 ${challengeStep === 'listening' ? 'animate-pulse' : ''}`}
                        >
                          <Shield className="w-10 h-10 text-red-500" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-orbitron text-white font-bold tracking-tight">
                          SOVEREIGN VOICE CHALLENGE
                        </h3>
                        <p className="text-xs text-white/40 mt-2 font-mono">
                          HIGH-PRIVILEGE ACTION DETECTED. AUTHORIZATION REQUIRED.
                        </p>
                      </div>

                      <div className="h-24 flex items-center justify-center">
                        {challengeStep === 'idle' && (
                          <button
                            onClick={() => setChallengeStep('listening')}
                            className="px-6 py-3 rounded-xl bg-red-500 text-white font-orbitron text-[10px] font-bold hover:bg-red-600 transition-all"
                          >
                            INICIAR DESAFÍO VOCAL
                          </button>
                        )}
                        {challengeStep === 'listening' && (
                          <div className="flex items-center gap-1 h-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                              <motion.div
                                key={i}
                                animate={{ height: [10, 30, 10] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                className="w-1 bg-red-500 rounded-full"
                              />
                            ))}
                          </div>
                        )}
                        {challengeStep === 'verifying' && (
                          <div className="flex flex-col items-center gap-3">
                            <RefreshCcw className="w-6 h-6 text-nexus-cyan-glow animate-spin" />
                            <span className="text-[10px] text-nexus-cyan-glow font-mono animate-pulse">
                              VERIFYING SPECTRAL SIGNATURE...
                            </span>
                          </div>
                        )}
                        {challengeStep === 'success' && (
                          <div className="flex flex-col items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <span className="text-[10px] text-green-500 font-mono">
                              AUTHORIZED. GOD-MODE ACTIVE.
                            </span>
                          </div>
                        )}
                      </div>

                      {challengeStep === 'listening' && (
                        <p className="text-sm font-orbitron text-white animate-pulse">
                          "Nexus, autoriza protocolo de emergencia."
                        </p>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowBiometricModal(false);
                            setChallengeStep('idle');
                          }}
                          className="flex-1 py-3 rounded-xl bg-white/5 text-white/40 font-orbitron text-[10px] hover:bg-white/10 transition-all"
                        >
                          CANCELAR
                        </button>
                        {challengeStep === 'listening' && (
                          <button
                            onClick={() => {
                              setChallengeStep('verifying');
                              setTimeout(() => setChallengeStep('success'), 2000);
                              setTimeout(() => {
                                setShowBiometricModal(false);
                                setChallengeStep('idle');
                              }, 4000);
                            }}
                            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-orbitron text-[10px] font-bold"
                          >
                            DETENER Y VERIFICAR
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Terminal */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-nexus-cyan-glow mb-2">
                <Terminal className="w-4 h-4" />
                <span className="font-orbitron text-xs tracking-widest">CONSOLE OUTPUT</span>
              </div>
              <div className="font-mono text-[11px] space-y-2 text-white/60">
                <div className="flex gap-2">
                  <span className="text-green-500">[14:04:05]</span>
                  <span>Swarm initialization confirmed.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-nexus-cyan-glow">[14:04:10]</span>
                  <span>Mastra node connected to Knowledge Graph.</span>
                </div>
                <div className="flex gap-2 font-bold text-white">
                  <span className="text-yellow-500">
                    {'>'}
                    {'>'}
                  </span>
                  <span className="animate-pulse">Waiting for directive...</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-nexus-cyan-glow/10 to-transparent border border-nexus-cyan-glow/20">
              <h4 className="font-orbitron text-xs text-nexus-cyan-glow tracking-widest mb-4">
                CONFIGURACIÓN DE AGENTES
              </h4>
              <div className="space-y-3">
                {['Researcher', 'Coder', 'Security Auditor'].map(agent => (
                  <div
                    key={agent}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-nexus-cyan-glow/20 transition-all cursor-pointer"
                  >
                    <span className="text-xs text-white/80">{agent}</span>
                    <Play className="w-3 h-3 text-nexus-cyan-glow" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-nexus-cyan-glow mb-2">
                <Globe className="w-4 h-4" />
                <span className="font-orbitron text-xs tracking-widest">REGIONAL HEALTH</span>
              </div>
              <div className="space-y-3">
                {[
                  { region: 'US-EAST-1 (Primary)', status: 'Operational', latency: '42ms' },
                  { region: 'EU-WEST-1 (Failover)', status: 'Standby', latency: '128ms' },
                ].map(r => (
                  <div
                    key={r.region}
                    className="flex items-center justify-between text-[11px] font-mono"
                  >
                    <span className="text-white/60">{r.region}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40">{r.latency}</span>
                      <span
                        className={r.status === 'Operational' ? 'text-green-500' : 'text-blue-500'}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-red-500/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-orbitron text-xs text-white/60 tracking-widest">
                  NEURAL RESILIENCE
                </h4>
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                  <span className="text-[10px] text-red-500 font-mono">SANITY: 98%</span>
                </div>
              </div>
              <button
                onClick={() => setShowBiometricModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 font-orbitron text-[10px] hover:bg-red-500/10 transition-all"
              >
                TRIGGER PHOENIX PROTOCOL
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-nexus-cyan-glow/20 transition-all">
              <h4 className="font-orbitron text-xs text-white/60 tracking-widest mb-4">
                ENTERPRISE AUDITING
              </h4>
              <button
                onClick={() => alert('Generando exportación criptográfica firmada...')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-nexus-cyan-glow/5 border border-nexus-cyan-glow/20 text-nexus-cyan-glow font-orbitron text-[10px] hover:bg-nexus-cyan-glow/10 transition-all"
              >
                SOLICITAR REPORTE CUMPLIMIENTO
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
