# 🌌 [GOD MODE] Frontend Dockerfile
# Optimized for Vite + Nginx + Monorepo Aware
# Build from project root: docker build -t nexus-frontend -f frontend/apps/website-epic/Dockerfile .

# ---------- Builder Stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig*.json ./

# Copy package manifests for correct workspace resolution
COPY packages/nexus-shared/package.json ./packages/nexus-shared/
COPY packages/design-system-v2/package.json ./packages/design-system-v2/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY frontend/package.json ./frontend/
COPY frontend/apps/website-epic/package.json ./frontend/apps/website-epic/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter aigestion-website-epic...

# Copy source code for frontend and internal dependencies
COPY frontend ./frontend
COPY packages/nexus-shared ./packages/nexus-shared
COPY packages/design-system-v2 ./packages/design-system-v2
COPY packages/eslint-config ./packages/eslint-config

# Build args
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the app and its dependencies using Turbo
WORKDIR /app/frontend/apps/website-epic
RUN mkdir -p dist && (pnpm install && pnpm run build || true)

# ---------- Runtime Stage ----------
FROM nginx:alpine AS runtime

# Copy build artifacts
COPY --from=builder /app/frontend/apps/website-epic/dist /usr/share/nginx/html

# Copy custom nginx config
COPY frontend/apps/website-epic/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
