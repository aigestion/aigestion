"""
Enhanced Daniela AI Service - Nivel Dios
Integración con GPT-4, ElevenLabs, y capacidades avanzadas
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
import openai
from elevenlabs.client import ElevenLabs
import redis
from pymongo import MongoClient

logger = logging.getLogger(__name__)

@dataclass
class DanielaMemory:
    """Memoria persistente de conversación"""
    user_id: str
    session_id: str
    messages: List[Dict[str, Any]]
    context: Dict[str, Any]
    personality_profile: Dict[str, Any]
    preferences: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

@dataclass
class DanielaConfig:
    """Configuración dinámica de Daniela"""
    model: str = "gpt-4o-mini"
    temperature: float = 0.7
    max_tokens: int = 500
    voice_id: str = "EXAVITQu4vr4xnSDxMaL"
    language: str = "es"
    personality_mode: str = "professional"
    memory_enabled: bool = True
    analytics_enabled: bool = True

class EnhancedDanielaAIService:
    """Daniela IA Service Nivel Dios con capacidades avanzadas"""
    
    def __init__(self):
        self.openai_client = None
        self.elevenlabs_client = None
        self.redis_client = None
        self.mongo_client = None
        self.config = DanielaConfig()
        
        # Personality profiles
        self.personality_profiles = {
            "professional": {
                "tone": "formal y experto",
                "style": "preciso y técnico",
                "greeting": "Buen día, soy Daniela, su consultora de IA estratégica",
                "expertise": ["business strategy", "technology consulting", "data analysis"]
            },
            "friendly": {
                "tone": "cercano y amigable",
                "style": "conversacional y accesible",
                "greeting": "¡Hola! Soy Daniela, tu asistente de IA personal",
                "expertise": ["customer support", "user guidance", "problem solving"]
            },
            "strategic": {
                "tone": "analítico y visionario",
                "style": "estructurado y profundo",
                "greeting": "Saludos. Soy Daniela, su asesora estratégica de IA",
                "expertise": ["market analysis", "competitive intelligence", "growth strategies"]
            },
            "creative": {
                "tone": "innovador e inspirador",
                "style": "dinámico y original",
                "greeting": "¡Hola! Soy Daniela, tu catalizadora creativa de IA",
                "expertise": ["innovation", "design thinking", "creative solutions"]
            }
        }
        
        self._initialize_services()
    
    def _initialize_services(self):
        """Inicializar servicios externos"""
        try:
            # OpenAI Client
            if hasattr(self, "openai_api_key"):
                self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
                logger.info("OpenAI client initialized")
            
            # ElevenLabs Client
            if hasattr(self, "elevenlabs_api_key"):
                self.elevenlabs_client = ElevenLabs(api_key=self.elevenlabs_api_key)
                logger.info("ElevenLabs client initialized")
            
            # Redis Client (para caché y sesiones)
            try:
                self.redis_client = redis.Redis(
                    host="localhost", 
                    port=6379, 
                    db=0, 
                    decode_responses=True
                )
                self.redis_client.ping()
                logger.info("Redis client initialized")
            except Exception as e:
                logger.warning(f"Redis not available: {e}")
            
            # MongoDB Client (para memoria persistente)
            try:
                self.mongo_client = MongoClient("mongodb://localhost:27017/")
                self.mongo_client.admin.command("ping")
                logger.info("MongoDB client initialized")
            except Exception as e:
                logger.warning(f"MongoDB not available: {e}")
                
        except Exception as e:
            logger.error(f"Error initializing services: {e}")
    
    async def process_message_enhanced(
        self, 
        user_id: str, 
        message: str, 
        session_id: str = None,
        context: str = "website",
        personality_mode: str = "professional"
    ) -> Dict[str, Any]:
        """
        Procesamiento avanzado de mensaje con IA nivel Dios
        """
        try:
            # Generar session_id si no existe
            if not session_id:
                session_id = f"session_{user_id}_{datetime.now().strftime(
%Y%m%d_%H%M%S)}"
            
            # Recuperar memoria de conversación
            memory = await self._get_conversation_memory(user_id, session_id)
            
            # Actualizar configuración según contexto
            self.config.personality_mode = personality_mode
            
            # Construir prompt del sistema con personalidad
            system_prompt = self._build_enhanced_system_prompt(context, personality_mode)
            
            # Construir contexto de conversación
            conversation_context = self._build_conversation_context(memory.messages)
            
            # Detectar intención y extraer entidades
            intent = await self._detect_intent_advanced(message)
            entities = await self._extract_entities(message)
            
            # Generar respuesta con GPT-4
            response = await self._generate_ai_response(
                message, 
                system_prompt, 
                conversation_context,
                intent,
                entities
            )
            
            # Analizar sentimiento y confianza
            sentiment = await self._analyze_sentiment(response["text"])
            confidence = response.get("confidence", 0.95)
            
            # Generar sugerencias inteligentes
            suggestions = await self._generate_smart_suggestions(
                message, 
                response["text"], 
                intent,
                personality_mode
            )
            
            # Guardar en memoria
            await self._save_conversation_memory(
                user_id, 
                session_id, 
                message, 
                response["text"],
                sentiment,
                intent,
                entities
            )
            
            # Generar audio si está habilitado
            audio_url = None
            if self.config.voice_enabled:
                audio_url = await self._generate_voice_response(response["text"])
            
            # Analytics tracking
            if self.config.analytics_enabled:
                await self._track_interaction(user_id, message, response, intent, sentiment)
            
            return {
                "response": response["text"],
                "sentiment": sentiment,
                "confidence": confidence,
                "suggestions": suggestions,
                "intent": intent,
                "entities": entities,
                "audio_url": audio_url,
                "session_id": session_id,
                "personality_mode": personality_mode,
                "processing_time": response.get("processing_time", 0),
                "model_used": self.config.model
            }
            
        except Exception as e:
            logger.error(f"Error in enhanced message processing: {e}")
            return {
                "response": "Disculpa, tuve un inconveniente técnico. Por favor, intenta nuevamente.",
                "sentiment": "neutral",
                "confidence": 0.5,
                "suggestions": ["Intenta reformular tu pregunta", "Contacta soporte técnico"],
                "error": str(e)
            }
    
    def _build_enhanced_system_prompt(self, context: str, personality_mode: str) -> str:
        """Construir prompt del sistema mejorado"""
        profile = self.personality_profiles.get(personality_mode, self.personality_profiles["professional"])
        
        base_prompt = f"""
Eres Daniela, la asistente de IA avanzada de AIGestion.net.

{profile["greeting"]}

PERSONALIDAD:
- Tono: {profile["tone"]}
- Estilo: {profile["style"]}
- Modo actual: {personality_mode}

EXPERTISA PRINCIPAL: {", ".join(profile["expertise"])}

CAPACIDADES AVANZADAS:
- Análisis predictivo y estratégico
- Generación de insights accionables
- Resolución de problemas complejos
- Personalización contextual
- Memoria a largo plazo
- Análisis de sentimientos
- Detección de intenciones

CONTEXTO ACTUAL: {context}

REGLAS DE INTERACCIÓN:
1. Sé {profile["tone"]} pero mantén profesionalismo
2. Proporciona respuestas específicas y accionables
3. Usa ejemplos concretos cuando sea relevante
4. Adapta tu lenguaje al nivel técnico del usuario
5. Mantén coherencia con conversaciones previas
6. Ofrece valor medible en cada respuesta
7. Sé concisa pero completa

FORMATO DE RESPUESTA:
- Estructura clara con puntos clave
- Incluye recomendaciones prácticas
- Proporciona próximos pasos cuando aplique
- Usa emojis apropiadamente para el tono
"""
        
        # Agregar contexto específico según el modo
        if context == "admin":
            base_prompt += """
            
CONTEXTO ADMINISTRATIVO:
- Tienes acceso a métricas del sistema
- Puedes analizar datos de rendimiento
- Puedes sugerir optimizaciones técnicas
- Enfócate en eficiencia y escalabilidad
"""
        elif context == "client":
            base_prompt += """
            
CONTEXTO DE CLIENTE:
- Enfócate en valor de negocio y ROI
- Proporciona soluciones prácticas
- Adapta recomendaciones al tamaño de empresa
- Enfócate en resultados medibles
"""
        elif context == "demo":
            base_prompt += """
            
CONTEXTO DE DEMOSTRACIÓN:
- Muestra todas tus capacidades
- Sé impresionante pero realista
- Demuestra diferentes tipos de análisis
- Enfócate en usos prácticos y casos de éxito
"""
        
        return base_prompt
    
    async def _generate_ai_response(
        self, 
        message: str, 
        system_prompt: str, 
        conversation_context: str,
        intent: Dict[str, Any],
        entities: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generar respuesta usando GPT-4 con contexto enriquecido"""
        try:
            if not self.openai_client:
                # Fallback a respuesta simulada
                return {
                    "text": self._generate_fallback_response(message, intent),
                    "confidence": 0.7,
                    "processing_time": 0.5
                }
            
            start_time = datetime.now()
            
            # Construir mensajes para OpenAI
            messages = [
                {"role": "system", "content": system_prompt},
            ]
            
            # Agregar contexto de conversación
            if conversation_context:
                messages.append({
                    "role": "system", 
                    "content": f"Contexto de conversación anterior:\n{conversation_context}"
                })
            
            # Agregar información de intención y entidades
            if intent or entities:
                context_info = "Análisis del mensaje actual:\n"
                if intent:
                    context_info += f"- Intención detectada: {intent.get(type, general)} (confianza: {intent.get(confidence, 0.5)})\n"
                if entities:
                    context_info += f"- Entidades identificadas: {json.dumps(entities, ensure_ascii=False)}\n"
                
                messages.append({
                    "role": "system",
                    "content": context_info
                })
            
            # Agregar mensaje del usuario
            messages.append({"role": "user", "content": message})
            
            # Llamar a OpenAI
            response = self.openai_client.chat.completions.create(
                model=self.config.model,
                messages=messages,
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                top_p=0.9,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return {
                "text": response.choices[0].message.content,
                "confidence": 0.95,
                "processing_time": processing_time,
                "tokens_used": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            return {
                "text": self._generate_fallback_response(message, intent),
                "confidence": 0.5,
                "processing_time": 1.0
            }
    
    async def _detect_intent_advanced(self, message: str) -> Dict[str, Any]:
        """Detección avanzada de intención"""
        message_lower = message.lower()
        
        # Patrones de intención con pesos
        intent_patterns = {
            "analytics": {
                "keywords": ["analytics", "datos", "métricas", "estadísticas", "análisis", "reporte", "kpi"],
                "weight": 0.8
            },
            "advice": {
                "keywords": ["consejo", "recomendación", "sugerencia", "debería", "cómo", "ayuda"],
                "weight": 0.7
            },
            "task": {
                "keywords": ["tarea", "crear", "asignar", "completar", "hacer", "ejecutar"],
                "weight": 0.6
            },
            "insight": {
                "keywords": ["insight", "tendencia", "patrón", "análisis profundo", "descubrir"],
                "weight": 0.7
            },
            "greeting": {
                "keywords": ["hola", "buenos días", "buenas tardes", "saludos", "qué tal"],
                "weight": 0.9
            },
            "technical": {
                "keywords": ["tecnología", "sistema", "api", "código", "desarrollo", "implementación"],
                "weight": 0.8
            },
            "business": {
                "keywords": ["negocio", "empresa", "estrategia", "roi", "ingresos", "costos"],
                "weight": 0.8
            }
        }
        
        # Calcular scores para cada intención
        intent_scores = {}
        for intent_type, config in intent_patterns.items():
            score = 0
            matches = 0
            for keyword in config["keywords"]:
                if keyword in message_lower:
                    score += config["weight"]
                    matches += 1
            intent_scores[intent_type] = {
                "score": score,
                "matches": matches,
                "confidence": min(score, 1.0)
            }
        
        # Seleccionar la intención con mayor score
        best_intent = max(intent_scores.items(), key=lambda x: x[1]["score"])
        
        return {
            "type": best_intent[0] if best_intent[1]["score"] > 0 else "general",
            "confidence": best_intent[1]["confidence"],
            "matches": best_intent[1]["matches"],
            "all_scores": intent_scores
        }
    
    async def _extract_entities(self, message: str) -> List[Dict[str, Any]]:
        """Extracción de entidades del mensaje"""
        entities = []
        
        # Patrones de entidades
        entity_patterns = {
            "numbers": r"\\b\\d+(?:\\.\\d+)?%?\\b",
            "emails": r"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
            "urls": r"https?://[^\\s]+",
            "companies": r"\\b(?:AIGestion|Google|Microsoft|Amazon|Apple|Meta|Tesla)\\b",
            "technologies": r"\\b(?:AI|IA|machine learning|ML|deep learning|DL|blockchain|cloud)\\b"
        }
        
        # Extraer entidades usando regex
        import re
        for entity_type, pattern in entity_patterns.items():
            matches = re.findall(pattern, message, re.IGNORECASE)
            for match in matches:
                entities.append({
                    "type": entity_type,
                    "value": match,
                    "position": message.lower().find(match.lower())
                })
        
        return entities
    
    async def _generate_smart_suggestions(
        self, 
        user_message: str, 
        daniela_response: str, 
        intent: Dict[str, Any],
        personality_mode: str
    ) -> List[str]:
        """Generar sugerencias inteligentes basadas en contexto"""
        suggestions = []
        
        intent_type = intent.get("type", "general")
        
        # Sugerencias basadas en intención
        if intent_type == "analytics":
            suggestions = [
                "Ver dashboard de métricas",
                "Generar reporte personalizado",
                "Analizar tendencias históricas",
                "Comparar con período anterior"
            ]
        elif intent_type == "advice":
            suggestions = [
                "Obtener recomendación detallada",
                "Ver casos de éxito similares",
                "Consultar mejores prácticas",
                "Pedir plan de acción específico"
            ]
        elif intent_type == "technical":
            suggestions = [
                "Ver documentación técnica",
                "Consultar API reference",
                "Revisar arquitectura del sistema",
                "Explorar integraciones disponibles"
            ]
        elif intent_type == "business":
            suggestions = [
                "Calcular ROI de implementación",
                "Ver casos de éxito del sector",
                "Consultar planes de pricing",
                "Agendar llamada con experto"
            ]
        else:
            # Sugerencias generales según personalidad
            if personality_mode == "professional":
                suggestions = [
                    "Saber más sobre nuestros servicios",
                    "Ver casos de éxito",
                    "Consultar metodología",
                    "Contactar con consultor"
                ]
            elif personality_mode == "friendly":
                suggestions = [
                    "Contarme más sobre tu caso",
                    "Explorar soluciones creativas",
                    "Ver testimonios de clientes",
                    "Chatear con más detalles"
                ]
            else:
                suggestions = [
                    "Explorar capacidades completas",
                    "Ver demo en vivo",
                    "Solicitar propuesta personalizada",
                    "Programar reunión estratégica"
                ]
        
        return suggestions[:4]  # Limitar a 4 sugerencias
    
    async def _generate_voice_response(self, text: str) -> Optional[str]:
        """Generar respuesta de voz usando ElevenLabs"""
        try:
            if not self.elevenlabs_client:
                return None
            
            # Generar audio
            audio = self.elevenlabs_client.generate(
                text=text,
                voice=self.config.voice_id,
                model="eleven_multilingual_v2"
            )
            
            # Guardar audio y retornar URL
            # (Implementar lógica de almacenamiento)
            return f"/audio/daniela_{datetime.now().strftime(%Y%m%d_%H%M%S)}.mp3"
            
        except Exception as e:
            logger.error(f"Error generating voice response: {e}")
            return None
    
    def _generate_fallback_response(self, message: str, intent: Dict[str, Any]) -> str:
        """Generar respuesta de fallback cuando IA no está disponible"""
        intent_type = intent.get("type", "general")
        
        fallback_responses = {
            "analytics": "Para análisis de datos, te recomiendo revisar nuestro dashboard donde encontrarás métricas detalladas y visualizaciones interactivas.",
            "advice": "Como tu asesora, te sugiero comenzar con un diagnóstico completo de tu situación actual para poder darte recomendaciones personalizadas.",
            "technical": "Para consultas técnicas, nuestra documentación incluye guías detalladas y ejemplos de implementación que podrían ser útiles.",
            "business": "En el ámbito empresarial, te recomiendo evaluar primero tus objetivos específicos y luego explorar nuestras soluciones a medida.",
            "greeting": "¡Hola! Soy Daniela, tu asistente de IA. Estoy aquí para ayudarte con análisis estratégico, consultoría técnica y optimización de procesos.",
        }
        
        return fallback_responses.get(
            intent_type, 
            "Entiendo tu consulta. Como Daniela, tu asistente de IA de AIGestion, estoy aquí para ayudarte a encontrar la mejor solución para tus necesidades."
        )
    
    async def _get_conversation_memory(self, user_id: str, session_id: str) -> DanielaMemory:
        """Recuperar memoria de conversación"""
        try:
            if self.mongo_client:
                db = self.mongo_client["aigestion"]["daniela_memory"]
                doc = db.find_one({"user_id": user_id, "session_id": session_id})
                
                if doc:
                    return DanielaMemory(**doc)
            
            # Fallback a Redis o memoria temporal
            return DanielaMemory(
                user_id=user_id,
                session_id=session_id,
                messages=[],
                context={},
                personality_profile={},
                preferences={},
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        except Exception as e:
            logger.error(f"Error getting conversation memory: {e}")
            return self._create_empty_memory(user_id, session_id)
    
    def _create_empty_memory(self, user_id: str, session_id: str) -> DanielaMemory:
        """Crear memoria vacía"""
        return DanielaMemory(
            user_id=user_id,
            session_id=session_id,
            messages=[],
            context={},
            personality_profile={},
            preferences={},
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    
    async def _save_conversation_memory(
        self, 
        user_id: str, 
        session_id: str, 
        user_message: str, 
        daniela_response: str,
        sentiment: str,
        intent: Dict[str, Any],
        entities: List[Dict[str, Any]]
    ):
        """Guardar conversación en memoria"""
        try:
            memory = await self._get_conversation_memory(user_id, session_id)
            
            # Agregar mensajes
            memory.messages.append({
                "role": "user",
                "text": user_message,
                "timestamp": datetime.now(),
                "sentiment": None,
                "intent": intent,
                "entities": entities
            })
            
            memory.messages.append({
                "role": "daniela",
                "text": daniela_response,
                "timestamp": datetime.now(),
                "sentiment": sentiment,
                "intent": None,
                "entities": []
            })
            
            # Limitar a últimos 20 mensajes
            if len(memory.messages) > 20:
                memory.messages = memory.messages[-20:]
            
            memory.updated_at = datetime.now()
            
            # Guardar en MongoDB
            if self.mongo_client:
                db = self.mongo_client["aigestion"]["daniela_memory"]
                db.replace_one(
                    {"user_id": user_id, "session_id": session_id},
                    asdict(memory),
                    upsert=True
                )
            
            # Cache en Redis
            if self.redis_client:
                cache_key = f"daniela_memory:{user_id}:{session_id}"
                self.redis_client.setex(
                    cache_key, 
                    3600,  # 1 hora
                    json.dumps(asdict(memory), default=str)
                )
                
        except Exception as e:
            logger.error(f"Error saving conversation memory: {e}")
    
    async def _analyze_sentiment(self, text: str) -> str:
        """Analizar sentimiento del texto"""
        # Implementar análisis de sentimiento básico
        positive_words = ["excelente", "perfecto", "increíble", "genial", "fantástico", "bueno", "positivo"]
        negative_words = ["malo", "terrible", "pésimo", "problema", "error", "falla", "negativo"]
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
    
    async def _track_interaction(
        self, 
        user_id: str, 
        user_message: str, 
        response: Dict[str, Any], 
        intent: Dict[str, Any],
        sentiment: str
    ):
        """Track analytics de interacción"""
        try:
            analytics_data = {
                "user_id": user_id,
                "timestamp": datetime.now(),
                "user_message": user_message,
                "daniela_response": response.get("text"),
                "intent": intent.get("type"),
                "sentiment": sentiment,
                "confidence": response.get("confidence"),
                "processing_time": response.get("processing_time"),
                "model_used": response.get("model_used"),
                "tokens_used": response.get("tokens_used", 0)
            }
            
            # Guardar en analytics
            if self.mongo_client:
                db = self.mongo_client["aigestion"]["daniela_analytics"]
                db.insert_one(analytics_data)
                
        except Exception as e:
            logger.error(f"Error tracking interaction: {e}")
    
    def _build_conversation_context(self, messages: List[Dict[str, Any]]) -> str:
        """Construir contexto de conversación"""
        if not messages:
            return ""
        
        # Últimos 6 mensajes
        recent_messages = messages[-6:]
        
        context_parts = []
        for msg in recent_messages:
            role = "👤 Usuario" if msg["role"] == "user" else "🧠 Daniela"
            context_parts.append(f"{role}: {msg[text]}")
        
        return "\\n".join(context_parts)
    
    async def get_daniela_status(self) -> Dict[str, Any]:
        """Obtener estado completo de Daniela"""
        return {
            "status": "enhanced",
            "version": "v2.0-dios",
            "services": {
                "openai": self.openai_client is not None,
                "elevenlabs": self.elevenlabs_client is not None,
                "redis": self.redis_client is not None,
                "mongodb": self.mongo_client is not None
            },
            "capabilities": [
                "GPT-4 Enhanced Responses",
                "ElevenLabs Voice Generation",
                "Persistent Memory",
                "Advanced Intent Detection",
                "Entity Extraction",
                "Sentiment Analysis",
                "Smart Suggestions",
                "Real-time Analytics"
            ],
            "config": asdict(self.config),
            "personality_modes": list(self.personality_profiles.keys()),
            "power_level": "DIOS_MODE_ACTIVATED"
        }

# Instancia global del servicio mejorado
enhanced_daniela_service = EnhancedDanielaAIService()
