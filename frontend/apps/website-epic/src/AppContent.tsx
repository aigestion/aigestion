import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { MeshGradientBG } from './components/MeshGradientBG';
import { Navigation } from './components/Navigation';
import {
  PublicRoute,
  RequireAuth,
  RequireEmailVerification,
  RequirePhoneVerification,
  RequireSubscription,
} from './components/RouteProtection';
import { ScrollProgress } from './components/ScrollProgress';
import SubscriptionGuard from './components/guards/SubscriptionGuard';
import { SkeletonLoader } from './components/ui/SkeletonLoader';
import { useNotification } from './contexts/NotificationContext';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import {
  BillingDashboard,
  ClientDashboard,
  DemoDashboard,
  EmailVerification,
  Login,
  Maintenance,
  Marketplace,
  MissionControl,
  PaymentGateway,
  PhoneVerification,
  PrivacyPolicy,
  Register,
  SovereignIntelligenceHub,
  SubscriptionPage,
  TermsOfUse,
  VirtualOfficePreview,
  WeaponDashboard,
} from './utils/routeLoader';

// ============================================
// CRITICAL: Static Load for Hero Section
// Prevents "Black Screen" if chunk loading fails
// ============================================
import { CinematicExperience } from './components/CinematicExperience';
import { ContactModal } from './components/ContactModal';

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
const SovereignPublicPulse = lazy(() =>
  import('./components/SovereignPublicPulse').then(m => ({ default: m.SovereignPublicPulse }))
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
const Register = lazy(() =>
  import('./components/auth/Register').then(m => ({ default: m.Register }))
);
// Note: VerifyEmail was previously imported from pages/VerifyEmail, but we created components/auth/EmailVerification.tsx
// I will point to the new one, but I need to make sure I don't break existing references if VerifyEmail page existed.
// The previous file content showed: const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
// I should probably keep using the new component I created.
// Wait, I created `components/auth/EmailVerification.tsx`.
// Let's adjust the import for VerifyEmail to use the new component if that was the intention, OR keep the old one if it was different.
// The task was "Create components/auth/EmailVerification.tsx".
// In AppContent.tsx I see: 92: const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
// I will replace it with the new one.

const EmailVerification = lazy(() =>
  import('./components/auth/EmailVerification').then(m => ({ default: m.EmailVerification }))
);

const WorkbenchLayout = lazy(() =>
  import('./components/workbench/WorkbenchLayout').then(m => ({ default: m.WorkbenchLayout }))
);
const PhoneVerification = lazy(() =>
  import('./components/auth/PhoneVerification').then(m => ({ default: m.PhoneVerification }))
);
const SubscriptionPage = lazy(() =>
  import('./pages/SubscriptionPage').then(m => ({
    default: m.default,
  }))
);
const PaymentGateway = lazy(() =>
  import('./components/subscription/PaymentGateway').then(m => ({ default: m.PaymentGateway }))
);
const WeaponDashboard = lazy(() => import('./pages/WeaponDashboard'));

const VirtualOfficePreview = lazy(() => import('./pages/VirtualOfficePreview'));
const ClientDashboard = lazy(() =>
  import('./components/ClientDashboard').then(m => ({ default: m.ClientDashboard }))
);
const SovereignIntelligenceHub = lazy(() =>
  import('./components/SovereignIntelligenceHub').then(m => ({
    default: m.SovereignIntelligenceHub,
  }))
);
const BillingDashboard = lazy(() =>
  import('./pages/BillingDashboard').then(m => ({ default: m.BillingDashboard }))
);
const Marketplace = lazy(() =>
  import('./pages/Marketplace').then(m => ({ default: m.Marketplace }))
);
const MissionControl = lazy(() => import('./pages/MissionControl'));
const SelectRole = lazy(() => import('./pages/onboarding/SelectRole').then(m => ({ default: m.default })));
const SelectPlan = lazy(() => import('./pages/onboarding/SelectPlan').then(m => ({ default: m.default })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));

// ============================================
// UI Components
// ============================================
export const LoadingFallback = () => (
  <div className="fixed inset-0 bg-nexus-obsidian z-10000 flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="w-16 h-16 border-t-2 border-nexus-cyan-glow rounded-full animate-spin" />
      <div className="text-nexus-cyan-glow font-orbitron tracking-[0.8em] text-[10px] animate-pulse">
        ESTABLECIENDO CONEXIÓN SEGURA...
      </div>
    </div>
  </div>
);

// Enhanced loading component with skeleton
const SectionSkeleton = () => (
  <div className="min-h-screen bg-nexus-obsidian">
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <SkeletonLoader variant="text" width="60%" height={40} />
        <SkeletonLoader variant="text" lines={3} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-nexus-dark rounded-lg p-6">
              <SkeletonLoader variant="circular" width={64} height={64} className="mb-4" />
              <SkeletonLoader variant="text" lines={2} />
            </div>
          ))}
        </div>
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

  // Route prediction and preloading
  const routePredictor = RoutePredictor.getInstance();

  useEffect(() => {
    // Record current route for prediction
    routePredictor.recordRoute(location.pathname);

    // Preload routes based on auth state
    if (isAuthenticated) {
      preloadDashboardRoutes();
    } else {
      preloadAuthRoutes();
    }
  }, [location.pathname, isAuthenticated]);

  // Intersection Observer for lazy sections
  const { ref: heroRef, isIntersecting: heroVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

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
      notify('MODO AVANZADO ACTIVADO', 'Bypass de mantenimiento habilitado', 'success');
    }
  }, [isGodMode, notify]);

  const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true'; // Default to false!

  if (MAINTENANCE_MODE && !bypassMaintenance && !isGodMode) {
    return <Maintenance />;
  }

  return (
    <SpotlightWrapper className="bg-nexus-obsidian min-h-screen text-white font-sans relative overflow-x-hidden">
      <div className="grain-overlay" />
      <div className="fixed inset-0 bg-[url('/images/nexus/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <MeshGradientBG />
      <ScrollProgress />

      {!isAuthenticated && <Navigation />}

      {isAuthenticated && currentUser?.role === 'client' && location.pathname !== '/onboarding/role' && location.pathname !== '/onboarding/plan' && (
        <Navigate to="/onboarding/role" replace />
      )}

      <AnimatePresence mode="wait">
        <Suspense fallback={<SectionSkeleton />}>
          <Routes>
            {/* Public Routes restricted if logged in */}
            <Route element={<PublicRoute />}>
              <Route
                path="/login"
                element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Landing Page */}
            <Route
              path="/"
              element={
                <div ref={heroRef}>
                  {!isAuthenticated ? <CinematicExperience /> : <Navigate to="/dashboard" />}
                </div>
              }
            />

            {/* Public: Virtual Office Preview — no auth required */}
            <Route path="/virtual-office" element={<VirtualOfficePreview />} />

            {/* PROTECTED ROUTES FLOW */}
            <Route element={<RequireAuth />}>
              {/* Level 1: Auth Required */}
              <Route path="/verify-email" element={<EmailVerification />} />

              {/* Level 2: Email Verified Required */}
              <Route element={<RequireEmailVerification />}>
                <Route path="/onboarding/role" element={<SelectRole />} />
                <Route path="/onboarding/plan" element={<SelectPlan />} />
                <Route path="/verify-phone" element={<PhoneVerification />} />

                {/* Level 3: Phone Verified Required */}
                <Route element={<RequirePhoneVerification />}>
                  <Route path="/pricing" element={<SubscriptionPage />} />
                  <Route path="/payment" element={<PaymentGateway />} />

                  <Route element={<RequireSubscription />}>
                    <Route
                      path="/dashboard/*"
                      element={
                        <SubscriptionGuard accessType="dashboard">
                          <WorkbenchLayout user={currentUser} onLogout={handleLogout} />
                        </SubscriptionGuard>
                      }
                    />
                    <Route
                      path="/intelligence"
                      element={
                        <SubscriptionGuard accessType="api">
                          <SovereignIntelligenceHub />
                        </SubscriptionGuard>
                      }
                    />
                    <Route path="/billing" element={<BillingDashboard />} />
                    <Route path="/weapon" element={<WeaponDashboard />} />
                    <Route
                      path="/missions"
                      element={
                        <SubscriptionGuard accessType="api">
                          <MissionControl />
                        </SubscriptionGuard>
                      }
                    />
                    <Route
                      path="/marketplace"
                      element={
                        <SubscriptionGuard accessType="marketplace">
                          <Marketplace />
                        </SubscriptionGuard>
                      }
                    />
                  </Route>
                  {/* Client Dashboard handles its own subscription check (Demo Mode) */}
                  <Route path="/client" element={<ClientDashboard />} />
                </Route>
              </Route>
            </Route>

            {/* Public Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />

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
    </SpotlightWrapper>
  );
};
