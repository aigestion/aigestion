# [GOD MODE] AIGestion Backend Optimized Dockerfile (Monorepo Aware)
# Optimized for: pnpm Workspaces & Cloud-Native Build
# Multi-stage build for minimal production image

# ---------- Build Stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all package manifests for correct workspace resolution
# This is crucial for pnpm to understand the dependency graph
COPY packages/dashboard-core/package.json ./packages/dashboard-core/
COPY packages/decentraland-parcel/package.json ./packages/decentraland-parcel/
COPY packages/design-system-v2/package.json ./packages/design-system-v2/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/nexus-core-nestjs/package.json ./packages/nexus-core-nestjs/
COPY packages/nexus-shared/package.json ./packages/nexus-shared/

# Copy backend package manifest
COPY backend/package.json ./backend/

# Install dependencies (frozen lockfile for production parity)
# We filter to backend and its dependencies
RUN pnpm install --frozen-lockfile --filter nexus-v1-dashboard-backend...

# Copy source code for backend and internal dependencies
COPY backend ./backend
COPY packages/nexus-shared ./packages/nexus-shared
COPY packages/nexus-core-nestjs ./packages/nexus-core-nestjs
COPY packages/dashboard-core ./packages/dashboard-core

# Compile TypeScript for the backend
WORKDIR /app/backend
RUN pnpm build

# ---------- Runtime Stage ----------
FROM node:22-alpine AS runtime

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV TZ=UTC

WORKDIR /app/backend

# Install security tools & useful utilities
RUN apk add --no-cache curl tzdata dumb-init

# Enable pnpm for runtime as well (to handle production-only install if needed,
# though copying node_modules or using a standalone build is better)
RUN npm install -g pnpm

# Copy package.json from builder
COPY --from=builder /app/backend/package.json ./

# Copy compiled artifacts
COPY --from=builder /app/backend/dist ./dist

# Copy only production node_modules (optimized)
COPY --from=builder /app/backend/node_modules ./node_modules

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
RUN mkdir -p /app/backend/quarantine /app/backend/uploads /app/backend/logs && \
  chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the Cloud Run / Railway default port
EXPOSE 8080

# Optimized health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/health || exit 1

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/bootstrap.js"]
