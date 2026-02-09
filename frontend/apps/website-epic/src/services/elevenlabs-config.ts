/**
 * ElevenLabs Configuration Nivel Dios - AIGestion.net
 * Voz española agradable, optimista, elegante y clara
 * Configuración gratuita optimizada
 */

export interface ElevenLabsVoiceConfig {
  voice_id: string;
  name: string;
  description: string;
  gender: 'female' | 'male';
  accent: 'spanish' | 'latino' | 'neutral';
  age: 'young' | 'adult';
  use_case: 'assistant' | 'narrator' | 'customer_service';
  premium_features: {
    instant_voice_cloning: boolean;
    voice_designer: boolean;
    professional_dubbing: boolean;
  };
}

export interface ElevenLabsGodModeConfig {
  api_key: string;
  model: {
    default: 'eleven_monolingual_v1' | 'eleven_multilingual_v2';
    turbo: 'eleven_turbo_v2';
    flash: 'eleven_flash_v2';
  };
  voices: {
    primary: ElevenLabsVoiceConfig;
    secondary: ElevenLabsVoiceConfig;
    alternatives: ElevenLabsVoiceConfig[];
  };
  voice_settings: {
    // Configuración para voz española perfecta
    stability: number;        // 0.0-1.0 - Consistencia de voz
    similarity_boost: number; // 0.0-1.0 - Claridad y precisión
    style: number;           // 0.0-1.0 - Expresividad y emoción
    use_speaker_boost: boolean; // Mejora de calidad de audio
  };
  optimization: {
    // Optimización para uso gratuito
    output_format: 'mp3_22050_32'; // Balance calidad/tamaño
    compression: 'high';       // Máxima compresión gratuita
    caching: boolean;         // Cache inteligente
    batch_processing: boolean; // Procesamiento por lotes
  };
  limits: {
    // Límites del plan gratuito
    characters_per_month: 10000;
    characters_per_request: 2500;
    max_voice_clones: 0;
    custom_voices: 0;
  };
}

// Configuración principal de ElevenLabs para AIGestion
export const elevenLabsGodModeConfig: ElevenLabsGodModeConfig = {
  api_key: 'sk_0703b4d45b912f7f0ee08284e9937ff943bec076904a05ae',

  model: {
    default: 'eleven_multilingual_v2', // Mejor para español
    turbo: 'eleven_turbo_v2',          // Más rápido y económico
    flash: 'eleven_flash_v2',          // Ultra rápido
  },

  voices: {
    // Voz principal - Bella (mejor para español de España)
    primary: {
      voice_id: 'EXAVITQu4vr4xnSDxMaL',
      name: 'Bella AIGestion',
      description: 'Voz principal de Daniela IA - Español de España elegante y optimista',
      gender: 'female',
      accent: 'spanish',
      age: 'adult',
      use_case: 'assistant',
      premium_features: {
        instant_voice_cloning: false,
        voice_designer: false,
        professional_dubbing: false,
      },
    },

    // Voz secundaria - Adam (para variedad)
    secondary: {
      voice_id: 'pNInz6obpgDQGcFmaJgB',
      name: 'Adam AIGestion',
      description: 'Voz masculina secundaria - Español claro y profesional',
      gender: 'male',
      accent: 'spanish',
      age: 'adult',
      use_case: 'assistant',
      premium_features: {
        instant_voice_cloning: false,
        voice_designer: false,
        professional_dubbing: false,
      },
    },

    // Alternativas gratuitas
    alternatives: [
      {
        voice_id: 'AZnzlk1XvdvUeBnXmlld',
        name: 'Domi AIGestion',
        description: 'Voz femenina juvenil - Español latino amigable',
        gender: 'female',
        accent: 'latino',
        age: 'young',
        use_case: 'assistant',
        premium_features: {
          instant_voice_cloning: false,
          voice_designer: false,
          professional_dubbing: false,
        },
      },
      {
        voice_id: 'ErXwobaYiN019PkySvjV',
        name: 'Antoni AIGestion',
        description: 'Voz masculina profesional - Español neutro confiable',
        gender: 'male',
        accent: 'spanish',
        age: 'adult',
        use_case: 'customer_service',
        premium_features: {
          instant_voice_cloning: false,
          voice_designer: false,
          professional_dubbing: false,
        },
      },
    ],
  },

  // Configuración perfecta para voz española
  voice_settings: {
    stability: 0.75,        // Alta consistencia para voz clara
    similarity_boost: 0.85, // Alta claridad y precisión en español
    style: 0.65,           // Expresividad optimista pero elegante
    use_speaker_boost: true, // Máxima calidad de audio
  },

  optimization: {
    output_format: 'mp3_22050_32', // Balance perfecto calidad/tamaño
    compression: 'high',             // Máxima compresión para plan gratuito
    caching: true,                   // Cache inteligente para ahorrar caracteres
    batch_processing: true,          // Procesar múltiples textos juntos
  },

  limits: {
    characters_per_month: 10000,    // Límite plan gratuito
    characters_per_request: 2500,   // Máximo por request
    max_voice_clones: 0,            // No disponible en plan gratuito
    custom_voices: 0,               // No disponibles en plan gratuito
  },
};

// Voces específicas para diferentes casos de uso
export const elevenLabsUseCases = {
  // Asistente principal - Daniela IA
  daniela: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - perfecto para español de España
    settings: {
      stability: 0.8,
      similarity_boost: 0.9,
      style: 0.7,
      use_speaker_boost: true,
    },
    prompts: {
      greeting: '¡Hola! Soy Daniela, tu asistente inteligente de AIGestion. ¿En qué puedo ayudarte hoy?',
      help: 'Estoy aquí para ayudarte con gestión empresarial, análisis de datos y automatización.',
      thanks: '¡Gracias por usar AIGestion! Estoy aquí para lo que necesites.',
      error: 'Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.',
    },
  },

  // Narrador para presentaciones
  narrator: {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    settings: {
      stability: 0.9,
      similarity_boost: 0.8,
      style: 0.5,
      use_speaker_boost: true,
    },
    prompts: {
      intro: 'Bienvenido a AIGestion, la plataforma de inteligencia artificial más avanzada.',
      feature: 'Descubre nuestras herramientas de automatización y análisis.',
      conclusion: 'Transforma tu negocio con el poder de la IA.',
    },
  },

  // Servicio al cliente
  support: {
    voice_id: 'ErXwobaYiN019PkySvjV',
    settings: {
      stability: 0.85,
      similarity_boost: 0.95,
      style: 0.4,
      use_speaker_boost: true,
    },
    prompts: {
      welcome: 'Bienvenido al soporte de AIGestion. ¿Cómo podemos ayudarte?',
      assistance: 'Nuestro equipo está listo para asistirte con cualquier consulta.',
      resolution: 'Tu problema ha sido resuelto. ¿Hay algo más en lo que podamos ayudar?',
    },
  },
};

// Textos optimizados para español
export const elevenLabsSpanishTexts = {
  // Mensajes de bienvenida
  welcome_messages: [
    '¡Bienvenido a AIGestion! Tu plataforma inteligente de gestión empresarial.',
    'Hola! Soy Daniela IA, tu asistente personal en AIGestion.',
    'Descubre el poder de la inteligencia artificial con AIGestion.',
  ],

  // Mensajes de ayuda
  help_messages: [
    'Puedo ayudarte con análisis de datos, automatización de procesos y gestión empresarial.',
    'Explora nuestras herramientas de IA para optimizar tu negocio.',
    'AIGestion transforma la forma en que gestionas tu empresa.',
  ],

  // Mensajes de éxito
  success_messages: [
    '¡Excelente! Has completado la operación con éxito.',
    'Perfecto! Tu solicitud ha sido procesada correctamente.',
    '¡Felicidades! Estás aprovechando al máximo AIGestion.',
  ],

  // Mensajes educativos
  educational_messages: [
    'La inteligencia artificial puede aumentar tu productividad en un 300%.',
    'Con AIGestion, automatizas tareas repetitivas y te enfocas en lo importante.',
    'Nuestros algoritmos aprenden de tu negocio para ofrecer soluciones personalizadas.',
  ],
};

// Configuración de optimización para plan gratuito
export const elevenLabsFreeOptimization = {
  // Estrategias para maximizar caracteres gratuitos
  character_saving: {
    // Abreviaciones inteligentes
    abbreviations: {
      'AIGestion': 'AI',
      'inteligencia artificial': 'IA',
      'administración': 'admón',
      'gestión': 'gest.',
      'análisis': 'anál.',
    },

    // Textos cortos y efectivos
    max_text_length: 200, // Caracteres máximos por mensaje

    // Eliminar caracteres innecesarios
    remove_extra_spaces: true,
    remove_special_chars: false, // Mantener acentos españoles
  },

  // Cache inteligente
  cache_strategy: {
    // Tiempo de cache en segundos
    cache_duration: 3600, // 1 hora

    // Textos comunes para cache
    common_texts: [
      'Hola',
      'Gracias',
      'Adiós',
      'Bienvenido',
      '¿En qué puedo ayudarte?',
    ],
  },

  // Procesamiento por lotes
  batch_processing: {
    // Tamaño máximo del lote
    batch_size: 5,

    // Intervalo entre lotes (ms)
    batch_interval: 1000,

    // Prioridad de mensajes
    priority_levels: ['high', 'medium', 'low'],
  },
};

export default elevenLabsGodModeConfig;
