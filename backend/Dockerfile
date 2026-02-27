# [GOD MODE] AIGestion Backend Optimized Dockerfile (Monorepo Aware)
# Optimized for: pnpm Workspaces & Cloud-Native Build
# Multi-stage build with pnpm deploy --prod for minimal production image

# ---------- Build Stage ----------
FROM node:22-alpine AS builder
LABEL version="2.0.0"
WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Copy workspace configuration and master environment
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY .env ./.env
COPY tsconfig*.json ./
COPY turbo.json ./

# Copy all package manifests for correct workspace resolution
# This is crucial for pnpm to understand the dependency graph
COPY packages/nexus-shared/package.json ./packages/nexus-shared/
COPY packages/eslint-config/package.json ./packages/eslint-config/
# Stub eslint-config to avoid resolving dev-only eslint deps in backend builds
RUN echo '{"name":"@aigestion/eslint-config","version":"0.0.1","private":true}' > ./packages/eslint-config/package.json

# Copy backend package manifest
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --filter nexus-v1-dashboard-backend...

# Copy source code for backend and internal dependencies
COPY backend ./backend
COPY packages/nexus-shared ./packages/nexus-shared

# Compile TypeScript for the backend and its dependencies
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN mkdir -p backend/dist
RUN pnpm --filter nexus-v1-dashboard-backend... build || (cd backend && npx tsc --outDir dist --noEmit false --noEmitOnError false || true)
RUN cd backend && npx tsc-alias -p tsconfig.json || true

# Create optimized production deployment using pnpm deploy
# This creates an isolated directory with only production dependencies
# and the compiled output — no dev deps, no hoisted store bloat
RUN pnpm --filter nexus-v1-dashboard-backend deploy --legacy --prod /app/deploy

# Copy compiled artifacts into the deploy directory
RUN mkdir -p /app/deploy/dist && (cp -r /app/backend/dist/* /app/deploy/dist/ || true)
RUN cp /app/.env /app/deploy/.env

# ---------- Runtime Stage ----------
FROM node:22-alpine AS runtime

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV TZ=UTC
ENV REDIS_URL=redis://default:gxWK2m2UjDw4kxv1P0lRyw9f1H76OE89@redis-16243.c327.europe-west1-2.gce.cloud.redislabs.com:16243
ENV MONGODB_URI=mongodb+srv://admin_db_user:AIGestionGodMode2026!Atlas@cluster0.mpfnejh.mongodb.net/?appName=Cluster0
ENV SUPABASE_URL=https://nbymcxvlcfyhebzjurml.supabase.co
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieW1jeHZsY2Z5aGViemp1cm1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU3NTUwMCwiZXhwIjoyMDg1MTUxNTAwfQ.7LqX8K8Y5Z3fJ7mN9rQ2Lq9wRzXvY0Z1mN2pQ3sR8
ENV PINECONE_API_KEY=pcsk_4pPkGH_9hEy5vg3x5V6TzPomG3ndJgZybcMzaSaiSzXqos2oSG4fVWtHGRe7hNK5HyS9YU
ENV MONGODB_ATLAS_API_KEY=al-isaib0moU8WikYHeRNZhIEJjV5Bx7DbL2T6NlCSAPvP
ENV JWT_SECRET=44810ed19aca3d4d642ec0f1f1f58ee744810ed19aca3d4d642ec0f1f1f58ee7

WORKDIR /app/backend

# Install security tools & useful utilities
RUN apk add --no-cache curl tzdata dumb-init

# Copy the self-contained production deployment
# pnpm deploy --prod created a clean directory with:
#   - package.json
#   - node_modules/ (production-only, fully resolved)
COPY --from=builder /app/deploy/package.json ./
COPY --from=builder /app/deploy/node_modules ./node_modules
COPY --from=builder /app/deploy/dist ./dist
COPY --from=builder /app/deploy/.env ./

# Create non-root user and directories in one layer for optimization
RUN addgroup -S nodejs && \
  adduser -S nodejs -G nodejs && \
  mkdir -p /app/backend/quarantine /app/backend/uploads /app/backend/logs && \
  chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the Cloud Run / Railway default port
EXPOSE 8080

# Optimized health check — extended start-period for heavy Node.js boot
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/health || exit 1

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/backend/src/bootstrap.js"]
