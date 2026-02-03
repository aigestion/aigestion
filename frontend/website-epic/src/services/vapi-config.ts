/**
 * Vapi Configuration Nivel Dios - AIGestion.net
 * Asistente de voz IA en español optimista, elegante y claro
 * Configuración gratuita optimizada
 */

export interface VapiAssistantConfig {
  id?: string;
  name: string;
  model: {
    provider: 'openai' | 'anthropic' | 'google';
    model: string;
    temperature: number;
    max_tokens: number;
  };
  voice: {
    provider: 'elevenlabs' | 'playht' | 'deepgram';
    voice_id: string;
    language: string;
    accent: string;
  };
  first_message: string;
  description: string;
  knowledge_base: string[];
  personality: {
    tone: 'optimista' | 'profesional' | 'amigable' | 'elegante';
    formality: 'formal' | 'informal' | 'semiformal';
    energy: 'alta' | 'media' | 'baja';
  };
  capabilities: {
    phone_calls: boolean;
    web_chat: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
}

export interface VapiGodModeConfig {
  api_keys: {
    public: string;
    private: string;
  };
  assistants: {
    primary: VapiAssistantConfig;
    secondary: VapiAssistantConfig;
    specialized: VapiAssistantConfig[];
  };
  phone_system: {
    default_phone_number: string;
    country_code: string;
    recording_enabled: boolean;
    transcription_enabled: boolean;
    voicemail: {
      enabled: boolean;
      message: string;
      timeout_seconds: number;
    };
  };
  optimization: {
    // Optimización para plan gratuito
    max_calls_per_month: number;
    max_call_duration_minutes: number;
    cost_per_minute: number;
    free_minutes_per_month: number;
  };
  integrations: {
    elevenlabs: boolean;
    twilio: boolean;
    slack: boolean;
    email: boolean;
  };
}

// Configuración principal de Vapi para AIGestion
export const vapiGodModeConfig: VapiGodModeConfig = {
  api_keys: {
    public: '8cec0d91-79bb-43f1-992b-5bb3d7393cbb',
    private: '30d5b0d2-f8f7-4320-939e-a8ef78396fd7',
  },

  assistants: {
    // Asistente principal - Daniela IA
    primary: {
      name: 'Daniela IA AIGestion',
      model: {
        provider: 'openai',
        model: 'gpt-4-turbo-preview', // Más económico que GPT-4
        temperature: 0.7, // Creatividad balanceada
        max_tokens: 800, // Optimizado para respuestas concisas
      },
      voice: {
        provider: 'elevenlabs',
        voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - perfecto para español de España
        language: 'es',
        accent: 'spain',
      },
      first_message: '¡Hola! Soy Daniela, tu asistente inteligente de AIGestion. Estoy aquí para ayudarte a optimizar tu negocio con el poder de la IA. ¿En qué puedo asistirte hoy?',
      description: 'Asistente IA especializada en gestión empresarial, análisis de datos y automatización. Voz optimista, elegante y clara en español.',
      knowledge_base: [
        'AIGestion es una plataforma de gestión empresarial con inteligencia artificial',
        'Ofrecemos herramientas de análisis de datos, automatización y optimización',
        'Nuestros servicios incluyen dashboards, reportes automáticos y asistentes virtuales',
        'Para soporte técnico, contactar a soporte@aigestion.net',
        'Planes gratuitos y premium disponibles según necesidades del cliente',
        'Integración con múltiples plataformas como Slack, Google Workspace y más',
      ],
      personality: {
        tone: 'optimista',
        formality: 'semiformal',
        energy: 'media',
      },
      capabilities: {
        phone_calls: true,
        web_chat: true,
        whatsapp: false, // Plan gratuito limitado
        sms: false, // Plan gratuito limitado
      },
    },

    // Asistente secundario - Soporte Técnico
    secondary: {
      name: 'Soporte Técnico AIGestion',
      model: {
        provider: 'openai',
        model: 'gpt-3.5-turbo', // Más económico para soporte
        temperature: 0.3, // Más preciso y técnico
        max_tokens: 600,
      },
      voice: {
        provider: 'elevenlabs',
        voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - voz masculina profesional
        language: 'es',
        accent: 'neutral',
      },
      first_message: 'Hola, soy el asistente de soporte técnico de AIGestion. ¿Qué problema técnico puedo ayudarte a resolver hoy?',
      description: 'Asistente especializado en soporte técnico y resolución de problemas de la plataforma.',
      knowledge_base: [
        'Guías de instalación y configuración',
        'Solución de problemas comunes',
        'Actualizaciones y mantenimiento del sistema',
        'Integración con APIs de terceros',
        'Mejores prácticas de uso de AIGestion',
      ],
      personality: {
        tone: 'profesional',
        formality: 'semiformal',
        energy: 'baja',
      },
      capabilities: {
        phone_calls: true,
        web_chat: true,
        whatsapp: false,
        sms: false,
      },
    },

    // Asistentes especializados
    specialized: [
      {
        name: 'Ventas AIGestion',
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          temperature: 0.8, // Más creativo para ventas
          max_tokens: 700,
        },
        voice: {
          provider: 'elevenlabs',
          voice_id: 'AZnzlk1XvdvUeBnXmlld', // Domi - voz amigable
          language: 'es',
          accent: 'latino',
        },
        first_message: '¡Hola! Soy tu consultor de ventas en AIGestion. ¿Te gustaría descubrir cómo nuestra IA puede transformar tu negocio?',
        description: 'Asistente especializado en ventas y consultoría de productos.',
        knowledge_base: [
          'Características y beneficios de AIGestion',
          'Planes de precios y licencias',
          'Casos de éxito y testimonios',
          'Demostraciones y pruebas gratuitas',
          'Integraciones disponibles',
        ],
        personality: {
          tone: 'optimista',
          formality: 'informal',
          energy: 'alta',
        },
        capabilities: {
          phone_calls: true,
          web_chat: true,
          whatsapp: false,
          sms: false,
        },
      },
    ],
  },

  phone_system: {
    default_phone_number: '+1234567890', // Número de Twilio
    country_code: '+1',
    recording_enabled: true,
    transcription_enabled: true,
    voicemail: {
      enabled: true,
      message: 'Hola, has llamado a AIGestion. En este momento todos nuestros asesores están ocupados. Por favor, deja un mensaje con tu nombre y número de teléfono, y te contactaremos lo antes posible. ¡Gracias!',
      timeout_seconds: 30,
    },
  },

  optimization: {
    // Límites del plan gratuito
    max_calls_per_month: 100,
    max_call_duration_minutes: 10,
    cost_per_minute: 0.05,
    free_minutes_per_month: 100,
  },

  integrations: {
    elevenlabs: true,
    twilio: true,
    slack: false, // Plan gratuito limitado
    email: false, // Plan gratuito limitado
  },
};

// Configuraciones específicas para diferentes casos de uso
export const vapiUseCases = {
  // Atención al cliente automatizada
  customer_service: {
    name: 'Servicio al Cliente AIGestion',
    first_message: '¡Bienvenido a AIGestion! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
    prompts: {
      greeting: 'Hola, gracias por contactar AIGestion. ¿Cómo estás?',
      help: 'Puedo ayudarte con información sobre nuestros servicios, soporte técnico o ventas.',
      transfer: 'Voy a transferirte con un especialista humano. Por favor, espera un momento.',
      closing: 'Ha sido un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?',
    },
    escalation_rules: {
      human_transfer_keywords: ['humano', 'persona', 'agente', 'especialista'],
      urgent_keywords: ['urgente', 'emergencia', 'problema grave'],
      satisfaction_keywords: ['excelente', 'perfecto', 'muy bueno'],
    },
  },

  // Ventas y consultoría
  sales: {
    name: 'Consultor IA AIGestion',
    first_message: '¡Hola! Soy tu consultor IA de AIGestion. ¿Listo para transformar tu negocio con inteligencia artificial?',
    prompts: {
      qualification: 'Para recomendarte la mejor solución, ¿podrías decirme el tamaño de tu empresa?',
      presentation: 'AIGestion ofrece análisis de datos automatizados, reportes en tiempo real y predicciones IA.',
      objection_handling: 'Entiendo tu preocupación. Ofrecemos una prueba gratuita de 14 días sin compromiso.',
      closing: '¿Te gustaría agendar una demostración personalizada?',
    },
    follow_up_schedule: {
      initial_follow_up: 24, // horas
      second_follow_up: 72, // horas
      final_follow_up: 168, // 1 semana
    },
  },

  // Soporte técnico
  technical_support: {
    name: 'Soporte Técnico IA',
    first_message: 'Hola, soy el asistente de soporte técnico de AIGestion. ¿Qué problema técnico puedo ayudarte a resolver?',
    prompts: {
      troubleshooting: 'Vamos a resolver esto paso a paso. ¿Puedes describir el problema que estás experimentando?',
      solution: 'Basado en lo que describes, recomiendo intentar estos pasos...',
      escalation: 'Este problema requiere atención especializada. Voy a crear un ticket de soporte prioritario.',
      resolution: '¿He resuelto tu problema? ¿Hay algo más que pueda hacer por ti?',
    },
    knowledge_base_categories: [
      'Problemas de inicio de sesión',
      'Errores de sincronización',
      'Integraciones con APIs',
      'Problemas de rendimiento',
      'Guías de configuración',
    ],
  },
};

// Mensajes optimizados para español
export const vapiSpanishMessages = {
  // Mensajes de bienvenida personalizados
  welcome_messages: [
    '¡Hola! Soy Daniela, tu asistente IA de AIGestion. ¡Estoy aquí para ayudarte!',
    'Bienvenido a AIGestion. ¿En qué puedo hacer tu día más productivo hoy?',
    '¡Hola! Gracias por contactar AIGestion. ¿Cómo puedo servirte hoy?',
  ],

  // Mensajes de ayuda
  help_messages: [
    'Puedo ayudarte con análisis de datos, automatización y optimización de procesos.',
    'Explora nuestras herramientas de IA para llevar tu negocio al siguiente nivel.',
    'AIGestion transforma datos en decisiones inteligentes. ¿Quieres saber cómo?',
  ],

  // Mensajes de despedida
  goodbye_messages: [
    'Ha sido un placer ayudarte. ¡No dudes en contactarme si necesitas algo más!',
    '¡Gracias por usar AIGestion! Estoy aquí para lo que necesites.',
    '¡Hasta pronto! Que tengas un excelente día con AIGestion.',
  ],

  // Mensajes de error
  error_messages: [
    'Lo siento, he tenido dificultades para procesar tu solicitud. ¿Podrías intentarlo de nuevo?',
    'Parece que hay un problema técnico. Estoy trabajando para resolverlo rápidamente.',
    'Disculpa la interrupción. Vamos a intentar esto de otra manera.',
  ],
};

// Estrategias de optimización para plan gratuito
export const vapiFreeOptimization = {
  // Gestión de llamadas
  call_management: {
    // Duración máxima por llamada
    max_call_duration: 600, // 10 minutos

    // Tiempo de espera máximo
    max_wait_time: 30, // segundos

    // Límite diario de llamadas
    max_daily_calls: 10,

    // Horarios de operación
    business_hours: {
      start: '09:00',
      end: '18:00',
      timezone: 'America/Mexico_City',
      weekends: false,
    },
  },

  // Optimización de tokens
  token_optimization: {
    // Tokens máximos por respuesta
    max_tokens_per_response: 200,

    // Respuestas cortas y efectivas
    concise_responses: true,

    // Cache de respuestas comunes
    common_responses_cache: true,
  },

  // Calidad de voz
  voice_optimization: {
    // Calidad de audio balanceada
    audio_quality: 'standard', // en lugar de 'high'

    // Compresión de audio
    audio_compression: true,

    // Reducción de ruido
    noise_reduction: true,
  },
};

// Configuración de monitoreo y analytics
export const vapiMonitoring = {
  // Métricas importantes
  key_metrics: [
    'call_duration',
    'customer_satisfaction',
    'resolution_rate',
    'cost_per_call',
    'token_usage',
  ],

  // Alertas
  alerts: {
    // Límite de uso mensual
    monthly_limit_warning: 80, // % del límite

    // Costo alto por llamada
    high_cost_threshold: 0.10, // $ por llamada

    // Baja satisfacción
    low_satisfaction_threshold: 3.0, // escala 1-5
  },

  // Reportes automáticos
  automated_reports: {
    frequency: 'weekly',
    recipients: ['admin@aigestion.net'],
    include_transcripts: false, // Ahorrar espacio
    include_analytics: true,
  },
};

export default vapiGodModeConfig;
