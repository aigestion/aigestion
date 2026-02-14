import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, TrendingDown, ShieldCheck, Zap, ArrowUpRight, Wallet, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface BondTier {
  id: 'silver' | 'gold' | 'sovereign';
  name: string;
  price: number;
  value: number;
  discount: number;
  features: string[];
}

const tiers: BondTier[] = [
  {
    id: 'silver',
    name: 'Bono Plata',
    price: 50,
    value: 55,
    discount: 10,
    features: ['10% de ahorro extra', 'Soporte Estándar', 'Válido por 1 año'],
  },
  {
    id: 'gold',
    name: 'Bono Oro',
    price: 200,
    value: 250,
    discount: 20,
    features: ['20% de ahorro extra', 'Prioridad Media', 'Acceso a Modelos Pro'],
  },
  {
    id: 'sovereign',
    name: 'Bono Soberano',
    price: 500,
    value: 770,
    discount: 35,
    features: ['35% de ahorro máximo', 'Soporte God Mode', 'Acceso anticipado a features'],
  },
];

export const SovereignTreasury: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<BondTier>(tiers[1]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [overview, setOverview] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await api.getTreasuryOverview();
      setOverview(data);
    } catch (error) {
      console.error('Failed to fetch treasury:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      await api.purchaseBond({ amount: selectedTier.price, tier: selectedTier.id });
      await fetchOverview();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="p-8 rounded-4xl bg-slate-900 border border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Landmark className="text-yellow-500" size={32} />
              Tesorería Soberana
            </h2>
            <p className="text-slate-400 mt-2 font-medium tracking-wide">
              Asegura tu potencia de cómputo con liquidez estratégica.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Saldo de Créditos</p>
              <p className="text-3xl font-black text-white">
                {loading ? <Loader2 className="animate-spin inline-block w-6 h-6" /> : `$${overview?.activeBalance?.toFixed(2) || '0.00'}`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <Wallet className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => setSelectedTier(tier)}
              className={`cursor-pointer p-6 rounded-4xl border transition-all duration-500 flex flex-col ${
                selectedTier.id === tier.id
                  ? 'bg-yellow-500/10 border-yellow-500/50 shadow-2xl shadow-yellow-500/10'
                  : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${
                  selectedTier.id === tier.id ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/30' : 'bg-white/5 text-slate-400'
                }`}>
                  <ShieldCheck size={28} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Bonus Rate</span>
                   <span className="text-2xl font-black text-white">+{tier.discount}%</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-slate-500 text-sm mb-6 font-medium">Inversión: <span className="text-white">${tier.price}</span> → Valor: <span className="text-yellow-500">${tier.value}</span></p>
              
              <ul className="space-y-4 mb-8 grow">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium tracking-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={(e) => { e.stopPropagation(); handlePurchase(); }}
                disabled={purchasing}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all relative overflow-hidden ${
                  selectedTier.id === tier.id
                    ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 active:scale-95'
                    : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                }`}
              >
                <AnimatePresence mode="wait">
                  {purchasing && selectedTier.id === tier.id ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Loader2 className="animate-spin w-4 h-4" />
                      Procesando...
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="label"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      Reforzar Tesorería
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 p-8 rounded-4xl bg-white/5 border border-white/5 backdrop-blur-sm">
             <div className="flex items-center justify-between mb-8">
               <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                 <Sparkles className="text-yellow-500" size={18} />
                 Bonos Activos en el Nodo
               </h4>
               <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded border border-green-500/20 tracking-tighter uppercase">Verificado por Inversify</span>
             </div>

             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {overview?.bonds?.length > 0 ? (
                  overview.bonds.map((b: any, i: number) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={`w-2 h-10 rounded-full ${b.tier === 'sovereign' ? 'bg-yellow-500' : b.tier === 'gold' ? 'bg-blue-400' : 'bg-slate-500'}`} />
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">{b.tier} Bond</p>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Status: <span className={b.status === 'active' ? 'text-green-400' : 'text-red-400'}>{b.status}</span></p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-white">${b.balance?.toFixed(2) || '0.00'}</p>
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Restante</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl">
                    <Zap size={24} className="mb-2 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50">No hay bonos activos</p>
                  </div>
                )}
             </div>
           </div>

           <div className="flex flex-col gap-6">
              <div className="p-8 rounded-4xl bg-linear-to-br from-yellow-500/10 to-transparent border border-yellow-500/10 flex flex-col justify-center grow">
                <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-4">Total Ahorrado</h4>
                <p className="text-5xl font-black text-white tracking-tighter mb-2">
                   ${overview?.totalSaved?.toFixed(2) || '0.00'}
                </p>
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                   <TrendingDown size={14} />
                   <span>Optimización de Margen Activa</span>
                </div>
              </div>

              <div className="p-6 rounded-4xl bg-white/5 border border-white/5 flex flex-col justify-center">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 leading-relaxed italic">
                   "La verdadera soberanía digital requiere independencia financiera del cómputo."
                 </p>
                 <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                      <ArrowUpRight className="text-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity" size={16} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Audit Node v2.4.0</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-12 right-12 z-50 bg-green-500 text-slate-900 px-8 py-4 rounded-3xl flex items-center gap-4 shadow-2xl shadow-green-500/30"
          >
            <CheckCircle2 size={24} />
            <div className="flex flex-col">
              <span className="font-black text-sm uppercase tracking-widest">Bono Adquirido</span>
              <span className="text-xs font-bold opacity-75">Tesorería Soberana Reforzada</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
