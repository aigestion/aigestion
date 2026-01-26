# 📚 AIGestion API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Webhooks](#webhooks)
- [SDKs & Libraries](#sdks--libraries)
- [Examples](#examples)

---

## 🌟 Overview

The AIGestion API provides RESTful endpoints for managing users, conversations, AI interactions, and system administration.

### API Features
- ✅ **RESTful architecture** with JSON responses
- ✅ **JWT authentication** with OAuth2 support
- ✅ **Rate limiting** with sliding window algorithm
- ✅ **Real-time updates** via WebSocket
- ✅ **Comprehensive error handling**
- ✅ **API versioning** (v1, v2)
- ✅ **OpenAPI 3.0 specification**

---

## 🔐 Authentication

### JWT Authentication
```bash
# Get access token
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

# Response
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "role": "user"
    }
  }
}

# Use token in requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### OAuth2 Flow
```bash
# Authorization URL
https://api.aigestion.net/oauth/authorize?
  response_type=code&
  client_id=your_client_id&
  redirect_uri=https://your-app.com/callback&
  scope=read:users write:conversations&
  state=random_string

# Exchange code for token
POST /api/v1/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
redirect_uri=https://your-app.com/callback&
client_id=your_client_id&
client_secret=your_client_secret
```

---

## 🌐 Base URL

### Environments
```bash
# Production
https://api.aigestion.net

# Staging
https://staging-api.aigestion.net

# Development
http://localhost:3000
```

### API Versions
```bash
# Current stable version
/api/v1/

# Latest version (unstable)
/api/v2/

# Legacy version (deprecated)
/api/v0/
```

---

## ⚡ Rate Limiting

### Rate Limits
```bash
# Default limits
- 100 requests per minute per IP
- 1000 requests per hour per user
- 10 requests per second for authenticated users

# Premium limits
- 1000 requests per minute per IP
- 10000 requests per hour per user
- 100 requests per second for authenticated users

# Headers included in responses
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetTime": "2024-01-01T12:00:00Z"
    }
  }
}
```

---

## ❌ Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details",
      "timestamp": "2024-01-01T12:00:00Z",
      "requestId": "req_123456789"
    }
  }
}
```

### Common Error Codes
```typescript
// Client errors (4xx)
400 - BAD_REQUEST              // Invalid request data
401 - UNAUTHORIZED            // Authentication required
403 - FORBIDDEN               // Insufficient permissions
404 - NOT_FOUND               // Resource not found
409 - CONFLICT                // Resource conflict
422 - VALIDATION_ERROR       // Validation failed
429 - RATE_LIMIT_EXCEEDED     // Rate limit exceeded

// Server errors (5xx)
500 - INTERNAL_SERVER_ERROR   // Unexpected server error
502 - BAD_GATEWAY             // Upstream service error
503 - SERVICE_UNAVAILABLE     // Service temporarily unavailable
504 - GATEWAY_TIMEOUT         // Request timeout
```

---

## 🔗 API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "avatar": "https://cdn.aigestion.net/avatars/user_123.jpg",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### User Endpoints

#### Get Current User
```http
GET /api/v1/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "avatar": "https://cdn.aigestion.net/avatars/user_123.jpg",
    "preferences": {
      "theme": "dark",
      "language": "en",
      "notifications": true
    },
    "stats": {
      "conversationsCount": 42,
      "messagesCount": 1337,
      "lastActiveAt": "2024-01-01T12:00:00Z"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### Update User
```http
PUT /api/v1/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "John Smith",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

### Conversation Endpoints

#### Create Conversation
```http
POST /api/v1/conversations
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Project Discussion",
  "type": "chat",
  "participants": ["user_456", "user_789"]
}
```

**Response:**
```json
{
  "data": {
    "id": "conv_123",
    "title": "Project Discussion",
    "type": "chat",
    "status": "active",
    "participants": [
      {
        "id": "user_123",
        "name": "John Doe",
        "role": "owner"
      },
      {
        "id": "user_456",
        "name": "Jane Smith",
        "role": "member"
      }
    ],
    "settings": {
      "isPublic": false,
      "allowInvites": true,
      "messageRetention": 30
    },
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### Get Conversations
```http
GET /api/v1/conversations?page=1&limit=20&type=chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Send Message
```http
POST /api/v1/conversations/{conversationId}/messages
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "content": "Hello, how are you?",
  "type": "text",
  "metadata": {
    "mood": "friendly",
    "priority": "normal"
  }
}
```

### AI Endpoints

#### Chat with AI
```http
POST /api/v1/ai/chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "message": "What's the weather like today?",
  "context": {
    "location": "New York, NY",
    "preferences": {
      "units": "metric",
      "language": "en"
    }
  },
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

**Response:**
```json
{
  "data": {
    "id": "ai_resp_123",
    "message": "The weather in New York today is sunny with a high of 75°F (24°C). There's a light breeze from the northwest at 5 mph. Perfect weather for a walk in the park!",
    "model": "gpt-4",
    "usage": {
      "promptTokens": 25,
      "completionTokens": 45,
      "totalTokens": 70
    },
    "metadata": {
      "responseTime": 1250,
      "confidence": 0.95,
      "sources": ["weather_api", "location_data"]
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### Voice Processing
```http
POST /api/v1/ai/voice/process
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: multipart/form-data

audio: [audio file]
language: en
model: whisper-1
transcribe: true
translate: false
```

**Response:**
```json
{
  "data": {
    "transcript": "Hello, how are you today?",
    "confidence": 0.98,
    "language": "en",
    "duration": 2.5,
    "words": [
      {
        "word": "Hello",
        "start": 0.1,
        "end": 0.5,
        "confidence": 0.99
      },
      {
        "word": "how",
        "start": 0.6,
        "end": 0.8,
        "confidence": 0.97
      }
    ]
  }
}
```

### Admin Endpoints

#### Get System Stats
```http
GET /api/v1/admin/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Admin-Role: admin
```

**Response:**
```json
{
  "data": {
    "users": {
      "total": 10000,
      "active": 7500,
      "newThisMonth": 1250
    },
    "conversations": {
      "total": 50000,
      "active": 12000,
      "avgDuration": "25 minutes"
    },
    "ai": {
      "requestsToday": 25000,
      "avgResponseTime": "1.2s",
      "successRate": 99.5
    },
    "system": {
      "uptime": "99.99%",
      "cpuUsage": "45%",
      "memoryUsage": "67%",
      "diskUsage": "23%"
    }
  }
}
```

---

## 📋 Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user' | 'guest';
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    timezone: string;
  };
  stats: {
    conversationsCount: number;
    messagesCount: number;
    lastActiveAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Conversation Model
```typescript
interface Conversation {
  id: string;
  title: string;
  type: 'chat' | 'voice' | 'video' | 'ai';
  status: 'active' | 'archived' | 'deleted';
  participants: Participant[];
  settings: {
    isPublic: boolean;
    allowInvites: boolean;
    messageRetention: number; // days
  };
  metadata: {
    tags: string[];
    priority: 'low' | 'normal' | 'high';
    category: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Participant {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
  lastSeenAt?: string;
}
```

### Message Model
```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'system';
  metadata: {
    mood?: string;
    priority?: 'low' | 'normal' | 'high';
    edited?: boolean;
    reactions?: Reaction[];
  };
  attachments?: Attachment[];
  timestamp: string;
  updatedAt?: string;
}

interface Reaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
}
```

---

## 🪝 Webhooks

### Webhook Configuration
```bash
# Register webhook
POST /api/v1/webhooks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/aigestion",
  "events": [
    "message.created",
    "conversation.updated",
    "user.joined",
    "ai.response"
  ],
  "secret": "your_webhook_secret",
  "active": true
}
```

### Webhook Events

#### Message Created
```json
{
  "event": "message.created",
  "data": {
    "message": {
      "id": "msg_123",
      "conversationId": "conv_456",
      "senderId": "user_789",
      "content": "Hello world!",
      "type": "text",
      "timestamp": "2024-01-01T12:00:00Z"
    },
    "user": {
      "id": "user_789",
      "name": "John Doe"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "signature": "sha256=abc123..."
}
```

#### AI Response
```json
{
  "event": "ai.response",
  "data": {
    "response": {
      "id": "ai_resp_123",
      "message": "I understand your question...",
      "model": "gpt-4",
      "confidence": 0.95
    },
    "conversation": {
      "id": "conv_456",
      "type": "ai"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "signature": "sha256=def456..."
}
```

### Webhook Verification
```javascript
// Verify webhook signature (Node.js)
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${expectedSignature}` === signature;
}

// Express.js middleware
app.post('/webhooks/aigestion', (req, res) => {
  const signature = req.headers['x-aigestion-signature'];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook
  handleWebhook(req.body);
  res.status(200).send('OK');
});
```

---

## 📚 SDKs & Libraries

### JavaScript/TypeScript SDK
```bash
npm install @aigestion/sdk
```

```typescript
import { AIGestionClient } from '@aigestion/sdk';

const client = new AIGestionClient({
  baseURL: 'https://api.aigestion.net',
  apiKey: 'your-api-key'
});

// Authentication
const user = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Send message
const message = await client.conversations.sendMessage('conv_123', {
  content: 'Hello!',
  type: 'text'
});

// Chat with AI
const response = await client.ai.chat({
  message: 'What is the weather?',
  model: 'gpt-4'
});
```

### Python SDK
```bash
pip install aigestion-python
```

```python
from aigestion import AIGestionClient

client = AIGestionClient(
    base_url='https://api.aigestion.net',
    api_key='your-api-key'
)

# Authentication
user = client.auth.login(
    email='user@example.com',
    password='password'
)

# Send message
message = client.conversations.send_message(
    conversation_id='conv_123',
    content='Hello!',
    message_type='text'
)

# Chat with AI
response = client.ai.chat(
    message='What is the weather?',
    model='gpt-4'
)
```

### cURL Examples
```bash
# Login
curl -X POST https://api.aigestion.net/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get conversations
curl -X GET https://api.aigestion.net/api/v1/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Send message
curl -X POST https://api.aigestion.net/api/v1/conversations/conv_123/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello!","type":"text"}'
```

---

## 💡 Examples

### Complete Chat Flow
```typescript
// 1. Authenticate
const auth = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// 2. Create conversation
const conversation = await client.conversations.create({
  title: 'AI Assistant Chat',
  type: 'ai'
});

// 3. Send message to AI
const response = await client.ai.chat({
  message: 'Help me write a Python function',
  context: {
    language: 'python',
    framework: 'flask'
  },
  model: 'gpt-4'
});

// 4. Get conversation history
const history = await client.conversations.getMessages(
  conversation.id,
  { limit: 50 }
);

// 5. Real-time updates via WebSocket
const ws = client.websockets.connect(conversation.id);
ws.on('message', (message) => {
  console.log('New message:', message);
});
```

### Voice Processing Flow
```typescript
// 1. Upload audio file
const audioFile = fs.readFileSync('recording.wav');
const transcription = await client.ai.voice.process(audioFile, {
  language: 'en',
  model: 'whisper-1',
  transcribe: true
});

// 2. Process transcribed text with AI
const response = await client.ai.chat({
  message: transcription.transcript,
  context: { isVoice: true }
});

// 3. Convert AI response to speech
const speech = await client.ai.voice.synthesize({
  text: response.message,
  voice: 'alloy',
  language: 'en'
});

// 4. Play audio
const audioBuffer = Buffer.from(speech.audio, 'base64');
fs.writeFileSync('response.mp3', audioBuffer);
```

### Admin Dashboard Integration
```typescript
// 1. Get system statistics
const stats = await client.admin.getStats();

// 2. Monitor active conversations
const conversations = await client.admin.getActiveConversations();

// 3. User management
const users = await client.admin.getUsers({
  page: 1,
  limit: 50,
  role: 'user'
});

// 4. Update user role
await client.admin.updateUserRole('user_123', 'moderator');

// 5. System health check
const health = await client.admin.getHealth();
```

---

## 🔧 Advanced Usage

### Custom Headers
```typescript
const client = new AIGestionClient({
  baseURL: 'https://api.aigestion.net',
  apiKey: 'your-api-key',
  defaultHeaders: {
    'X-Client-Version': '1.0.0',
    'X-Client-Name': 'MyApp'
  }
});
```

### Retry Logic
```typescript
const response = await client.ai.chat({
  message: 'Hello!',
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 'exponential'
  }
});
```

### Streaming Responses
```typescript
const stream = await client.ai.chatStream({
  message: 'Tell me a story',
  stream: true
});

for await (const chunk of stream) {
  console.log(chunk.content);
}
```

---

## 📞 Support

### Getting Help
- 📧 **Email**: api-support@aigestion.net
- 💬 **Discord**: [AIGestion API Discord](https://discord.gg/aigestion)
- 📖 **Documentation**: [docs.aigestion.net](https://docs.aigestion.net)
- 🐛 **Issues**: [GitHub Issues](https://github.com/aigestion/aigestion-net/issues)

### API Status
- 🌐 **Status Page**: [status.aigestion.net](https://status.aigestion.net)
- 📊 **Uptime**: 99.9% SLA
- 🚨 **Incidents**: Posted on status page

### Rate Limit Appeals
- 📧 **Email**: limits@aigestion.net
- 📋 **Include**: API key, use case, expected request volume

---

*Last Updated: 2025-01-25*
*API Documentation Version: 2.0.0-GOLD*
