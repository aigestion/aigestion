import { DashboardLayout, NeonCard, Skeleton, BusinessIntelligence, GoogleServiceHub, IdeaSynthesizer } from '@shared/index';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <DashboardLayout title="CENTRO DE EMPRESA DIVINO" type="CLIENT">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <NeonCard title="CLIENTE PREMIUM" accentColor="rgba(168, 85, 247, 0.5)" className="lg:col-span-2">
          {loading ? <Skeleton className="h-44" /> : (
            <div className="flex justify-between items-center h-full">
              <div>
                <h3 className="text-4xl font-orbitron font-black text-white">ALJANDRO CORP</h3>
                <p className="text-nexus-silver/40 font-mono mt-2">ID: AIG-99228-G | Status: VIP GOD MODE</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-orbitron text-nexus-violet-glow tracking-widest uppercase">Crédito AI</span>
                <p className="text-2xl font-orbitron font-bold text-white">UNLIMITED</p>
              </div>
            </div>
          )}
        </NeonCard>

        <NeonCard title="CONSUMO NEURONAL" accentColor="rgba(255, 255, 255, 0.2)">
          <div className="text-6xl font-orbitron font-black text-white tracking-tighter">84%</div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-nexus-violet-glow" style={{ width: '84%' }} />
          </div>
        </NeonCard>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4 text-nexus-violet-glow">
          <div className="w-1 h-8 bg-nexus-violet-glow shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          BUSINESS INTELLIGENCE & CRM
        </h3>
        {loading ? <Skeleton className="h-96 w-full" /> : <BusinessIntelligence />}
      </div>

      <div className="mt-12 mb-12">
        <h3 className="text-xl font-orbitron font-black mb-8 flex items-center gap-4">
          <div className="w-1 h-8 bg-white/20" />
          GOOGLE WORKSPACE ECOSYSTEM
        </h3>
        {loading ? <Skeleton className="h-64 w-full" /> : <GoogleServiceHub />}
      </div>
      <div className="mt-12">
        <IdeaSynthesizer />
      </div>
      <Analytics />
      <SpeedInsights />
    </DashboardLayout>
  );
};

export default App;
