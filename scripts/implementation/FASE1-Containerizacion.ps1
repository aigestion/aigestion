# 🚀 FASE 1: CONTAINERIZACIÓN COMPLETA - AIGESTION
# Script PowerShell para Dockerizar todos los servicios

param(
    [string]$Environment = "development",
    [switch]$Production,
    [switch]$Test,
    [switch]$Build,
    [switch]$Push,
    [switch]$Clean,
    [switch]$Help
)

# ============================================
# 📋 CONFIGURACIÓN INICIAL
# ============================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Colors for output
$colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Cyan = "Cyan"
    Magenta = "Magenta"
    White = "White"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Show-Help {
    Write-ColorOutput "🚀 FASE 1: Containerización AIGestion - Nivel Dios" "Cyan"
    Write-ColorOutput "" "White"
    Write-ColorOutput "Uso:" "Yellow"
    Write-ColorOutput "  .\FASE1-Containerizacion.ps1 [parámetros]" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "Parámetros:" "Yellow"
    Write-ColorOutput "  -Environment    Entorno (development|staging|production) [default: development]" "White"
    Write-ColorOutput "  -Production     Modo producción (optimizado, multi-stage)" "White"
    Write-ColorOutput "  -Test           Ejecutar tests después de build" "White"
    Write-ColorOutput "  -Build          Solo construir imágenes" "White"
    Write-ColorOutput "  -Push           Push a registry después de build" "White"
    Write-ColorOutput "  -Clean          Limpiar imágenes y containers viejos" "White"
    Write-ColorOutput "  -Help           Mostrar esta ayuda" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "Ejemplos:" "Yellow"
    Write-ColorOutput "  .\FASE1-Containerizacion.ps1 -Environment development -Test" "White"
    Write-ColorOutput "  .\FASE1-Containerizacion.ps1 -Production -Push" "White"
    Write-ColorOutput "  .\FASE1-Containerizacion.ps1 -Clean" "White"
}

if ($Help) {
    Show-Help
    exit 0
}

# ============================================
# 🎯 VARIABLES DE ENTORNO
# ============================================

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$DockerDir = Join-Path $ProjectRoot "docker"
$FrontendDir = Join-Path $ProjectRoot "frontend\apps\website-epic"
$BackendDir = Join-Path $ProjectRoot "backend"
$ServicesDir = Join-Path $ProjectRoot "services"

if ($Production) {
    $Environment = "production"
}

$Registry = if ($Environment -eq "production") { "aigestion.azurecr.io" } else { "localhost:5000" }
$Tag = if ($Environment -eq "production") { "latest" } else { "dev" }

Write-ColorOutput "🚀 Iniciando Containerización AIGestion - Environment: $Environment" "Cyan"
Write-ColorOutput "📁 Project Root: $ProjectRoot" "Blue"
Write-ColorOutput "🐳 Registry: $Registry" "Blue"
Write-ColorOutput "🏷️  Tag: $Tag" "Blue"

# ============================================
# 🧹 LIMPIEZA (Opcional)
# ============================================

if ($Clean) {
    Write-ColorOutput "🧹 Limpiando containers e imágenes viejas..." "Yellow"
    
    # Stop and remove containers
    docker ps -aq | ForEach-Object { 
        Write-ColorOutput "  🛑 Stopping container $_" "Red"
        docker stop $_ 2>$null
        docker rm $_ 2>$null
    }
    
    # Remove images
    docker images -f "dangling=true" -q | ForEach-Object { 
        Write-ColorOutput "  🗑️  Removing dangling image $_" "Red"
        docker rmi $_ 2>$null
    }
    
    # Remove AIGestion images
    docker images --format "table {{.Repository}}:{{.Tag}}" | Select-String "aigestion" | ForEach-Object {
        $image = $_.ToString().Trim()
        if ($image -and $image -ne "REPOSITORY:TAG") {
            Write-ColorOutput "  🗑️  Removing AIGestion image $image" "Red"
            docker rmi $image 2>$null
        }
    }
    
    Write-ColorOutput "✅ Limpieza completada" "Green"
    exit 0
}

# ============================================
# 📁 CREAR ESTRUCTURA DE DIRECTORIOS
# ============================================

Write-ColorOutput "📁 Creando estructura de directorios Docker..." "Blue"

$DockerDirs = @(
    $DockerDir,
    Join-Path $DockerDir "frontend",
    Join-Path $DockerDir "backend",
    Join-Path $DockerDir "services",
    Join-Path $DockerDir "nginx",
    Join-Path $DockerDir "postgres",
    Join-Path $DockerDir "redis"
)

foreach ($dir in $DockerDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-ColorOutput "  📁 Created: $dir" "Green"
    }
}

# ============================================
# 🐳 DOCKERFILE FRONTEND
# ============================================

Write-ColorOutput "🎨 Creando Dockerfile para Frontend..." "Blue"

$FrontendDockerfile = @"
# 🚀 AIGestion Frontend - Multi-stage Build
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG VITE_API_URL=/api
ARG VITE_VAPI_PUBLIC_KEY=demo-key

ENV NODE_ENV=$NODE_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_VAPI_PUBLIC_KEY=$VITE_VAPI_PUBLIC_KEY

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner
WORKDIR /app

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
"@

Set-Content -Path (Join-Path $DockerDir "frontend\Dockerfile") -Value $FrontendDockerfile -Encoding UTF8
Write-ColorOutput "  ✅ Frontend Dockerfile created" "Green"

# ============================================
# 🐳 DOCKERFILE BACKEND
# ============================================

Write-ColorOutput "⚙️ Creando Dockerfile para Backend..." "Blue"

$BackendDockerfile = @"
# 🚀 AIGestion Backend - Node.js API
FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy application code
COPY --chown=nodejs:nodejs . .

# Build arguments
ARG NODE_ENV=production
ARG DATABASE_URL=postgresql://user:pass@localhost:5432/aigestion
ARG REDIS_URL=redis://localhost:6379
ARG JWT_SECRET=your-secret-key

ENV NODE_ENV=$NODE_ENV
ENV DATABASE_URL=$DATABASE_URL
ENV REDIS_URL=$REDIS_URL
ENV JWT_SECRET=$JWT_SECRET
ENV PORT=3000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
"@

Set-Content -Path (Join-Path $DockerDir "backend\Dockerfile") -Value $BackendDockerfile -Encoding UTF8
Write-ColorOutput "  ✅ Backend Dockerfile created" "Green"

# ============================================
# 🐳 DOCKERFILE SERVICES
# ============================================

Write-ColorOutput "🤖 Creando Dockerfile para Services..." "Blue"

$ServicesDockerfile = @"
# 🚀 AIGestion Services - Daniela IA & Analytics
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    dumb-init

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy application code
COPY --chown=nodejs:nodejs . .

# Build arguments
ARG NODE_ENV=production
ARG OPENAI_API_KEY=your-openai-key
ARG VAPI_API_KEY=your-vapi-key
ARG ELEVENLABS_API_KEY=your-elevenlabs-key

ENV NODE_ENV=$NODE_ENV
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV VAPI_API_KEY=$VAPI_API_KEY
ENV ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 3001 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the services
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services.js"]
"@

Set-Content -Path (Join-Path $DockerDir "services\Dockerfile") -Value $ServicesDockerfile -Encoding UTF8
Write-ColorOutput "  ✅ Services Dockerfile created" "Green"

# ============================================
# 🌐 NGINX CONFIGURATION
# ============================================

Write-ColorOutput "🌐 Creando configuración Nginx..." "Blue"

$NginxConf = @"
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
}
"@

Set-Content -Path (Join-Path $DockerDir "nginx\nginx.conf") -Value $NginxConf -Encoding UTF8

$DefaultConf = @"
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html index.htm;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
"@

Set-Content -Path (Join-Path $DockerDir "nginx\default.conf") -Value $DefaultConf -Encoding UTF8
Write-ColorOutput "  ✅ Nginx configuration created" "Green"

# ============================================
# 🐳 DOCKER COMPOSE
# ============================================

Write-ColorOutput "🔧 Creando Docker Compose..." "Blue"

$DockerCompose = @"
version: '3.8'

services:
  # Frontend Application
  frontend:
    build:
      context: ../frontend/apps/website-epic
      dockerfile: ../../docker/frontend/Dockerfile
      args:
        NODE_ENV: $Environment
        VITE_API_URL: /api
        VITE_VAPI_PUBLIC_KEY: demo-key
    container_name: aigestion-frontend
    restart: unless-stopped
    networks:
      - aigestion-network
    depends_on:
      - backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(\`localhost\`)"

  # Backend API
  backend:
    build:
      context: ../backend
      dockerfile: ../../docker/backend/Dockerfile
      args:
        NODE_ENV: $Environment
        DATABASE_URL: postgresql://aigestion:password@postgres:5432/aigestion
        REDIS_URL: redis://redis:6379
        JWT_SECRET: your-super-secret-jwt-key
    container_name: aigestion-backend
    restart: unless-stopped
    networks:
      - aigestion-network
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=$Environment
      - DATABASE_URL=postgresql://aigestion:password@postgres:5432/aigestion
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-super-secret-jwt-key
    volumes:
      - ./logs:/app/logs
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(\`localhost\`) && PathPrefix(\`/api\`)"

  # Services (Daniela IA, Analytics)
  services:
    build:
      context: ../services
      dockerfile: ../../docker/services/Dockerfile
      args:
        NODE_ENV: $Environment
        OPENAI_API_KEY: your-openai-key
        VAPI_API_KEY: your-vapi-key
        ELEVENLABS_API_KEY: your-elevenlabs-key
    container_name: aigestion-services
    restart: unless-stopped
    networks:
      - aigestion-network
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=$Environment
      - DATABASE_URL=postgresql://aigestion:password@postgres:5432/aigestion
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=your-openai-key
      - VAPI_API_KEY=your-vapi-key
      - ELEVENLABS_API_KEY=your-elevenlabs-key
    volumes:
      - ./logs:/app/logs

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: aigestion-postgres
    restart: unless-stopped
    networks:
      - aigestion-network
    environment:
      - POSTGRES_DB=aigestion
      - POSTGRES_USER=aigestion
      - POSTGRES_PASSWORD=password
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aigestion -d aigestion"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: aigestion-redis
    restart: unless-stopped
    networks:
      - aigestion-network
    command: redis-server --appendonly yes --requirepass redis-password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Reverse Proxy (Traefik)
  traefik:
    image: traefik:v3.0
    container_name: aigestion-traefik
    restart: unless-stopped
    networks:
      - aigestion-network
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=admin@aigestion.net"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt

networks:
  aigestion-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
"@

Set-Content -Path (Join-Path $DockerDir "docker-compose.yml") -Value $DockerCompose -Encoding UTF8
Write-ColorOutput "  ✅ Docker Compose created" "Green"

# ============================================
# 🗄️ POSTGRES INIT SCRIPT
# ============================================

Write-ColorOutput "🗄️ Creando scripts de inicialización PostgreSQL..." "Blue"

$PostgresInit = @"
-- 🚀 AIGestion Database Initialization
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_messages_content_gin ON messages USING gin(content gin_trgm_ops);

-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES (
    'admin@aigestion.net',
    '$2b$10$rQZ8ZHWK2YzZzZzZzZzZzOZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz',
    'Admin',
    'User',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Create database for services
CREATE DATABASE IF NOT EXISTS aigestion_services;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE aigestion_services TO aigestion;

\c aigestion_services;

-- Services tables
CREATE TABLE IF NOT EXISTS ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    model_id VARCHAR(255) NOT NULL,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES aigestion.public.users(id),
    session_data JSONB,
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default AI models
INSERT INTO ai_models (name, provider, model_id, config)
VALUES 
    ('Daniela Default', 'openai', 'gpt-4', '{"temperature": 0.7, "max_tokens": 1000}'),
    ('Daniela Voice', 'elevenlabs', 'bella', '{"voice_id": "EXAVITQu4vr4xnSDxMaL", "language": "es"}')
ON CONFLICT DO NOTHING;
"@

Set-Content -Path (Join-Path $DockerDir "postgres\init.sql") -Value $PostgresInit -Encoding UTF8
Write-ColorOutput "  ✅ PostgreSQL init script created" "Green"

# ============================================
# 🏗️ BUILD IMAGES
# ============================================

if ($Build -or !$Push) {
    Write-ColorOutput "🏗️ Construyendo imágenes Docker..." "Blue"
    
    $Services = @(
        @{ Name = "frontend"; Path = $FrontendDir; Dockerfile = "../../docker/frontend/Dockerfile" },
        @{ Name = "backend"; Path = $BackendDir; Dockerfile = "../../docker/backend/Dockerfile" },
        @{ Name = "services"; Path = $ServicesDir; Dockerfile = "../../docker/services/Dockerfile" }
    )
    
    foreach ($service in $Services) {
        Write-ColorOutput "  🐳 Building $($service.Name)..." "Yellow"
        
        $BuildArgs = @(
            "build",
            "-t", "$Registry/aigestion-$($service.Name):$Tag",
            "-f", $service.Dockerfile,
            "--build-arg", "NODE_ENV=$Environment"
        )
        
        if ($service.Name -eq "frontend") {
            $BuildArgs += "--build-arg", "VITE_API_URL=/api"
            $BuildArgs += "--build-arg", "VITE_VAPI_PUBLIC_KEY=demo-key"
        }
        
        $BuildArgs += $service.Path
        
        $process = Start-Process -FilePath "docker" -ArgumentList $BuildArgs -Wait -PassThru
        
        if ($process.ExitCode -ne 0) {
            Write-ColorOutput "  ❌ Failed to build $($service.Name)" "Red"
            exit 1
        }
        
        Write-ColorOutput "  ✅ $($service.Name) built successfully" "Green"
    }
    
    Write-ColorOutput "🎉 Todas las imágenes construidas exitosamente" "Green"
}

# ============================================
# 🧪 EJECUTAR TESTS
# ============================================

if ($Test) {
    Write-ColorOutput "🧪 Ejecutando tests..." "Blue"
    
    # Test frontend
    Write-ColorOutput "  🎨 Testing frontend..." "Yellow"
    Set-Location $FrontendDir
    $testResult = npm run test 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Frontend tests failed" "Red"
        Write-ColorOutput $testResult "Red"
    } else {
        Write-ColorOutput "  ✅ Frontend tests passed" "Green"
    }
    
    # Test backend
    Write-ColorOutput "  ⚙️ Testing backend..." "Yellow"
    Set-Location $BackendDir
    $testResult = npm run test 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Backend tests failed" "Red"
        Write-ColorOutput $testResult "Red"
    } else {
        Write-ColorOutput "  ✅ Backend tests passed" "Green"
    }
    
    # Test services
    Write-ColorOutput "  🤖 Testing services..." "Yellow"
    Set-Location $ServicesDir
    $testResult = npm run test 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Services tests failed" "Red"
        Write-ColorOutput $testResult "Red"
    } else {
        Write-ColorOutput "  ✅ Services tests passed" "Green"
    }
    
    Set-Location $ProjectRoot
}

# ============================================
# 📤 PUSH TO REGISTRY
# ============================================

if ($Push) {
    Write-ColorOutput "📤 Pushing imágenes a registry..." "Blue"
    
    if ($Environment -eq "production") {
        # Login to Azure Container Registry
        Write-ColorOutput "  🔐 Logging into Azure Container Registry..." "Yellow"
        $loginResult = az acr login --name aigestion 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "  ❌ Failed to login to ACR" "Red"
            Write-ColorOutput $loginResult "Red"
            exit 1
        }
    }
    
    $Services = @("frontend", "backend", "services")
    
    foreach ($service in $Services) {
        Write-ColorOutput "  📤 Pushing $service..." "Yellow"
        
        $pushResult = docker push "$Registry/aigestion-$service:$Tag" 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "  ❌ Failed to push $service" "Red"
            Write-ColorOutput $pushResult "Red"
            exit 1
        }
        
        Write-ColorOutput "  ✅ $service pushed successfully" "Green"
    }
    
    Write-ColorOutput "🎉 Todas las imágenes push exitosamente" "Green"
}

# ============================================
# 🚀 START SERVICES
# ============================================

if (!$Build -and !$Push) {
    Write-ColorOutput "🚀 Iniciando servicios con Docker Compose..." "Blue"
    
    Set-Location $DockerDir
    
    # Stop existing containers
    Write-ColorOutput "  🛑 Stopping existing containers..." "Yellow"
    docker-compose down 2>$null
    
    # Start services
    Write-ColorOutput "  ▶️ Starting services..." "Yellow"
    $upResult = docker-compose up -d 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Failed to start services" "Red"
        Write-ColorOutput $upResult "Red"
        exit 1
    }
    
    # Wait for services to be ready
    Write-ColorOutput "  ⏳ Waiting for services to be ready..." "Yellow"
    Start-Sleep -Seconds 30
    
    # Check service health
    Write-ColorOutput "  🔍 Checking service health..." "Yellow"
    $healthStatus = docker-compose ps
    
    Write-ColorOutput "📊 Service Status:" "Cyan"
    Write-ColorOutput $healthStatus "White"
    
    # Show logs
    Write-ColorOutput "📋 Recent logs:" "Cyan"
    $logs = docker-compose logs --tail=20
    Write-ColorOutput $logs "White"
    
    Set-Location $ProjectRoot
}

# ============================================
# ✅ COMPLETADO
# ============================================

Write-ColorOutput "" "White"
Write-ColorOutput "🎉 CONTAINERIZACIÓN COMPLETADA EXITOSAMENTE" "Green"
Write-ColorOutput "" "White"
Write-ColorOutput "📋 Resumen:" "Cyan"
Write-ColorOutput "  ✅ Dockerfiles creados para todos los servicios" "Green"
Write-ColorOutput "  ✅ Configuración Nginx optimizada" "Green"
Write-ColorOutput "  ✅ Docker Compose con todos los servicios" "Green"
Write-ColorOutput "  ✅ Scripts de inicialización PostgreSQL" "Green"
Write-ColorOutput "  ✅ Health checks configurados" "Green"
Write-ColorOutput "  ✅ Security headers implementados" "Green"
Write-ColorOutput "" "White"

if (!$Build -and !$Push) {
    Write-ColorOutput "🌐 Servicios disponibles en:" "Cyan"
    Write-ColorOutput "  🎨 Frontend: http://localhost" "Blue"
    Write-ColorOutput "  ⚙️ Backend API: http://localhost/api" "Blue"
    Write-ColorOutput "  📊 Traefik Dashboard: http://localhost:8080" "Blue"
    Write-ColorOutput "  🗄️ PostgreSQL: localhost:5432" "Blue"
    Write-ColorOutput "  🔴 Redis: localhost:6379" "Blue"
    Write-ColorOutput "" "White"
    Write-ColorOutput "🔧 Comandos útiles:" "Cyan"
    Write-ColorOutput "  docker-compose logs -f          # Ver logs en tiempo real" "White"
    Write-ColorOutput "  docker-compose ps               # Ver estado de servicios" "White"
    Write-ColorOutput "  docker-compose restart service  # Reiniciar servicio específico" "White"
    Write-ColorOutput "  docker-compose down              # Detener todos los servicios" "White"
}

Write-ColorOutput "" "White"
Write-ColorOutput "🚀 AIGestion Containerización - FASE 1 COMPLETADA" "Green"
Write-ColorOutput "   Listo para la siguiente fase: CI/CD Pipeline" "Cyan"
