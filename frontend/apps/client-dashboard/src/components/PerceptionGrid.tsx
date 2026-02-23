import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Scan, 
  Image as ImageIcon, 
  Maximize2, 
  Cpu, 
  Zap,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

/**
 * 👁️ PERCEPTION GRID WIDGET
 * Visual perception interface for exploring AI visual analysis and browser snapshots.
 */
export const PerceptionGrid = () => {
  const [perceptions, setPerceptions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'live' | 'archive'>('live');

  // Load initial simulated data or fetch real archive
  React.useEffect(() => {
    setPerceptions([
      {
        id: '1',
        type: 'web_snapshot',
        title: 'Google Logo Analysis',
        timestamp: new Date().toISOString(),
        thumbnail: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        analysis: 'Detected official Google brand assets with high confidence (99.8%). Colors: Blue, Red, Yellow, Green.',
        status: 'analyzed'
      },
      {
        id: '2',
        type: 'system_viz',
        title: 'Nexus Infrastructure Hub',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
        analysis: 'Infrastructure topology scan complete. No critical anomalies in core clusters.',
        status: 'analyzed'
      }
    ]);
  }, []);

  const triggerAnalysis = async () => {
    setLoading(true);
    try {
        const result = await api.analyzeVision({
            imageUri: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
            instruction: 'Analyze this logo for brand consistency.'
        });
        
        if (result.success) {
            const newPerception = {
                id: Date.now().toString(),
                type: 'ai_vision',
                title: 'New Perception',
                timestamp: new Date().toISOString(),
                thumbnail: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
                analysis: result.analysis,
                status: 'analyzed'
            };
            setPerceptions(prev => [newPerception, ...prev]);
        }
    } catch (err) {
        console.error('Vision trigger failed', err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 h-full flex flex-col bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-white/10 relative overflow-hidden group"
    >
      {/* Background Pulse */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[120px] pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-1000" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Visual Perception</h3>
            <p className="text-[10px] text-purple-400 font-mono uppercase tracking-widest leading-none mt-1">
              Active Neural Sight
            </p>
          </div>
        </div>
        <button 
          onClick={triggerAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-white/70 font-bold uppercase tracking-tight transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Scan className="w-3 h-3" />}
          Trigger Scan
        </button>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar z-10">
        <AnimatePresence mode="popLayout">
          {perceptions.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 rounded-xl border border-white/5 overflow-hidden group/card hover:border-purple-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row h-full">
                {/* Thumbnail Layer */}
                <div className="relative w-full sm:w-24 h-24 sm:h-auto bg-black">
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-1 left-1">
                    {p.type === 'web_snapshot' ? <ExternalLink className="w-3 h-3 text-white/50" /> : <Zap className="w-3 h-3 text-purple-400" />}
                  </div>
                </div>

                {/* Info Layer */}
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{p.title}</h4>
                    <span className="text-[8px] text-white/30 font-mono italic">
                      {new Date(p.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/60 line-clamp-2 leading-relaxed italic">
                    \"{p.analysis}\"
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-purple-500/40 animate-pulse" />
                    </div>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Maximize2 className="w-3 h-3 text-white/40 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-white/20" />
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Multimodal Hub: Online</span>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
      </div>
    </motion.div>
  );
};
