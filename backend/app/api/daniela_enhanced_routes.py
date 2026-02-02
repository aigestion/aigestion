"""
Enhanced Daniela API Routes - Nivel Dios
Endpoints avanzados con capacidades de IA real-time
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import asyncio
import logging
from datetime import datetime

from app.services.daniela_enhanced import enhanced_daniela_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/daniela-enhanced", tags=["daniela-enhanced"])

# Pydantic models
class MessageRequest(BaseModel):
    user_id: str
    message: str
    session_id: Optional[str] = None
    context: str = "website"
    personality_mode: str = "professional"
    voice_enabled: bool = False

class VoiceRequest(BaseModel):
    text: str
    voice_id: str = "EXAVITQu4vr4xnSDxMaL"
    language: str = "es"

class AnalyticsQuery(BaseModel):
    user_id: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    intent_type: Optional[str] = None

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)
        
        logger.info(f"WebSocket connected for user: {user_id}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        self.active_connections.remove(websocket)
        
        if user_id in self.user_connections:
            self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        logger.info(f"WebSocket disconnected for user: {user_id}")

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Connection might be closed, remove it
                    self.disconnect(connection, user_id)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove dead connection
                self.active_connections.remove(connection)

manager = ConnectionManager()

@router.post("/chat")
async def enhanced_chat(request: MessageRequest) -> Dict[str, Any]:
    """
    Endpoint principal de chat con capacidades mejoradas
    """
    try:
        logger.info(f"Enhanced chat request from user {request.user_id}")
        
        # Procesar mensaje con servicio mejorado
        response = await enhanced_daniela_service.process_message_enhanced(
            user_id=request.user_id,
            message=request.message,
            session_id=request.session_id,
            context=request.context,
            personality_mode=request.personality_mode
        )
        
        # Enviar actualización via WebSocket si está conectado
        if response.get("session_id"):
            await manager.send_personal_message(
                json.dumps({
                    "type": "new_message",
                    "user_id": request.user_id,
                    "session_id": response["session_id"],
                    "response": response["text"],
                    "timestamp": datetime.now().isoformat()
                }),
                request.user_id
            )
        
        return {
            "success": True,
            "data": response,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in enhanced chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice/generate")
async def generate_voice(request: VoiceRequest) -> Dict[str, Any]:
    """
    Generar respuesta de voz usando ElevenLabs
    """
    try:
        logger.info(f"Voice generation request for text: {request.text[:50]}...")
        
        # Generar audio
        audio_url = await enhanced_daniela_service._generate_voice_response(
            text=request.text,
            voice_id=request.voice_id,
            language=request.language
        )
        
        if audio_url:
            return {
                "success": True,
                "audio_url": audio_url,
                "text": request.text,
                "voice_id": request.voice_id,
                "language": request.language,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate voice")
            
    except Exception as e:
        logger.error(f"Error generating voice: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_daniela_status() -> Dict[str, Any]:
    """
    Obtener estado completo del sistema Daniela
    """
    try:
        status = enhanced_daniela_service.get_daniela_status()
        
        # Agregar métricas en tiempo real
        status["real_time_metrics"] = {
            "active_websockets": len(manager.active_connections),
            "connected_users": len(manager.user_connections),
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": status
        }
        
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/memory/{user_id}")
async def get_user_memory(user_id: str, session_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Obtener memoria de conversación de usuario
    """
    try:
        if session_id:
            memory = await enhanced_daniela_service._get_conversation_memory(user_id, session_id)
            return {
                "success": True,
                "data": {
                    "user_id": user_id,
                    "session_id": session_id,
                    "messages": memory.messages,
                    "context": memory.context,
                    "personality_profile": memory.personality_profile,
                    "created_at": memory.created_at.isoformat(),
                    "updated_at": memory.updated_at.isoformat()
                }
            }
        else:
            # Obtener todas las sesiones del usuario
            # Implementar lógica para obtener múltiples sesiones
            return {
                "success": True,
                "data": {
                    "user_id": user_id,
                    "sessions": []  # Implementar
                }
            }
            
    except Exception as e:
        logger.error(f"Error getting user memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/memory/{user_id}/clear")
async def clear_user_memory(user_id: str, session_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Limpiar memoria de conversación
    """
    try:
        # Implementar lógica para limpiar memoria
        return {
            "success": True,
            "message": f"Memory cleared for user {user_id}" + (f" session {session_id}" if session_id else ""),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error clearing memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics")
async def get_analytics(query: AnalyticsQuery) -> Dict[str, Any]:
    """
    Obtener analytics de interacciones
    """
    try:
        # Implementar lógica de analytics
        analytics_data = {
            "total_interactions": 0,
            "average_confidence": 0.0,
            "top_intents": [],
            "sentiment_distribution": {},
            "daily_stats": [],
            "user_engagement": {}
        }
        
        return {
            "success": True,
            "data": analytics_data,
            "query": query.dict(),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/personality-profiles")
async def get_personality_profiles() -> Dict[str, Any]:
    """
    Obtener perfiles de personalidad disponibles
    """
    try:
        profiles = enhanced_daniela_service.personality_profiles
        
        return {
            "success": True,
            "data": {
                "profiles": profiles,
                "default": "professional",
                "available_modes": list(profiles.keys())
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting personality profiles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/config/update")
async def update_config(config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Actualizar configuración de Daniela
    """
    try:
        # Validar y actualizar configuración
        valid_keys = ["model", "temperature", "max_tokens", "voice_id", "language"]
        updated_config = {}
        
        for key, value in config.items():
            if key in valid_keys:
                setattr(enhanced_daniela_service.config, key, value)
                updated_config[key] = value
        
        return {
            "success": True,
            "data": {
                "updated_config": updated_config,
                "current_config": enhanced_daniela_service.config.__dict__
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error updating config: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint para comunicación real-time
    """
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Recibir mensaje del cliente
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "chat":
                # Procesar mensaje de chat
                response = await enhanced_daniela_service.process_message_enhanced(
                    user_id=user_id,
                    message=message_data.get("message", ""),
                    session_id=message_data.get("session_id"),
                    context=message_data.get("context", "website"),
                    personality_mode=message_data.get("personality_mode", "professional")
                )
                
                # Enviar respuesta
                await websocket.send_text(json.dumps({
                    "type": "chat_response",
                    "data": response,
                    "timestamp": datetime.now().isoformat()
                }))
                
            elif message_data.get("type") == "ping":
                # Heartbeat
                await websocket.send_text(json.dumps({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                }))
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        logger.info(f"WebSocket disconnected for user: {user_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, user_id)

@router.get("/stream/{user_id}")
async def stream_response(user_id: str, message: str):
    """
    Streaming endpoint para respuestas en tiempo real
    """
    async def generate_stream():
        try:
            # Generar respuesta chunk by chunk
            response = await enhanced_daniela_service.process_message_enhanced(
                user_id=user_id,
                message=message,
                context="streaming",
                personality_mode="professional"
            )
            
            # Simular streaming
            words = response["text"].split()
            for i, word in enumerate(words):
                chunk = {
                    "word": word,
                    "index": i,
                    "total": len(words),
                    "done": i == len(words) - 1
                }
                yield f"data: {json.dumps(chunk)}\\n\\n"
                await asyncio.sleep(0.05)  # Simular typing delay
                
        except Exception as e:
            error_chunk = {
                "error": str(e),
                "done": True
            }
            yield f"data: {json.dumps(error_chunk)}\\n\\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@router.post("/batch-process")
async def batch_process(requests: List[MessageRequest]) -> Dict[str, Any]:
    """
    Procesar múltiples mensajes en batch
    """
    try:
        results = []
        
        for req in requests:
            result = await enhanced_daniela_service.process_message_enhanced(
                user_id=req.user_id,
                message=req.message,
                session_id=req.session_id,
                context=req.context,
                personality_mode=req.personality_mode
            )
            results.append(result)
        
        return {
            "success": True,
            "data": {
                "processed_count": len(results),
                "results": results,
                "batch_id": f"batch_{datetime.now().strftime(
%Y%m%d_%H%M%S)}"
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in batch processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint
    """
    try:
        # Verificar estado de servicios
        status = enhanced_daniela_service.get_daniela_status()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "2.0-dios",
            "services": status["services"],
            "uptime": "running"  # Implementar uptime tracking
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
