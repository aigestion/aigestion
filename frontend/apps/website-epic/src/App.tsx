import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';
import { Navigation } from './components/Navigation';
import { IllustrativeHero } from './components/IllustrativeHero';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { DataVisualization } from './components/DataVisualization';
import { CinematicPresentation } from './components/CinematicPresentation';
import { DanielaShowcase } from './components/DanielaShowcase';
import { MetaverseSection } from './components/MetaverseSection';
import { DashboardAccess } from './components/DashboardAccess';
import { supabase } from './services/supabase';
import Login from './pages/Login';
import { BrandShowcase } from './components/BrandShowcase';
import { NexusAvatar } from './components/NexusAvatar';
import { NexusHome } from './components/NexusHome';
import { NexusWarRoom } from './components/NexusWarRoom';
import { ImageGenerator } from './components/ImageGenerator';
import WeaponDashboard from './pages/WeaponDashboard';
import { CursorFollower } from './components/CursorFollower';
import { ROICalculator } from './components/ROICalculator';
import { CommandTerminal } from './components/CommandTerminal';
import { ParticleBackground } from './components/ParticleBackground';
import { MobileDownloadSection } from './components/MobileDownloadSection';
import SpatialPresentation from './components/SpatialPresentation';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('admindashboard'));
const ClientDashboard = lazy(() => import('clientdashboard'));
const DemoDashboard = lazy(() => import('demodashboard'));

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[100] bg-nexus-obsidian-deep flex flex-col items-center justify-center text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs">
    <div className="w-12 h-px bg-nexus-cyan-glow mb-4 animate-[pulse_1s_infinite]" />
    INITIALIZING MODULE...
  </div>
);

const Footer = () => (
  <footer className="py-32 bg-nexus-obsidian-deep border-t border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-radial-at-bottom from-nexus-violet/5 via-transparent to-transparent pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 relative z-10">
      <div className="col-span-1 md:col-span-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-12 h-12 bg-nexus-violet rounded-xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h3 className="text-3xl font-orbitron font-black mb-6 text-white">AIGestion</h3>
          <p className="text-nexus-silver/50 text-lg max-w-sm mb-12 font-light leading-relaxed italic">
            "Arquitectura de Inteligencia Soberana. <br />
            El núcleo neuronal para las empresas del mañana."
          </p>
          <div className="text-[10px] text-nexus-silver/20 font-mono uppercase tracking-[0.4em] mt-12">
            © 2026 AIGestion.net | God Level AI Restored
          </div>
        </motion.div>
      </div>
      <div>
        <h4 className="font-orbitron text-xs text-nexus-cyan-glow mb-8 uppercase tracking-[0.3em] font-bold">Ecosistema</h4>
        <ul className="space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase">
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Admin Dashboard</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Client Dashboard</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Demo Dashboard</li>
        </ul>
      </div>
      <div>
        <h4 className="font-orbitron text-xs text-nexus-violet-glow mb-8 uppercase tracking-[0.3em] font-bold">Tecnología</h4>
        <ul className="space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase">
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Arduino Integration</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">IoT Sensors</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300 text-nexus-cyan-glow font-bold">Real-time Control</li>
        </ul>
      </div>
    </div>
  </footer>
);

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isWarRoomOpen, setIsWarRoomOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-obsidian-deep flex flex-col items-center justify-center text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs">
        <div className="w-12 h-px bg-nexus-cyan-glow mb-4 animate-[pulse_1s_infinite]" />
        INITIALIZING CORE...
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-nexus-obsidian min-h-screen text-white font-sans selection:bg-nexus-violet selection:text-white relative">
        <CommandTerminal />
        <ParticleBackground />
        <CursorFollower />
        <div className="grain-overlay" />
        <Navigation onTerminalToggle={() => setIsWarRoomOpen(!isWarRoomOpen)} />

        <AnimatePresence>
          {isWarRoomOpen && (
            <NexusWarRoom onClose={() => setIsWarRoomOpen(false)} />
          )}
        </AnimatePresence>

        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={
            <main>
              <CinematicPresentation />
              <BrandShowcase />
              <section className="py-24 px-6 max-w-7xl mx-auto">
                <NexusHome />
              </section>
              <InteractiveShowcase />
              <DanielaShowcase />
              <section className="py-32 px-6 flex flex-col items-center justify-center">
                <div className="max-w-4xl w-full">
                  <SpatialPresentation
                    title="NODO CENTRAL - PROYECCIÓN 3D"
                    modelUrl="/models/central_node.glb"
                    posterUrl="/images/models/central_node_poster.webp"
                  />
                </div>
              </section>
              <DataVisualization />
              <ROICalculator />
              <MobileDownloadSection />
              <section className="py-24 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-at-center from-nexus-cyan/5 via-transparent to-transparent pointer-events-none" />
                <div className="w-px h-32 bg-linear-to-b from-nexus-cyan-glow to-transparent mb-16" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-4xl md:text-7xl font-orbitron font-black mb-12 tracking-tight">
                    ¿LISTO PARA EL <br />
                    <span className="text-nexus-violet-glow text-glow uppercase italic">Siguiente Nivel?</span>
                  </h3>
                  <button className="btn-enterprise px-16! py-6! text-xl! rounded-full! font-orbitron tracking-[0.3em] uppercase transition-all duration-500 hover:scale-105 active:scale-95">
                    Contactar Nodo Central
                  </button>
                </motion.div>
              </section>
            </main>
          } />

          <Route path="/lab" element={
            <div className="pt-32 pb-20 px-6">
              <ImageGenerator />
            </div>
          } />

          <Route path="/weapon" element={<WeaponDashboard />} />

          <Route path="/admin/*" element={
            <Suspense fallback={<LoadingOverlay />}>
              <AdminDashboard />
            </Suspense>
          } />

          <Route path="/client/*" element={
            <Suspense fallback={<LoadingOverlay />}>
              <ClientDashboard />
            </Suspense>
          } />

          <Route path="/demo/*" element={
            <Suspense fallback={<LoadingOverlay />}>
              <DemoDashboard />
            </Suspense>
          } />

          <Route path="/dashboards" element={
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
              <DashboardAccess />
            </div>
          } />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
