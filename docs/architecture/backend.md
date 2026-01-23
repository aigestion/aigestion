# Backend Architecture

## Tech Stack
- **Runtime**: Node.js (>=18)
- **Framework**: Express.js with InversifyJS (Dependency Injection)
- **Language**: TypeScript
- **Database**:
  - **Primary**: MongoDB (Mongoose ORM)
  - **Caching/Rate Limit**: Redis (ioredis)
- **Message Queue**: RabbitMQ

## Key Components
### Dependency Injection
The application uses `inversify` for IoC container management. Controllers and Services are decorated with `@injectable()`.

### Folder Structure
- `src/controllers`: Request handlers.
- `src/services`: Business logic.
- `src/models`: Mongoose schemas.
- `src/config`: Environment and service configuration.
- `src/routes`: API route definitions.
- `src/integrations`: External API wrappers (Social, AI).

### Integrations
- **AI**: Google Vertex AI, Gemini, OpenAI, Suno AI.
- **Cloud**: Google Cloud Platform (Secret Manager, Storage, etc.).
- **Social**: Meta (WhatsApp, Instagram, Facebook), TikTok, LinkedIn, X (Twitter).

## Database
- **Mongoose**: Used for all persistent data storage. Connections managed in `src/config/database.ts`.
- **Redis**: Used for API rate limiting and likely caching.

## Environment Variables
Managed via `dotenv` and Google Secret Manager in production. See `src/config/env.schema.ts` for validation.
