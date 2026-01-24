# API Reference - Daniela Enhanced Voice Service

## 📋 Overview

Complete API documentation for the Daniela Enhanced Voice Service, including endpoints, request/response formats, authentication, and examples.

---

## 🔐 Authentication

### JWT Token Required
All API endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Format
```json
{
  "sub": "user_id",
  "role": "admin|client|demo",
  "permissions": ["enhanced_voice:read", "enhanced_voice:write"],
  "exp": 1640995200,
  "iat": 1640908800
}
```

---

## 🗣️ Enhanced Voice Endpoints

### POST /api/v1/enhanced-voice/process

Process conversation with Daniela AI (text or audio input).

#### Request
```http
POST /api/v1/enhanced-voice/process
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "sessionId": "session_123456",
  "userId": "user_789012",
  "text": "Hola Daniela, ¿cómo estás?",
  "audio": "base64_encoded_audio_data"
}
```

**Parameters**:
- `sessionId` (string, required): Unique session identifier
- `userId` (string, required): User identifier
- `text` (string, optional): Text input for processing
- `audio` (string, optional): Base64 encoded audio data

#### Response
```json
{
  "success": true,
  "data": {
    "transcription": "Hola Daniela, ¿cómo estás?",
    "emotionalAnalysis": {
      "emotion": "neutral",
      "confidence": 0.85,
      "sentiment": "positive",
      "suggestions": ["friendly_response", "ask_follow_up"]
    },
    "response": "¡Hola! Estoy excelente, gracias por preguntar. ¿En qué puedo ayudarte hoy?",
    "audioResponse": "base64_encoded_audio_response",
    "suggestedActions": [
      {
        "id": "action_1",
        "text": "Mostrar dashboard principal",
        "type": "action",
        "priority": "high",
        "context": "navigation"
      },
      {
        "id": "action_2",
        "text": "Analizar métricas de rendimiento",
        "type": "response",
        "priority": "medium",
        "context": "analytics"
      }
    ],
    "context": {
      "messages": [
        {
          "id": "msg_1",
          "text": "Hola Daniela, ¿cómo estás?",
          "speaker": "client",
          "timestamp": "2026-01-24T15:30:00Z",
          "emotion": "neutral",
          "confidence": 0.85
        },
        {
          "id": "msg_2",
          "text": "¡Hola! Estoy excelente, gracias por preguntar. ¿En qué puedo ayudarte hoy?",
          "speaker": "daniela",
          "timestamp": "2026-01-24T15:30:02Z",
          "emotion": "professional"
        }
      ],
      "emotionalHistory": [
        {
          "emotion": "neutral",
          "confidence": 0.85,
          "sentiment": "positive",
          "suggestions": ["friendly_response"]
        }
      ],
      "clientProfile": {
        "preferences": ["spanish_language", "professional_tone"],
        "previousTopics": ["greeting", "dashboard"],
        "interactionStyle": "professional"
      }
    }
  },
  "meta": {
    "requestId": "req_123456",
    "timestamp": "2026-01-24T15:30:05Z",
    "version": "2.0.0",
    "processingTime": "1.2s"
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "D001",
    "message": "Invalid session ID",
    "details": "Session session_invalid not found"
  },
  "meta": {
    "requestId": "req_123457",
    "timestamp": "2026-01-24T15:30:05Z",
    "version": "2.0.0"
  }
}
```

---

### GET /api/v1/enhanced-voice/history

Retrieve conversation history for a specific session.

#### Request
```http
GET /api/v1/enhanced-voice/history?sessionId=session_123456
Authorization: Bearer <token>
```

**Query Parameters**:
- `sessionId` (string, required): Session identifier

#### Response
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_1",
        "text": "Hola Daniela",
        "speaker": "client",
        "timestamp": "2026-01-24T15:25:00Z",
        "emotion": "neutral"
      },
      {
        "id": "msg_2",
        "text": "¡Hola! ¿En qué puedo ayudarte?",
        "speaker": "daniela",
        "timestamp": "2026-01-24T15:25:02Z",
        "emotion": "professional"
      }
    ],
    "emotionalHistory": [
      {
        "emotion": "neutral",
        "confidence": 0.9,
        "sentiment": "positive",
        "suggestions": []
      }
    ],
    "clientProfile": {
      "preferences": ["spanish"],
      "previousTopics": ["greeting"],
      "interactionStyle": "casual"
    }
  },
  "meta": {
    "requestId": "req_123458",
    "timestamp": "2026-01-24T15:30:10Z",
    "version": "2.0.0"
  }
}
```

---

### POST /api/v1/enhanced-voice/clear

Clear conversation session data.

#### Request
```http
POST /api/v1/enhanced-voice/clear
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "sessionId": "session_123456"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Conversation cleared successfully"
  },
  "meta": {
    "requestId": "req_123459",
    "timestamp": "2026-01-24T15:30:15Z",
    "version": "2.0.0"
  }
}
```

---

## 📊 Analytics Endpoints

### GET /api/v1/enhanced-voice/analytics/session

Get analytics for a specific session.

#### Request
```http
GET /api/v1/enhanced-voice/analytics/session?sessionId=session_123456
Authorization: Bearer <token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "sessionId": "session_123456",
    "userId": "user_789012",
    "metrics": {
      "totalMessages": 12,
      "averageResponseTime": "1.1s",
      "emotionalTransitions": [
        {
          "from": "neutral",
          "to": "happy",
          "count": 3
        }
      ],
      "featureUsage": {
        "voiceInput": 8,
        "textInput": 4,
        "suggestedActions": 6
      },
      "satisfactionScore": 4.8
    },
    "timeline": [
      {
        "timestamp": "2026-01-24T15:25:00Z",
        "action": "conversation_start",
        "details": "User initiated conversation"
      },
      {
        "timestamp": "2026-01-24T15:30:00Z",
        "action": "voice_input",
        "details": "User provided voice input"
      }
    ]
  },
  "meta": {
    "requestId": "req_123460",
    "timestamp": "2026-01-24T15:35:00Z",
    "version": "2.0.0"
  }
}
```

---

### GET /api/v1/enhanced-voice/analytics/user

Get analytics for a specific user across all sessions.

#### Request
```http
GET /api/v1/enhanced-voice/analytics/user?userId=user_789012&period=7d
Authorization: Bearer <token>
```

**Query Parameters**:
- `userId` (string, required): User identifier
- `period` (string, optional): Time period (1d, 7d, 30d, 90d)

#### Response
```json
{
  "success": true,
  "data": {
    "userId": "user_789012",
    "period": "7d",
    "totalSessions": 15,
    "totalConversations": 45,
    "averageSessionDuration": "5m 30s",
    "mostUsedFeatures": [
      {
        "feature": "voice_input",
        "usage": 67
      },
      {
        "feature": "dashboard_navigation",
        "usage": 23
      }
    ],
    "emotionalTrends": {
      "positive": 0.65,
      "neutral": 0.25,
      "concerned": 0.10
    },
    "satisfactionTrend": [
      {
        "date": "2026-01-18",
        "score": 4.5
      },
      {
        "date": "2026-01-24",
        "score": 4.8
      }
    ]
  },
  "meta": {
    "requestId": "req_123461",
    "timestamp": "2026-01-24T15:40:00Z",
    "version": "2.0.0"
  }
}
```

---

## ⚙️ Configuration Endpoints

### GET /api/v1/enhanced-voice/config

Get current Daniela configuration.

#### Request
```http
GET /api/v1/enhanced-voice/config
Authorization: Bearer <token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "voice": {
      "provider": "elevenlabs",
      "voiceId": "EXAVITQu4vr4xnSDxMaL",
      "language": "es",
      "speed": 1.0,
      "pitch": 1.0
    },
    "ai": {
      "provider": "openai",
      "model": "gpt-4o",
      "temperature": 0.7,
      "maxTokens": 2048,
      "systemPrompt": "Eres Daniela, una asistente de IA futurista..."
    },
    "features": {
      "emotionalAnalysis": true,
      "contextualMemory": true,
      "suggestedActions": true,
      "voiceInput": true,
      "multiLanguage": false
    },
    "limits": {
      "maxSessionDuration": "30m",
      "maxMessagesPerSession": 100,
      "rateLimitPerMinute": 30
    }
  },
  "meta": {
    "requestId": "req_123462",
    "timestamp": "2026-01-24T15:45:00Z",
    "version": "2.0.0"
  }
}
```

---

### PUT /api/v1/enhanced-voice/config

Update Daniela configuration (admin only).

#### Request
```http
PUT /api/v1/enhanced-voice/config
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "voice": {
    "voiceId": "MF3mGyEYCl7XYWbV9V6O",
    "speed": 1.1
  },
  "ai": {
    "temperature": 0.8,
    "systemPrompt": "Eres Daniela, una asistente especializada en..."
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Configuration updated successfully",
    "updatedFields": ["voice.voiceId", "voice.speed", "ai.temperature", "ai.systemPrompt"]
  },
  "meta": {
    "requestId": "req_123463",
    "timestamp": "2026-01-24T15:50:00Z",
    "version": "2.0.0"
  }
}
```

---

## 🔍 System Endpoints

### GET /api/v1/enhanced-voice/health

Health check for the enhanced voice service.

#### Request
```http
GET /api/v1/enhanced-voice/health
```

#### Response
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "2.0.0",
    "uptime": "72h 15m 30s",
    "services": {
      "ai_provider": "healthy",
      "voice_synthesis": "healthy",
      "speech_recognition": "healthy",
      "database": "healthy",
      "cache": "healthy"
    },
    "metrics": {
      "active_sessions": 24,
      "requests_per_minute": 145,
      "average_response_time": "1.1s",
      "error_rate": "0.2%"
    }
  },
  "meta": {
    "requestId": "req_123464",
    "timestamp": "2026-01-24T15:55:00Z",
    "version": "2.0.0"
  }
}
```

---

## 📝 Data Models

### ConversationMessage
```typescript
interface ConversationMessage {
  id: string;
  text: string;
  speaker: 'daniela' | 'client';
  timestamp: Date;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'excited' | 'professional';
  confidence?: number;
  isEditing?: boolean;
}
```

### EmotionalAnalysis
```typescript
interface EmotionalAnalysis {
  emotion: string;
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
}
```

### SuggestedAction
```typescript
interface SuggestedAction {
  id: string;
  text: string;
  type: 'response' | 'action' | 'question';
  priority: 'high' | 'medium' | 'low';
  context: string;
}
```

### ConversationContext
```typescript
interface ConversationContext {
  messages: ConversationMessage[];
  emotionalHistory: EmotionalAnalysis[];
  clientProfile: {
    preferences: string[];
    previousTopics: string[];
    interactionStyle: string;
  };
}
```

---

## 🚨 Error Codes

| Code | Message | HTTP Status | Description |
|------|---------|-------------|-------------|
| D001 | Invalid session ID | 400 | Session not found or invalid |
| D002 | Audio processing failed | 500 | Error processing audio input |
| D003 | AI provider error | 502 | External AI service unavailable |
| D004 | Rate limit exceeded | 429 | Too many requests |
| D005 | Authentication required | 401 | Missing or invalid token |
| D006 | Insufficient permissions | 403 | User lacks required permissions |
| D007 | Invalid request format | 400 | Malformed request body |
| D008 | Service temporarily unavailable | 503 | Service under maintenance |
| D009 | Quota exceeded | 429 | User quota exceeded |
| D010 | Unsupported audio format | 400 | Audio format not supported |

---

## 📊 Rate Limiting

### Endpoints Limits
| Endpoint | Requests/Minute | Burst | Daily Limit |
|----------|-----------------|-------|------------|
| /process | 30 | 5 | 1000 |
| /history | 60 | 10 | 2000 |
| /clear | 10 | 2 | 100 |
| /analytics/* | 20 | 5 | 500 |
| /config | 5 | 2 | 50 |

### Headers
```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1640995200
```

---

## 🔄 Webhooks

### Conversation Events
Configure webhooks to receive real-time conversation events.

#### Event Types
- `conversation.started`: New conversation initiated
- `message.received`: New message received
- `emotion.changed`: Emotional state changed
- `conversation.ended`: Conversation completed

#### Webhook Payload
```json
{
  "event": "message.received",
  "sessionId": "session_123456",
  "userId": "user_789012",
  "timestamp": "2026-01-24T15:30:00Z",
  "data": {
    "message": {
      "id": "msg_1",
      "text": "Hola Daniela",
      "speaker": "client",
      "emotion": "neutral"
    }
  }
}
```

---

## 🧪 Testing Examples

### cURL Examples

#### Process Text Conversation
```bash
curl -X POST https://aigestion-backend.onrender.com/api/v1/enhanced-voice/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sessionId": "test_session",
    "userId": "test_user",
    "text": "Hola Daniela, ¿cómo estás?"
  }'
```

#### Process Audio Conversation
```bash
curl -X POST https://aigestion-backend.onrender.com/api/v1/enhanced-voice/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sessionId": "test_session",
    "userId": "test_user",
    "audio": "base64_encoded_audio_data"
  }'
```

#### Get Conversation History
```bash
curl -X GET "https://aigestion-backend.onrender.com/api/v1/enhanced-voice/history?sessionId=test_session" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript Examples

#### Using Fetch API
```javascript
const processConversation = async (text, sessionId, userId) => {
  const response = await fetch('/api/v1/enhanced-voice/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      sessionId,
      userId,
      text
    })
  });

  const result = await response.json();
  return result.data;
};

// Usage
const result = await processConversation(
  'Hola Daniela',
  'session_123',
  'user_456'
);
console.log(result.response);
```

#### Using WebSocket for Real-time
```javascript
const ws = new WebSocket('wss://aigestion-backend.onrender.com/ws/enhanced-voice');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: 'YOUR_JWT_TOKEN'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'conversation_response') {
    console.log('Daniela:', data.response);
  }
};
```

---

## 📚 SDK Examples

### Node.js SDK
```javascript
const { DanielaClient } = require('@aigestion/daniela-sdk');

const client = new DanielaClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://aigestion-backend.onrender.com'
});

async function chatWithDaniela() {
  const session = await client.createSession();

  const response = await client.processMessage({
    sessionId: session.id,
    text: 'Hola Daniela, ¿cómo estás?'
  });

  console.log(response.response);

  // Get audio response
  if (response.audioResponse) {
    const audioBuffer = await client.getAudio(response.audioResponse);
    // Play audio...
  }
}
```

### Python SDK
```python
from aigestion_daniela import DanielaClient

client = DanielaClient(
    api_key='YOUR_API_KEY',
    base_url='https://aigestion-backend.onrender.com'
)

async def chat_with_daniela():
    session = await client.create_session()

    response = await client.process_message(
        session_id=session.id,
        text='Hola Daniela, ¿cómo estás?'
    )

    print(response.response)

    # Get audio response
    if response.audio_response:
        audio_data = await client.get_audio(response.audio_response)
        # Play audio...
```

---

## 📞 Support

### API Support
- **Documentation**: https://docs.aigestion.net
- **Status Page**: https://status.aigestion.net
- **Support Email**: api-support@aigestion.net
- **Developer Discord**: https://discord.gg/aigestion

### Rate Limit Support
- **Enterprise Plans**: Unlimited requests
- **Custom Limits**: Contact sales@aigestion.net
- **Burst Requests**: Available on premium plans

---

**API Version**: 2.0.0
**Last Updated**: 2026-01-24
**Base URL**: https://aigestion-backend.onrender.com/api/v1
**Documentation Version**: 1.0.0
