// Gemini Pro Service for AIGestion
// Servicio avanzado de IA con Google Gemini Pro

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
}

export interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

class GeminiProService {
  private config: GeminiConfig;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    // Configuración por defecto
    this.config = {
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      model: 'gemini-1.5-pro',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.8,
      topK: 40,
    };
  }

  // Configurar el servicio
  configure(config: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Verificar configuración
  isConfigured(): boolean {
    return !!this.config.apiKey && this.config.apiKey !== 'your_new_gemini_api_key_here';
  }

  // Generar contenido con Gemini Pro
  async generateContent(
    prompt: string,
    context: string = 'AIGestion AI Assistant - Advanced AI Management Platform',
    options?: Partial<GeminiConfig>
  ): Promise<GeminiResponse> {
    const config = { ...this.config, ...options };

    if (!this.isConfigured()) {
      throw new Error('❌ API Key de Gemini Pro no configurada');
    }

    const endpoint = `${this.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${context}\n\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        topP: config.topP,
        topK: config.topK,
      },
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error: GeminiError = await response.json();
        throw new Error(`❌ Error en API de Gemini Pro: ${error.error.message}`);
      }

      const data = await response.json();
      
      return {
        text: data.candidates[0].content.parts[0].text,
        usage: data.usageMetadata,
      };
    } catch (error) {
      console.error('Error en Gemini Pro:', error);
      throw error;
    }
  }

  // Análisis de código
  async analyzeCode(code: string, language: string = 'typescript'): Promise<GeminiResponse> {
    const prompt = `
Analiza este código ${language} de AIGestion y proporciona:
1. Resumen del funcionamiento
2. Posibles bugs o problemas
3. Sugerencias de optimización
4. Mejoras de rendimiento
5. Buenas prácticas aplicadas

Código:
\`\`\`${language}
${code}
\`\`\`
    `;

    return this.generateContent(prompt, 'Análisis de código AIGestion');
  }

  // Generación de contenido para marketing
  async generateMarketingContent(
    topic: string,
    platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram',
    tone: 'professional' | 'casual' | 'inspirational' | 'technical' = 'professional'
  ): Promise<GeminiResponse> {
    const platformInstructions = {
      twitter: 'Máximo 280 caracteres, hashtags incluidos',
      facebook: '300-500 caracteres, tono conversacional',
      linkedin: 'Profesional, 100-200 caracteres, enfocado en negocios',
      instagram: 'Visual, hashtags relevantes, emoji apropiados',
    };

    const prompt = `
Genera contenido para ${platform} sobre "${topic}" con tono ${tone}.
Requisitos: ${platformInstructions[platform]}

El contenido debe ser para AIGestion.net - plataforma de gestión IA avanzada.
    `;

    return this.generateContent(prompt, `Generación de contenido ${platform} para AIGestion`);
  }

  // Asistente técnico para desarrollo
  async getTechnicalAssistance(
    problem: string,
    context: string = '',
    code?: string
  ): Promise<GeminiResponse> {
    let prompt = `Problema técnico en AIGestion: ${problem}`;
    
    if (context) {
      prompt += `\n\nContexto: ${context}`;
    }
    
    if (code) {
      prompt += `\n\nCódigo relacionado:\n\`\`\`\n${code}\n\`\`\``;
    }

    prompt += `\n\nProporciona soluciones específicas, ejemplos de código y mejores prácticas.`;

    return this.generateContent(prompt, 'Asistencia técnica para desarrollo AIGestion');
  }

  // Análisis de sentimiento y feedback
  async analyzeFeedback(feedback: string): Promise<GeminiResponse> {
    const prompt = `
Analiza este feedback de usuario de AIGestion:
"${feedback}"

Proporciona:
1. Sentimiento general (positivo/negativo/neutro)
2. Temas principales mencionados
3. Nivel de urgencia
4. Sugerencias de respuesta
5. Acciones recomendadas
    `;

    return this.generateContent(prompt, 'Análisis de feedback de usuarios AIGestion');
  }

  // Generación de ideas innovadoras
  async generateInnovativeIdeas(
    area: string,
    constraints: string[] = []
  ): Promise<GeminiResponse> {
    const constraintText = constraints.length > 0 
      ? `\nRestricciones: ${constraints.join(', ')}`
      : '';

    const prompt = `
Genera 5 ideas innovadoras para ${area} en AIGestion.net${constraintText}

Cada idea debe incluir:
1. Concepto principal
2. Beneficios clave
3. Viabilidad técnica
4. Potencial impacto
5. Pasos iniciales
    `;

    return this.generateContent(prompt, 'Generación de ideas innovadoras para AIGestion');
  }
}

// Exportar instancia única
export const geminiService = new GeminiProService();

// Exportar tipo para uso en componentes
export type { GeminiConfig, GeminiResponse, GeminiError };
