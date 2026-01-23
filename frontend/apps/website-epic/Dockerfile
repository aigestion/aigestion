# Multi-stage Dockerfile optimizado para website-epic

# =====================================
# STAGE 1: BUILDER
# =====================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar configuración de workspaces
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias con lockfile congelado
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY frontend/ ./frontend/
COPY packages/ ./packages/
COPY tsconfig.json ./

# Build específico de website-epic
WORKDIR /app/frontend/apps/website-epic
RUN pnpm run build

# =====================================
# STAGE 2: RUNTIME (NGINX)
# =====================================
FROM nginx:alpine

# Metadata
LABEL maintainer="AIGestion Team"
LABEL description="NEXUS V1 Website Epic - Production Frontend"
LABEL version="2.0.0"

# Copiar configuración nginx
COPY frontend/apps/website-epic/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos buildados
COPY --from=builder /app/frontend/apps/website-epic/dist /usr/share/nginx/html

# Crear directorio de logs
RUN mkdir -p /var/log/nginx

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/index.html || exit 1

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
