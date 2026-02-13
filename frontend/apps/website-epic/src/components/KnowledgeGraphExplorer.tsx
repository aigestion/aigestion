import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, Zap, Database, Search } from 'lucide-react';
import { sovereignGodMode, KGNode, KGEdge } from '../services/sovereign-godmode';

export const KnowledgeGraphExplorer: React.FC = () => {
  const [data, setData] = useState<{ nodes: KGNode[]; edges: KGEdge[] }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const graphData = await sovereignGodMode.getKnowledgeGraph();
        setData(graphData);
      } catch (err) {
        console.error('Failed to load KG:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getNodeStyles = (type: string) => {
    if (type === 'mission') return 'border-nexus-cyan/30 bg-nexus-cyan/5';
    if (type === 'finding') return 'border-nexus-violet/30 bg-nexus-violet/5';
    return 'border-white/10 bg-white/5';
  };

  const getIconStyles = (type: string) => {
    if (type === 'mission') return 'text-nexus-cyan bg-nexus-cyan/10';
    if (type === 'finding') return 'text-nexus-violet bg-nexus-violet/10';
    return 'text-white/40 bg-white/5';
  };

  const getGlowStyles = (type: string) => {
    if (type === 'mission') return 'bg-nexus-cyan';
    if (type === 'finding') return 'bg-nexus-violet';
    return 'bg-white';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-nexus-cyan/40">
        <Share2 className="animate-spin-slow" size={48} />
        <p className="font-orbitron text-[10px] tracking-[0.5em]">SYNCING SOVEREIGN MEMORY...</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full bg-black/20 rounded-3xl overflow-hidden"
      ref={containerRef}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 p-6 flex flex-wrap gap-8 items-center justify-center min-h-full">
        {data.nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, index % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              opacity: { delay: index * 0.1 },
              scale: { delay: index * 0.1 },
              y: { repeat: Infinity, duration: 4 + index, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            className={`relative p-6 rounded-2xl border backdrop-blur-xl shadow-2xl cursor-pointer group ${getNodeStyles(node.type)}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${getIconStyles(node.type)}`}>
                {node.type === 'mission' && <Zap size={20} />}
                {node.type === 'finding' && <Database size={20} />}
                {node.type === 'concept' && <Search size={20} />}
              </div>
              <div>
                <div className="text-[10px] opacity-40 font-orbitron tracking-widest uppercase mb-1">
                  {node.type}
                </div>
                <div className="text-sm font-bold text-white group-hover:text-nexus-cyan transition-colors">
                  {node.label}
                </div>
              </div>
            </div>

            <div
              className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${getGlowStyles(node.type)}`}
            />
          </motion.div>
        ))}

        {data.nodes.length === 0 && (
          <div className="text-nexus-silver/20 font-orbitron uppercase text-xs tracking-[0.4em]">
            No se han detectado nodos de inteligencia activas
          </div>
        )}
      </div>

      {/* Legend & Controls */}
      <div className="absolute bottom-6 left-6 flex gap-6 z-20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-nexus-cyan shadow-cyan-glow" />
          <span className="text-[9px] font-orbitron text-white/40 tracking-widest uppercase">
            Misiones
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-nexus-violet shadow-violet-glow" />
          <span className="text-[9px] font-orbitron text-white/40 tracking-widest uppercase">
            Hallazgos
          </span>
        </div>
      </div>
    </div>
  );
};
