
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, TrendingUp, TrendingDown, Clock, ShieldAlert, Crosshair } from 'lucide-react';
import { api } from '../services/api';

interface AlertLog {
  asset: string;
  price: number;
  change: number;
  direction: 'pump' | 'dump';
  timestamp: number;
}

interface AlertsResponse {
  success: boolean;
  data: AlertLog[];
}

export const AlertsWidget: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      // Don't set loading on poll to avoid flicker
      if (alerts.length === 0) setLoading(true);

      const res = await api.getFinanceAlerts();
      if (res.success) {
        setAlerts(res.data);
        setError(null);
      } else {
        setError('Registro no disponible');
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      // Don't show error on poll failure, just log it
      if (alerts.length === 0) setError('Fuera de línea');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 rounded-4xl bg-slate-900 border border-white/5 relative overflow-hidden group h-full flex flex-col">
      {/* Background Glows (Red for Alert theme) */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none group-hover:bg-red-500/20 transition-all duration-700" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/20">
              <Crosshair size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                El Francotirador
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                Objetivos Activos
                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {alerts.length} Impactos
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {loading && alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-full h-16 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </motion.div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs font-bold uppercase tracking-widest">
                {error}
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                <ShieldAlert size={32} className="opacity-20" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Sin Amenazas Activas
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {alerts.map((alert, i) => (
                  <motion.div
                    key={`${alert.asset}-${alert.timestamp}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/item"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-xl ${
                            alert.direction === 'pump'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {alert.direction === 'pump' ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-black text-white uppercase tracking-wider">
                              {alert.asset}
                            </span>
                            <span
                              className={`text-xs font-bold ${
                                alert.direction === 'pump' ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {alert.direction === 'pump' ? '+' : '-'}
                              {Math.abs(alert.change).toFixed(2)}%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Precio: ${alert.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={12} />
                        <span className="text-[9px] font-bold uppercase">
                          {new Date(alert.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
