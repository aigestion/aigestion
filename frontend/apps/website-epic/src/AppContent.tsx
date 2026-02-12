import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
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

export const Footer = () => (
  <footer className="py-24 bg-black border-t border-white/5 relative z-10">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-nexus-silver/40 text-[9px] font-orbitron tracking-widest uppercase">
      <div className="col-span-2">
        <img src="/images/brand/logo.png" alt="Sovereign Nexus" className="h-8 mb-6 opacity-80" />
        <p className="max-w-sm mb-8 leading-relaxed">
          Sistemas avanzados de orquestación neural y soberanía cognitiva.
        </p>
        <div className="text-[8px] opacity-30">
          © 2026 Sovereign Nexus | Enterprise Infrastructure v2.1
        </div>
      </div>
      <div>
        <h4 className="text-white mb-6 tracking-[0.4em] font-bold">Soluciones</h4>
        <ul className="space-y-4">
          <li className="hover:text-nexus-cyan-glow cursor-pointer transition-colors">
            Infraestructura
          </li>
          <li className="hover:text-nexus-cyan-glow cursor-pointer transition-colors">
            Automatización
          </li>
          <li className="hover:text-nexus-cyan-glow cursor-pointer transition-colors">Seguridad</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white mb-6 tracking-[0.4em] font-bold">Soporte</h4>
        <ul className="space-y-4">
          <li className="hover:text-nexus-cyan-glow cursor-pointer transition-colors">
            Documentación
          </li>
          <li className="hover:text-nexus-cyan-glow cursor-pointer transition-colors">
            Terminal SSH
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

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
    <div className="bg-black min-h-screen text-white font-sans selection:bg-nexus-cyan/20 selection:text-white relative overflow-x-hidden custom-cursor">
      <div className="grain-overlay" />
      <CustomCursor />
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
};;
