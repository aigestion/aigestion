import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { MeshGradientBG } from './components/MeshGradientBG';
import { useNotification } from './contexts/NotificationContext';
import { Login } from './pages/Login';
import { Maintenance } from './pages/Maintenance';

// ============================================
// CRITICAL: Static Load for Hero Section
// Prevents "Black Screen" if chunk loading fails
// ============================================
import { CinematicPresentation } from './components/CinematicPresentation';

// ============================================
// LAZY LOAD: Below-the-fold content sections
// ============================================
const DanielaShowcase = lazy(() =>
  import('./components/DanielaShowcase').then(m => ({ default: m.DanielaShowcase }))
);
const NexusAndroid = lazy(() =>
  import('./components/NexusAndroid').then(m => ({ default: m.NexusAndroid }))
);
const ServicesDeepDive = lazy(() =>
  import('./components/ServicesDeepDive').then(m => ({ default: m.ServicesDeepDive }))
);
const CaseStudies = lazy(() =>
  import('./components/CaseStudies').then(m => ({ default: m.CaseStudies }))
);
const EnhancedROI = lazy(() =>
  import('./components/EnhancedROI').then(m => ({ default: m.EnhancedROI }))
);
const PricingSection = lazy(() =>
  import('./components/PricingSection').then(m => ({ default: m.PricingSection }))
);
const IngeniousPlan = lazy(() =>
  import('./components/IngeniousPlan').then(m => ({ default: m.IngeniousPlan }))
);
const VideoTutorials = lazy(() =>
  import('./components/VideoTutorials').then(m => ({ default: m.VideoTutorials }))
);
const MetaverseSection = lazy(() =>
  import('./components/MetaverseSection').then(m => ({ default: m.MetaverseSection }))
);
const DecentralandOffice = lazy(() =>
  import('./components/DecentralandOffice').then(m => ({ default: m.DecentralandOffice }))
);
const FAQSection = lazy(() =>
  import('./components/FAQSection').then(m => ({ default: m.FAQSection }))
);
const DemoDashboard = lazy(() =>
  import('./components/DemoDashboard').then(m => ({ default: m.DemoDashboard }))
);
import { ContactModal } from './components/ContactModal';

// ============================================
// LAZY LOAD: Non-critical widgets & overlays
// ============================================
const AnimatedMeshGradient = lazy(() =>
  import('./components/AnimatedMeshGradient').then(m => ({ default: m.AnimatedMeshGradient }))
);
const CommandTerminal = lazy(() =>
  import('./components/CommandTerminal').then(m => ({ default: m.CommandTerminal }))
);
const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then(m => ({ default: m.CommandPalette }))
);
const DanielaOmniWidget = lazy(() =>
  import('./components/DanielaOmniWidget').then(m => ({ default: m.DanielaOmniWidget }))
);
const CyberpunkGrid = lazy(() =>
  import('./components/CyberpunkGrid').then(m => ({ default: m.CyberpunkGrid }))
);
const NeuralParticles = lazy(() =>
  import('./components/NeuralParticles').then(m => ({ default: m.NeuralParticles }))
);
const NexusGuardianWidget = lazy(() =>
  import('./components/NexusGuardianWidget').then(m => ({ default: m.NexusGuardianWidget }))
);

// ============================================
// LAZY LOAD: Route-level pages
// ============================================
const Dashboard = lazy(() =>
  import('./components/Dashboard').then(m => ({ default: m.Dashboard }))
);
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const VerifyEmail = lazy(() =>
  import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail }))
);
const SelectRole = lazy(() =>
  import('./pages/onboarding/SelectRole').then(m => ({ default: m.SelectRole }))
);
const SelectPlan = lazy(() =>
  import('./pages/onboarding/SelectPlan').then(m => ({ default: m.SelectPlan }))
);
const WorkbenchLayout = lazy(() =>
  import('./components/workbench/WorkbenchLayout').then(m => ({ default: m.WorkbenchLayout }))
);
const WeaponDashboard = lazy(() => import('./pages/WeaponDashboard'));
const DanielaDemo = lazy(() =>
  import('./pages/DanielaDemo').then(m => ({ default: m.DanielaDemo }))
);
const VirtualOfficePreview = lazy(() => import('./pages/VirtualOfficePreview'));
const ClientDashboard = lazy(() =>
  import('./components/ClientDashboard').then(m => ({ default: m.ClientDashboard }))
);

// ============================================
// UI Components
// ============================================
export const LoadingFallback = () => (
  <div className="fixed inset-0 bg-black z-10000 flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="w-16 h-16 border-t-2 border-nexus-cyan-glow rounded-full animate-spin" />
      <div className="text-nexus-cyan-glow font-orbitron tracking-[0.8em] text-[10px] animate-pulse">
        ESTABLECIENDO CONEXIÓN SOBERANA...
      </div>
    </div>
  </div>
);

// Footer removed - using imported version from ./components/Footer

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

  // 🚧 Maintenance Mode Logic with God Mode Bypass
  // Access via: https://aigestion.net/?mode=god
  const searchParams = new URLSearchParams(location.search);
  const isGodMode = searchParams.get('mode') === 'god';

  // Persist God Mode session
  const [bypassMaintenance, setBypassMaintenance] = useState(() => {
    return sessionStorage.getItem('god_mode_bypass') === 'true';
  });

  useEffect(() => {
    if (isGodMode) {
      sessionStorage.setItem('god_mode_bypass', 'true');
      setBypassMaintenance(true);
      notify('GOD MODE ACTIVADO', 'Bypass de mantenimiento habilitado', 'success');
    }
  }, [isGodMode, notify]);

  const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true'; // Default to false!

  if (MAINTENANCE_MODE && !bypassMaintenance && !isGodMode) {
    return <Maintenance />;
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-nexus-cyan/20 selection:text-white relative overflow-x-hidden">
      <div className="grain-overlay" />
      <MeshGradientBG />
      <ScrollProgress />

      {!isAuthenticated && <Navigation />}

      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
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
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <main>
                    <CinematicPresentation />
                    <DanielaShowcase />
                    <NexusAndroid />
                    <section id="demo-dashboard">
                      <DemoDashboard />
                    </section>
                    <ServicesDeepDive />
                    <CaseStudies />
                    <EnhancedROI />
                    <PricingSection />
                    <IngeniousPlan />
                    <VideoTutorials />
                    <MetaverseSection />
                    <DecentralandOffice />
                    <FAQSection />
                  </main>
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            <Route
              path="/dashboard/*"
              element={
                isAuthenticated ? (
                  <WorkbenchLayout user={currentUser} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/client"
              element={isAuthenticated ? <ClientDashboard /> : <Navigate to="/login" />}
            />
            <Route path="/weapon" element={<WeaponDashboard />} />
            <Route path="/daniela/*" element={<DanielaDemo />} />
            <Route path="/virtual-office/*" element={<VirtualOfficePreview />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      <Footer />
      <ContactModal />

      {/* Non-critical overlays — lazy loaded */}

      <Suspense fallback={null}>
        <CommandTerminal />
        <CommandPalette />
        <DanielaOmniWidget />
        <NexusGuardianWidget />
        <AnimatedMeshGradient />
        <CyberpunkGrid />
        <NeuralParticles />
      </Suspense>
    </div>
  );
};
