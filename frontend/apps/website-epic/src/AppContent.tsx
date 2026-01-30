import { motion } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatedMeshGradient } from './components/AnimatedMeshGradient';
import { CaseStudies } from './components/CaseStudies';
import { CommandPalette } from './components/CommandPalette';
import { CommandTerminal } from './components/CommandTerminal';
import { ContactSection } from './components/ContactSection';
import { CyberpunkGrid } from './components/CyberpunkGrid';
import { DanielaOmniWidget } from './components/DanielaOmniWidget';
import { DanielaShowcase } from './components/DanielaShowcase';
import { FAQSection } from './components/FAQSection';
import { IngeniousPlan } from './components/IngeniousPlan';
import { MeshGradientBG } from './components/MeshGradientBG';
import { Navigation } from './components/Navigation';
import { NeuralParticles } from './components/NeuralParticles';
import { PricingSection } from './components/PricingSection';
import { ScrollProgress } from './components/ScrollProgress';
import { ServicesDeepDive } from './components/ServicesDeepDive';
import { VideoTutorials } from './components/VideoTutorials';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { DemoDashboard } from './components/dashboard/DemoDashboard';
import { WorkbenchLayout } from './components/workbench/WorkbenchLayout';
import { useNotification } from './contexts/NotificationContext';
import { DanielaDemo } from './pages/DanielaDemo';
import { Login } from './pages/Login';
import VirtualOfficePreview from './pages/VirtualOfficePreview';
import WeaponDashboard from './pages/WeaponDashboard';

// Lazy load heavy components
const CinematicPresentation = lazy(() => import('./components/CinematicPresentation').then(module => ({ default: module.CinematicPresentation })));
const NexusAndroid = lazy(() => import('./components/NexusAndroid').then(module => ({ default: module.NexusAndroid })));
const EnhancedROI = lazy(() => import('./components/EnhancedROI').then(module => ({ default: module.EnhancedROI })));
const DecentralandOffice = lazy(() => import('./components/DecentralandOffice').then(module => ({ default: module.DecentralandOffice })));
const VitureXRExperience = lazy(() => import('./components/VitureXRExperience').then(module => ({ default: module.VitureXRExperience })));

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
            src="/images/brand/logo.png"
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
                <div style={{ minHeight: '100vh', padding: '2rem' }}>
                  <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' }}>
                    Centro de Control AIGestion
                  </h1>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <a href="/dashboard/admin" style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      padding: '2rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'white',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      <h3>🏆 Panel Administrativo</h3>
                      <p>Control administrativo y análisis</p>
                    </a>
                    <a href="/dashboard/client" style={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      padding: '2rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'white',
                      border: '1px solid rgba(6, 182, 212, 0.3)'
                    }}>
                      <h3>👥 Panel de Cliente</h3>
                      <p>Portal de clientes y gestión de proyectos</p>
                    </a>
                    <a href="/dashboard/demo" style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'white',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <h3>🎪 Panel de Demostración</h3>
                      <p>Demos interactivas y showcases</p>
                    </a>
                  </div>
                  <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <a href="/login" style={{ color: '#667eea' }}>Iniciar Sesión para Acceso Completo</a>
                  </p>
                </div>
            )
          }
        />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/demo" element={<DemoDashboard />} />
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <main>
                {/* HeroSection - Cinematic Presentation */}
                <Suspense fallback={<LoadingFallback />}>
                  <CinematicPresentation />
                </Suspense>

                {/* synthetic Consciousness - Daniela AI */}
                <Suspense fallback={<LoadingFallback />}>
                  <DanielaShowcase />
                </Suspense>

                {/* Quantum Guardian - Nexus Android */}
                <Suspense fallback={<LoadingFallback />}>
                  <NexusAndroid />
                </Suspense>

                {/* Servicios Integrales */}
                <ServicesDeepDive />

                {/* Casos de éxito */}
                <CaseStudies />

                {/* Strategic ROI analysis */}
                <Suspense fallback={<LoadingFallback />}>
                  <EnhancedROI />
                </Suspense>

                {/* Precios y planes por cliente/gremio */}
                <PricingSection />

                {/* Plan Ingenioso */}
                <IngeniousPlan />

                {/* Tutoriales en video */}
                <VideoTutorials />

                {/* Decentraland Headquarters */}
                <Suspense fallback={<LoadingFallback />}>
                  <DecentralandOffice />
                </Suspense>

                {/* Preguntas clave */}
                <FAQSection />

                {/* Immersive Contact Experience */}
                <Suspense fallback={<LoadingFallback />}>
                  <ContactSection />
                </Suspense>

                {/* VITURE XR Experience */}
                <Suspense fallback={<LoadingFallback />}>
                  <VitureXRExperience />
                </Suspense>
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

        {/* Dashboard Hub Routes */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/" />} />
        <Route path="/dashboard/" element={
          <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' }}>
              AIGestion Dashboard Hub
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <a href="/dashboard/admin" style={{
                background: 'rgba(139, 92, 246, 0.1)',
                padding: '2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'white',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                <h3>🏆 Admin Dashboard</h3>
                <p>Administrative control and analytics</p>
              </a>
              <a href="/dashboard/client" style={{
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'white',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>
                <h3>👥 Client Dashboard</h3>
                <p>Client portal and project management</p>
              </a>
              <a href="/dashboard/demo" style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'white',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <h3>🎪 Demo Dashboard</h3>
                <p>Interactive demos and showcases</p>
              </a>
            </div>
          </div>
        } />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/demo" element={<DemoDashboard />} />

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
      <AnimatedMeshGradient />
      <CyberpunkGrid />
      <NeuralParticles />
    </div>
  );
};
