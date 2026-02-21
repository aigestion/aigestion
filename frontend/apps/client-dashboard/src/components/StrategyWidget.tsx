
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, RefreshCcw, AlertTriangle, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

interface StrategyData {
  success: boolean;
  data: string;
}

export const StrategyWidget: React.FC = () => {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStrategy = async () => {
    try {
      setLoading(true);
      const res = await api.getFinanceStrategy();
      if (res.success) {
        setStrategy(res.data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('Estrategia no disponible');
      }
    } catch (err) {
      console.error('Failed to fetch strategy:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
    const interval = setInterval(fetchStrategy, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 rounded-4xl bg-slate-900 border border-white/5 relative overflow-hidden group h-full flex flex-col">
      {/* Background Glows */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/20">
              <Brain size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                Estratega DeFi
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                Motor de Razonamiento IA
                <span
                  className={`w-1 h-1 rounded-full ${loading ? 'bg-yellow-500' : 'bg-purple-500'} animate-pulse`}
                />
              </p>
            </div>
          </div>
          <button
            onClick={fetchStrategy}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {loading && !strategy ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="w-3/4 h-4 bg-white/5 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-white/5 rounded animate-pulse" />
                <div className="w-full h-24 bg-white/5 rounded-xl animate-pulse mt-4" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400"
              >
                <AlertTriangle size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-sm max-w-none"
              >
                <div className="whitespace-pre-wrap text-slate-300 font-medium leading-relaxed">
                  {strategy}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Gemini 2.0 Flash
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    Actualizado: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
