import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoadingFallback = () => (
  <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-2 border-nexus-cyan/20 border-t-nexus-cyan rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

interface RouteProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requirePhoneVerification?: boolean;
  redirectTo?: string;
  fallbackPath?: string;
}

export const RouteProtection: React.FC<RouteProtectionProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requirePhoneVerification = false,
  redirectTo = '/login',
  fallbackPath = '/dashboard',
}) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">🔒 Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-300 mb-6">Esta área es solo para administradores del sistema.</p>
          <button
            onClick={() => (window.location.href = fallbackPath)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white hover:scale-105 transition-all"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  // Check if phone verification is required (for clients)
  if (requirePhoneVerification && user && !user.phoneVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-md">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-white mb-2">Verificación Requerida</h2>
          <p className="text-gray-300 mb-6">
            Para acceder a tu panel de cliente, necesitas verificar tu número de teléfono para
            prevenir fraudes.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = '/verify-phone')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-bold text-white hover:scale-105 transition-all"
            >
              📞 Verificar Teléfono
            </button>
            <button
              onClick={() => (window.location.href = fallbackPath)}
              className="w-full px-6 py-3 bg-gray-600 rounded-full font-bold text-white hover:scale-105 transition-all"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// 1. Basic Auth Guard
export const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingFallback />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// 2. Email Verification Guard
export const RequireEmailVerification = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;

  // Skip if already verified (mock logic: assuming true if not explicitly false in strict mode)
  // In real app: if (!user?.emailVerified)
  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

// 3. Phone Verification Guard
export const RequirePhoneVerification = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;

  if (user && !user.phoneVerified) {
    return <Navigate to="/verify-phone" replace />;
  }

  return <Outlet />;
};

// 4. Subscription Guard (The Paywall)
export const RequireSubscription = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;

  // Allow admins/superadmins or users in demo mode to bypass
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  if (user?.role === 'admin' || user?.role === 'superadmin' || isDemoMode) {
    return <Outlet />;
  }

  if (user?.subscription === 'free' || !user?.subscription) {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
};

// 5. Admin Guard
export const RequireAdmin = () => {
  const { loading, isAdmin } = useAuth();
  if (loading) return <LoadingFallback />;

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// 6. Public Route (Redirects if already logged in)
export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
