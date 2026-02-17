import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  RefreshCcw,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

interface PortfolioData {
  address: string;
  totalValue: number;
  assets: Array<{
    symbol: string;
    name: string;
    balance: number;
    valueUsd: number;
    price: number;
  }>;
}

export const PortfolioWidget: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getPortfolio();
      if (res.success) {
        setData(res.data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('Error al cargar el portafolio');
      }
    } catch (err: any) {
      console.error('Failed to fetch portfolio:', err);
      setError('Conexión fallida');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 rounded-4xl bg-slate-900 border border-white/5 relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
              <Wallet size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">The Vault</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                Sovereign Net Worth
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="mb-10">
          <AnimatePresence mode="wait">
            {loading && !data ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-24 flex items-center gap-4"
              >
                <div className="w-full h-12 bg-white/5 rounded-2xl animate-pulse" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400"
              >
                <AlertCircle size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    ${data?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                    <TrendingUp size={14} />
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                    <ShieldCheck size={12} className="text-blue-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {data?.address.slice(0, 6)}...{data?.address.slice(-4)}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    Sync: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {data?.assets.map((asset, i) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/asset"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/asset:text-emerald-400 transition-colors">
                    {asset.symbol}
                  </span>
                  <span className="text-sm font-bold text-white tracking-tight">
                    {asset.balance.toFixed(4)}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-white/80">${asset.valueUsd.toFixed(2)}</p>
                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">@ ${asset.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 border border-slate-900 flex items-center justify-center text-[10px] font-bold">₿</div>
                <div className="w-6 h-6 rounded-full bg-blue-500 border border-slate-900 flex items-center justify-center text-[10px] font-bold">Ξ</div>
                <div className="w-6 h-6 rounded-full bg-yellow-500 border border-slate-900 flex items-center justify-center text-[10px] font-bold">S</div>
             </div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Multi-Chain Nexus</span>
          </div>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
            Wolf Protocol Active
          </p>
        </div>
      </div>
    </div>
  );
};
