import React, { useEffect, useState } from 'react';
import { fetchBillingData } from '../api/billing';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

export const FinanceAdminPanel = () => {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBillingData()
      .then(data => {
        setBilling(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error fetching billing data');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 font-bold">
      ⚠️ {error}
    </div>
  );

  const chartData = [
    { name: 'Google Cloud', value: billing.googleCloudUSD, color: '#4285F4' },
    { name: 'Vercel', value: billing.vercelUSD, color: '#000000' },
    { name: 'Otros', value: billing.otherUSD, color: '#10B981' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Gestión Financiera Nexus
          </h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Control de costos en tiempo real • IVA 21% ES</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Última sync:</span>
          <span className="ml-2 text-xs font-bold">{new Date(billing.updatedAt).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Subtotal (Base)" value={`$${billing.googleCloudUSD + billing.vercelUSD + billing.otherUSD}`} sub="Neto" />
        <KpiCard title="IVA (21%)" value={`$${(billing.totalUSD - (billing.googleCloudUSD + billing.vercelUSD + billing.otherUSD)).toFixed(2)}`} sub="Fiscal ES" color="text-emerald-400" />
        <KpiCard title="Total Bruto" value={`$${billing.totalUSD.toFixed(2)}`} sub="USD" />
        <KpiCard title="Total en EUR" value={`€${billing.totalEUR.toFixed(2)}`} sub="Estimado" highlight={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Breakdown Chart */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gray-900/40 shadow-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>📊</span> Desglose por Proveedor
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Projection Chart */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gray-900/40 shadow-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>📈</span> Proyección de Beneficio
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Gastos', value: billing.totalEUR, color: '#ef4444' },
                    { name: 'Beneficio', value: 49 * 10 - billing.totalEUR, color: '#22c55e' },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#22c55e" />
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">Escenario: 10 Suscriptores "Manager"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, sub, color = "text-white", highlight = false }) => (
  <div className={`p-6 rounded-3xl border ${highlight ? 'border-blue-500/50 shadow-lg shadow-blue-500/20 bg-blue-600/10' : 'border-white/5 bg-gray-900/40'} flex flex-col justify-between h-32`}>
    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{title}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
    <p className="text-[9px] text-gray-500 font-bold uppercase">{sub}</p>
  </div>
);

const AlertItem = ({ label, perc, status }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold">
      <span>{label}</span>
      <span className={status === 'WARNING' ? 'text-orange-400' : 'text-blue-400'}>{perc}%</span>
    </div>
    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${status === 'WARNING' ? 'bg-orange-400' : 'bg-blue-400'}`} style={{ width: `${perc}%` }}></div>
    </div>
  </div>
);
