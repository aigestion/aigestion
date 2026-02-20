import { useEffect, useState } from 'react';
// import SpatialPresentation from '../components/SpatialPresentation'; // Temporarily disabled for debugging
// Using only verified icons or simple text fallback
import { Activity } from 'lucide-react';

const WeaponDashboard: React.FC = () => {
  const [_spatialMode, _setSpatialMode] = useState(false);
  const [sysStatus, setSysStatus] = useState({ cpu: 12, memory: 45 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        setSysStatus(_prev => ({
          cpu: Math.floor(Math.random() * 30) + 10,
          memory: Math.floor(Math.random() * 20) + 40,
        }));
      }, 2000);
      return () => clearInterval(interval);
    } catch (e: any) {
      setError(e.message);
    }
    return undefined;
  }, []);

  if (error) {
    return <div className="p-10 bg-black text-red-500">Error Crítico: {error}</div>;
  }

  return (
    <div
      className={`weapon-dashboard min-h-screen p-4 bg-nexus-obsidian-deep text-white overflow-hidden relative`}
    >
      <header className="flex justify-between items-start mb-8 z-10 relative">
        <div>
          <h1 className="text-3xl font-bold text-nexus-cyan animate-pulse">GOD MODE ACTIVE</h1>
          <p className="text-xs text-gray-400">System Stable // v3.0</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {/* Simple Status Card */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            SYSTEM STATUS
          </h2>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-nexus-cyan">{sysStatus.cpu}%</div>
              <div className="text-[10px] uppercase">CPU Load</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nexus-violet">{sysStatus.memory}GB</div>
              <div className="text-[10px] uppercase">Memory</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <button className="bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-cyan hover:text-black transition-all">
          DANIELA CORE
        </button>

        <button className="bg-nexus-violet/20 text-nexus-violet border border-nexus-violet p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-violet hover:text-black transition-all">
          ADMIN ACCESS
        </button>

        <button
          onClick={() => globalThis.location.reload()}
          className="mt-8 text-xs text-gray-500 underline"
        >
          Reload Shell
        </button>
      </div>
    </div>
  );
};

export default WeaponDashboard;
