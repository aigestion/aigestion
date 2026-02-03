/**
 * Plan de Minutos Gratis - AIGestion.net
 * Sistema inteligente para aprovechar minutos gratis de múltiples servicios
 * Gestión automática para no gastar dinero
 */

export interface FreeMinutesService {
  name: string;
  provider: string;
  free_minutes_per_month: number;
  free_calls_per_month: number;
  signup_bonus_minutes: number;
  referral_bonus_minutes: number;
  features: {
    voice_calls: boolean;
    video_calls: boolean;
    conference_calls: boolean;
    recording: boolean;
    transcription: boolean;
    international_calls: boolean;
  };
  limitations: {
    max_call_duration: number; // minutos
    countries_available: string[];
    require_credit_card: boolean;
    auto_renewal: boolean;
  };
  priority: number; // 1 = más prioritario
}

export interface CallRoutingStrategy {
  service_name: string;
  conditions: {
    call_type: 'domestic' | 'international' | 'emergency' | 'business';
    duration_preference: 'short' | 'medium' | 'long';
    time_of_day: 'business_hours' | 'after_hours' | 'weekend';
    importance: 'low' | 'medium' | 'high' | 'critical';
  };
  fallback_service?: string;
}

export interface MinutesBudget {
  total_available: number;
  used_this_month: number;
  remaining: number;
  daily_allowance: number;
  services_breakdown: Record<
    string,
    {
      allocated: number;
      used: number;
      remaining: number;
    }
  >;
}

export interface SmartCallManager {
  current_call: {
    service: string;
    duration: number;
    cost: number;
    minutes_used: number;
  } | null;
  queue: Array<{
    priority: number;
    recipient: string;
    estimated_duration: number;
    preferred_service?: string;
  }>;
  auto_routing_enabled: boolean;
  cost_saving_mode: boolean;
}

// Servicios con minutos gratis configurados
export const freeMinutesServices: FreeMinutesService[] = [
  {
    name: 'Google Voice',
    provider: 'Google',
    free_minutes_per_month: 0, // Ilimitado para EE.UU. y Canadá
    free_calls_per_month: 999,
    signup_bonus_minutes: 0,
    referral_bonus_minutes: 10,
    features: {
      voice_calls: true,
      video_calls: false,
      conference_calls: true,
      recording: true,
      transcription: true,
      international_calls: false, // Solo EE.UU. y Canadá
    },
    limitations: {
      max_call_duration: 180, // 3 horas
      countries_available: ['US', 'CA'],
      require_credit_card: false,
      auto_renewal: false,
    },
    priority: 1, // Máxima prioridad
  },

  {
    name: 'Skype',
    provider: 'Microsoft',
    free_minutes_per_month: 0,
    free_calls_per_month: 100, // Llamadas Skype a Skype ilimitadas
    signup_bonus_minutes: 15,
    referral_bonus_minutes: 5,
    features: {
      voice_calls: true,
      video_calls: true,
      conference_calls: true,
      recording: false,
      transcription: false,
      international_calls: false, // Solo Skype a Skype gratis
    },
    limitations: {
      max_call_duration: 240, // 4 horas
      countries_available: ['ALL'], // Skype a Skype global
      require_credit_card: false,
      auto_renewal: false,
    },
    priority: 2,
  },

  {
    name: 'Discord',
    provider: 'Discord',
    free_minutes_per_month: 0, // Ilimitado
    free_calls_per_month: 999,
    signup_bonus_minutes: 0,
    referral_bonus_minutes: 0,
    features: {
      voice_calls: true,
      video_calls: true,
      conference_calls: true,
      recording: false,
      transcription: false,
      international_calls: true, // Global
    },
    limitations: {
      max_call_duration: 480, // 8 horas
      countries_available: ['ALL'],
      require_credit_card: false,
      auto_renewal: false,
    },
    priority: 3,
  },

  {
    name: 'WhatsApp',
    provider: 'Meta',
    free_minutes_per_month: 0, // Ilimitado
    free_calls_per_month: 999,
    signup_bonus_minutes: 0,
    referral_bonus_minutes: 0,
    features: {
      voice_calls: true,
      video_calls: true,
      conference_calls: false,
      recording: false,
      transcription: false,
      international_calls: true, // Global
    },
    limitations: {
      max_call_duration: 120, // 2 horas
      countries_available: ['ALL'],
      require_credit_card: false,
      auto_renewal: false,
    },
    priority: 4,
  },

  {
    name: 'Signal',
    provider: 'Signal Foundation',
    free_minutes_per_month: 0, // Ilimitado
    free_calls_per_month: 999,
    signup_bonus_minutes: 0,
    referral_bonus_minutes: 0,
    features: {
      voice_calls: true,
      video_calls: true,
      conference_calls: false,
      recording: false,
      transcription: false,
      international_calls: true, // Global
    },
    limitations: {
      max_call_duration: 180, // 3 horas
      countries_available: ['ALL'],
      require_credit_card: false,
      auto_renewal: false,
    },
    priority: 5,
  },

  {
    name: 'Telegram',
    provider: 'Telegram',
    free_minutes_per_month: 0, // Ilimitado
    free_calls_per_month: 999,
    signup_bonus_minutes: 0,
    referral_bonus_minutes: 0,
    features: {
      voice_calls: true,
      video_calls: true,
      conference_calls: true, // Voice Chats 2.0
      recording: false,
      transcription: false,
      international_calls: true, // Global
    },
    limitations: {
      max_call_duration: 300, // 5 horas
      countries_available: ['ALL'],
      require_credit_card: false,
      auto_renewal: false,
    },
    priority: 6,
  },

  {
    name: 'Vapi Trial',
    provider: 'Vapi',
    free_minutes_per_month: 100,
    free_calls_per_month: 50,
    signup_bonus_minutes: 30,
    referral_bonus_minutes: 20,
    features: {
      voice_calls: true,
      video_calls: false,
      conference_calls: false,
      recording: true,
      transcription: true,
      international_calls: true,
    },
    limitations: {
      max_call_duration: 10, // 10 minutos por llamada
      countries_available: ['ALL'],
      require_credit_card: true,
      auto_renewal: false,
    },
    priority: 7,
  },

  {
    name: 'Twilio Trial',
    provider: 'Twilio',
    free_minutes_per_month: 100,
    free_calls_per_month: 100,
    signup_bonus_minutes: 15,
    referral_bonus_minutes: 10,
    features: {
      voice_calls: true,
      video_calls: false,
      conference_calls: true,
      recording: true,
      transcription: true,
      international_calls: true,
    },
    limitations: {
      max_call_duration: 15, // 15 minutos por llamada
      countries_available: ['ALL'],
      require_credit_card: true,
      auto_renewal: false,
    },
    priority: 8,
  },
];

// Estrategias de enrutamiento inteligente
export const callRoutingStrategies: CallRoutingStrategy[] = [
  {
    service_name: 'Google Voice',
    conditions: {
      call_type: 'domestic',
      duration_preference: 'medium',
      time_of_day: 'business_hours',
      importance: 'medium',
    },
    fallback_service: 'Skype',
  },

  {
    service_name: 'Discord',
    conditions: {
      call_type: 'international',
      duration_preference: 'long',
      time_of_day: 'after_hours',
      importance: 'low',
    },
    fallback_service: 'Telegram',
  },

  {
    service_name: 'WhatsApp',
    conditions: {
      call_type: 'international',
      duration_preference: 'short',
      time_of_day: 'business_hours',
      importance: 'high',
    },
    fallback_service: 'Signal',
  },

  {
    service_name: 'Vapi Trial',
    conditions: {
      call_type: 'business',
      duration_preference: 'short',
      time_of_day: 'business_hours',
      importance: 'high',
    },
    fallback_service: 'Twilio Trial',
  },

  {
    service_name: 'Skype',
    conditions: {
      call_type: 'business',
      duration_preference: 'medium',
      time_of_day: 'business_hours',
      importance: 'medium',
    },
    fallback_service: 'WhatsApp',
  },
];

// Gestor inteligente de minutos gratis
export class FreeMinutesManager {
  private services: FreeMinutesService[];
  private currentBudget: MinutesBudget;
  private callManager: SmartCallManager;
  private usageHistory: Array<{
    service: string;
    duration: number;
    cost: number;
    timestamp: Date;
    recipient: string;
  }> = [];

  constructor() {
    this.services = freeMinutesServices;
    this.callManager = {
      current_call: null,
      queue: [],
      auto_routing_enabled: true,
      cost_saving_mode: true,
    };
    this.currentBudget = this.calculateInitialBudget();
  }

  /**
   * Calcular presupuesto inicial de minutos
   */
  private calculateInitialBudget(): MinutesBudget {
    const totalAvailable = this.services.reduce((total, service) => {
      return total + service.free_minutes_per_month + service.signup_bonus_minutes;
    }, 0);

    const servicesBreakdown: Record<string, any> = {};
    this.services.forEach(service => {
      servicesBreakdown[service.name] = {
        allocated: service.free_minutes_per_month + service.signup_bonus_minutes,
        used: 0,
        remaining: service.free_minutes_per_month + service.signup_bonus_minutes,
      };
    });

    return {
      total_available: totalAvailable,
      used_this_month: 0,
      remaining: totalAvailable,
      daily_allowance: Math.floor(totalAvailable / 30),
      services_breakdown: servicesBreakdown,
    };
  }

  /**
   * Encontrar el mejor servicio para una llamada específica
   */
  findBestServiceForCall(callDetails: {
    recipient_country: string;
    estimated_duration: number;
    importance: 'low' | 'medium' | 'high' | 'critical';
    call_type: 'domestic' | 'international' | 'business';
    time_of_day: 'business_hours' | 'after_hours' | 'weekend';
  }): { service: FreeMinutesService; reason: string } | null {
    const availableServices = this.services.filter(service => {
      const serviceBudget = this.currentBudget.services_breakdown[service.name];
      return serviceBudget.remaining > 0;
    });

    // Ordenar por prioridad y disponibilidad
    const prioritizedServices = availableServices.sort((a, b) => a.priority - b.priority);

    for (const service of prioritizedServices) {
      // Verificar si el servicio puede manejar esta llamada
      if (this.canServiceHandleCall(service, callDetails)) {
        const reason = this.getServiceSelectionReason(service, callDetails);
        return { service, reason };
      }
    }

    return null;
  }

  /**
   * Verificar si un servicio puede manejar una llamada específica
   */
  private canServiceHandleCall(service: FreeMinutesService, callDetails: any): boolean {
    const serviceBudget = this.currentBudget.services_breakdown[service.name];

    // Verificar minutos disponibles
    if (serviceBudget.remaining < callDetails.estimated_duration) {
      return false;
    }

    // Verificar duración máxima
    if (callDetails.estimated_duration > service.limitations.max_call_duration) {
      return false;
    }

    // Verificar países disponibles
    if (service.limitations.countries_available[0] !== 'ALL') {
      if (!service.limitations.countries_available.includes(callDetails.recipient_country)) {
        return false;
      }
    }

    // Verificar tipo de llamada
    if (callDetails.call_type === 'international' && !service.features.international_calls) {
      return false;
    }

    return true;
  }

  /**
   * Obtener razón de selección del servicio
   */
  private getServiceSelectionReason(service: FreeMinutesService, _callDetails: any): string {
    const reasons = [];

    if (service.priority === 1) reasons.push('máxima prioridad');
    if (service.free_minutes_per_month > 0) reasons.push('minutos gratuitos');
    if (!service.limitations.require_credit_card) reasons.push('sin tarjeta requerida');
    if (service.features.recording) reasons.push('grabación disponible');
    if (service.features.transcription) reasons.push('transcripción incluida');

    return reasons.join(', ') || 'mejor opción disponible';
  }

  /**
   * Iniciar una llamada con el servicio óptimo
   */
  async initiateCall(callDetails: {
    recipient: string;
    recipient_country: string;
    estimated_duration: number;
    importance: 'low' | 'medium' | 'high' | 'critical';
    call_type: 'domestic' | 'international' | 'business';
    time_of_day: 'business_hours' | 'after_hours' | 'weekend';
  }): Promise<{
    success: boolean;
    service?: FreeMinutesService;
    reason?: string;
    cost_saving?: number;
  }> {
    const bestService = this.findBestServiceForCall(callDetails);

    if (!bestService) {
      return {
        success: false,
        reason: 'No hay minutos gratuitos disponibles para esta llamada',
      };
    }

    // Simular inicio de llamada
    this.callManager.current_call = {
      service: bestService.service.name,
      duration: 0,
      cost: 0,
      minutes_used: callDetails.estimated_duration,
    };

    // Actualizar presupuesto
    this.updateBudget(bestService.service.name, callDetails.estimated_duration);

    // Calcular ahorro
    const estimatedCost = this.calculateEstimatedCost(callDetails);
    const costSaving = estimatedCost; // 100% de ahorro con minutos gratis

    return {
      success: true,
      service: bestService.service,
      reason: bestService.reason,
      cost_saving: costSaving,
    };
  }

  /**
   * Actualizar presupuesto después de una llamada
   */
  private updateBudget(serviceName: string, minutesUsed: number): void {
    const serviceBudget = this.currentBudget.services_breakdown[serviceName];
    serviceBudget.used += minutesUsed;
    serviceBudget.remaining -= minutesUsed;

    this.currentBudget.used_this_month += minutesUsed;
    this.currentBudget.remaining -= minutesUsed;

    // Agregar al historial
    this.usageHistory.push({
      service: serviceName,
      duration: minutesUsed,
      cost: 0, // Gratis
      timestamp: new Date(),
      recipient: 'Usuario',
    });
  }

  /**
   * Calcular costo estimado si no usáramos minutos gratis
   */
  private calculateEstimatedCost(callDetails: any): number {
    // Costos promedio del mercado
    const domesticRate = 0.05; // $0.05 por minuto
    const internationalRate = 0.15; // $0.15 por minuto

    const rate = callDetails.call_type === 'international' ? internationalRate : domesticRate;
    return callDetails.estimated_duration * rate;
  }

  /**
   * Obtener estado actual del presupuesto
   */
  getBudgetStatus(): MinutesBudget {
    return { ...this.currentBudget };
  }

  /**
   * Obtener recomendaciones para maximizar minutos gratis
   */
  getOptimizationRecommendations(): Array<{
    type: 'usage' | 'signup' | 'referral' | 'routing';
    title: string;
    description: string;
    potential_savings: number;
    priority: 'high' | 'medium' | 'low';
  }> {
    const recommendations = [];

    // Analizar uso actual
    const mostUsedService = Object.entries(this.currentBudget.services_breakdown).sort(
      ([, a], [, b]) => b.used - a.used
    )[0];

    if (mostUsedService && mostUsedService[1].used > mostUsedService[1].allocated * 0.8) {
      recommendations.push({
        type: 'usage',
        title: 'Optimizar uso de ' + mostUsedService[0],
        description: `Estás usando el 80% de los minutos de ${mostUsedService[0]}. Considera usar servicios alternativos.`,
        potential_savings: 50,
        priority: 'high',
      });
    }

    // Recomendar servicios no utilizados
    const unusedServices = this.services.filter(service => {
      const budget = this.currentBudget.services_breakdown[service.name];
      return budget.remaining === budget.allocated && budget.allocated > 0;
    });

    if (unusedServices.length > 0) {
      recommendations.push({
        type: 'signup',
        title: 'Activar servicios sin usar',
        description: `Tienes ${unusedServices.length} servicios con minutos gratis sin utilizar.`,
        potential_savings: 100,
        priority: 'medium',
      });
    }

    // Recomendar programa de referidos
    const referralServices = this.services.filter(service => service.referral_bonus_minutes > 0);
    if (referralServices.length > 0) {
      recommendations.push({
        type: 'referral',
        title: 'Programa de referidos',
        description: `Invita amigos y gana hasta ${Math.max(
          ...referralServices.map(s => s.referral_bonus_minutes)
        )} minutos extra por referencia.`,
        potential_savings: 200,
        priority: 'medium',
      });
    }

    return recommendations as Array<{
      type: 'usage' | 'signup' | 'referral' | 'routing';
      title: string;
      description: string;
      potential_savings: number;
      priority: 'high' | 'medium' | 'low';
    }>;
  }

  /**
   * Generar reporte de ahorro
   */
  generateSavingsReport(): {
    total_minutes_saved: number;
    total_money_saved: number;
    most_valuable_service: string;
    usage_efficiency: number;
    recommendations_count: number;
  } {
    const totalMinutesSaved = this.currentBudget.used_this_month;
    const totalMoneySaved = this.usageHistory.reduce((total, call) => {
      // Estimar costo basado en tipo de llamada
      return total + call.duration * 0.1; // Promedio $0.10 por minuto
    }, 0);

    const mostValuableService =
      Object.entries(this.currentBudget.services_breakdown).sort(
        ([, a], [, b]) => b.used - a.used
      )[0]?.[0] || 'N/A';

    const usageEfficiency =
      (this.currentBudget.used_this_month / this.currentBudget.total_available) * 100;

    const recommendations = this.getOptimizationRecommendations();

    return {
      total_minutes_saved: totalMinutesSaved,
      total_money_saved: totalMoneySaved,
      most_valuable_service: mostValuableService,
      usage_efficiency: Math.round(usageEfficiency),
      recommendations_count: recommendations.length,
    };
  }

  /**
   * Simular fin de mes y reiniciar presupuesto
   */
  resetMonthlyBudget(): void {
    this.currentBudget = this.calculateInitialBudget();
    this.usageHistory = [];
  }
}

export const freeMinutesManager = new FreeMinutesManager();
