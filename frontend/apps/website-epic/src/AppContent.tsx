import { motion } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatedMeshGradient } from './components/AnimatedMeshGradient';
import { CaseStudies } from './components/CaseStudies';
import { CommandPalette } from './components/CommandPalette';
import { CommandTerminal } from './components/CommandTerminal';
import { ContactSection } from './components/ContactSection';
import { CyberpunkGrid } from './components/CyberpunkGrid';
import { DanielaOmniWidget } from './components/DanielaOmniWidget';
import { FAQSection } from './components/FAQSection';
import { IngeniousPlan } from './components/IngeniousPlan';
import { MeshGradientBG } from './components/MeshGradientBG';
import { Navigation } from './components/Navigation';
import { NeuralParticles } from './components/NeuralParticles';
import { PricingSection } from './components/PricingSection';
import { ScrollProgress } from './components/ScrollProgress';
import { ServicesDeepDive } from './components/ServicesDeepDive';
import { VideoTutorials } from './components/VideoTutorials';
import { useNotification } from './contexts/NotificationContext';
import { Login } from './pages/Login';

// Lazy load heavy components (20KB+)
const DanielaWebsite = lazy(() =>
  import('./components/DanielaWebsite').then(module => ({ default: module.DanielaWebsite }))
);

// Lazy load medium components (15-20KB)
const Dashboard = lazy(() =>
  import('./components/Dashboard').then(module => ({ default: module.Dashboard }))
);
const EnhancedROI = lazy(() =>
  import('./components/EnhancedROI').then(module => ({ default: module.EnhancedROI }))
);
const CinematicPresentation = lazy(() =>
  import('./components/CinematicPresentation').then(module => ({
    default: module.CinematicPresentation,
  }))
);
const InteractiveShowcase = lazy(() =>
  import('./components/InteractiveShowcase').then(module => ({
    default: module.InteractiveShowcase,
  }))
);

// Lazy load smaller heavy components (10-15KB)
const DataVisualization = lazy(() =>
  import('./components/DataVisualization').then(module => ({ default: module.DataVisualization }))
);
const DanielaAI = lazy(() =>
  import('./components/DanielaAI').then(module => ({ default: module.DanielaAI }))
);
const NexusAndroid = lazy(() =>
  import('./components/NexusAndroid').then(module => ({ default: module.NexusAndroid }))
);
const DanielaShowcase = lazy(() =>
  import('./components/DanielaShowcase').then(module => ({ default: module.DanielaShowcase }))
);
const DecentralandOffice = lazy(() =>
  import('./components/DecentralandOffice').then(module => ({ default: module.DecentralandOffice }))
);

// Lazy load dashboard pages
const AdminDashboard = lazy(() =>
  import('./components/dashboard/AdminDashboard').then(module => ({
    default: module.AdminDashboard,
  }))
);
const ClientDashboard = lazy(() =>
  import('./components/dashboard/ClientDashboard').then(module => ({
    default: module.ClientDashboard,
  }))
);
const DemoDashboard = lazy(() =>
  import('./components/dashboard/DemoDashboard').then(module => ({ default: module.DemoDashboard }))
);
const WorkbenchLayout = lazy(() =>
  import('./components/workbench/WorkbenchLayout').then(module => ({
    default: module.WorkbenchLayout,
  }))
);

const BillingDashboard = lazy(() =>
  import('./pages/BillingDashboard').then(module => ({ default: module.BillingDashboard }))
);

// Lazy load pages
const DanielaDemo = lazy(() =>
  import('./pages/DanielaDemo').then(module => ({ default: module.DanielaDemo }))
);
const VirtualOfficePreview = lazy(() => import('./pages/VirtualOfficePreview'));
const WeaponDashboard = lazy(() => import('./pages/WeaponDashboard'));

// Onboarding Pages
const Register = lazy(() =>
  import('./pages/Register').then(module => ({ default: module.Register }))
);
const VerifyEmail = lazy(() =>
  import('./pages/VerifyEmail').then(module => ({ default: module.VerifyEmail }))
);
const SelectRole = lazy(() =>
  import('./pages/onboarding/SelectRole').then(module => ({ default: module.SelectRole }))
);
const SelectPlan = lazy(() =>
  import('./pages/onboarding/SelectPlan').then(module => ({ default: module.SelectPlan }))
);

// Loading fallback component
export const LoadingFallback = () => (
  <div className="min-h-[400px] bg-nexus-obsidian-deep flex items-center justify-center">
    <div className="text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs animate-pulse">
      LOADING...
    </div>
  </div>
);

export const Footer = () => (
  <footer className="py-24 bg-nexus-obsidian-deep border-t border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-radial-at-bottom from-nexus-cyan/5 via-transparent to-transparent pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 relative z-10">
      <div className="col-span-1 md:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="/images/brand/logo.png"
            alt="AIGestion"
            className="h-8 mb-6 filter brightness-110 drop-shadow-[0_0_10px_rgba(0,245,255,0.2)]"
          />
          <p className="text-nexus-silver/40 text-sm max-w-sm mb-8 font-light leading-relaxed">
            Sistemas avanzados de inteligencia soberana y automatización estratégica para
            ecosistemas empresariales de alta demanda.
          </p>
          <div className="text-[9px] text-nexus-silver/20 font-mono uppercase tracking-[0.5em] mt-8">
            © 2026 AIGestion.net | Enterprise Infrastructure v2.1
          </div>
        </motion.div>
      </div>
      <div>
        <h4 className="font-orbitron text-[10px] text-white mb-6 uppercase tracking-[0.4em] font-bold">
          Soluciones
        </h4>
        <ul className="space-y-4 text-[9px] text-nexus-silver/40 font-orbitron tracking-[0.2em] uppercase">
          <li className="hover:text-nexus-cyan-glow transition-colors cursor-pointer duration-300">
            Infraestructura
          </li>
          <li className="hover:text-nexus-cyan-glow transition-colors cursor-pointer duration-300">
            Automatización
          </li>
          <li className="hover:text-nexus-cyan-glow transition-colors cursor-pointer duration-300">
            Seguridad
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-orbitron text-[10px] text-white mb-6 uppercase tracking-[0.4em] font-bold">
          Soporte
        </h4>
        <ul className="space-y-4 text-[9px] text-nexus-silver/40 font-orbitron tracking-[0.2em] uppercase">
          <li className="hover:text-nexus-cyan-glow transition-colors cursor-pointer duration-300">
            Documentación
          </li>
          <li className="hover:text-nexus-cyan-glow transition-colors cursor-pointer duration-300">
            Centro de Ayuda
          </li>
          <li className="hover:text-nexus-cyan-glow transition-colors cursor-pointer duration-300 text-nexus-cyan-glow font-bold">
            Terminal SSH
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
  const navigate = useNavigate();

  // Handle SPA redirect from 404.html
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath) {
      sessionStorage.removeItem('redirect');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

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
      {!isAuthenticated ? (
        <div className="nexus-pulse-nav sticky top-0 z-[100] bg-black/50 backdrop-blur-xl">
          <Navigation />
        </div>
      ) : null}
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
          path="/register"
          element={
            !isAuthenticated ? (
              <Suspense fallback={<LoadingFallback />}>
                <Register />
              </Suspense>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/verify-email"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <VerifyEmail />
            </Suspense>
          }
        />
        <Route
          path="/onboarding/role"
          element={
            isAuthenticated ? (
              <Suspense fallback={<LoadingFallback />}>
                <SelectRole />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/onboarding/plan"
          element={
            isAuthenticated ? (
              <Suspense fallback={<LoadingFallback />}>
                <SelectPlan />
              </Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <WorkbenchLayout user={currentUser} onLogout={handleLogout} />
            ) : (
              <div className="min-h-screen p-8">
                <h1 className="text-center text-4xl mb-12 font-orbitron tracking-[0.3em] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  AIGESTION CONTROL CENTER
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  <a href="/dashboard/admin" className="nexus-hub-card">
                    <h3 className="font-orbitron text-sm tracking-[0.2em] text-nexus-cyan-glow">
                      ADMINISTRATION
                    </h3>
                    <p className="high-contrast-silver text-xs mt-4">
                      Sistemas de control y análisis de infraestructura.
                    </p>
                  </a>
                  <a href="/dashboard/client" className="nexus-hub-card">
                    <h3 className="font-orbitron text-sm tracking-[0.2em]">CLIENT PORTAL</h3>
                    <p className="high-contrast-silver text-xs mt-4">
                      Gestión de proyectos y servicios de consultoría.
                    </p>
                  </a>
                  <a href="/dashboard/demo" className="nexus-hub-card">
                    <h3 className="font-orbitron text-sm tracking-[0.2em]">DEMO ENVIRONMENT</h3>
                    <p className="high-contrast-silver text-xs mt-4">
                      Entornos de prueba y visualización técnica.
                    </p>
                  </a>
                </div>
                <p className="text-center mt-16">
                  <a
                    href="/login"
                    className="text-[10px] tracking-[0.4em] text-nexus-cyan-glow border-b border-nexus-cyan-glow pb-1 uppercase hover:text-white transition-colors"
                  >
                    INICIAR SESIÓN PARA ACCESO COMPLETO
                  </a>
                </p>
              </div>
            )
          }
        />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/demo" element={<DemoDashboard />} />
        <Route path="/dashboard/billing" element={<BillingDashboard />} />
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
