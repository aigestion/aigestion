import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { React } from 'react';

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
  fallbackPath = '/dashboard'
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
          <p className="text-gray-300 mb-6">
            Esta área es solo para administradores del sistema.
          </p>
          <button
            onClick={() => window.location.href = fallbackPath}
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
            Para acceder a tu panel de cliente, necesitas verificar tu número de teléfono para prevenir fraudes.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/verify-phone'}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-bold text-white hover:scale-105 transition-all"
            >
              📞 Verificar Teléfono
            </button>
            <button
              onClick={() => window.location.href = fallbackPath}
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

// Specific protection components for different routes
export const AdminRouteProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteProtection requireAuth requireAdmin requireAdmin>
    {children}
  </RouteProtection>
);

export const ClientRouteProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteProtection requireAuth requirePhoneVerification fallbackPath="/dashboard">
    {children}
  </RouteProtection>
);

export const DemoRouteProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo is accessible to everyone, but we can add rate limiting or session tracking
  return <>{children}</>;
};

// Public route that redirects authenticated users away
export const PublicRouteProtection: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
