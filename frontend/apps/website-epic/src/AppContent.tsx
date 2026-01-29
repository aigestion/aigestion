import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatedMeshGradient } from './components/AnimatedMeshGradient';
import { CommandTerminal } from './components/CommandTerminal';
import { CyberpunkGrid } from './components/CyberpunkGrid';
import { Navigation } from './components/Navigation';
import { NeuralParticles } from './components/NeuralParticles';
import { NexusCursor } from './components/NexusCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { VitureXRExperience } from './components/VitureXRExperience';
import { WorkbenchLayout } from './components/workbench/WorkbenchLayout';
import { CursorGlow } from './components/CursorGlow';
import { MeshGradientBG } from './components/MeshGradientBG';
import { useNotification } from './contexts/NotificationContext';
import { Login } from './pages/Login';
import VirtualOfficePreview from './pages/VirtualOfficePreview';
import WeaponDashboard from './pages/WeaponDashboard';

// Loading fallback component
export const LoadingFallback = () => (
  <div className="min-h-[400px] bg-nexus-obsidian-deep flex items-center justify-center">
    <div className="text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs animate-pulse">
      LOADING...
    </div>
  </div>
);

export const Footer = () => (
  <footer className="py-32 bg-nexus-obsidian-deep border-t border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-radial-at-bottom from-nexus-violet/5 via-transparent to-transparent pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 relative z-10">
      <div className="col-span-1 md:col-span-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="/website-epic/images/brand/logo.png"
            alt="AIGestion"
            className="h-10 mb-8 filter brightness-110 drop-shadow-[0_0_10px_rgba(138,43,226,0.3)]"
          />
          <p className="text-nexus-silver/50 text-lg max-w-sm mb-12 font-light leading-relaxed italic">
            "Arquitectura de Inteligencia Soberana. <br />
            El núcleo neuronal para las empresas del mañana."
          </p>
          <div className="text-[10px] text-nexus-silver/20 font-mono uppercase tracking-[0.4em] mt-12">
            © 2026 AIGestion.net | God Level AI Restored v2.1 (Fixes Applied)
          </div>
        </motion.div>
      </div>
      <div>
        <h4 className="font-orbitron text-xs text-nexus-cyan-glow mb-8 uppercase tracking-[0.3em] font-bold">
          Ecosistema
        </h4>
        <ul className="space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase">
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">
            Casos de Uso
          </li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">
            Daniela AI
          </li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">
            Nodos Globales
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-orbitron text-xs text-nexus-violet-glow mb-8 uppercase tracking-[0.3em] font-bold">
          Metaverso
        </h4>
        <ul className="space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase">
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">
            Sedes Decentraland
          </li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">
            Virtual Office
          </li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300 text-nexus-cyan-glow font-bold">
            Acceso Terminal
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

// Component that uses useNotification - MUST be inside NotificationProvider
export const AppContent = ({
  loading,
  isAuthenticated,
  currentUser,
  handleLogin,
  handleLogout,
}: any) => {
  const { notify } = useNotification();
  const location = useLocation();

  // Watch location for view transitions
  useEffect(() => {
    if (!document.startViewTransition) return;
    document.startViewTransition(() => {
      // Transition trigger
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!loading) {
      notify('SISTEMA ACTIVADO', 'Protocolos Antigravity God Mode Online', 'success');
    }
  }, [loading, notify]);

  return (
    <div className="bg-nexus-obsidian min-h-screen text-white font-sans selection:bg-nexus-violet selection:text-white relative">
      <MeshGradientBG />
      <CursorGlow />
      <ScrollProgress />
      {!isAuthenticated ? <Navigation /> : null}
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <WorkbenchLayout user={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <main>
                {/* HeroSection - New Organism */}
                <HeroSection
                  title={
                    <>
                      AIGESTION<span className="text-nexus-cyan font-light">.NET</span>
                    </>
                  }
                  subtitle="Arquitectura de Inteligencia Soberana"
                  description="El núcleo neuronal para las empresas del mañana. Sincronización absoluta entre inteligencia artificial, IoT y logística global."
                  videoSrc="/website-epic/videos/cinematic/space-intro.mp4"
                  ctas={[
                    {
                      label: 'AUTORIZAR ACCESO',
                      onClick: () => (window.location.href = '#contact'),
                    },
                    { label: 'VER ECOSISTEMA', onClick: () => {}, variant: 'outline' },
                  ]}
                />

                {/* synthetic Consciousness - Daniela AI */}
                <Suspense fallback={<LoadingFallback />}>
                  <DanielaShowcase />
                </Suspense>

                {/* Quantum Guardian - Nexus Android */}
                <Suspense fallback={<LoadingFallback />}>
                  <NexusAndroid />
                </Suspense>

                {/* Strategic ROI analysis */}
                <Suspense fallback={<LoadingFallback />}>
                  <EnhancedROI />
                </Suspense>

                {/* Decentraland Headquarters */}
                <Suspense fallback={<LoadingFallback />}>
                  <DecentralandOffice />
                </Suspense>

                {/* Immersive Contact Experience */}
                <Suspense fallback={<LoadingFallback />}>
                  <ContactSection />
                </Suspense>

                {/* VITURE XR Experience */}
                <VitureXRExperience />
              </main>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/lab"
          element={
            <div className="pt-32 pb-20 px-6">
              <h1 className="text-4xl font-orbitron text-white text-center">Lab Section</h1>
            </div>
          }
        />

        <Route path="/weapon" element={<WeaponDashboard />} />

        {/* Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-orbitron text-nexus-violet-glow mb-4">
                  Admin Dashboard
                </h1>
                <p className="text-nexus-silver/60 mb-8">Panel de administración avanzada</p>
                <a
                  href="https://admin.aigestion.net"
                  className="btn-enterprise px-8 py-3 rounded-full"
                >
                  Acceder al Admin Dashboard
                </a>
              </div>
            </div>
          }
        />

        <Route
          path="/client"
          element={
            <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-orbitron text-nexus-cyan-glow mb-4">
                  Client Dashboard
                </h1>
                <p className="text-nexus-silver/60 mb-8">Portal exclusivo para clientes</p>
                <a
                  href="https://client.aigestion.net"
                  className="btn-enterprise px-8 py-3 rounded-full"
                >
                  Acceder al Client Dashboard
                </a>
              </div>
            </div>
          }
        />

        <Route
          path="/demo"
          element={
            <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-orbitron text-nexus-gold mb-4">Demo Dashboard</h1>
                <p className="text-nexus-silver/60 mb-8">Experiencia interactiva de demostración</p>
                <a
                  href="https://demo.aigestion.net"
                  className="btn-enterprise px-8 py-3 rounded-full"
                >
                  Acceder al Demo Dashboard
                </a>
              </div>
            </div>
          }
        />

        {/* Daniela AI Routes */}
        <Route path="/daniela" element={<DanielaDemo />} />
        <Route path="/daniela/demo" element={<DanielaDemo />} />

        {/* Virtual Office Routes */}
        <Route path="/virtual-office" element={<VirtualOfficePreview />} />
        <Route path="/virtual-office/go" element={<DecentralandOffice />} />
      </Routes>

      <Footer />
      <CommandTerminal />
      <CommandPalette />
      <DanielaOmniWidget />
      <NexusCursor />
      <AnimatedMeshGradient />
      <CyberpunkGrid />
      <NeuralParticles />
    </div>
  );
};
