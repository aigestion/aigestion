/**
 * Subscription Service - Gestión de Suscripciones y Validación de Acceso
 * Controla el acceso a dashboards y APK basado en estado de suscripción
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxProjects: number;
  maxUsers: number;
  hasDashboardAccess: boolean;
  hasMobileAccess: boolean;
  hasAPIAccess: boolean;
  hasPrioritySupport: boolean;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate?: string;
  trialEnd?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: string;
  nextBillingDate?: string;
}

export interface SubscriptionValidation {
  isValid: boolean;
  plan: SubscriptionPlan | null;
  subscription: UserSubscription | null;
  restrictions: {
    canAccessDashboard: boolean;
    canAccessMobile: boolean;
    canAccessAPI: boolean;
    maxProjectsReached: boolean;
    maxUsersReached: boolean;
    daysUntilExpiry: number;
    isTrial: boolean;
    isExpired: boolean;
  };
  messages: string[];
}

// Planes de suscripción disponibles
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Gratis',
    price: 0,
    features: [
      'Hasta 3 proyectos',
      '1 usuario',
      'Soporte básico',
      'Dashboard limitado'
    ],
    maxProjects: 3,
    maxUsers: 1,
    hasDashboardAccess: false,
    hasMobileAccess: false,
    hasAPIAccess: false,
    hasPrioritySupport: false,
  },
  basic: {
    id: 'basic',
    name: 'Básico',
    price: 29.99,
    features: [
      'Hasta 10 proyectos',
      '3 usuarios',
      'Dashboard completo',
      'App móvil',
      'Soporte email'
    ],
    maxProjects: 10,
    maxUsers: 3,
    hasDashboardAccess: true,
    hasMobileAccess: true,
    hasAPIAccess: false,
    hasPrioritySupport: false,
  },
  professional: {
    id: 'professional',
    name: 'Profesional',
    price: 79.99,
    features: [
      'Proyectos ilimitados',
      '10 usuarios',
      'Dashboard avanzado',
      'App móvil premium',
      'API completa',
      'Soporte prioritario'
    ],
    maxProjects: Infinity,
    maxUsers: 10,
    hasDashboardAccess: true,
    hasMobileAccess: true,
    hasAPIAccess: true,
    hasPrioritySupport: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Empresarial',
    price: 199.99,
    features: [
      'Todo ilimitado',
      'Usuarios ilimitados',
      'Dashboard personalizado',
      'App móvil white-label',
      'API dedicada',
      'Soporte 24/7',
      'SLA garantizado'
    ],
    maxProjects: Infinity,
    maxUsers: Infinity,
    hasDashboardAccess: true,
    hasMobileAccess: true,
    hasAPIAccess: true,
    hasPrioritySupport: true,
  },
};

class SubscriptionService {
  private API_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  private cache = new Map<string, { data: any; expiry: number }>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor() {
    console.log('[SubscriptionService] Subscription validation service initialized');
  }

  /**
   * Obtener suscripción del usuario con cache
   */
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const cacheKey = `subscription_${userId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() < cached.expiry) {
      console.log('[SubscriptionService] Cache hit for user subscription');
      return cached.data;
    }

    try {
      const response = await fetch(`${this.API_URL}/v1/subscriptions/${userId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Usuario no tiene suscripción, crear una gratuita
          const freeSubscription: UserSubscription = {
            userId,
            planId: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            autoRenew: false,
          };
          await this.createUserSubscription(freeSubscription);
          this.cache.set(cacheKey, { data: freeSubscription, expiry: Date.now() + this.CACHE_DURATION });
          return freeSubscription;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const subscription = await response.json();
      this.cache.set(cacheKey, { data: subscription, expiry: Date.now() + this.CACHE_DURATION });
      return subscription;
    } catch (error) {
      console.error('[SubscriptionService] Error fetching subscription:', error);
      // En caso de error, retornar suscripción gratuita
      const freeSubscription: UserSubscription = {
        userId,
        planId: 'free',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: false,
      };
      return freeSubscription;
    }
  }

  /**
   * Crear suscripción para usuario nuevo
   */
  async createUserSubscription(subscription: UserSubscription): Promise<UserSubscription> {
    try {
      const response = await fetch(`${this.API_URL}/v1/subscriptions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const createdSubscription = await response.json();
      console.log('[SubscriptionService] Subscription created:', createdSubscription);
      return createdSubscription;
    } catch (error) {
      console.error('[SubscriptionService] Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Actualizar suscripción del usuario
   */
  async updateSubscription(userId: string, updates: Partial<UserSubscription>): Promise<UserSubscription> {
    try {
      const response = await fetch(`${this.API_URL}/v1/subscriptions/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const updatedSubscription = await response.json();
      
      // Invalidar cache
      this.cache.delete(`subscription_${userId}`);
      
      console.log('[SubscriptionService] Subscription updated:', updatedSubscription);
      return updatedSubscription;
    } catch (error) {
      console.error('[SubscriptionService] Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Validar acceso basado en suscripción
   */
  async validateAccess(userId: string, accessType: 'dashboard' | 'mobile' | 'api'): Promise<SubscriptionValidation> {
    const subscription = await this.getUserSubscription(userId);
    const plan = SUBSCRIPTION_PLANS[subscription?.planId || 'free'];

    const now = new Date();
    const endDate = subscription?.endDate ? new Date(subscription.endDate) : null;
    const trialEnd = subscription?.trialEnd ? new Date(subscription.trialEnd) : null;

    const isExpired = endDate && endDate < now;
    const isTrial = trialEnd && trialEnd > now && !endDate;
    const daysUntilExpiry = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;

    const canAccessDashboard = !isExpired && (plan.hasDashboardAccess || isTrial);
    const canAccessMobile = !isExpired && (plan.hasMobileAccess || isTrial);
    const canAccessAPI = !isExpired && (plan.hasAPIAccess || isTrial);

    const validation: SubscriptionValidation = {
      isValid: !isExpired && subscription?.status === 'active',
      plan,
      subscription,
      restrictions: {
        canAccessDashboard,
        canAccessMobile,
        canAccessAPI,
        maxProjectsReached: false, // TODO: Implementar conteo de proyectos
        maxUsersReached: false, // TODO: Implementar conteo de usuarios
        daysUntilExpiry,
        isTrial,
        isExpired,
      },
      messages: this.generateValidationMessages(accessType, plan, isExpired, isTrial, daysUntilExpiry),
    };

    console.log('[SubscriptionService] Access validation:', validation);
    return validation;
  }

  /**
   * Generar mensajes de validación
   */
  private generateValidationMessages(
    accessType: string,
    plan: SubscriptionPlan,
    isExpired: boolean,
    isTrial: boolean,
    daysUntilExpiry: number
  ): string[] {
    const messages: string[] = [];

    if (isExpired) {
      messages.push('Tu suscripción ha expirado. Renueva tu plan para continuar.');
      return messages;
    }

    if (isTrial) {
      messages.push(`Estás en período de prueba. Disfruta de todas las funciones premium.`);
      return messages;
    }

    if (plan.id === 'free') {
      if (accessType === 'dashboard') {
        messages.push('El dashboard completo requiere una suscripción de pago.');
      } else if (accessType === 'mobile') {
        messages.push('La aplicación móvil requiere una suscripción Básica o superior.');
      } else if (accessType === 'api') {
        messages.push('El acceso a API requiere una suscripción Profesional o Empresarial.');
      }
    }

    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      messages.push(`Tu suscripción expira en ${daysUntilExpiry} días. Renueva para evitar interrupciones.`);
    }

    return messages;
  }

  /**
   * Verificar si puede acceder al dashboard
   */
  async canAccessDashboard(userId: string): Promise<boolean> {
    const validation = await this.validateAccess(userId, 'dashboard');
    return validation.restrictions.canAccessDashboard;
  }

  /**
   * Verificar si puede acceder a la app móvil
   */
  async canAccessMobile(userId: string): Promise<boolean> {
    const validation = await this.validateAccess(userId, 'mobile');
    return validation.restrictions.canAccessMobile;
  }

  /**
   * Verificar si puede acceder a la API
   */
  async canAccessAPI(userId: string): Promise<boolean> {
    const validation = await this.validateAccess(userId, 'api');
    return validation.restrictions.canAccessAPI;
  }

  /**
   * Obtener token de autenticación
   */
  private getAuthToken(): string {
    // Intentar obtener de múltiples fuentes
    const token = localStorage.getItem('auth_token') || 
                  sessionStorage.getItem('auth_token') ||
                  (window as any).__AIGESTION_AUTH_TOKEN__;
    
    if (!token) {
      console.warn('[SubscriptionService] No auth token found');
    }
    
    return token || '';
  }

  /**
   * Limpiar cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[SubscriptionService] Cache cleared');
  }

  /**
   * Obtener planes disponibles
   */
  getAvailablePlans(): SubscriptionPlan[] {
    return Object.values(SUBSCRIPTION_PLANS);
  }

  /**
   * Obtener plan por ID
   */
  getPlanById(planId: string): SubscriptionPlan | null {
    return SUBSCRIPTION_PLANS[planId] || null;
  }

  /**
   * Calcular precio de upgrade
   */
  calculateUpgradePrice(currentPlanId: string, newPlanId: string, daysRemaining: number): number {
    const currentPlan = SUBSCRIPTION_PLANS[currentPlanId];
    const newPlan = SUBSCRIPTION_PLANS[newPlanId];
    
    if (!currentPlan || !newPlan) return 0;
    
    const dailyPrice = newPlan.price / 30;
    return Math.round(dailyPrice * daysRemaining * 100) / 100;
  }

  /**
   * Crear sesión de pago
   */
  async createPaymentSession(userId: string, planId: string): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch(`${this.API_URL}/v1/subscriptions/checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, planId }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[SubscriptionService] Error creating payment session:', error);
      throw error;
    }
  }

  /**
   * Cancelar suscripción
   */
  async cancelSubscription(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/v1/subscriptions/${userId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Invalidar cache
      this.cache.delete(`subscription_${userId}`);
      
      console.log('[SubscriptionService] Subscription cancelled for user:', userId);
    } catch (error) {
      console.error('[SubscriptionService] Error cancelling subscription:', error);
      throw error;
    }
  }
}

// Exportar singleton
export const subscriptionService = new SubscriptionService();
export type { SubscriptionService };
