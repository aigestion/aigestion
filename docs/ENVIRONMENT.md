# 🌍 AIGestion Environment Configuration

## 📋 Overview

This file contains all environment variables needed for AIGestion deployment across different environments.

---

## 🔧 Core Environment Variables

### Application Settings
```bash
# Application
NODE_ENV=development
APP_VERSION=2.0.0-GOLD
APP_NAME=AIGestion
APP_URL=http://localhost:3000
APP_PORT=3000

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# CORS
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true
```

### Database Configuration
```bash
# PostgreSQL (Primary Database)
DATABASE_URL=postgresql://username:password@localhost:5432/aigestion
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=aigestion
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_SSL=false
POSTGRES_POOL_MIN=2
POSTGRES_POOL_MAX=10

# MongoDB (Document Storage)
MONGODB_URL=mongodb://localhost:27017/aigestion
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DB=aigestion
MONGODB_USER=username
MONGODB_PASSWORD=password
MONGODB_SSL=false

# Redis (Cache & Sessions)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600
```

### Authentication & Security
```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=aigestion
JWT_AUDIENCE=aigestion-users

# OAuth2 Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key
ENCRYPTION_ALGORITHM=aes-256-gcm
```

### AI Service Configuration
```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORG_ID=org-your-org-id
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
ANTHROPIC_MODEL=claude-3-sonnet-20240229
ANTHROPIC_MAX_TOKENS=1000
ANTHROPIC_TEMPERATURE=0.7

# Google Gemini
GOOGLE_AI_API_KEY=your-google-ai-api-key
GOOGLE_AI_MODEL=gemini-pro
GOOGLE_AI_MAX_TOKENS=1000
GOOGLE_AI_TEMPERATURE=0.7

# Voice Services
AZURE_SPEECH_KEY=your-azure-speech-key
AZURE_SPEECH_REGION=eastus
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

### External Services
```bash
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@aigestion.net

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=aigestion-files
AWS_CLOUDFRONT_DOMAIN=cdn.aigestion.net

# Monitoring & Analytics
SENTRY_DSN=https://your-sentry-dsn
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

---

## 🌍 Environment-Specific Configurations

### Development (.env.development)
```bash
# Development overrides
NODE_ENV=development
LOG_LEVEL=debug
APP_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173

# Database (local)
DATABASE_URL=postgresql://postgres:password@localhost:5432/aigestion_dev
MONGODB_URL=mongodb://localhost:27017/aigestion_dev
REDIS_URL=redis://localhost:6379

# Feature flags
ENABLE_DEBUG_ROUTES=true
ENABLE_MOCK_AI=true
ENABLE_SWAGGER=true
ENABLE_PLAYGROUND=true

# Testing
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/aigestion_test
```

### Staging (.env.staging)
```bash
# Staging overrides
NODE_ENV=staging
LOG_LEVEL=info
APP_URL=https://staging.aigestion.net
CORS_ORIGIN=https://staging.aigestion.net

# Database (cloud)
DATABASE_URL=postgresql://user:pass@staging-db:5432/aigestion_staging
MONGODB_URL=mongodb://user:pass@staging-mongo:27017/aigestion_staging
REDIS_URL=redis://staging-redis:6379

# Feature flags
ENABLE_DEBUG_ROUTES=false
ENABLE_MOCK_AI=false
ENABLE_SWAGGER=true
ENABLE_PLAYGROUND=false

# Monitoring
SENTRY_DSN=https://staging-sentry-dsn
```

### Production (.env.production)
```bash
# Production overrides
NODE_ENV=production
LOG_LEVEL=warn
APP_URL=https://aigestion.net
CORS_ORIGIN=https://aigestion.net

# Database (cloud)
DATABASE_URL=postgresql://user:pass@prod-db:5432/aigestion
MONGODB_URL=mongodb://user:pass@prod-mongo:27017/aigestion
REDIS_URL=redis://prod-redis:6379

# Feature flags
ENABLE_DEBUG_ROUTES=false
ENABLE_MOCK_AI=false
ENABLE_SWAGGER=false
ENABLE_PLAYGROUND=false

# Security
FORCE_HTTPS=true
SECURE_COOKIES=true
RATE_LIMIT_STRICT=true

# Monitoring
SENTRY_DSN=https://prod-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key
```

---

## 🔐 Security Configuration

### Security Headers
```bash
# HTTPS
FORCE_HTTPS=true
SECURE_COOKIES=true
HSTS_MAX_AGE=31536000
HSTS_INCLUDE_SUBDOMAINS=true

# Content Security Policy
CSP_DEFAULT_SRC='self'
CSP_SCRIPT_SRC='self' 'unsafe-inline' https://cdn.aigestion.net
CSP_STYLE_SRC='self' 'unsafe-inline' https://cdn.aigestion.net
CSP_IMG_SRC='self' data: https://cdn.aigestion.net
CSP_CONNECT_SRC='self' https://api.aigestion.net

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
```

### Session Configuration
```bash
# Session Store
SESSION_STORE=redis
SESSION_SECRET=your-session-secret-key
SESSION_NAME=aigestion-session
SESSION_MAX_AGE=86400000
SESSION_SECURE=true
SESSION_HTTP_ONLY=true
```

### API Keys & Secrets
```bash
# API Keys (never commit to version control)
API_KEY_SECRET=your-api-key-secret
WEBHOOK_SECRET=your-webhook-secret
ENCRYPTION_KEY=your-32-character-encryption-key
SIGNING_KEY=your-signing-key

# Third-party integrations
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

---

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# Sentry
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=2.0.0-GOLD
SENTRY_TRACES_SAMPLE_RATE=0.1

# New Relic
NEW_RELIC_LICENSE_KEY=your-newrelic-key
NEW_RELIC_APP_NAME=AIGestion
NEW_RELIC_LOG_LEVEL=info

# DataDog
DATADOG_API_KEY=your-datadog-key
DATADOG_APP_KEY=your-datadog-app-key
DATADOG_SITE=datadoghq.com
```

### Analytics
```bash
# Google Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Vercel Analytics
VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# Custom Analytics
ANALYTICS_ENDPOINT=https://analytics.aigestion.net/events
ANALYTICS_API_KEY=your-analytics-api-key
```

### Performance Monitoring
```bash
# APM
APM_SERVICE_NAME=aigestion
APM_ENVIRONMENT=production
APM_SAMPLE_RATE=0.1

# Profiling
ENABLE_PROFILING=true
PROFILE_SAMPLE_RATE=0.01
```

---

## 🚀 Deployment Configuration

### Docker Configuration
```bash
# Docker
DOCKER_REGISTRY=gcr.io
DOCKER_PROJECT=aigestion-pro
DOCKER_IMAGE_TAG=latest

# Kubernetes
KUBERNETES_NAMESPACE=aigestion
KUBERNETES_CLUSTER=aigestion-cluster
KUBERNETES_SERVICE_ACCOUNT=aigestion-sa
```

### CI/CD Configuration
```bash
# GitHub Actions
GITHUB_TOKEN=ghp_your-github-token
GITHUB_ACTOR=github-actions
GITHUB_REPOSITORY=aigestion/aigestion-net
GITHUB_SHA=commit-sha

# Build
BUILD_NUMBER=123
BUILD_URL=https://github.com/aigestion/aigestion-net/actions/runs/123
```

### Cloud Provider Configuration
```bash
# Google Cloud
GOOGLE_PROJECT_ID=aigestion-pro
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_CLOUD_PROJECT=aigestion-pro

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Azure
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
AZURE_SUBSCRIPTION_ID=your-azure-subscription-id
```

---

## 🧪 Testing Configuration

### Unit Testing
```bash
# Jest
NODE_ENV=test
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/aigestion_test
TEST_MONGODB_URL=mongodb://localhost:27017/aigestion_test
TEST_REDIS_URL=redis://localhost:6379/1

# Coverage
COVERAGE_THRESHOLD=80
COVERAGE_REPORTERS=text lcov html
COVERAGE_DIRECTORY=coverage
```

### Integration Testing
```bash
# Test Environment
TEST_TIMEOUT=30000
TEST_PARALLEL=true
TEST_MAX_WORKERS=4

# Mock Services
MOCK_AI_SERVICE=true
MOCK_EMAIL_SERVICE=true
MOCK_FILE_STORAGE=true
```

### E2E Testing
```bash
# Playwright/Cypress
E2E_BASE_URL=http://localhost:3000
E2E_USERNAME=testuser
E2E_PASSWORD=testpass
E2E_HEADLESS=true
E2E_SLOWMO=1000
```

---

## 📱 Feature Flags

### Development Features
```bash
# Debug Features
ENABLE_DEBUG_ROUTES=true
ENABLE_DEBUG_LOGS=true
ENABLE_PERFORMANCE_LOGS=true
ENABLE_REQUEST_LOGS=true

# Development Tools
ENABLE_SWAGGER=true
ENABLE_PLAYGROUND=true
ENABLE_GRAPHQL_IDE=true
ENABLE_PROFILER=true
```

### Experimental Features
```bash
# AI Features
ENABLE_GPT4_TURBO=true
ENABLE_CLAUDE_3=true
ENABLE_GEMINI_PRO=true
ENABLE_CUSTOM_MODELS=false

# Voice Features
ENABLE_VOICE_CHAT=true
ENABLE_VOICE_SYNTHESIS=true
ENABLE_REAL_TIME_TRANSCRIPTION=false

# Advanced Features
ENABLE_REAL_TIME_COLLABORATION=false
ENABLE_ADVANCED_ANALYTICS=false
ENABLE_CUSTOM_INTEGRATIONS=false
```

---

## 🔧 Service Configuration

### Backend Services
```bash
# API Server
API_PORT=3000
API_HOST=0.0.0.0
API_TIMEOUT=30000
API_BODY_LIMIT=10mb

# WebSocket Server
WS_PORT=3001
WS_PATH=/socket.io
WS_CORS_ORIGIN=http://localhost:5173
```

### Frontend Services
```bash
# Development Server
DEV_PORT=5173
DEV_HOST=localhost
DEV_HTTPS=false

# Build Configuration
BUILD_OUTDIR=dist
BUILD_SOURCEMAP=true
BUILD_MINIFY=true
```

### AI Services
```bash
# AI Service Configuration
AI_SERVICE_PORT=5000
AI_SERVICE_HOST=localhost
AI_MODEL_CACHE_TTL=3600
AI_REQUEST_TIMEOUT=30000

# Model Configuration
DEFAULT_AI_MODEL=gpt-4
FALLBACK_AI_MODEL=gpt-3.5-turbo
MAX_CONCURRENT_REQUESTS=10
```

---

## 📝 Environment Validation

### Required Variables Check
```bash
# Core required variables
REQUIRED_VARS=(
  "NODE_ENV"
  "DATABASE_URL"
  "MONGODB_URL"
  "REDIS_URL"
  "JWT_SECRET"
  "OPENAI_API_KEY"
)

# Optional but recommended
RECOMMENDED_VARS=(
  "ANTHROPIC_API_KEY"
  "GOOGLE_AI_API_KEY"
  "SENTRY_DSN"
  "SMTP_HOST"
  "SMTP_USER"
  "SMTP_PASS"
)
```

### Validation Script
```bash
#!/bin/bash
# scripts/validate-env.sh

echo "🔍 Validating environment variables..."

# Check required variables
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required variable: $var"
    exit 1
  else
    echo "✅ $var is set"
  fi
done

# Check recommended variables
for var in "${RECOMMENDED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "⚠️  Missing recommended variable: $var"
  else
    echo "✅ $var is set"
  fi
done

echo "✅ Environment validation complete!"
```

---

## 🔄 Environment Switching

### Development Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local

# Load environment
source .env.local

# Start development
pnpm run dev
```

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production

# Load production variables
source .env.production

# Deploy
pnpm run deploy:prod
```

### Environment Override
```bash
# Override specific variables
export LOG_LEVEL=debug
export ENABLE_DEBUG_ROUTES=true

# Run with overrides
pnpm run dev
```

---

## 📚 Environment File Templates

### .env.example
```bash
# Copy this file to .env.local and fill in your values
# Never commit actual environment variables to version control

# Application
NODE_ENV=development
APP_VERSION=2.0.0-GOLD
APP_URL=http://localhost:3000
APP_PORT=3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/aigestion
MONGODB_URL=mongodb://localhost:27017/aigestion
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
ENABLE_DEBUG_ROUTES=true
ENABLE_SWAGGER=true
```

### .env.test
```bash
# Testing environment
NODE_ENV=test
LOG_LEVEL=error

# Test databases
TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/aigestion_test
TEST_MONGODB_URL=mongodb://localhost:27017/aigestion_test
TEST_REDIS_URL=redis://localhost:6379/1

# Test secrets
JWT_SECRET=test-jwt-secret-for-testing-only
ENCRYPTION_KEY=test-encryption-key-32-chars

# Mock services
MOCK_AI_SERVICE=true
MOCK_EMAIL_SERVICE=true
MOCK_FILE_STORAGE=true
```

---

## 🔍 Environment Debugging

### Debug Commands
```bash
# Show current environment
pnpm run env:show

# Validate environment
pnpm run env:validate

# Test database connection
pnpm run db:test-connection

# Test Redis connection
pnpm run redis:test-connection

# Test AI service connection
pnpm run ai:test-connection
```

### Environment Diagnostics
```bash
#!/bin/bash
# scripts/env-diagnostics.sh

echo "🔍 Environment Diagnostics"
echo "=========================="

# System info
echo "Node.js: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "OS: $(uname -s)"

# Environment variables
echo "NODE_ENV: $NODE_ENV"
echo "APP_URL: $APP_URL"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
echo "MONGODB_URL: ${MONGODB_URL:0:20}..."

# Service health
echo "Database: $(pnpm run db:health)"
echo "Redis: $(pnpm run redis:health)"
echo "AI Service: $(pnpm run ai:health)"
```

---

## 📞 Support

### Getting Help
- 📧 **Email**: env-support@aigestion.net
- 📖 **Documentation**: [docs.aigestion.net](https://docs.aigestion.net)
- 💬 **Discord**: [AIGestion Discord](https://discord.gg/aigestion)

### Security Issues
- 🔒 **Report Security**: security@aigestion.net
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/aigestion/aigestion-net/issues)

---

*Last Updated: 2025-01-25*
*Environment Configuration Version: 2.0.0-GOLD*
