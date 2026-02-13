/**
 * Twilio Configuration Nivel Dios - AIGestion.net
 * Comunicaciones en español con voz agradable y profesional
 * Configuración gratuita optimizada
 */

export interface TwilioPhoneConfig {
  phone_number: string;
  friendly_name: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
    whatsapp: boolean;
  };
  country: string;
  region: string;
  type: 'local' | 'toll_free' | 'mobile';
}

export interface TwilioMessageConfig {
  templates: {
    welcome: string[];
    verification: string[];
    notifications: string[];
    promotions: string[];
    support: string[];
  };
  personalization: {
    company_name: string;
    sender_name: string;
    signature: string;
    language: 'es' | 'en';
  };
  optimization: {
    max_length: number;
    use_emojis: boolean;
    use_short_links: boolean;
    scheduling: boolean;
  };
}

export interface TwilioVoiceConfig {
  twiml_applications: {
    main_assistant: string;
    support_line: string;
    voicemail: string;
    conference: string;
  };
  voice_settings: {
    language: string;
    voice_gender: 'man' | 'woman';
    speech_speed: number;
    pause_duration: number;
  };
  call_routing: {
    business_hours: {
      monday_friday: { start: string; end: string };
      saturday: { start: string; end: string };
      sunday: { start: string; end: string };
    };
    fallback_number: string;
    voicemail_enabled: boolean;
  };
}

export interface TwilioGodModeConfig {
  account: {
    sid: string;
    auth_token: string;
    recovery_code: string;
  };
  phone_numbers: TwilioPhoneConfig[];
  messaging: TwilioMessageConfig;
  voice: TwilioVoiceConfig;
  whatsapp: {
    enabled: boolean;
    business_profile: {
      about: string;
      address: string;
      email: string;
      website: string;
    };
    templates: {
      welcome: string;
      support: string;
      notification: string;
    };
  };
  optimization: {
    // Optimización para plan gratuito
    free_sms_per_month: number;
    free_whatsapp_messages: number;
    cost_per_sms: number;
    cost_per_minute: number;
    rate_limiting: {
      messages_per_second: number;
      calls_per_second: number;
    };
  };
  compliance: {
    opt_in_required: boolean;
    unsubscribe_keyword: string;
    privacy_policy_url: string;
    terms_of_service_url: string;
  };
}

// Configuración principal de Twilio para AIGestion
export const twilioGodModeConfig: TwilioGodModeConfig = {
  account: {
    sid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || '',
    auth_token: process.env.REACT_APP_TWILIO_AUTH_TOKEN || '',
    recovery_code: process.env.REACT_APP_TWILIO_RECOVERY_CODE || '',
  },

  phone_numbers: [
    {
      phone_number: process.env.REACT_APP_TWILIO_PHONE_NUMBER || '',
      friendly_name: 'AIGestion Principal',
      capabilities: {
        voice: true,
        sms: true,
        mms: false,
        whatsapp: false, // Plan gratuito limitado
      },
      country: 'US',
      region: 'North America',
      type: 'toll_free',
    },
  ],

  messaging: {
    templates: {
      // Mensajes de bienvenida
      welcome: [
        '¡Bienvenido a AIGestion! 🚀 Tu plataforma inteligente de gestión empresarial está lista.',
        'Hola de AIGestion! 🤖 Soy Daniela IA, tu asistente personal. ¿En qué ayudarte?',
        '¡Gracias por unirte a AIGestion! 💼 Transforma tu negocio con el poder de la IA.',
      ],

      // Mensajes de verificación
      verification: [
        'Tu código AIGestion es: {code}. ⏰ Válido por 10 minutos.',
        'AIGestion verification: {code}. No compartas este código. 🔐',
        'Código de seguridad AIGestion: {code}. Ingresa ahora para continuar. ✅',
      ],

      // Notificaciones importantes
      notifications: [
        '📊 Tu reporte de AIGestion está listo. Revisa tu dashboard.',
        '⚠️ Alerta de AIGestion: Se detectó una actividad inusual en tu cuenta.',
        '✅ Actualización completada en AIGestion. Todo funciona perfectamente.',
      ],

      // Promociones especiales
      promotions: [
        '🎉 Oferta especial AIGestion! 30% de descuento en planes premium. ¡Limited time!',
        '💡 Mejora tu negocio con AIGestion. Prueba gratuita de 14 días disponible.',
        '🚀 Transforma tu empresa con IA. AIGestion te muestra cómo. ¡Agenda una demo!',
      ],

      // Soporte al cliente
      support: [
        '🛠️ Soporte AIGestion: Hemos recibido tu solicitud. Te contactaremos pronto.',
        '✅ Tu problema AIGestion ha sido resuelto. ¿Hay algo más en lo que ayudarte?',
        '📞 Necesitas ayuda con AIGestion? Llámanos o responde este mensaje.',
      ],
    },

    personalization: {
      company_name: 'AIGestion',
      sender_name: 'Daniela IA',
      signature:
        '\n\n---\n🤖 Daniela IA\nAIGestion - Inteligencia Artificial para tu Negocio\n🌐 aigestion.net',
      language: 'es',
    },

    optimization: {
      max_length: 160, // Límite SMS estándar
      use_emojis: true, // Hacer mensajes más atractivos
      use_short_links: true, // Ahorrar caracteres
      scheduling: true, // Enviar en horarios óptimos
    },
  },

  voice: {
    twiml_applications: {
      main_assistant: 'aigestion-main-assistant',
      support_line: 'aigestion-support',
      voicemail: 'aigestion-voicemail',
      conference: 'aigestion-conference',
    },

    voice_settings: {
      language: 'es-ES', // Español de España peninsular
      voice_gender: 'woman', // Voz femenina más amigable
      speech_speed: 0.9, // Ligeramente más lento para claridad
      pause_duration: 0.5, // Pausas naturales
    },

    call_routing: {
      business_hours: {
        monday_friday: { start: '09:00', end: '18:00' },
        saturday: { start: '10:00', end: '14:00' },
        sunday: { start: 'closed', end: 'closed' },
      },
      fallback_number: process.env.REACT_APP_TWILIO_FALLBACK_NUMBER || '',
      voicemail_enabled: true,
    },
  },

  whatsapp: {
    enabled: false, // Deshabilitado en plan gratuito
    business_profile: {
      about: 'AIGestion - Plataforma de gestión empresarial con inteligencia artificial',
      address: 'México City, México',
      email: 'contacto@aigestion.net',
      website: 'https://aigestion.net',
    },
    templates: {
      welcome:
        '¡Hola! Bienvenido a AIGestion. Soy Daniela IA, tu asistente personal. ¿En qué ayudarte?',
      support: 'Hola de AIGestion. ¿Cómo puedo ayudarte hoy?',
      notification: 'Notificación importante de AIGestion: {message}',
    },
  },

  optimization: {
    // Límites del plan gratuito de Twilio
    free_sms_per_month: 100,
    free_whatsapp_messages: 0, // No disponible en plan gratuito
    cost_per_sms: 0.0079, // USD por SMS a EE.UU.
    cost_per_minute: 0.013, // USD por minuto de llamada
    rate_limiting: {
      messages_per_second: 1, // Prevenir spam
      calls_per_second: 1, // Prevenir abusos
    },
  },

  compliance: {
    opt_in_required: true,
    unsubscribe_keyword: 'STOP',
    privacy_policy_url: 'https://aigestion.net/privacidad',
    terms_of_service_url: 'https://aigestion.net/terminos',
  },
};

// TwiML templates para diferentes casos de uso
export const twilioTwimlTemplates = {
  // Mensaje de bienvenida principal
  welcome_message: `
    <Response>
      <Gather input="speech" timeout="3" numDigits="1" action="/handle-welcome">
        <Say language="es-ES" voice="woman">
          ¡Hola! Bienvenido a AIGestion. Soy Daniela, tu asistente inteligente.
          Para hablar conmigo, presiona 1 o simplemente di hola.
          Para soporte técnico, presiona 2.
          Para ventas, presiona 3.
        </Say>
      </Gather>
      <Pause length="2"/>
      <Redirect method="POST">/welcome</Redirect>
    </Response>
  `,

  // Asistente principal Daniela IA
  main_assistant: `
    <Response>
      <Gather input="speech" timeout="5" action="/handle-assistant">
        <Say language="es-ES" voice="woman">
          ¡Hola! Soy Daniela, tu asistente de AIGestion.
          Puedo ayudarte con análisis de datos, automatización y optimización de tu negocio.
          ¿En qué te gustaría que te ayude hoy?
        </Say>
      </Gather>
      <Pause length="1"/>
      <Say language="es-ES" voice="woman">
          Si no respondes en 10 segundos, te transferiré con un especialista.
      </Say>
      <Pause length="10"/>
      <Redirect method="POST">/transfer-human</Redirect>
    </Response>
  `,

  // Línea de soporte técnico
  support_line: `
    <Response>
      <Gather input="speech" timeout="4" action="/handle-support">
        <Say language="es-ES" voice="woman">
          Bienvenido al soporte técnico de AIGestion.
          Para reportar un problema, di "problema".
          Para ayuda con configuración, di "configuración".
          Para hablar con un técnico, di "humano".
        </Say>
      </Gather>
      <Pause length="2"/>
      <Redirect method="POST">/support-menu</Redirect>
    </Response>
  `,

  // Buzón de voz
  voicemail: `
    <Response>
      <Say language="es-ES" voice="woman">
        Hola, has llamado a AIGestion. En este momento todos nuestros asesores están ocupados.
        Por favor, deja un mensaje con tu nombre, número de teléfono y el motivo de tu llamada.
        Te contactaremos lo antes posible. ¡Gracias!
      </Say>
      <Record timeout="10" maxLength="60" transcribe="true" transcribeCallback="/voicemail-transcription" />
      <Say language="es-ES" voice="woman">
        Gracias por tu mensaje. Nos pondremos en contacto contigo pronto. ¡Hasta luego!
      </Say>
      <Hangup/>
    </Response>
  `,

  // Conferencia telefónica
  conference: `
    <Response>
      <Say language="es-ES" voice="woman">
        Bienvenido a la conferencia de AIGestion.
        Estás siendo conectado a la sala de reuniones.
        Por favor, espera un momento.
      </Say>
      <Dial>
        <Conference startConferenceOnEnter="true" endConferenceOnExit="true" waitUrl="hold-music">
          AIGestion-Conference
        </Conference>
      </Dial>
    </Response>
  `,

  // Música en espera
  hold_music: `
    <Response>
      <Say language="es-ES" voice="woman">
        Gracias por esperar. Un asistente estará contigo en breve.
        Tu tiempo es valioso para nosotros en AIGestion.
      </Say>
      <Play loop="10">https://demo.twilio.com/docs/classic.mp3</Play>
    </Response>
  `,
};

// Mensajes SMS optimizados para español
export const twilioSpanishMessages = {
  // Mensajes de marketing efectivos
  marketing_messages: [
    '🚀 AIGestion: Transforma datos en decisiones inteligentes. Prueba gratuita! 📊',
    '💡 ¿Listo para automatizar tu negocio? AIGestion te muestra cómo. ¡Agenda demo!',
    '📈 Incrementa tu productividad 300% con IA. AIGestion tiene la solución. ✨',
    '🤖 Tu asistente IA personal te espera. AIGestion - El futuro de la gestión. 🎯',
  ],

  // Mensajes de engagement
  engagement_messages: [
    '👋 Hola de AIGestion! ¿Cómo está tu productividad esta semana? 📊',
    '💡 Tip del día: Automatiza 1 tarea con AIGestion y ahorra 2 horas. ⏰',
    '🎯 ¿Sabías que AIGestion puede analizar 1000 datos en segundos? ¡Increíble! 🤯',
    '🌟 Tu negocio + IA = Éxito garantizado. AIGestion te ayuda. 🚀',
  ],

  // Mensajes educativos
  educational_messages: [
    '📚 ¿Qué es IA? Es como tener un cerebro extra para tu negocio. AIGestion te lo explica.',
    '🔮 Predice tendencias, automatiza tareas, toma decisiones inteligentes. Eso es AIGestion.',
    '💼 La gestión empresarial del futuro es hoy. AIGestion te lleva al futuro. 🚀',
    '📊 Datos + IA = Decisiones perfectas. AIGestion hace la magia. ✨',
  ],

  // Mensajes de urgencia
  urgent_messages: [
    '⚠️ Alerta AIGestion: Tu dashboard necesita atención. Revisa ahora. 📊',
    '🔴 Acción requerida: Tu cuenta AIGestion expira en 3 días. Renueva ahora. ⏰',
    '🚨 Problema detectado en AIGestion. Nuestro equipo está trabajando en solucionarlo. 🛠️',
    '⏰ Última oportunidad: 30% descuento en AIGestion termina hoy. ¡Actúa ahora! 🎯',
  ],
};

// Estrategias de optimización para plan gratuito
export const twilioFreeOptimization = {
  // Gestión de SMS
  sms_management: {
    // Consolidar mensajes
    batch_messages: true,
    max_batch_size: 100,

    // Horarios óptimos de envío
    optimal_send_times: [
      { day: 'monday', time: '10:00' },
      { day: 'wednesday', time: '14:00' },
      { day: 'friday', time: '16:00' },
    ],

    // Evitar horarios no productivos
    avoid_times: [
      { day: 'sunday', time: 'all_day' },
      { day: 'daily', time: '22:00-08:00' },
    ],
  },

  // Gestión de llamadas
  call_management: {
    // Duración máxima de llamadas gratuitas
    max_call_duration: 300, // 5 minutos

    // Enrutamiento inteligente
    priority_routing: {
      existing_customers: 'main_assistant',
      new_customers: 'sales',
      technical_issues: 'support',
    },

    // Callback durante horas no laborales
    callback_scheduling: true,
  },

  // Ahorro de costos
  cost_saving: {
    // Usar números locales cuando sea posible
    prefer_local_numbers: true,

    // Compresión de mensajes
    message_compression: true,

    // Cache de respuestas comunes
    response_cache: true,

    // Limitar llamadas internacionales
    restrict_international: true,
  },
};

// Configuración de monitoreo y analytics
export const twilioMonitoring = {
  // Métricas clave
  key_metrics: [
    'sms_delivery_rate',
    'call_connect_rate',
    'average_call_duration',
    'customer_satisfaction',
    'cost_per_interaction',
  ],

  // Alertas importantes
  alerts: {
    // Límite de uso mensual
    monthly_usage_warning: 80, // % del límite

    // Tasa de entrega baja
    low_delivery_rate: 90, // %

    // Costo alto
    high_cost_threshold: 50, // USD por mes

    // Quejas de spam
    spam_complaints: 1, // Cualquier queja
  },

  // Reportes automáticos
  automated_reports: {
    frequency: 'weekly',
    metrics: ['usage', 'costs', 'performance'],
    recipients: ['admin@aigestion.net'],
    format: 'email',
  },
};

// Plantillas de TwiML dinámicas
export class TwiMLBuilder {
  static buildWelcomeMessage(name?: string): string {
    const greeting = name ? `¡Hola ${name}!` : '¡Hola!';
    return `
      <Response>
        <Say language="es-ES" voice="woman">
          ${greeting} Bienvenido a AIGestion. Soy Daniela, tu asistente inteligente.
          Para continuar, presiona 1 o simplemente di "hola".
        </Say>
        <Gather input="speech dtmf" timeout="3" numDigits="1" action="/handle-welcome">
        </Gather>
      </Response>
    `;
  }

  static buildSupportMessage(issue?: string): string {
    const issueText = issue
      ? `Entiendo que tienes un problema con ${issue}.`
      : 'Entiendo que necesitas ayuda.';
    return `
      <Response>
        <Say language="es-ES" voice="woman">
          ${issueText} Voy a ayudarte a resolverlo.
          Para hablar con un especialista, presiona 1.
          Para dejar un mensaje, presiona 2.
        </Say>
        <Gather input="dtmf" timeout="3" numDigits="1" action="/handle-support">
        </Gather>
      </Response>
    `;
  }

  static buildGoodbyeMessage(): string {
    return `
      <Response>
        <Say language="es-ES" voice="woman">
          Ha sido un placer ayudarte en AIGestion.
          ¡No dudes en contactarme si necesitas algo más!
          ¡Que tengas un excelente día!
        </Say>
        <Hangup/>
      </Response>
    `;
  }
}

export default twilioGodModeConfig;
