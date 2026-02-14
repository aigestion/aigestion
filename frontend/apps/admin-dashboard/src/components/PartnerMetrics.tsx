import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Zap, Users, Shield } from 'lucide-react';
import { api, PartnerMetrics as IPartnerMetrics } from '../services/api';

export const PartnerMetrics = () => {
  const [metrics, setMetrics] = React.useState<IPartnerMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getPartnerMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-card animate-pulse flex items-center justify-center min-h-[200px]">
        <span className="text-white/20 font-bold tracking-widest uppercase">Synchronizing Sovereign Data...</span>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Uso del Sistema',
      value: `${((metrics?.totalTokens || 0) / 1000).toFixed(1)}k`,
      sub: 'Tokens Procesados',
      icon: Zap,
      color: 'text-yellow-400',
    },
    {
      title: 'Retención Soberana',
      value: `$${(metrics?.totalPlatformCommission || 0).toFixed(2)}`,
      sub: 'Beneficio Plataforma',
      icon: Shield,
      color: 'text-cyan-400',
    },
    {
      title: 'Economía Creadores',
      value: `$${(metrics?.totalCreatorCommission || 0).toFixed(2)}`,
      sub: 'Marketplace Volume',
      icon: DollarSign,
      color: 'text-emerald-400',
    },
    {
      title: 'Alcance Global',
      value: metrics?.userCount || 0,
      sub: 'Usuarios Activos',
      icon: Users,
      color: 'text-purple-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-yellow-500 via-purple-600 to-cyan-500" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-yellow-500" />
            PORTAL DE SOCIOS <span className="text-xs ml-3 text-white/30 font-mono">BI_SOVEREIGN_V1</span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1 font-bold">Métricas de Crecimiento y Reparto de Beneficios</p>
        </div>
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
           <span className="text-[10px] font-black text-yellow-500 uppercase tracking-tighter">Live Intelligence</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-[10px] font-bold text-white/20 group-hover:text-white/40 transition-colors uppercase">0{index + 1}</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tighter">{item.value}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-linear-to-r from-purple-900/40 to-blue-900/40 rounded-2xl border border-white/5 flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
               <Shield className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
               <p className="text-xs font-bold text-white tracking-tight uppercase">Estado de Soberanía</p>
               <p className="text-[10px] text-white/40 font-medium">Todas las comisiones auditadas mediante AES-256</p>
            </div>
         </div>
         <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            Descargar Reporte
         </button>
      </div>
    </motion.div>
  );
};
