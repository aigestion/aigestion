import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Scale, Target, Gavel, Cpu } from 'lucide-react';
import { api } from '../services/api';

export const SovereignHealthRadar: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api.getGovernanceHealth();
        setHealth(data);
      } catch (error) {
        console.error('Health scan failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) {
    return (
      <div className="glass-card animate-pulse flex items-center justify-center min-h-[400px]">
        <Activity className="text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Scale className="w-5 h-5 mr-3 text-cyan-400" />
          RADAR DE SALUD SOBERANA
        </h2>
        <div className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${
          health?.compliant ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {health?.compliant ? 'Cumplimiento: 100%' : 'VIOLACIÓN DE MARGEN'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Margin Gauge */}
        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 relative">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Margen de Cómputo Real</p>
          <div className="relative h-4 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(health?.currentMargin || 0) * 100}%` }}
              className={`h-full bg-linear-to-r ${health?.compliant ? 'from-cyan-500 to-blue-500' : 'from-red-500 to-orange-500'}`}
            />
            {/* Target 30% indicator */}
            <div className="absolute left-[30%] top-0 w-px h-full bg-white/50 z-10" />
          </div>
          <div className="flex justify-between text-[10px] font-black text-slate-600">
            <span>0%</span>
            <span className="text-white">OBJETIVO SOBERANO: 30%</span>
            <span>100%</span>
          </div>
          <p className="text-3xl font-black text-white mt-4">
            {((health?.currentMargin || 0) * 100).toFixed(1)}%
          </p>
        </div>

        {/* Burn Efficiency */}
        <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Eficiencia de Burn</p>
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
               <Cpu className="text-cyan-400" size={32} />
            </div>
            <div>
               <p className="text-2xl font-black text-white">${health?.burnEfficiency || '0.00'}</p>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Costo promedio por misión</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
         <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Gavel size={14} className="text-purple-400" />
            Leyes de Ejecución Activas
         </h3>
         <div className="grid grid-cols-1 gap-2">
            {(health?.laws || []).map((law: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-lg ${law.status === 'ENFORCED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      <Target size={16} />
                   </div>
                   <span className="text-sm font-bold text-white tracking-tight">{law.name}</span>
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{law.status}</span>
              </div>
            ))}
         </div>
      </div>

      <div className="mt-8 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <ShieldAlert size={18} className="text-purple-400 animate-pulse" />
            <p className="text-xs font-medium text-slate-400">
               Estado de la Tesorería: <span className="text-white font-bold">{health?.status || 'UNKNOWN'}</span>
            </p>
         </div>
         <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors">
            Ejecutar Auditoría Root
         </button>
      </div>
    </div>
  );
};
