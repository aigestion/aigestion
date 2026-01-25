# Multi-stage Dockerfile optimizado para AIGestion Professional Account

# =====================================
# STAGE 1: BUILDER
# =====================================
FROM node:22-alpine AS builder

# Metadata
LABEL maintainer="AIGestion Professional Team"
LABEL description="AIGestion Frontend - Professional Production"
LABEL version="2.0.0"

WORKDIR /app

# Copiar configuración de workspaces
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Instalar pnpm
RUN npm install -g pnpm@8

# Instalar dependencias con lockfile congelado
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY frontend/ ./frontend/
COPY packages/ ./packages/
COPY tsconfig.json ./

# Build específico de website-epic con optimizaciones
WORKDIR /app/frontend/apps/website-epic
RUN pnpm run build

# =====================================
# STAGE 2: RUNTIME (NGINX + Professional Features)
# =====================================
FROM nginx:alpine

# Professional metadata
LABEL maintainer="AIGestion Professional Team <admin@aigestion.net>"
LABEL description="AIGestion Professional Frontend - Production Ready"
LABEL version="2.0.0"
LABEL project="aigestion-prod"
LABEL environment="production"

# Instalar herramientas adicionales para monitoreo
RUN apk add --no-cache \
    curl \
    wget \
    tzdata \
    && rm -rf /var/cache/apk/*

# Configurar zona horaria
ENV TZ=UTC

# Copiar configuración nginx mejorada
COPY frontend/apps/website-epic/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos buildados
COPY --from=builder /app/frontend/apps/website-epic/dist /usr/share/nginx/html

# Crear directorios necesarios
RUN mkdir -p /var/log/nginx \
    && mkdir -p /usr/share/nginx/html/health \
    && mkdir -p /var/cache/nginx

# Crear health check endpoint
RUN echo '<!DOCTYPE html><html><head><title>Health Check</title></head><body><h1>OK</h1><p>Timestamp: '$(date -u +%Y-%m-%dT%H:%M:%SZ)'</p></body></html>' > /usr/share/nginx/html/health/index.html

# Configurar logs
RUN touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && chmod 644 /var/log/nginx/*.log

# Health check mejorado
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health/index.html || exit 1

# Variables de entorno para producción
ENV NODE_ENV=production
ENV VITE_SUPABASE_URL=""
ENV VITE_SUPABASE_ANON_KEY=""
ENV VERTEX_AI_API_KEY=""
ENV ANTIGRAVITY_API_KEY=""

# Expose port
EXPOSE 8080

# Configurar nginx para Cloud Run
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Run nginx con configuración profesional
CMD ["nginx", "-g", "daemon off;"]
