import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { danielaApi } from '../services/daniela-api.service';
import './daniela-website.css';

interface DanielaWebsiteProps {
  className?: string;
  variant?: 'widget' | 'assistant' | 'advisor';
  context?: 'homepage' | 'contact' | 'pricing' | 'about';
}

export const DanielaWebsite: React.FC<DanielaWebsiteProps> = ({
  className = '',
  variant = 'assistant',
  context = 'homepage',
}) => {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      text: string;
      sender: 'user' | 'daniela';
      timestamp: Date;
      suggestions?: string[];
    }>
  >([]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mensajes iniciales según el contexto
  useEffect(() => {
    const initialMessages = {
      homepage: [
        {
          id: 'welcome',
          text: '🧠 ¡Hola! Soy Daniela, tu asistente inteligente de AIGestion. Estoy aquí para ayudarte a entender cómo podemos transformar tu negocio.',
          sender: 'daniela' as const,
          timestamp: new Date(),
          suggestions: ['¿Qué servicios ofrecen?', '¿Cómo funciona la IA?', '¿Cuál es el ROI?'],
        },
      ],
      contact: [
        {
          id: 'contact',
          text: '🤝 ¡Hola! Soy Daniela, tu consultora de IA de AIGestion. Estoy aquí para conectar contigo y encontrar la solución perfecta para tus necesidades.',
          sender: 'daniela' as const,
          timestamp: new Date(),
          suggestions: ['Agendar una llamada', 'Ver casos de éxito', 'Solicitar demostración'],
        },
      ],
      pricing: [
        {
          id: 'pricing',
          text: '💰 ¡Hola! Soy Daniela, tu asesora financiera de AIGestion. Estoy aquí para ayudarte a encontrar el plan perfecto que se ajuste a tu presupuesto y objetivos.',
          sender: 'daniela' as const,
          timestamp: new Date(),
          suggestions: ['Ver planes disponibles', 'Calcular ROI', 'Obtener cotización'],
        },
      ],
      about: [
        {
          id: 'about',
          text: '🏢 ¡Hola! Soy Daniela, tu guía de AIGestion. Estoy aquí para mostrarte cómo nuestra tecnología revoluciona la gestión empresarial.',
          sender: 'daniela' as const,
          timestamp: new Date(),
          suggestions: ['Nuestra misión', 'Tecnología usada', 'Casos de éxito'],
        },
      ],
    };

    setMessages(initialMessages[context]);
  }, [context]);

  // Verificar conexión con el backend
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await danielaApi.checkConnectivity();
        setIsConnected(connected);

        if (connected) {
          const status = await danielaApi.getSystemStatus();
          setSystemStatus(status);
        }
      } catch (error) {
        console.log('DanielaWebsite: Modo demostración');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await danielaApi.chat(inputText, 'website-user', `session-${Date.now()}`);

      const danielaMessage = {
        id: `daniela-${Date.now()}`,
        text: response.response,
        sender: 'daniela' as const,
        timestamp: new Date(),
        suggestions: generateSuggestions(inputText, context),
      };

      setMessages((prev) => [...prev, danielaMessage]);
    } catch (error) {
      const fallbackResponse = generateFallbackResponse(inputText, context);

      const danielaMessage = {
        id: `daniela-${Date.now()}`,
        text: fallbackResponse,
        sender: 'daniela' as const,
        timestamp: new Date(),
        suggestions: generateSuggestions(inputText, context),
      };

      setMessages((prev) => [...prev, danielaMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const generateSuggestions = (message: string, ctx: string): string[] => {
    const lowerMessage = message.toLowerCase();

    switch (ctx) {
      case 'homepage':
        if (lowerMessage.includes('servicio'))
          return [
            'Nuestros servicios principales',
            'Soluciones personalizadas',
            'Precios y planes',
          ];
        if (lowerMessage.includes('tecnología'))
          return ['IA y Machine Learning', 'Automatización', 'Integración con sistemas existentes'];
        if (lowerMessage.includes('roi'))
          return ['Calculadora de ROI', 'Casos de éxito', 'Demostración en vivo'];
        return ['Saber más', 'Contactar ventas', 'Ver demostración'];

      case 'contact':
        return ['Agendar llamada', 'Enviar email', 'Ver portfolio'];

      case 'pricing':
        if (lowerMessage.includes('precio'))
          return ['Planes básicos', 'Planes empresariales', 'Personalización'];
        if (lowerMessage.includes('roi'))
          return ['Calculadora ROI', 'Comparativa de planes', 'Periodo de recuperación'];
        return ['Ver todos los planes', 'Solicitar cotización', 'Hablar con asesor'];

      case 'about':
        return ['Nuestra historia', 'Equipo fundador', 'Tecnología y metodología'];

      default:
        return ['Saber más', 'Contactar', 'Ver servicios'];
    }
  };

  const generateFallbackResponse = (message: string, ctx: string): string => {
    const lowerMessage = message.toLowerCase();

    if (ctx === 'homepage') {
      if (lowerMessage.includes('servicio')) {
        return 'En AIGestion ofrecemos soluciones de IA personalizadas para optimizar tus procesos empresariales. ¿Qué área te interesa más?';
      }
      if (lowerMessage.includes('tecnología')) {
        return 'Utilizamos IA avanzada, automatización y análisis de datos para transformar tu negocio. ¿Quieres conocer más detalles?';
      }
      if (lowerMessage.includes('roi')) {
        return 'Nuestros clientes typically ven un ROI del 200-300% en los primeros 6 meses. ¿Te gustaría calcular tu ROI específico?';
      }
      return 'En AIGestion, creamos soluciones inteligentes que se adaptan a tus necesidades únicas. ¿En qué puedo ayudarte hoy?';
    }

    if (ctx === 'contact') {
      return 'Estoy aquí para conectar contigo. Puedo agendar una llamada con uno de nuestros especialistas o responder tus preguntas inmediatamente. ¿Qué prefieres?';
    }

    if (ctx === 'pricing') {
      return 'Tenemos planes flexibles que se adaptan a cualquier tamaño de empresa. ¿Te gustaría ver nuestras opciones o calcular una cotización personalizada?';
    }

    if (ctx === 'about') {
      return 'En AIGestion, combinamos tecnología de vanguardia con experiencia humana para crear soluciones que realmente impactan. ¿Qué te gustaría conocer?';
    }

    return 'Gracias por tu interés en AIGestion. Estoy aquí para responder cualquier pregunta que tengas. ¿En qué puedo ayudarte?';
  };

  const getContextTitle = () => {
    switch (context) {
      case 'homepage':
        return '💡 Asistente Inteligente';
      case 'contact':
        return '🤝 Consultora de Contacto';
      case 'pricing':
        return '💰 Asesor Financiero';
      case 'about':
        return '🏢 Guía de Empresa';
      default:
        return '🧠 Daniela AI';
    }
  };

  const getContextSubtitle = () => {
    switch (context) {
      case 'homepage':
        return 'Optimiza tu negocio con IA';
      case 'contact':
        return 'Conecta con expertos';
      case 'pricing':
        return 'Maximiza tu inversión';
      case 'about':
        return 'Descubre nuestra historia';
      default:
        return 'Tu asistente inteligente';
    }
  };

  if (variant === 'widget') {
    return (
      <div className={`daniela-widget ${className}`}>
        <div className="daniela-widget-header">
          <div className="daniela-avatar">🧠</div>
          <div className="daniela-info">
            <div className="daniela-title">{getContextTitle()}</div>
            <div className="daniela-subtitle">{getContextSubtitle()}</div>
          </div>
          <button className="daniela-expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="daniela-widget-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="daniela-messages">
                {messages.slice(-3).map((message) => (
                  <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-content">{message.text}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message daniela">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              <div className="daniela-input">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu pregunta..."
                />
                <button onClick={handleSendMessage} disabled={!inputText.trim() || isTyping}>
                  {isTyping ? <div className="loading-spinner"></div> : '→'}
                </button>
              </div>

              {messages[messages.length - 1]?.suggestions && (
                <div className="daniela-suggestions">
                  {messages[messages.length - 1].suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-btn"
                      onClick={() => handleSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Variante assistant (sidebar o modal)
  if (variant === 'assistant') {
    return (
      <div className={`daniela-assistant ${className}`}>
        <div className="daniela-assistant-header">
          <div className="daniela-avatar-large">🧠</div>
          <div className="daniela-info">
            <h3>{getContextTitle()}</h3>
            <p>{getContextSubtitle()}</p>
            <div className="daniela-status">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              <span className="status-text">{isConnected ? 'En línea' : 'Modo demostración'}</span>
            </div>
          </div>
        </div>

        <div className="daniela-assistant-content">
          <div className="daniela-messages">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message ${message.sender}`}
              >
                <div className="message-content">{message.text}</div>
                <div className="message-time">{message.timestamp.toLocaleTimeString()}</div>
              </motion.div>
            ))}

            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="message daniela"
                >
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {messages[messages.length - 1]?.suggestions && (
            <div className="daniela-suggestions">
              <p className="suggestions-title">Sugerencias:</p>
              <div className="suggestions-grid">
                {messages[messages.length - 1].suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="daniela-input-container">
            <div className="daniela-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu pregunta..."
                className="daniela-input-field"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="daniela-send-btn"
              >
                {isTyping ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9-18-9 2-9 18z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {systemStatus && (
          <div className="daniela-system-status">
            <h4>Estado del Sistema</h4>
            <div className="system-metrics">
              <div className="metric">
                <span className="metric-label">Estado:</span>
                <span className={`metric-value ${systemStatus.status}`}>
                  {systemStatus.status === 'operational' ? '✅ Operativo' : '⚠️ Requiere atención'}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Versión:</span>
                <span className="metric-value">{systemStatus.version}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Usuarios:</span>
                <span className="metric-value">{systemStatus.statistics?.totalUsers || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Variante advisor (integrado en secciones específicas)
  return (
    <div className={`daniela-advisor ${className}`}>
      <div className="daniela-advisor-header">
        <div className="daniela-avatar">🧠</div>
        <div className="daniela-info">
          <h3>{getContextTitle()}</h3>
          <p>{getContextSubtitle()}</p>
          <div className="daniela-badges">
            <span className="badge badge-ai">IA Avanzada</span>
            <span className="badge badge-realtime">Tiempo Real</span>
            <span className="badge badge-available">Disponible</span>
          </div>
        </div>
      </div>

      <div className="daniela-advisor-content">
        <div className="daniela-conversation">
          {messages.map((message) => (
            <div key={message.id} className={`conversation-message ${message.sender}`}>
              <div className="message-avatar">{message.sender === 'user' ? '👤' : '🧠'}</div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{message.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>
          ))}

          <AnimatePresence>
            {isTyping && (
              <div className="conversation-message daniela">
                <div className="message-avatar">🧠</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="daniela-actions">
          <div className="daniela-input-group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Pregúntale sobre ${getContextSubtitle().toLowerCase()}...`}
              className="daniela-advisor-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="daniela-action-btn"
            >
              {isTyping ? 'Pensando...' : 'Enviar'}
            </button>
          </div>

          {messages[messages.length - 1]?.suggestions && (
            <div className="daniela-quick-actions">
              <p className="actions-title">Acciones rápidas:</p>
              <div className="actions-grid">
                {messages[messages.length - 1].suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="action-btn"
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isConnected && (
          <div className="daniela-features">
            <h4>Capacidades Disponibles:</h4>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🧠</span>
                <span className="feature-name">Análisis Emocional</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔧</span>
                <span className="feature-name">Ejecución de Herramientas</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💭</span>
                <span className="feature-name">Memoria Inteligente</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span className="feature-name">Razonamiento Avanzado</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
