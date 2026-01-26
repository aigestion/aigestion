import SpatialPresentation from '../components/SpatialPresentation';
import { motion } from 'framer-motion';
import { Activity, Cpu, Shield, Zap } from 'lucide-react';

const WeaponDashboard: React.FC = () => {
    const [spatialMode, setSpatialMode] = useState(false);

    return (
        <div className={`weapon-dashboard min-h-screen p-6 transition-all duration-700 ${spatialMode ? 'bg-black' : 'bg-nexus-obsidian'}`}>
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-orbitron text-glow tracking-tighter">TU PANEL DE CONTROL</h1>
                    <p className="text-nexus-cyan text-xs font-bold uppercase tracking-widest">Toda la información en tu mano</p>
                </div>
                <button
                    onClick={() => setSpatialMode(!spatialMode)}
                    className={`px-4 py-2 rounded-lg border transition-all ${spatialMode ? 'bg-nexus-cyan text-black border-nexus-cyan' : 'bg-transparent text-nexus-cyan border-nexus-cyan/30'}`}
                >
                    {spatialMode ? 'VER EN 3D: SÍ' : 'VER EN 3D: NO'}
                </button>
            </header>

            {/* Main Grid - Advanced Masonry-style Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-24">

                {/* Quick Fire Actions - Span 4 */}
                <section className="md:col-span-4 card-enterprise group hover:border-nexus-cyan/40 transition-all duration-500">
                    <h2 className="text-xl font-orbitron mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="text-nexus-silver/50 tracking-[0.2em] text-xs">MENÚ://</span>
                        ACCIONES RÁPIDAS
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {['USAR DANIELA', 'REVISAR TODO', 'GUARDAR NUBE', 'CREAR DIBUJO'].map((action, i) => (
                            <motion.button 
                                key={action}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
                                whileTap={{ scale: 0.98 }}
                                className={`btn-enterprise text-[10px] py-4 px-2 tracking-widest ${i === 1 ? 'bg-nexus-violet/20 border-nexus-violet/40' : ''}`}
                            >
                                {action}
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* System Health / Telemetry - Span 8 */}
                <section className="md:col-span-8 card-enterprise bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                        <Cpu className="w-4 h-4 text-nexus-cyan/20 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-orbitron mb-6 flex items-center gap-2">
                        <span className="text-nexus-silver/50 tracking-[0.2em] text-xs">DATOS://</span>
                        CÓMO VA TODO
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {[
                                { label: 'CONEXIÓN CEREBAL', value: '98%', color: 'bg-nexus-cyan' },
                                { label: 'RAPIDEZ RESPUESTA', value: 'Muy veloz', color: 'bg-nexus-violet' },
                                { label: 'SEGURIDAD TOTAL', value: 'ALTA', color: 'bg-green-500' }
                            ].map((stat, i) => (
                                <div key={stat.label} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-nexus-silver/60 text-[10px] tracking-widest">{stat.label}</span>
                                        <span className="text-white font-orbitron text-xs">{stat.value}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: stat.value.includes('%') ? stat.value : '100%' }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                            className={`h-full ${stat.color} shadow-[0_0_10px_rgba(34,211,238,0.3)]`} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Live Sparkline Simulation */}
                        <div className="relative h-full min-h-[120px] bg-black/40 rounded-xl border border-white/5 p-4">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <Activity className="w-12 h-12 text-nexus-cyan" />
                            </div>
                            <div className="relative h-full flex items-end gap-1">
                                {[...Array(24)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: [Math.random() * 40 + 20 + '%', Math.random() * 60 + 30 + '%', Math.random() * 40 + 20 + '%'] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                        className="flex-1 bg-nexus-cyan/20 min-w-[2px] rounded-t-sm"
                                    />
                                ))}
                            </div>
                            <div className="absolute top-2 left-2 text-[8px] font-mono text-nexus-cyan/40">FLUJO DE DATOS EN VIVO</div>
                        </div>
                    </div>
                </section>

                {/* Spatial Preview - Large Span */}
                {spatialMode && (
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-12 mt-6"
                    >
                        <div className="card-enterprise p-0 overflow-hidden border-nexus-cyan/30">
                            <div className="p-4 border-b border-white/5 bg-nexus-cyan/5 flex justify-between items-center">
                                <span className="text-[10px] font-orbitron tracking-widest text-nexus-cyan-glow">SALA DE PROYECCIÓN 3D // ACTIVA</span>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-nexus-violet animate-pulse delay-75" />
                                </div>
                            </div>
                            <div className="h-[600px] w-full bg-black relative">
                                <SpatialPresentation
                                    title="AIG Proyect Alpha (AR Preview)"
                                    modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                                    posterUrl="https://modelviewer.dev/shared-assets/models/Astronaut.png"
                                />
                                {/* Scrawling Data background */}
                                <div className="absolute top-0 left-0 w-32 h-full border-r border-white/5 overflow-hidden pointer-events-none opacity-20">
                                    <motion.div 
                                        animate={{ y: ['0%', '-100%'] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        className="text-[8px] font-mono p-2 space-y-1"
                                    >
                                        {[...Array(50)].map((_, i) => (
                                            <div key={i}>0x{Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}</div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>

            {/* Footer Status */}
            <footer className="fixed bottom-6 left-6 right-6 flex justify-between items-center opacity-40 text-[10px] font-mono tracking-widest uppercase">
                <span>APARATO: TU MÓVIL</span>
                <span>CEREBRO: NEXUS V1</span>
            </footer>
        </div>
    );
};

export default WeaponDashboard;
