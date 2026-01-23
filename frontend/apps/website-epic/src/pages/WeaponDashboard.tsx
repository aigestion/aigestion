import React, { useState } from 'react';
import SpatialPresentation from '../components/SpatialPresentation';

const WeaponDashboard: React.FC = () => {
    const [spatialMode, setSpatialMode] = useState(false);

    return (
        <div className={`weapon-dashboard min-h-screen p-6 transition-all duration-700 ${spatialMode ? 'bg-black' : 'bg-nexus-obsidian'}`}>
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-orbitron text-glow tracking-tighter">AIG WEAPON</h1>
                    <p className="text-nexus-cyan text-xs font-bold uppercase tracking-widest">Pixel 8a Command Center</p>
                </div>
                <button
                    onClick={() => setSpatialMode(!spatialMode)}
                    className={`px-4 py-2 rounded-lg border transition-all ${spatialMode ? 'bg-nexus-cyan text-black border-nexus-cyan' : 'bg-transparent text-nexus-cyan border-nexus-cyan/30'}`}
                >
                    {spatialMode ? 'SPATIAL: ON' : 'SPATIAL: OFF'}
                </button>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Quick Fire Actions */}
                <section className="card-enterprise">
                    <h2 className="text-xl font-orbitron mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        QUICK FIRE
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="btn-enterprise text-sm py-4">DEPLOY AI</button>
                        <button className="btn-enterprise text-sm py-4 bg-nexus-violet">AUDIT SYS</button>
                        <button className="btn-enterprise text-sm py-4 opacity-50">SYNC CLOUD</button>
                        <button className="btn-enterprise text-sm py-4 border-nexus-gold/30">GEN ASSET</button>
                    </div>
                </section>

                {/* System Health */}
                <section className="card-enterprise bg-gradient-to-br from-white/5 to-white/0">
                    <h2 className="text-xl font-orbitron mb-4">SYSTEM HEALTH</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-nexus-silver text-sm">GPU ACCEL</span>
                            <span className="text-nexus-accent font-bold">ACTIVE</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-nexus-cyan w-[85%]" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-nexus-silver text-sm">LATENCY</span>
                            <span className="text-nexus-accent font-bold">12ms</span>
                        </div>
                    </div>
                </section>

                {/* Spatial Preview (Client Demo) */}
                {spatialMode && (
                    <section className="col-span-1 md:col-span-2 mt-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <SpatialPresentation
                            title="AIG Proyect Alpha (AR Preview)"
                            modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                            posterUrl="https://modelviewer.dev/shared-assets/models/Astronaut.png"
                        />
                    </section>
                )}
            </div>

            {/* Footer Status */}
            <footer className="fixed bottom-6 left-6 right-6 flex justify-between items-center opacity-40 text-[10px] font-mono tracking-widest uppercase">
                <span>DEVICE: PIXEL 8A</span>
                <span>ENGINE: NEXUS-V1-CORE</span>
            </footer>
        </div>
    );
};

export default WeaponDashboard;
